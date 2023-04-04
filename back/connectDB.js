const { mongoose } = require('mongoose')
const userModel = require('./userModel.js')
const bcrypt = require('bcrypt');
const dotenv = require("dotenv")
dotenv.config();

const admin = {
  username: "admin",
  password: "admin",
  role: "admin",
  email: "admin@admin.ca"
}

const connectDB = async (input) => {
  try {
    const x = await mongoose.connect(process.env.DB_STRING)
    console.log("Connected to db");
    if (input.dropUsers === true)
    {
      console.log("Dropped pokeusers collection");
      await mongoose.connection.dropCollection('pokeusers');
      await userModel.create({ ...admin, password: bcrypt.hashSync(admin.password, 10) });
    }
    if (input.dropPokemon === true)
    {
      console.log("Dropped pokemons collection");
      await mongoose.connection.dropCollection('pokemons');
    }
    if (input.dropLogs === true)
    {
      console.log("Dropped logs collection");
      await mongoose.connection.dropCollection('logs');
    }
  } catch (error) {
    console.log('db error');
    console.log(error)
  }
}

module.exports = { connectDB }