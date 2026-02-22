const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const {
  createLand,
  getAllLands,
} = require("../controller/landController");

// single image + single video
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createLand
);

router.get("/getAll", getAllLands);

module.exports = router;