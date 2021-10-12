const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
    firstName: {
        required: true,
        type: String,
    },
    lastName: {
        required: true,
        type: String,
    },
    email: {
        required: true,
        type: String,
        unique: true,
    },
    password: {
        required: true,
        type: String,
    },
    phoneNumber: {
        required: true,
        type: Number,
    },
    area: {
        required: true,
        type: String,
    },
    category: {
        required: true,
        type: String,
    },
    // picture: {
    //     required: false,
    //     type: File
    // },
    isAdmin: {
        required: true,
        type: Boolean,
    },
    isValidate: {
        required: true,
        type: Boolean,
    }
});

const UsersExperienceSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String,
    },
    startingDate: {
        required: true,
        type: Number,
    },
    endingDate: {
        required: true,
        type: Number,
    },
    userId: [{
        type: mongoose.Types.ObjectId,
        ref: "Users", // à vérif
    }],
});

const UsersEducationSchema = new mongoose.Schema({
    EducationId: [{
        type: mongoose.Types.ObjectId,
        ref: "EducationList",
    }],
    date: {
        required: true,
        type: Number,
    },
    // certificate: {
    //     required: true,
    //     type: fichier
    // },
    userId: [{
        type: mongoose.Types.ObjectId,
        ref: "Users", // à vérif
    }],
});

const EventsSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String,
    },
    date: {
        required: true,
        type: Number,
    },
    heure: {
        required: true,
        type: Number,
    },
    duration: {
        required: true,
        type: Number,
    },
    place: {
        required: true,
        type: String,
    },
    // picture: {
    //     required: true,
    //     type: File
    // },
    description: {
        required: true,
        type: String,
    },
    userId: [{
        type: mongoose.Types.ObjectId,
        ref: "Users", // à vérif
    }],
    numberOfAttendies: {
        required: true,
        type: Number,
    }
});

const EventEducationRelatedSchema = new mongoose.Schema({
    EventId: [{
        type: mongoose.Types.ObjectId,
        ref: "Events", // à vérif
    }],
    EducationId: [{
        type: mongoose.Types.ObjectId,
        ref: "EducationLists",
    }],
});

const EducationListSchema = new mongoose.Schema({
    EducationName: {
        required: true,
        type: String,
    },
});

const EventAttendeesSchema = new mongoose.Schema({
    EventId: [{
        type: mongoose.Types.ObjectId,
        ref: "Event", // à vérif
    }],
    userId: [{
        type: mongoose.Types.ObjectId,
        ref: "Users", // à vérif
    }],
});

const User = mongoose.model("User", UsersSchema);
const UserExperience = mongoose.model("UserExperience", UsersExperienceSchema);
const UserEducation = mongoose.model("UserEducation", UsersEducationSchema);
const Event = mongoose.model("Event", EventsSchema);
const EventEducationRelated = mongoose.model("EventEducationRelated", EventEducationRelatedSchema);
const EducationList = mongoose.model("EducationList", EducationListSchema);
const EventAttendees = mongoose.model("EventAttendees", EventAttendeesSchema);

module.exports = {
    User,
    UserExperience,
    UserEducation,
    Event,
    EventEducationRelated,
    EducationList,
    EventAttendees,
};