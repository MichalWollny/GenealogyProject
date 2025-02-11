import mongoose from "mongoose";
import Person from "./personSchema.js";

const relationshipSchema = new mongoose.Schema({
  person: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Person",
    required: true,
  },
  type: {
    type: String,
    enum: ["blood", "married", "divorced", "adopted"],
    required: true,
  },
});

export default relationshipSchema;
// export default mongoose.model("Relationship", relationshipSchema);
