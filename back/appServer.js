const express = require("express")
const mongoose = require("mongoose")
const morgan = require("morgan")
const cors = require("cors")
const { authUser, authAdmin, logRequest } = require('./middlewares.js')
const { connectDB } = require("./connectDB.js")
const { populatePokemons } = require("./populatePokemons.js")
const { getTypes } = require("./getTypes.js")
const { handleErr } = require("./errorHandler.js")
const { asyncWrapper } = require("./asyncWrapper.js")
const dotenv = require("dotenv")
dotenv.config();

const {
  PokemonBadRequestMissingID,
  PokemonDbError,
  PokemonNotFoundError,
  PokemonDuplicateError,
  PokemonAuthError
} = require("./errors.js")

const app = express()

var pokeModel = null;

async function start() {
  const options = {
    "dropPokemon": false
  }

  await connectDB(options);
  const pokeSchema = await getTypes();
  if (options.dropPokemon) {
    pokeModel = await populatePokemons(pokeSchema);
  } else {
    pokeModel = mongoose.model('pokemons', pokeSchema);
  }

  app.listen(process.env.pokeServerPORT, (err) => {
    if (err)
      throw new PokemonDbError(err)
    else
      console.log(`Phew! Server is running on port: ${process.env.pokeServerPORT}`);
  })
}

app.use(express.json())
app.use(morgan(":method"))
app.use(cors())

function isAccess(token)
{
  return (token.split(' ')[0] == "Bearer");
}

app.use(logRequest)
app.use(authUser)
app.get('/api/v1/pokedex', asyncWrapper(async (req, res) => {
  const docs = await pokeModel.find({})
  .sort({ "id": 1 })
  res.json(docs);
}));

app.get('/api/v1/pokemons', asyncWrapper(async (req, res) => {
  if (!req.query["count"])
    req.query["count"] = 10
  if (!req.query["after"])
    req.query["after"] = 0
  const docs = await pokeModel.find({})
    .sort({ "id": 1 })
    .skip(req.query["after"])
    .limit(req.query["count"])
  res.json(docs)
}))

app.get('/api/v1/pokemon', asyncWrapper(async (req, res) => {
  const { id } = req.query
  console.log(req.query)
  const docs = await pokeModel.findOne({ "id": id })
  if (docs)
  {
    res.json(docs)
  } else {
    res.json({ errMsg: "Pokemon not found" })
  }
}))

app.use(authAdmin)
app.post('/api/v1/pokemon/', asyncWrapper(async (req, res) => {
  console.log(req.body);
  if (!req.body.id) throw new PokemonBadRequestMissingID()
  const poke = await pokeModel.find({ "id": req.body.id })
  if (poke.length != 0) throw new PokemonDuplicateError()
  const pokeDoc = await pokeModel.create(req.body)
  res.json({
    msg: "Added Successfully"
  })
}))

app.delete('/api/v1/pokemon', asyncWrapper(async (req, res) => {
  const docs = await pokeModel.findOneAndRemove({ id: req.query.id })
  if (docs)
    res.json({
      msg: "Deleted Successfully"
    })
  else
    throw new PokemonNotFoundError("");
}))

app.put('/api/v1/pokemon/:id', asyncWrapper(async (req, res) => {
  const selection = { id: req.params.id }
  const update = req.body
  const options = {
    new: true,
    runValidators: true,
    overwrite: true
  }
  const doc = await pokeModel.findOneAndUpdate(selection, update, options)
  if (doc) {
    res.json({
      msg: "Updated Successfully",
      pokeInfo: doc
    })
  } else {
    throw new PokemonNotFoundError("");
  }
}))

app.patch('/api/v1/pokemon/:id', asyncWrapper(async (req, res) => {
  // try {
  const selection = { id: req.params.id }
  const update = req.body
  const options = {
    new: true,
    runValidators: true
  }
  const doc = await pokeModel.findOneAndUpdate(selection, update, options)
  if (doc) {
    res.json({
      msg: "Updated Successfully",
      pokeInfo: doc
    })
  } else {
    throw new PokemonNotFoundError("");
  }
}))

app.use(handleErr)

module.exports = {
  app: app,
  start: start()
};
