const express = require("express");
const multer = require("multer");
const { addEvent } = require("../../controllers/eventController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../../uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/add-event", upload.single("eventImage"), addEvent);

module.exports = router;
