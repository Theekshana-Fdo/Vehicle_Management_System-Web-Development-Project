import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    make: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    registration: { type: String, required: true, trim: true, uppercase: true },
    status: {
      type: String,
      enum: ["Active", "In service", "Inactive"],
      default: "Active",
    },
    odometer: { type: Number, default: 0 },
    nextService: { type: String, default: "" },
  },
  { timestamps: true },
);

// React expects "id" but MongoDB uses "_id", so we rename it in the JSON we send
vehicleSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

export default mongoose.model("Vehicle", vehicleSchema);
