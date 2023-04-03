const express = require("express")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userModel = require("./userModel.js")
const logModel = require("./logModel.js")
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
  await connectDB({ "dropUsers": true });
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

app.use(authAdmin())
app.get('/report', async (req, res) => {

})

module.exports = {
  app: app,
  start: start(),
  adminAccountInfo: admin
};
