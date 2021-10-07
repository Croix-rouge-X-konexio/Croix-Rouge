const express = require("express");
const router = express.Router();
const ListController = require("../Controller/ListController");
const Protect = require("../middleware/protect");
const isAdmin = require("../middleware/isAdmin");

app.get("/listUsers", Protect.protect, isAdmin.isAdmin, ListController.getAllUsers);
app.get("/listUsers/:userid", Protect.protect, isAdmin.isAdmin, ListController.getOneUser);
app.patch("/listUsers/:userid", Protect.protect, isAdmin.isAdmin, ListController.modifyOneUser);
app.delete("/listUsers/:userid", Protect.protect, isAdmin.isAdmin, ListController.deleteOneUser);

module.exports = router;
