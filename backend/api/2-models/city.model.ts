import * as mongoose from 'mongoose';
module.exports = (mongoose: mongoose.Mongoose) => {
  var schema = new mongoose.Schema({
    cityName: {
      type: String,
    },
    count: {
      type: Number,
    },
 
  });

  const City = mongoose.model("city", schema);
  return City;
};
