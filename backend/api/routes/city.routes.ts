import express from "express";

module.exports = (app: express.Application) => {
  const cities = require("../3-controllers/city.controller");

  var router = require("express").Router();

  router.get("/", cities.searchCities);
  router.post("/", cities.createCity);
  router.get("/:id", cities.readCity);
  router.put("/:id", cities.updateCity);
  router.delete("/:id", cities.deleteCity);
  router.delete("/", cities.deleteAll);

  app.use("/api/cities", router);
};
