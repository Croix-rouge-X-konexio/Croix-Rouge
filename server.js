const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const Middleware = require("./middleware/middleware");

// Shema
const Schema = require("./Schema");
// console.log(Schema);

// dotenv config
dotenv.config(
    { path: "./congif.env" }
);

// Mongoose Connect
mongoose
    .connect(process.env.DB, {
        useNewUrlParser: true,
    })
    .then(() => {
        console.log("Connected to MongoDB !");
    });

// Middleware
app.use(express.json());

app.post("/user", async (req, res) => {
    const User = req.body
    const hashedPassword = await bcrypt.hash(User.password, 12);
    const educationExist = await Schema.EducationList.findOne({
        education: User.education,
    });
    // remplir l'EducationList
    try {
        const newUser = await Schema.User.create({
            firstName: User.firstName,
            lastName: User.lastName,
            phoneNumber: User.phoneNumber,
            email: User.email,
            area: User.area,
            category: User.category,
            password: hashedPassword,
            isAdmin: false,
            isValidate: false,
            // picture
        });
        // console.log(newUser.id);
        await Schema.UserEducation.create({
            date: User.date,
            userId: newUser.id,
            EducationId: educationExist.id,
            // certificate
        });
        await Schema.UserExperience.create({
            title: User.titleExperience,
            startingDate: User.startingDate,
            endingDate: User.endingDate,
            userId: newUser.id,
        });
        res.status(201).json({
            message: `New user added ! ${User.email}`,
            data: User
        });
    }
    catch (err) {
        return res.json({
            message: "error",
        });
    }
});


app.post("/event", middleware.protect, async (req, res) => {
    const Event = req.body;
    try {
        const newEvent = await Schema.Event.create({
            title: Event.title,
            date: Event.date,
            heure: Event.heure,
            duration: Event.duration,
            place: Event.place,
            description: Event.description,
            userId: 1
        });
        await Schema.EventEducationRelated.create({
            EventId: newEvent.id,
            EducationId: newEvent.education
        });
    }
    catch (err) {
        return res.json({
            message: "error",
        });
    }
});

// LISTEN
app.listen(process.env.PORT, () => {
    console.log("Server listening on port: " + process.env.PORT);
});

// exemple new user
// {
//     "firstName": "User.firstName",  
//     "lastName": "User.lastName",
//     "phoneNumber": 6565,
//     "email": "User.email",
//     "area": "User.area",
//     "category": "User.category",
//     "password": "hashedPassword",
//     "date": 654654,
//     "title": "User.title",
//     "startingDate": 54654,
//     "endingDat": 656,
//     "education": "ambulancier"
// }