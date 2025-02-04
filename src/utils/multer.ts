import multer from "multer";
import path from "path";

//multer for storing file
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, "uploads/");
  },
  filename: (req: any, file: any, cb: any) => {
    const fileExtension = path.extname(file.originalname);
    const filename = Date.now() + fileExtension;
    cb(null, filename);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "video/mp4",
    "video/mpeg",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPG, PNG, PDF, MP4, and MPEG are allowed."
      ),
      false
    );
  }
};

const uploadImageOnly = multer({
  storage,
  fileFilter: (req: any, file: any, cb: any) => {
    const allowedImageTypes = ["image/jpeg", "image/png"];
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true); // Accept only image files (JPG, PNG)
    } else {
      cb(
        new Error("Invalid file type. Only JPG and PNG images are allowed."),
        false
      ); // Reject other files
    }
  },
});
// Utility for uploading PDFs only
const uploadPdfOnly = multer({
  storage,
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true); // Accept only PDF files
    } else {
      cb(new Error("Invalid file type. Only PDF files are allowed."), false); // Reject other files
    }
  },
});

// Utility for uploading videos only
const uploadVideoOnly = multer({
  storage,
  fileFilter: (req: any, file: any, cb: any) => {
    const allowedVideoTypes = ["video/mp4", "video/mpeg"];
    if (allowedVideoTypes.includes(file.mimetype)) {
      cb(null, true); // Accept only video files
    } else {
      cb(
        new Error("Invalid file type. Only MP4 and MPEG videos are allowed."),
        false
      ); // Reject other files
    }
  },
});

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // file size limit (50 MB)
  },
});

export { upload, uploadImageOnly, uploadPdfOnly, uploadVideoOnly };
