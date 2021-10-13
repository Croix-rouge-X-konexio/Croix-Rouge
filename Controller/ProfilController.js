const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Schema = require("../Schema")
const cookieParser = require("cookie-parser");
const router = express.Router();


const getMyProfil = async (req, res) => {
    try {
        const userId = req.cookies.jwtData.id
        const userInfo = await Schema.User.find({ _id: userId });
        const EducationInfo = await Schema.UserEducation.find({ userId: userId });
        const ExperienceInfo = await Schema.UserExperience.find({ userId: userId });
        const allInfoUser = [];

        allInfoUser.push({
            user: userInfo,
            EducationInfo,
            ExperienceInfo
        });
        res.json({
            message: "UserInfo",
            data: allInfoUser
        });
    }

    catch (err) {
        console.log(err);
        return res.json({
            message: "error",
        });
    }

}

module.exports = {
    getMyProfil: getMyProfil,
};