const { getConnection } = require("../db/db-connection");
const connection = getConnection();

exports.createLand = (req, res) => {
  const { owner, contact, location, size, price, description } = req.body;

  if (!owner || !contact || !location || !size || !price) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  // single image
  const image = req.files?.image
    ? `/uploads/${req.files.image[0].filename}`
    : null;

  // single video
  const video = req.files?.video
    ? `/uploads/${req.files.video[0].filename}`
    : null;

  connection.query(
    `INSERT INTO lands
     (owner, contact, location, size, price, description, image, video)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      owner,
      contact,
      location,
      size,
      price,
      description,
      image,
      video,
    ],
    (err, result) => {
      if (err) {
        console.error("MYSQL ERROR 👉", err);
        return res.status(500).json({
          message: "Database error",
          error: err.sqlMessage,
        });
      }

      res.status(201).json({
        message: "Land added successfully",
        data: {
          id: result.insertId,
          owner,
          contact,
          location,
          size,
          price,
          description,
          image,
          video,
        },
      });
    }
  );
};

exports.getAllLands = (req, res) => {
  connection.query("SELECT * FROM lands", (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json(results);
  });
};