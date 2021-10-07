const express = require("express");
const router = express.Router();
const ListController = require("../Controller/ListController");
const Protect = require("../middleware/protect");
const isAdmin = require("../middleware/isAdmin");
const checkId = require("../middleware/checkId");

router.get("/listUsers", Protect.protect, isAdmin.isAdmin, ListController.getAllUsers);
router.get("/listUsers/:userid", Protect.protect, isAdmin.isAdmin, checkId.checkId, ListController.getOneUser);
router.patch("/listUsers/:userid", Protect.protect, isAdmin.isAdmin, checkId.checkId, ListController.modifyOneUser);
router.delete("/listUsers/:userid", Protect.protect, isAdmin.isAdmin, checkId.checkId, ListController.deleteOneUser);

module.exports = router;
