import mongoose, { Mongoose } from 'mongoose';
const dbConfig = require("../1-config/db.config");
const createCityModel = require("./city.model");

// const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

interface DB {
  mongoose: Mongoose;
  url: string;
  cities: ReturnType<typeof createCityModel>;
}

const db: DB = {
  mongoose,
  url: dbConfig.url,
  cities: createCityModel(mongoose),
};



export default db;