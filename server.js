const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const userRoute = require("./routes/userRoutes");
const bookRoute = require("./routes/bookRoutes");
const reviewRoute = require("./routes/reviewRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

// middleware
app.use(express.json());   //parse incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true })); // parse incoming requests with url-encoded payloads
app.use(errorMiddleware);


// mongoose
mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));


// routes
app.use("/api/auth",userRoute);
app.use("/api/books",bookRoute); 
app.use("/api/reviews",reviewRoute);

const PORT=process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));