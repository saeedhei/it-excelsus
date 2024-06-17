import * as fs from "fs";
import { Request, Response } from "express";
import db from "../2-models";
const City = db.cities;

interface CityType {
  uuid: string;
  cityName: string;
  count: number;
}

// Search in all Cities
// http://localhost:8000/api/cities?search=Dresden
export const searchCities = async (req: Request, res: Response) => {

  try {
    const { search = '', page = '1', limit = '5' } = req.query as Record<string, string>;

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 5;

    let condition: any = {};
    if (typeof search === 'string' && search) {
      condition = { cityName: { $regex: new RegExp(search, 'i') } };
    }

    // Fetching cities with pagination
    const cities = await City.find(condition)
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber);

    const count = await City.countDocuments(condition);

      // Just for Test 
      if (count){
        res.json({
          link: "http://localhost:8000/api/cities?search=&page=1&limit=5",
          totalPages: Math.ceil(count / limitNumber),
          currentPage: pageNumber,
          cities
        });
      }
       else  {
        console.log("No cities found, adding dummy data...");
        try {
          const rawData = fs.readFileSync('./dummy_cities.json', 'utf8');
          const dummyCitiesData: CityType[] = JSON.parse(rawData);
          const cleanedData = dummyCitiesData.map(({ uuid, ...rest }: CityType) => rest);
          City.insertMany(cleanedData)
          .then((data: CityType[]) => {
            res.send(data);
          })
          .catch((err: Error) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while creating Many Tutorials.",
            });
          });

        } catch (err: any) {
          console.error("Error reading dummy city data:", err.message);
        }
        
      } 
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Create a City
exports.createCity = async (req: Request, res: Response) => {
  try {
    // if (!req.body.cityName || !req.body.count) {
      if (!req.body.cityName) {
      return res.status(400).send({ message: "Missing required fields: cityName and count." });
    }

    const newCity = new City({
      cityName: req.body.cityName,
      count: req.body.count,
    });

    await newCity.save(); 

    res.status(201).send({ message: "City created successfully!", city: newCity }); // Send created city object
  } catch (err: any) {
    console.error("Error creating city:", err.message);
    res.status(500).send({ message: "Error creating city. Please try again." });
  }
};


// Find a city
exports.readCity = async (req: Request, res: Response) => {
  try {
    const cityId = req.params.id; 

    const city = await City.findById(cityId); 

    if (!city) {
      return res.status(404).send({ message: "City not found." });
    }

    res.status(200).send(city); 
  } catch (err: any) {
    console.error("Error finding city:", err.message);
    res.status(500).send({ message: "Error retrieving city. Please try again." });
  }
};


// Update a City
exports.updateCity = async (req: Request, res: Response) => {
  try {
    const cityId = req.params.id; 

    const updateData = req.body;

    // Filter out undefined properties (optional, prevents overwriting existing values)
    const filteredUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([key, value]) => value !== undefined)
    );

    const updatedCity = await City.findByIdAndUpdate(cityId, filteredUpdateData, {
      new: true, // Return the updated city document
    });

    if (!updatedCity) {
      return res.status(404).send({ message: "City not found." });
    }

    res.status(200).send({ message: "City updated successfully!", city: updatedCity });
  } catch (err: any) {
    console.error("Error updating city:", err.message);
    res.status(500).send({ message: "Error updating city. Please try again." });
  }
};

// Delete one City
exports.deleteCity = async (req: Request, res: Response) => {
  try {
    const cityId = req.params.id; 

    const deletedCity = await City.findByIdAndDelete(cityId);

    if (!deletedCity) {
      return res.status(404).send({ message: "City not found." });
    }

    res.status(200).send({ message: "City deleted successfully!" });
  } catch (err: any) {
    console.error("Error deleting city:", err.message);
    res.status(500).send({ message: "Error deleting city. Please try again." });
  }
};

// Delete all Cities 
exports.deleteAll = async (req: Request, res: Response) => {
  try {
    const result = await City.deleteMany({});
    res.send({
      message: `${result.deletedCount} Cities were deleted successfully!`,
    });
  } catch (err: any) {
    res.status(500).send({
      message: err.message || "Some error occurred while removing all cities.",
    });
  }
};

