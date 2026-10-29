import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Car, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useFleet } from "../context/FleetContext";
import { inputClass } from "../components/Field";

export default function Auth() {
  const { login } = useFleet();
  const navigate = useNavigate();
  const [mode, setMode] = useState("signup"); // "signup" or "signin"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // stop the browser from reloading the page
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Please enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setError("");
    login(email); // later: call the backend /api/auth/login here
    navigate("/");
  };

  const isSignup = mode === "signup";

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left green panel */}
      <div className="relative hidden flex-col justify-between bg-brand-700 p-12 text-white lg:flex"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}>
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500"><Car size={20} /></div>
          <span className="text-lg font-bold">Fleetwise</span>
        </div>
        <div>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-white/70">A clearer view starts here</p>
          <h1 className="text-5xl font-bold leading-tight">{isSignup ? "Create your workspace" : "Welcome back"}</h1>
          <p className="mt-4 max-w-sm text-white/80">
            Bring your vehicle records and upcoming maintenance into one calm, useful place.
          </p>
        </div>
        <p className="text-xs text-white/60">Fleetwise · Vehicle operations</p>
      </div>

      {/* Right form */}
      <div className="grid place-items-center p-6">
        <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-sm ring-1 ring-brand-100">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-brand-600 text-white"><Car size={22} /></div>
          <h2 className="text-center text-xl font-bold">{isSignup ? "Create your workspace" : "Sign in"}</h2>
          <p className="mb-6 text-center text-sm text-brand-900/60">
            {isSignup ? "Start keeping your fleet in good order" : "Pick up where you left off"}
          </p>

          <label className="mb-1 block text-xs font-semibold text-brand-900/70">Email address</label>
          <input className={inputClass} type="email" placeholder="Enter your email address"
            value={email} onChange={(e) => setEmail(e.target.value)} />

          <label className="mb-1 mt-4 block text-xs font-semibold text-brand-900/70">Password</label>
          <div className="relative">
            <input className={inputClass} type={show ? "text" : "password"}
              placeholder={isSignup ? "Create a password" : "Your password"}
              value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-900/40">
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && <p className="mt-3 text-sm text-orange-700">{error}</p>}

          <button type="submit"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700">
            Continue <ArrowRight size={16} />
          </button>

          <p className="mt-5 text-center text-sm text-brand-900/60">
            {isSignup ? "Already have an account? " : "New here? "}
            <button type="button" onClick={() => setMode(isSignup ? "signin" : "signup")}
              className="font-semibold text-brand-600 hover:underline">
              {isSignup ? "Sign in" : "Create a workspace"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
