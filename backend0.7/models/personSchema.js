import mongoose from "mongoose";
import { parse, isValid } from "date-fns";
import { de } from "date-fns/locale";

import relationshipSchema from "./relationshipSchema.js";

const personSchema = new mongoose.Schema({
  firstName: {
    type: String,
    default: "firstName",
    required: [true, "First Name is required"],
  },
  lastName: {
    type: String,
    default: "lastName",
    required: [true, "Last Name is required"],
  },
  birthDate: {
    type: Date,
    required: [true, "Date of birth is required, please use DD-MM-YYYY format"],
    validate: {
      validator: function (value) {
        // Check if date is in EU format and is valid
        const parsedDate = parse(value, "dd-MM-yyyy", new Date(), {
          locale: de,
        });
        return isValid(parsedDate);
      },
      message: "Date of birth must be in the format DD-MM-YYYY",
    },
  },
  deathDate: {
    type: Date,
    default: null,
    validate: {
      validator: function (value) {
        // Check if date is in EU format and is valid
        const parsedDate = parse(value, "dd-MM-yyyy", new Date(), {
          locale: de,
        });
        return isValid(parsedDate);
      },
      message: "Death date must be in the format DD-MM-YYYY",
    },
  },
  gender: {
    type: String,
    default: "Unknown",
    enum: ["Unknown", "Male", "Female"],
  },
  parents: {
    type: [relationshipSchema],
    default: [],
  },
  spouses: {
    type: [relationshipSchema],
    default: [],
  },
  siblings: {
    type: [relationshipSchema],
    default: [],
  },
  children: {
    type: [relationshipSchema],
    default: [],
  },
});

// Pre-Save Hook, um das Datum zu transformieren
personSchema.pre("save", function (next) {
  if (this.birthDate) {
    this.birthDate = parse(this.birthDate, "dd-MM-yyyy", new Date(), {
      locale: de,
    });
  }
  if (this.deathDate) {
    this.deathDate = parse(this.deathDate, "dd-MM-yyyy", new Date(), {
      locale: de,
    });
  }
  next();
});

export default mongoose.model("Person", personSchema);
