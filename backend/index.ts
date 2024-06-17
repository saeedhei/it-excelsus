import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
const cors = require("cors"); 

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());


app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

require("./api/routes/city.routes")(app);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at \x1b[34mhttp://localhost:${port}\x1b[0m`);
  console.log(`⚡️[API]: Server is running at \x1b[34mhttp://localhost:${port}/api/cities\x1b[0m`);
});


import db from './api/2-models';
async function connectWithRetry() {
  try {
      // Establish the connection with the database
      await db.mongoose.connect(db.url, {});
      console.log("⚡️[DB]: Server is Connected to the database!");

      // Set up listeners for connection events
      db.mongoose.connection.on("error", (err: Error) => {
          console.error("⚠️MongoDB connection error:", err);
      });

      db.mongoose.connection.on("disconnected", () => {
          console.warn("❌MongoDB connection disconnected");
      });
  } catch (err) {
      console.error("⚠️Cannot connect to the database!", err);
      console.log("🔄 Retrying connection in 5 seconds...");
      // Retry connection after 5 seconds
      setTimeout(connectWithRetry, 5000);
  }
}
connectWithRetry();
process.on("SIGINT", async () => {
  console.log("Received SIGINT, closing MongoDB connection");
  await db.mongoose.connection.close();
  console.log("❌MongoDB connection closed");
  process.exit(0);
});

