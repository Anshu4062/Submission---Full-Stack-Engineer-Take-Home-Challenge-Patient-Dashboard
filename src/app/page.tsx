"use client";
import { useState } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

export default function AuthPage() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Patient Wellness Portal
          </h1>
          <p className="mt-2 text-gray-600">
            {showLogin
              ? "Welcome back! Please sign in."
              : "Create your account to get started."}
          </p>
        </div>

        {showLogin ? <LoginForm /> : <RegisterForm />}

        <p className="text-sm text-center text-gray-600">
          {showLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setShowLogin(!showLogin)}
            className="ml-1 font-semibold text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {showLogin ? "Register here" : "Login here"}
          </button>
        </p>
      </div>
    </div>
  );
}
