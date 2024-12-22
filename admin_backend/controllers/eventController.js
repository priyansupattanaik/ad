const db = require("../config/db");

// Controller to add a new event
const addEvent = (req, res) => {
  const { eventTitle, eventDescription, eventDate, eventTime, eventLocation } =
    req.body;

  const eventImage = req.file ? req.file.filename : null;

  // Input validation
  if (
    !eventTitle ||
    !eventDescription ||
    !eventDate ||
    !eventTime ||
    !eventLocation ||
    !eventImage
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // SQL query to insert event into the database
  const query = `INSERT INTO upcoming_events (event_title, event_description, event_date, event_time, event_location, event_image) 
                 VALUES (?, ?, ?, ?, ?, ?)`;

  const values = [
    eventTitle,
    eventDescription,
    eventDate,
    eventTime,
    eventLocation,
    eventImage,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting event: ", err);
      return res.status(500).json({ message: "Error adding event" });
    }
    res
      .status(200)
      .json({ message: "Event added successfully", eventId: result.insertId });
  });
};

module.exports = { addEvent };
