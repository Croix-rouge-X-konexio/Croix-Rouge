const express = require("express");
const app = express();
// const dotenv = require("dotenv");
const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");

const Schema = require("../Schema");


async function isAdmin(req, res, next) {
    try {
        const data = await Schema.User.find({ _id: req.cookies.jwtData.id });
        // console.log(data[0].isAdmin);
        if (data[0].isAdmin) {
            next()
        } else {
            return res.json({
                message: "No admin !!! you don't have right"
            });
        }
    } catch (err) {
        console.log(err)
        return res.json({
            message: "Err user not find"
        });
    }
}
module.exports = { isAdmin: isAdmin };