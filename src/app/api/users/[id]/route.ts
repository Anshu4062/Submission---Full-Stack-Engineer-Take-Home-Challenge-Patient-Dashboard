import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongo";
import UserModel from "@/app/models/user";

// This line forces the route to be rendered dynamically and is a key part of the fix.
export const dynamic = "force-dynamic";

// --- Handles updating a user's information ---
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const updateData = await request.json();

    // Directly delete the _id property to prevent errors and ESLint warnings.
    delete updateData._id;

    await dbConnect();

    // Use the $set operator for a reliable update
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Failed to update user:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Server error while updating user", error: errorMessage },
      { status: 500 }
    );
  }
}

// --- Handles deleting a user ---
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json(
      { message: "Server error while deleting user" },
      { status: 500 }
    );
  }
}
