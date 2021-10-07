const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const Protect = require("../middleware/protect");
const isAdmin = require("../middleware/isAdmin");
const router = express.Router();
const Schema = require("../Schema");


//  PAGE EVENT //

//  MODIFIER EVENT
//  SUPPRIMER EVENT
//  CREER EVENT
//  CONSULTER EVENT

// .delete et .patch à faire


const getAllEvent = async (_req, res) => {
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
};

const addEvent = async (req, res) => {
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
};

// const deleteEvent = (Protect.protect, isAdmin.isAdmin, async (req, res) => {

// });

// const patchEvent = (Protect.protect, isAdmin.isAdmin, async (req, res) => {

// });

module.exports = {
    getAllEvent: getAllEvent,
    addEvent: addEvent,
    // deleteEvent: deleteEvent,
    // patchEvent: patchEvent,
};