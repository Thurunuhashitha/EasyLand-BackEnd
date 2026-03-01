const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const { getConnection } = require("../db/db-connection");

const connection = getConnection();

// Run every day at midnight
cron.schedule("0 0 * * *", () => {
  console.log("🗑 Running auto-delete job...");

  const query = `
    SELECT * FROM lands
    WHERE created_at <= NOW() - INTERVAL 6 MONTH
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error checking expired lands:", err);
      return;
    }

    results.forEach((land) => {
      // Delete image file
      if (land.image) {
        const imagePath = path.join(__dirname, "..", land.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      // Delete video file
      if (land.video) {
        const videoPath = path.join(__dirname, "..", land.video);
        if (fs.existsSync(videoPath)) {
          fs.unlinkSync(videoPath);
        }
      }

      // Delete record from DB
      connection.query(
        "DELETE FROM lands WHERE id = ?",
        [land.id],
        (deleteErr) => {
          if (deleteErr) {
            console.error("Error deleting land:", deleteErr);
          } else {
            console.log(`Deleted land ID: ${land.id}`);
          }
        }
      );
    });
  });
});