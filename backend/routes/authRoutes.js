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
    console.log("No file uploaded");
    return res.status(400).json({ message: "No file uploaded" });
  }
  // const protocol = process.env.NODE_ENV === "production" ? "https" : req.protocol;
  // const host = process.env.NODE_ENV === "production"  ? "jobtime-backend.onrender.com" : req.get("host");

  // Log environment variables
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("BASE_URL:", process.env.BASE_URL);

  // Log request info
  console.log("req.protocol:", req.protocol);
  console.log("req.get('host'):", req.get("host"));

  const imageUrl = `${process.env.BASE_URL}/uploads/${req.file.filename}`;
  console.log("Generated imageUrl:", imageUrl); // debug

  // const imageUrl = `${protocol}://${host}/uploads/${
  //   req.file.filename
  // }`;
  res.status(200).json({ imageUrl });
});


export default router;