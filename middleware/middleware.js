const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

function protect(req, res, next) {
    try {
        const dataUser = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
        if (dataUser.iat + 1000 < Math.ceil(Date.now() / 1000)) {
            return res.clearCookie('jwt').json({
                message: "Session expired"
            })
        } else {
            req.cookies.jwtData = dataUser;
            next();
        }
    } catch (err) {
        return res.status(401).json({
            message: "TOKEN not Valid"
        })
    }
}
// TEST datauser 

module.exports = { protect: protect };