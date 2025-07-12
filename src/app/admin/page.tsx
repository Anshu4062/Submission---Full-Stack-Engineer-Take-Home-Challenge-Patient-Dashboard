import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify, JWTPayload } from "jose";
import dbConnect from "@/app/lib/mongo";
import UserModel, { IUser } from "@/app/models/user";
import UserManagementClient from "./UserManagementClient";
interface CustomJWTPayload extends JWTPayload {
  id: string;
  isAdmin: boolean;
}

function getJwtSecretKey() {
  const secret =
    "2bb2c71a4b8125d5be09ffeb51e0dbcefb31b9b536a03e1f59821d8a388e8be333ead6315c4fe6e837d7bfc6c185923eab9b1431235c1c1d5791ee5ad53a4008";
  return new TextEncoder().encode(secret);
}

// NEW FUNCTION to fetch all users
async function getAllUsers(): Promise<IUser[]> {
  try {
    await dbConnect();
    const users = await UserModel.find({}).lean(); // .lean() for plain JS objects
    return JSON.parse(JSON.stringify(users)); // Serialize data for the client
  } catch (error) {
    console.error("Failed to fetch all users:", error);
    return [];
  }
}

export default async function AdminPage() {
  const tokenCookie = cookies().get("token");
  if (!tokenCookie) redirect("/");

  try {
    const { payload } = await jwtVerify(tokenCookie.value, getJwtSecretKey());
    const user = payload as CustomJWTPayload;

    if (!user.isAdmin) redirect("/dashboard");

    // Fetch all users
    const allUsers = await getAllUsers();

    // --- ADD THIS LOGGING TO DEBUG ---
    console.log("--- Users fetched on server: ---");
    console.log(allUsers);
    console.log("---------------------------------");
    // ------------------------------------

    return <UserManagementClient users={allUsers} />;

  } catch (error) {
    console.error("Admin page error:", error);
    cookies().delete("token");
    redirect("/");
  }
}
