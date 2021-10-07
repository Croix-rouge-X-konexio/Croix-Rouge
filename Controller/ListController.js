const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const Protect = require("./middleware/protect");
const isAdmin = require("./middleware/isAdmin");
const router = express.Router();


//  PAGE List //

//  CONSULTER TOUT LES USERS
//  CONSULTER UN USER
//  MODIFIER UN USER
//  SUPPRIMER UN USER

// .delete et .patch à faire

const getAllUsers = async (_req, res) => {
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

    res.status(200).json({
        message: "RS-RedCross ListUser !",
        data: listUser
    });
};

const getOneUser = async (_req, res) => {
    const userInfo = await Schema.User.find({ /* _id: req.param.userid */ });
    const EducationInfo = await Schema.UserEducation.find({/* _id: req.param.userid */ });
    const ExperienceInfo = await Schema.UserExperience.find({ /* _id: req.param.userid */ });
    const allInfoUser = [];

    allInfoUser.push({
        user: userInfo,
        EducationInfo,
        ExperienceInfo
    });

    res.status(200).json({
        message: "UserInfo",
        data: allInfoUser
    });
};

const modifyOneUser = async (_req, res) => {
    // ici on met le code qui change le statut isValidate à true
};

const deleteOneUser = async (_req, res) => {
    //ici on met le code qui supprime un compte
};

module.exports = {
    getAllUsers: getAllUsers,
    getOneUser: getOneUser,
    modifyOneUser: modifyOneUser,
    deleteOneUser: deleteOneUser,
};