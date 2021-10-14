const express = require("express");
const app = express();
// const dotenv = require("dotenv");
const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

function protect(req, res, next) {
    // console.log(req.cookies.jwt)
    try {
        const dataUser = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
        if (dataUser.iat + 1000 < Math.ceil(Date.now() / 1000)) {
            return res.clearCookie('jwt').json({
                message: "Session expired"
            })
        } else {
            req.cookies.jwtData = { id: dataUser.id, email: dataUser.email };
            next();
        }
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            message: "TOKEN not Valid"
        })
    }
}
// TEST datauser récupère id  email password

module.exports = { protect: protect };