const express = require("express")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userModel = require("./userModel.js")
const logModel = require("./logModel.js")
const { authAdmin, logRequest } = require('./middlewares.js')
const { asyncWrapper } = require("./asyncWrapper.js")
const { connectDB } = require("./connectDB.js")
const dotenv = require("dotenv")
dotenv.config();

const {
  PokemonDbError,
  PokemonAuthError
} = require("./errors.js")

const app = express()

const admin = {
  username: "admin",
  password: "admin",
  role: "admin",
  email: "admin@admin.ca"
}

async function start() {
  await connectDB({ "dropUsers": true, "dropLogs": true });
  app.listen(process.env.authServerPORT, async (err) => {
    if (err) {
      throw new PokemonDbError(err)
    } else {
      console.log(`Phew! Server is running on port: ${process.env.authServerPORT}`);
    }
  })
}

app.use(express.json())
app.use(cors({
  exposedHeaders: ['authorization']
}))

function isRefresh(token) {
  return (token.split(' ')[0] == "Refresh");
}


app.post('/register', asyncWrapper(async (req, res) => {
  const { username, password, email } = req.body
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  const userWithHashedPassword = { ...req.body, password: hashedPassword }

  const user = await userModel.create(userWithHashedPassword)
  res.send(user)
}))

app.use(logRequest)
app.post('/requestNewAccessToken', asyncWrapper(async (req, res) => {

  // Parse the headers to get the Refresh token.
  const refreshToken = req.header('authorization')
  if (!(refreshToken && isRefresh(refreshToken))) {
    throw new PokemonAuthError("No Token: Please provide a token.")
  }

  // Find a user with the token only if the token is valid.
  const user = await userModel.findOne({ token: refreshToken, token_invalid: false });
  if (!user) {
    throw new PokemonAuthError("Invalid Token: Please provide a valid token.")
  }

  // Create, store, and send a new Access token.
  const refreshTokenString = refreshToken.split(' ')[1];
  try {
    const payload = jwt.verify(refreshTokenString, process.env.REFRESH_TOKEN_SECRET)
    const payload_user = { ...JSON.parse(JSON.stringify(payload.user)), access: "", token: "" };
    const accessToken = "Bearer " + jwt.sign({ user: payload_user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5s' })
    await userModel.updateOne({ token: refreshToken }, { access: accessToken });
    res.header('authorization', accessToken)
    res.send("All good!")
  } catch (error) {
    console.log(error);
    throw new PokemonAuthError("Invalid Token: Please provide a valid token.")
  }
}))

app.post('/login', asyncWrapper(async (req, res) => {
  const { username, password } = req.body
  const user = await userModel.findOne({ username: username });
  if (!user)
    throw new PokemonAuthError("User not found")

  const isPasswordCorrect = await bcrypt.compare(password, user.password)
  if (!isPasswordCorrect)
    throw new PokemonAuthError("Password is incorrect")

  const sign_user = { ...JSON.parse(JSON.stringify(user)), access: "", token: "" };
  const accessToken = "Bearer " + jwt.sign({ user: sign_user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' })
  const refreshToken = "Refresh " + jwt.sign({ user: sign_user }, process.env.REFRESH_TOKEN_SECRET)

  const logged_in_user = await userModel.findOneAndUpdate(
    { username: username },
    { token: refreshToken, token_invalid: false, access: accessToken },
    { new: true });

  const authorization_header_field = accessToken + "," + refreshToken;
  res.header('authorization', authorization_header_field);
  res.send(logged_in_user)
}));

app.get('/logout', asyncWrapper(async (req, res) => {
  const user = await userModel.findOneAndUpdate({ token: req.query.appid }, { token_invalid: true }, { new: true })
  if (!user) {
    throw new PokemonAuthError("User not found")
  }
  res.send(user)
}))

app.use(authAdmin)
app.get('/report', async (req, res) => {

  const MS_PER_WEEK = 604800000;
  const END_DATE = Date.now();
  const START_DATE = END_DATE - MS_PER_WEEK;

  let report_name
  let stats;

  switch (req.query.id) {
    case "1":
      {
        report_name = "Unique API Users Over the Last Week";
        // stats = await logModel.distinct('user_id', { timestamp: { $gte: START_DATE, $lte: END_DATE } });
        stats = await logModel.aggregate([
          { $match: { timestamp: { $gte: START_DATE, $lte: END_DATE } } },
          { $group: { _id: {email: '$email', username: '$username', user_id: '$user_id'}, count: { $sum: 1 } } }]);
        break;
      }
    case "2":
      {
        report_name = "Top API Users Over the Last Week"
        stats = await logModel.aggregate([
          { $match: { timestamp: { $gte: START_DATE, $lte: END_DATE } } },
          { $group: { _id: {email: '$email', username: '$username', user_id: '$user_id'}, count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ])
        break;
      }
    case "3":
      {
        report_name = "Top Users for Each Endpoint Over the Last Week"
        stats = await logModel.aggregate([
          { $match: { timestamp: { $gte: START_DATE, $lte: END_DATE } } },
          { $group: { _id: { endpoint: '$endpoint', user_id: '$user_id' }, count: { $sum: 1 } } },
          { $sort: { '_id.endpoint': 1, count: -1 } },
          { $group: { _id: '$_id.endpoint', topUsers: { $push: { user_id: '$_id.user_id', count: '$count' } } } }
        ])
        break;
      }
    case "4":
      {
        report_name = "4xx Errors by Endpoint Over the Last Week"
        stats = await logModel.aggregate([
          { $match: { timestamp: { $gte: START_DATE, $lte: END_DATE }, status_code: { $gte: 400, $lt: 500 } } },
          { $group: { _id: '$endpoint', count: { $sum: 1 } } }
        ])
        break;
      }
    case "5":
      {
        const CUT_OFF_DATE = END_DATE - 24 * 60 * 60 * 1000
        report_name = "4xx/5xx Errors in the Last 24 Hours"
        stats = await logModel.find({ status_code: { $gte: 400 }, timestamp: { $gte: CUT_OFF_DATE } })
        .sort({ timestamp: -1 })
        break;
      }
    default: ;
  }
  const return_object = {
    report_name: report_name,
    report_num: req.query.id,
    statistics: stats
  }
  res.send(return_object);
})

module.exports = {
  app: app,
  start: start(),
  adminAccountInfo: admin
};
