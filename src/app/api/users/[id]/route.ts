import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongo";
import UserModel from "@/app/models/user";

// --- Handles updating a user's information ---
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const body = await request.json();

    // We don't need to destructure here, we'll pass the whole body.
    // However, it's good practice to remove the _id from the update payload
    // to prevent any potential errors with trying to change the immutable _id.
    const { _id, ...updateData } = body;

    await dbConnect();

    // --- THE FIX IS HERE ---
    // We use the $set operator to explicitly tell MongoDB to replace the
    // fields with the new data provided in the updateData object.
    // This is the most reliable way to update the entire document's content.
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $set: updateData }, // Using the $set operator
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
  { params }: { params: { id: string } }
) {
  const { id } = params;

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
