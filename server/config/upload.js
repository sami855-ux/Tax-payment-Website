import multer from "multer"
import { storage } from "./cloudairy.js"

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
})

export default upload
