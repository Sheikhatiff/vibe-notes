import multer from "multer";
import fs from "fs";
import path from "path";
import Lan from "../models/lan.model.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  const sanitized = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
  file.originalname = sanitized;
  cb(null, true);
};

export const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 10,
  },
});

// Middleware to set IP address
export const setIP = catchAsync(async (req, res, next) => {
  let ip = req.header("x-forwarded-for") || req.connection.remoteAddress;

  if (ip && ip.includes(",")) {
    ip = ip.split(",")[0].trim();
  }

  // Remove IPv6 prefix
  ip = ip.replace("::ffff:", "");
  if (ip === "::1" || ip === "127.0.0.1") {
    ip = "localhost";
  }

  req._ipAddress = ip;
  next();
});

const getSafePath = (ipAddress) => {
  const safeIP = ipAddress.replace(/[:.]/g, "_");
  return path.join(process.cwd(), "public", safeIP, "files");
};

// Helper to get file stats
const getFileStats = (folderPath, filename) => {
  try {
    const filePath = path.join(folderPath, filename);
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (err) {
    return 0;
  }
};

// Helper to format file data
const formatFileData = (filename, ipAddress) => {
  const safeIP = ipAddress.replace(/[:.]/g, "_");
  const folderPath = getSafePath(ipAddress);
  const size = getFileStats(folderPath, filename);

  return {
    name: filename,
    path: `/${safeIP}/files/${encodeURIComponent(filename)}`,
    size: size,
  };
};

export const uploadFiles = catchAsync(async (req, res, next) => {
  const folderPath = getSafePath(req._ipAddress);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const keepFiles = req.body.keepFiles || [];
  console.log("Files to keep:", keepFiles);

  const existingFilesOnDisk = fs.existsSync(folderPath)
    ? fs.readdirSync(folderPath)
    : [];

  const newFiles = req.files ? req.files.map((f) => f.originalname) : [];
  console.log("New files being uploaded:", newFiles);

  existingFilesOnDisk.forEach((file) => {
    const shouldKeep = keepFiles.includes(file) || newFiles.includes(file);
    if (!shouldKeep) {
      try {
        fs.unlinkSync(path.join(folderPath, file));
        console.log(`Deleted old file: ${file}`);
      } catch (err) {
        console.error(`Failed to delete ${file}:`, err);
      }
    }
  });

  if (req.files && req.files.length > 0) {
    const totalSize = req.files.reduce((sum, f) => sum + f.size, 0);
    if (totalSize > 10 * 1024 * 1024) {
      return next(new AppError("Total file size exceeds 10MB", 400));
    }

    try {
      req.files.forEach((file) => {
        fs.writeFileSync(path.join(folderPath, file.originalname), file.buffer);
        console.log(`Saved new file: ${file.originalname}`);
      });
    } catch (err) {
      return next(new AppError("Failed to save files", 500));
    }
  }

  const keptFilesData = keepFiles.map((filename) =>
    formatFileData(filename, req._ipAddress)
  );

  const newFilesData = req.files
    ? req.files.map((file) => formatFileData(file.originalname, req._ipAddress))
    : [];

  req.body.files = [...keptFilesData, ...newFilesData];

  console.log(`Total files after operation: ${req.body.files.length}`);

  next();
});

export const updateOrCreateLAN = catchAsync(async (req, res, next) => {
  const lanData = {
    text: req.body.text || "",
    files: req.body?.files || [],
    ipAddress: req._ipAddress,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };

  const lan = await Lan.findOneAndUpdate(
    { ipAddress: req._ipAddress },
    lanData,
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: { lan },
  });
});

export const getLAN = catchAsync(async (req, res, next) => {
  const { filename } = req.query;

  if (filename) {
    const folderPath = getSafePath(req._ipAddress);
    const filePath = path.join(folderPath, filename);

    const resolvedPath = path.resolve(filePath);
    const resolvedFolder = path.resolve(folderPath);

    if (!resolvedPath.startsWith(resolvedFolder)) {
      return next(new AppError("Invalid file path", 400));
    }

    if (!fs.existsSync(filePath)) {
      return next(new AppError("File not found", 404));
    }

    const lan = await Lan.findOne({ ipAddress: req._ipAddress });
    if (!lan || !lan.files.some((f) => f.name === filename)) {
      return next(new AppError("File not found", 404));
    }
    return res.sendFile(resolvedPath);
  }
  const lan = await Lan.findOne({ ipAddress: req._ipAddress });

  if (!lan) {
    return res.status(200).json({
      status: "success",
      data: {
        lan: {
          text: "",
          files: [],
          ipAddress: req._ipAddress,
        },
      },
    });
  }

  const formattedFiles = lan.files.map((file) => {
    if (typeof file === "string") {
      return formatFileData(file, req._ipAddress);
    }
    return file;
  });

  res.status(200).json({
    status: "success",
    data: {
      lan: {
        ...lan.toObject(),
        files: formattedFiles,
      },
    },
  });
});
