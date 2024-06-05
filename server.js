import {connectMongoDB} from "./connection.js";
import { app } from "./app.js";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
});

connectMongoDB()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running at :: http://localhost/${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("connection failed ", err);
})