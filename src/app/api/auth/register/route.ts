import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongo";
import UserModel from "@/app/models/user";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email or username already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      // Add some initial mock data for demonstration
      goalWeight: 180,
      medication: { type: "Wellness-Pill", dosage: "50mg" },
      nextShipmentDate: new Date(new Date().setDate(new Date().getDate() + 20)),
      weightData: [
        {
          date: new Date(new Date().setDate(new Date().getDate() - 30)),
          weight: 210,
        },
        {
          date: new Date(new Date().setDate(new Date().getDate() - 15)),
          weight: 205,
        },
        { date: new Date(), weight: 202 },
      ],
      shipments: [
        {
          date: new Date(new Date().setDate(new Date().getDate() - 45)),
          status: "Delivered",
          trackingNumber: "1Z999AA10123456784",
        },
      ],
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
