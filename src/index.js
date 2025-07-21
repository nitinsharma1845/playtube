import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import connectDb from "./db/index.js";
import { app } from "./app.js";



connectDb()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error ::: ", error);
      throw error
    });

    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server stared at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Connection Failed to DataBase");
  });
