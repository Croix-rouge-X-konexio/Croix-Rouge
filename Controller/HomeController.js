const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const router = express.Router();
const Schema = require("../Schema");


// PAGE HOME //

// SE CONNECTER - OK
// S'INSCRIRE - OK
// MODIFIER SON PROFIL - A faire
// SE DECONNECTER - OK

const logIn = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const userExist = await Schema.User.findOne({ email }); //Chercher l'utilisateur dans la BD

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
};



const addUser = async (req, res) => {
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
};

const deconnected = (_req, res) => {
    res.clearCookie("jwt", "", { path: "/dsiconnect" })
        .status(200)
        .json({ message: "Offline" });
};

// const patchUser = (Protect.protect, (req, res) => {

// });

module.exports = {
    logIn: logIn,
    addUser: addUser,
    // patchUser: patchUser,
    deconnected: deconnected,
};