const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const Protect = require("./middleware/protect");
const isAdmin = require("./middleware/isAdmin");

// Shema
const Schema = require("./Schema");

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
app.use(cookieParser());

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
        console.log(err);
        return res.json({
            message: "error",
        });
    }
});


app.post("/event", Protect.protect, isAdmin.isAdmin, async (req, res) => {
    const Event = req.body;
    // console.log(req.cookies.jwtData.id);
    try {
        const newEvent = await Schema.Event.create({
            title: Event.title,
            date: Event.date,
            heure: Event.heure,
            duration: Event.duration,
            place: Event.place,
            description: Event.description,
            userId: req.cookies.jwtData.id
        });
        await Schema.EventEducationRelated.create({
            EventId: newEvent.id,
            EducationId: Event.educationId
        });
        res.status(201).json({
            message: `New Event added ${Event.title}`,
            data: Event
        });
    }
    catch (err) {
        console.log(err);
        return res.json({
            message: "error",
        });
    }
});

/////// Connection utilisateur
app.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const userExist = await Schema.User.findOne({ email }); //Chercher l'utilisateur dans la BD
    // console.log(userExist);

    if (!userExist) {
        return res.json({
            message: "Invalid email or password",
        });
    }

    const passwordValid = await bcrypt.compare(password, userExist.password) //Verification du MDP
    if (!passwordValid) {
        return res.json({
            message: "Invalid email or password",
        });
    }

    const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET); //Creation du token

    res.cookie("jwt", token, { httpOnly: true, secure: false }); //creation du cookie
    res.json("You are connected");
});

app.get("/allUser", Protect.protect, isAdmin.isAdmin, async (_req, res) => {
    const userInfo = await Schema.User.find({ isValidate: false });
    const allInfoUser = [];

    for (let i = 0; i < userInfo.length; i++) {
        const idUser = userInfo[i]._id;
        const EducationInfo = await Schema.UserEducation.find({ userId: idUser })
        const ExperienceInfo = await Schema.UserExperience.find({ userId: idUser })
        allInfoUser.push({
            user: userInfo[i],
            EducationInfo,
            ExperienceInfo
        })
    }

    res.status(200).json({
        message: "Users waiting for validation !",
        data: allInfoUser
    });
});


app.get("/allEvent", Protect.protect, async (_req, res) => {
    const Events = await Schema.Event.find(/* { date: { $lte: date du jour} } */);
    const allInfoEvent = [];

    for (let i = 0; i < Events.length; i++) {
        const idEvent = Events[i]._id;
        const attendeesList = await Schema.EventAttendees.find({ EventId: idEvent })
        const educationRelated = await Schema.EventEducationRelated.find({ EventId: idEvent })
        allInfoEvent.push({
            Event: Events[i],
            attendeesList,
            educationRelated
        })
    }

    res.status(200).json({
        message: "Event list",
        data: allInfoEvent,
    });
});

app.get("/disconnect", Protect.protect, (_req, res) => {
    res.clearCookie("jwt", "", { path: "/dsiconnect" })
        .status(200)
        .json({ message: "Offline" });
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
// mot de passe : Victor
// }

// userId: 615c4cec100ff385f853033d

// , middleware.protect