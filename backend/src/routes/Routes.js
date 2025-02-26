const express = require("express");
const router = express.Router();
const userController = require("../users/user.js");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const originalName = path
      .parse(file.originalname)
      .name.replace(/\s+/g, "_"); 
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "");
    const extension = path.extname(file.originalname);

    cb(null, `${originalName}_${timestamp}${extension}`);
  },
});

const upload = multer({ storage });

router.post("/", userController.createUser);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.delete("/:id", userController.deleteUser);
router.put("/:id", upload.single("foto_profile"), userController.updateUser);

module.exports = router;
