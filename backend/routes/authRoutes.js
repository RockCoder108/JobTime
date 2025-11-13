import express from "express"
import { register, login, getMe } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);


router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const protocol = process.env.NODE_ENV === "production" ? "https" : req.protocol;
  const host =
    process.env.NODE_ENV === "production"  ? "jobtime-backend.onrender.com" : req.get("host");

  const imageUrl = `${protocol}://${host}/uploads/${
    req.file.filename
  }`;
  res.status(200).json({ imageUrl });
});


export default router;