import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    service: { type: String, required: true, trim: true },
    dueDate: { type: String, required: true }, // yyyy-mm-dd, same as the date input
    status: {
      type: String,
      enum: ["Scheduled", "Complete"],
      default: "Scheduled",
    },
  },
  { timestamps: true },
);

maintenanceSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

export default mongoose.model("Maintenance", maintenanceSchema);
