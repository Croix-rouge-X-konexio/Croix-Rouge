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

//  MODIFIER EVENT - a faire si temps
//  SUPPRIMER EVENT - OK
//  CREER EVENT - OK
//  CONSULTER EVENT - OK

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

const deleteEvent = async (req, res) => {

    try {
        const eventId = req.params.eventId;
        const Event = await Schema.Event.deleteOne({ _id: eventId });
        const EventAttendees = await Schema.EventAttendees.deleteMany({ EventId: eventId });
        const EventEducationRelated = await Schema.EventEducationRelated.deleteMany({ EventId: eventId });

        res.json({
            message: `${eventId} deleted`,
        });
    }
    catch (err) {
        console.log(err);
        return res.json({
            message: "error: Event not found",
        });
    }



};

/* const patchEvent = async (req, res) => { //////// A corriger et ajouter si on a du temps
    try {
        const EventUpdate = req.body;
        await Schema.Event.findOneAndUpdate(
            { _id: req.body.id },
            {
            title: EventUpdate.title,
            date: EventUpdate.date,
            heure: EventUpdate.heure,
            duration: EventUpdate.duration,
            place: EventUpdate.place,
            description: EventUpdate.description,
            userId: req.cookies.jwtData.id,
            }
        );
        await Schema.EventEducationRelated.findOneAndUpdate(
            { _id: req.body.id },
            {
            EventId: newEvent.id,
            EducationId: EventUpdate.educationId
            }
        );

        res.json({
            message: "Update status: changed recorded",
        })
    }
    catch (err) {
        console.log(err);
        return res.json({
            message: "error: Event not found",
        });
    }
}; */

module.exports = {
    getAllEvent: getAllEvent,
    addEvent: addEvent,
    deleteEvent: deleteEvent,
    // patchEvent: patchEvent,
};