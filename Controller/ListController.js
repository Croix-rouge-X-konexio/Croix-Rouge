const express = require("express");
// const app = express();
// const dotenv = require("dotenv");
const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
const Schema = require("../Schema")
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const fs = require("fs");
// const router = express.Router();


//  PAGE List //

//  CONSULTER TOUT LES USERS
//  CONSULTER UN USER
//  MODIFIER UN USER
//  SUPPRIMER UN USER

const getAllUsers = async (_req, res) => {
    try {
        const userInfo = await Schema.User.find();
        const listUser = [];

        for (let i = 0; i < userInfo.length; i++) {
            listUser.push({
                userid: userInfo[i]._id,
                firstName: userInfo[i].firstName,
                lastName: userInfo[i].lastName,
                email: userInfo[i].email,
                isValidate: userInfo[i].isValidate,
                isAdmin: userInfo[i].isAdmin,
            });
        }
        res.json({
            message: "RS-RedCross ListUser !",
            data: listUser
        });
    }
    catch (err) {
        console.log(err);
        return res.json({
            message: "error",
        });
    }

}

// test avec plusieurs expériences et formation
const getOneUser = async (req, res) => {
    try {
        const userId = req.params.userid;
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
            message: "error: User not found",
        });
    }

};

const modifyOneUser = async (req, res) => {
    try {
        const userId = req.params.userid;
        // console.log("coté back ligne 79   ", userId);
        const userUpdate = await Schema.User.updateOne(
            { _id: userId },
            { isValidate: true }
        );
        res.json({
            message: "Update status: isValidate => true",
        })
    }
    catch (err) {
        console.log(err);
        return res.json({
            message: "error: User not found",
        });
    }
};

const deleteOneUser = async (req, res) => {
    try {
        const userId = req.params.userid;
        const userInfo = await Schema.User.deleteOne({ _id: userId });
        const EducationInfo = await Schema.UserEducation.deleteMany({ userId: userId });
        const ExperienceInfo = await Schema.UserExperience.deleteMany({ userId: userId });
        fs.unlinkSync(`./public/Img/${userId}`)
        // fs.unlink(`./public/Img${userId}`)
        res.json({
            message: `${userId} deleted`,
        });
    }
    catch (err) {
        console.log(err);
        return res.json({
            message: "error: User not found",
        });
    }

};

module.exports = {
    getAllUsers: getAllUsers,
    getOneUser: getOneUser,
    modifyOneUser: modifyOneUser,
    deleteOneUser: deleteOneUser,
};