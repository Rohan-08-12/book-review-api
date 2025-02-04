const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const userRoute = require("./controllers/userController");
const bookRoute = require("./controllers/bookController");

// middleware
app.use(express.json());   //parse incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true })); // parse incoming requests with url-encoded payloads



// mongoose
mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));


// routes
app.use("/api/auth",userRoute);
app.use("/api/books",bookRoute); 

const PORT=process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));