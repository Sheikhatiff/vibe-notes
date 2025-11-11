import mongoose from "mongoose";
import User from "./user.model.js";
import { encrypt, decrypt, isEncrypted } from "../utils/encrypt.js";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title must be less than 100 characters"],
    },
    note: {
      type: String,
      required: [true, "note is required"],
      trim: true,
    },
    type: {
      enum: ["quick", "smart", "geo"],
      type: String,
      required: [true, "Note type is required"],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    prompt: {
      type: String,
      trim: true,
    },
    coordinates: {
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },
    locationName: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.every(
            (tag) => typeof tag === "string" && tag.trim() !== ""
          );
        },
        message: "Tags must be an array of non-empty strings",
      },
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Middleware to check notes types according to fields
noteSchema.pre("save", function (next) {
  if (this.type === "smart" && !this.prompt) {
    return next(new Error("Prompt is required for smart notes"));
  }
  if (
    this.type === "geo" &&
    (!this.coordinates || !this.coordinates.lat || !this.coordinates.lng)
  ) {
    return next(new Error("Coordinates are required for geo notes"));
  }
  next();
});

noteSchema.post("save", async function (doc, next) {
  try {
    await User.findByIdAndUpdate(doc.user, { $addToSet: { notes: doc._id } });
    next();
  } catch (err) {
    next(err);
  }
});

noteSchema.post("findOneAndDelete", async function (doc, next) {
  if (!doc) return next();
  try {
    await User.findByIdAndUpdate(doc.user, { $pull: { notes: doc._id } });
    next();
  } catch (err) {
    next(err);
  }
});

noteSchema.pre("save", function (next) {
  // only encrypt when note exists and is not already encrypted
  if (this.isModified("note") && this.note && !isEncrypted(this.note)) {
    this.note = encrypt(this.note);
  }
  next();
});

noteSchema.post(/^find/, function (result) {
  if (!result) return;
  const decryptSafely = (val) => {
    try {
      return isEncrypted(val) ? decrypt(val) : val;
    } catch (err) {
      // log but do not crash the whole query result pipeline
      console.error("Decryption error (skipping this field):", err.message);
      // return the stored value so the app can decide what to do
      return val;
    }
  };

  if (Array.isArray(result)) {
    result.forEach((doc) => {
      if (doc.note) {
        doc.note = decryptSafely(doc.note);
      }
    });
  } else {
    if (result.note) {
      result.note = decryptSafely(result.note);
    }
  }
});

const Note = mongoose.model("Note", noteSchema);
export default Note;
