import mongoose, { Schema, Document, models, Model } from "mongoose";

// Define the interface for a single medication entry
export interface IMedication {
  type: string;
  dosage: string;
}

export interface IWeightData {
  date: Date;
  weight: number;
}

export interface IShipment {
  date: Date;
  status: "Shipped" | "Processing" | "Delivered" | "Pending";
  tracking?: string; // Changed from trackingNumber to tracking to match client
}

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  weightData: IWeightData[];
  goalWeight?: number;
  // --- FIX 1: Changed from singular 'medication' to plural 'medications' array ---
  medications: IMedication[];
  shipments: IShipment[];
  nextShipmentDate?: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    weightData: [
      {
        date: { type: Date, required: true },
        weight: { type: Number, required: true },
      },
    ],
    goalWeight: {
      type: Number,
    },
    // --- FIX 2: Updated schema definition to be an array of medication objects ---
    medications: [
      {
        type: { type: String, required: true },
        dosage: { type: String, required: true },
      },
    ],
    shipments: [
      {
        date: { type: Date, required: true },
        status: {
          type: String,
          required: true,
          enum: ["Shipped", "Processing", "Delivered", "Pending"],
        },
        // --- FIX 3: Changed from trackingNumber to tracking to match client ---
        tracking: { type: String },
      },
    ],
    nextShipmentDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const UserModel: Model<IUser> =
  models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
