"use client";

import { IUser } from "@/app/models/user"; // Adjusted path for robustness
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useRouter } from "next/navigation";

// Helper function to format dates
const formatDate = (dateString: string | Date) =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

export default function DashboardClient({ user }: { user: IUser }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const currentWeight =
    user.weightData && user.weightData.length > 0
      ? user.weightData[user.weightData.length - 1].weight
      : "N/A";
  const goalWeight = user.goalWeight || "N/A";
  const bmi =
    typeof currentWeight === "number"
      ? ((currentWeight * 0.453592) / (1.78 * 1.78)).toFixed(1)
      : "N/A"; // Assuming height 5'10"

  const chartData = user.weightData?.map((d) => ({
    name: formatDate(d.date),
    Weight: d.weight,
    Goal: user.goalWeight,
  }));

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user.username}!
          </h1>
          <p className="text-gray-600 mt-1">Here is your wellness snapshot.</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
        >
          Logout
        </button>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-gray-500 font-semibold">Current Weight</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {currentWeight}{" "}
            <span className="text-lg font-normal text-gray-500">lbs</span>
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-gray-500 font-semibold">Weight Goal</h3>
          <p className="text-3xl font-bold text-green-600">
            {goalWeight}{" "}
            <span className="text-lg font-normal text-gray-500">lbs</span>
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-gray-500 font-semibold">Est. BMI</h3>
          <p className="text-3xl font-bold text-orange-600">{bmi}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-gray-500 font-semibold">Next Shipment</h3>
          <p className="text-3xl font-bold text-blue-600">
            {user.nextShipmentDate ? formatDate(user.nextShipmentDate) : "N/A"}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weight Progress Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Weight Progress</h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={["dataMin - 10", "dataMax + 10"]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Weight"
                  stroke="#8884d8"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="Goal"
                  stroke="#82ca9d"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Medication & Shipments */}
        <div className="space-y-6">
          {/* --- FIX: CURRENT MEDICATION SECTION --- */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">Current Medications</h2>
            <div className="space-y-3">
              {user.medications && user.medications.length > 0 ? (
                user.medications.map((med, index) => (
                  <div
                    key={index}
                    className="text-gray-700 p-2 bg-gray-50 rounded-md"
                  >
                    <p>
                      <span className="font-semibold">Type:</span> {med.type}
                    </p>
                    <p>
                      <span className="font-semibold">Dosage:</span>{" "}
                      {med.dosage}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No medications listed.</p>
              )}
            </div>
          </div>
          {/* ------------------------------------ */}

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-2">Shipment History</h2>
            <ul className="space-y-2">
              {user.shipments?.map((shipment, index) => (
                <li key={index} className="text-sm p-2 bg-gray-50 rounded-md">
                  <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {formatDate(shipment.date)}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    {shipment.status}
                  </p>
                  {shipment.tracking && (
                    <p>
                      <span className="font-semibold">Tracking:</span>{" "}
                      {shipment.tracking}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
