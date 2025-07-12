import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify, JWTPayload } from "jose";
import dbConnect from "@/app/lib/mongo";
import UserModel, { IUser } from "@/app/models/user";
import DashboardClient from "./DashboardClient";

interface TokenPayload extends JWTPayload {
  id: string;
}

// Helper function with the hardcoded secret
function getJwtSecretKey() {
  const secret =
    "2bb2c71a4b8125d5be09ffeb51e0dbcefb31b9b536a03e1f59821d8a388e8be333ead6315c4fe6e837d7bfc6c185923eab9b1431235c1c1d5791ee5ad53a4008";
  return new TextEncoder().encode(secret);
}

async function getUserData(userId: string): Promise<IUser | null> {
  try {
    await dbConnect();
    const user = await UserModel.findById(userId).lean();
    if (!user) return null;
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return null;
  }
}

export default async function DashboardPage() {
  const tokenCookie = cookies().get("token");

  if (!tokenCookie) {
    redirect("/");
  }

  let userData: IUser | null = null;
  try {
    const { payload } = await jwtVerify(tokenCookie.value, getJwtSecretKey());
    userData = await getUserData(payload.id as string);
  } catch (error) {
    console.error("JWT verification failed:", error);
    cookies().delete("token");
    redirect("/");
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Could not load user data. Please try logging in again.</p>
      </div>
    );
  }

  return <DashboardClient user={userData} />;
}
