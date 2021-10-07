const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const Schema = require("../Schema");

async function checkId(req, res, next) {
    const userId = req.params.userid;
    try {
        const userExist = await Schema.User.find({ _id: req.params.userid });
        if (userExist.length !== 0) {
            next();
        }
        else {
            return res.json({
                message: "user doesn't exist"
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.json({
            message: "ID not valid",
        });
    }
}


module.exports = {
    checkId: checkId
}