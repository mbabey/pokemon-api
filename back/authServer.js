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

app.use(logRequest)
app.post('/register', asyncWrapper(async (req, res) => {
  const { username, password, email } = req.body
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  const userWithHashedPassword = { ...req.body, password: hashedPassword }

  const user = await userModel.create(userWithHashedPassword)
  res.send(user)
}))

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
    res.header('Authorization', accessToken)
    res.send("All good!")
  } catch (error) {
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
  res.header('Authorization', authorization_header_field);
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

  switch (req.query.id) {
    case "1": // Unique API users over a period of time
      {
        logModel.aggregate([
          { $match: { timestamp: { $gte: ISODate("2022-01-01T00:00:00.000Z"), $lte: ISODate("2022-12-31T23:59:59.999Z") } } },
          { $group: { _id: "$user_id" } },
          { $group: { _id: null, count: { $sum: 1 } } }
        ])
        break;
      }
    case "2": // Top API users over period of time
      {
        logModel.aggregate([
          { $match: { timestamp: { $gte: ISODate("2022-01-01T00:00:00.000Z"), $lte: ISODate("2022-12-31T23:59:59.999Z") } } },
          { $group: { _id: "$user_id", total_response_time: { $sum: "$response_time" } } },
          { $sort: { total_response_time: -1 } },
          { $limit: 10 }
        ])
        break;
      }
    case "3": // Top users for each Endpoint
      {
        logModel.aggregate([
          { $match: { timestamp: { $gte: ISODate("2022-01-01T00:00:00.000Z"), $lte: ISODate("2022-12-31T23:59:59.999Z") } } },
          { $group: { _id: { endpoint: "$endpoint", user_id: "$user_id" }, total_response_time: { $sum: "$response_time" } } },
          { $sort: { "_id.endpoint": 1, total_response_time: -1 } },
          { $group: { _id: "$_id.endpoint", top_users: { $push: { user_id: "$_id.user_id", total_response_time: "$total_response_time" } } } }
        ])
        break;
      }
    case "4": // 4xx Errors By Endpoint
      {
        logModel.aggregate([
          { $match: { timestamp: { $gte: ISODate("2022-01-01T00:00:00.000Z"), $lte: ISODate("2022-12-31T23:59:59.999Z") }, status_code: { $gte: 400, $lt: 500 } } },
          { $group: { _id: { endpoint: "$endpoint", status_code: "$status_code" }, count: { $sum: 1 } } },
          { $match: { "_id.status_code": /^4/ } },
          { $sort: { count: -1 } }
        ])
        break;
      }
    case "5": // Recent 4xx/5xx Errors
      {
        logModel.find({timestamp: { $gte: ISODate("2022-12-01T00:00:00.000Z") }, status_code: { $gte: 400 }},
          { timestamp: 1, user_id: 1, endpoint: 1, status_code: 1 })
          .sort({ timestamp: -1 }).limit(10)
        break;
      }
    default: ;
  }

  res.send(`Report ${id}`);
})

module.exports = {
  app: app,
  start: start(),
  adminAccountInfo: admin
};
