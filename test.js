const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.post("/event", async (req, res) => {
    const Event = req.body
    try {
        const newEvent = await Schema.Event.create({
            title: Event.title,
            date: Event.date,
            heure: Event.heure,
            duration: Event.duration,
            place: Event.place,
            description: Event.description,
            // userId: 
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