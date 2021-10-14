const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");
const Schema = require("../Schema");
// const Protect = require("../middleware/protect");
// const isAdmin = require("../middleware/isAdmin");
// const router = express.Router();
// const dotenv = require("dotenv");


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
    try {

        const newEvent = await Schema.Event.create({
            title: Event.title,
            date: Event.date,
            heure: Event.heure,
            duration: Event.duration,
            place: Event.place,
            description: Event.description,
            userId: req.cookies.jwtData.id,
            picture: req.file.originalname,
            numberOfAttendies: 0
        });

        fs.renameSync(req.file.path, path.join(req.file.destination, newEvent.id));
        await Schema.Event.updateOne({ _id: newEvent.id }, { picture: newEvent.id });

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
        fs.unlinkSync(`./public/Img/${eventId}`)
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

async function numberOfAttendees() {
    try {
        const arrayEvent = await Schema.Event.find({}); // On récupère tous les evenement 
        const IdOfAllEvent = arrayEvent.map(element => element._id); // on crée un tableau avec la liste de tous les EventID
        // console.log(IdOfAllEvent.length)
        for (let i = 0; i < IdOfAllEvent.length; i++) { // On boucle sur tous les éléments du tableau
            const numberAttendies = await Schema.EventAttendees.countDocuments({ EventId: IdOfAllEvent[i] }); // on compte dans eventattendee le nombre de fois ou l'ID de l'event existe
            // console.log(numberAttendies); // on affiche le numbre de participant
            // console.log(IdOfAllEvent[i]);
            // const test = await Schema.Event.updateOne({ EventId: IdOfAllEvent[i] }, { numberOfAttendies: numberAttendies }); // Regardé le updateOne //On met à jours la valeur du numberAttendies avec ce qu'on à récupérer ligne précédente
            const test = await Schema.Event.updateOne({ _id: IdOfAllEvent[i] }, { $set: { numberOfAttendies: numberAttendies } }); // Regardé le updateOne //On met à jours la valeur du numberAttendies avec ce qu'on à récupérer ligne précédente
            // console.log(test);
        } // On boucle sur l'evenement suivant (présent dans la variable/tableau IdOfAllEvent 
    }
    catch (err) {
        console.log(err);
        return res.json({
            message: "error",
        });
    }
}



const attendEvent = async (req, res) => {
    const eventId = req.params.eventId;
    const userId = req.cookies.jwtData.id;
    try {
        const attendToEvent = await Schema.EventAttendees.findOne({ EventId: eventId, userId: userId });
        if (attendToEvent) {
            await Schema.EventAttendees.deleteOne({ EventId: eventId });
        } else {
            const newEvent = await Schema.EventAttendees.create({
                EventId: eventId,
                userId: userId
            });
        };
        numberOfAttendees();
        res.json({
            message: `Number of attendees up to date`,
        });
    }
    catch (err) {
        console.log(err);
        return res.json({
            message: "error",
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
    attendEvent: attendEvent,
};