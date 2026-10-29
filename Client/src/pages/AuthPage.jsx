import React, { useState } from "react";
import { Link } from "react-router-dom";

const AuthPage = ({ mode = "register" }) => {
  const isRegister = mode === "register";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // we connect this to the backend in the next step
    console.log({ mode, email, password });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left green panel */}
      <div
        className="hidden lg:flex w-1/2 flex-col justify-between p-12 text-white"
        style={{
          backgroundColor: "#1f5c3a",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      >
        <div className="text-xl font-semibold">Vehicle Management</div>

        <div>
          <p className="text-xs tracking-widest uppercase mb-4 opacity-80">
            A clearer view starts here
          </p>
          <h1 className="text-5xl font-bold leading-tight">
            {isRegister ? "Create your workspace" : "Welcome back"}
          </h1>
          <p className="mt-6 max-w-md opacity-90">
            Bring your vehicle records and bookings into one calm, useful place.
          </p>
        </div>

        <p className="text-sm opacity-80">Vehicle Management · Car Rental</p>
      </div>

      {/* Right form side */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-center">
            {isRegister ? "Create your workspace" : "Sign in"}
          </h2>
          <p className="text-center text-gray-500 mt-1 mb-6">
            {isRegister
              ? "Start managing your fleet"
              : "Welcome back to your fleet"}
          </p>

          <button
            type="button"
            className="w-full border border-gray-300 rounded-lg py-2.5 text-gray-600 hover:bg-gray-50"
          >
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-5 text-gray-400 text-sm">
            <div className="flex-1 h-px bg-gray-200" />
            or
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-green-700"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isRegister ? "Create a password" : "Enter your password"}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pr-14 outline-none focus:border-green-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 text-white rounded-lg py-2.5 font-medium"
            >
              Continue
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            {isRegister ? "Already have an account? " : "New here? "}
            <Link
              to={isRegister ? "/login" : "/register"}
              className="text-green-700 font-semibold"
            >
              {isRegister ? "Sign in" : "Create account"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;