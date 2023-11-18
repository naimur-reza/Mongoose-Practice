import { app } from "./app";
import config from "./app/config";
import mongoose from "mongoose";

const port = config.port;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    app.listen(port, () => {
      console.log("Server is running on port " + port);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
}

main();
