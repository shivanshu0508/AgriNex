import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import { getDashboardPath } from "../auth/authUtils";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Leaf,
  Lock,
  Mail,
  MapPin,
  Phone,
  Tractor,
  User,
  Users,
} from "lucide-react";
import LocationAutocomplete from "../components/LocationAutocomplete.jsx";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [role, setRole] = useState("farmer");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.agree) {
      setError("Please accept the Terms and Conditions.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      const user = await register({
        fullName: formData.fullname,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        location: formData.location,
        role,
      });
      navigate(getDashboardPath(user), { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7faf7]">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left Section */}
        <div className="relative hidden overflow-hidden bg-[#103d2b] lg:flex">

          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-green-800/40" />

          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-green-900/50" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500">
                <Leaf size={25} className="text-white" />
              </div>

              <span className="text-2xl font-bold text-white">
                Agri<span className="text-green-400">Next</span>
              </span>
            </Link>

            {/* Content */}
            <div className="max-w-lg">

              <div className="mb-7 flex h-20 w-20 items-center justify-center rounded-2xl bg-green-500/15">
                <Tractor
                  size={46}
                  strokeWidth={1.4}
                  className="text-green-400"
                />
              </div>

              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-400">
                Join AgriNext
              </p>

              <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                Make agricultural equipment more accessible.
              </h1>

              <p className="mt-6 text-base leading-7 text-green-100">
                Join as a farmer to rent equipment or as an owner to list machinery and manage requests.
              </p>

              {/* Benefits */}
              <div className="mt-8 space-y-4">

                <div className="flex items-center gap-3 text-sm text-green-100">
                  <CheckCircle2
                    size={20}
                    className="shrink-0 text-green-400"
                  />
                  Rent equipment without purchasing expensive machinery
                </div>

                <div className="flex items-center gap-3 text-sm text-green-100">
                  <CheckCircle2
                    size={20}
                    className="shrink-0 text-green-400"
                  />
                  Earn additional income from unused equipment
                </div>

                <div className="flex items-center gap-3 text-sm text-green-100">
                  <CheckCircle2
                    size={20}
                    className="shrink-0 text-green-400"
                  />
                  Connect with farmers and equipment owners
                </div>

              </div>

            </div>

            <p className="text-sm text-green-200">
              © 2026 AgriNext. Empowering modern agriculture.
            </p>

          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-12 xl:px-20">

          <div className="w-full max-w-lg">

            {/* Mobile Logo */}
            <div className="mb-8 flex justify-center lg:hidden">

              <Link
                to="/"
                className="flex items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600">
                  <Leaf size={25} className="text-white" />
                </div>

                <span className="text-2xl font-bold text-[#103d2b]">
                  Agri<span className="text-green-600">Next</span>
                </span>
              </Link>

            </div>

            {/* Heading */}
            <div className="mb-7">

              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-green-600">
                Create Account
              </p>

              <h2 className="text-3xl font-bold text-slate-900">
                Join AgriNext
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Create your account and start using AgriNext today.
              </p>

            </div>

            <div className="mb-7">
              <label className="mb-3 block text-sm font-semibold text-slate-700">
                I want to join as
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { value: "farmer", label: "Farmer", description: "Find and rent agricultural equipment.", Icon: Tractor },
                  { value: "owner", label: "Equipment Owner", description: "List equipment and manage rental requests.", Icon: Users },
                ].map(({ value, label, description, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRole(value)}
                    aria-pressed={role === value}
                    className={`rounded-xl border-2 p-4 text-left transition ${
                      role === value
                        ? "border-green-500 bg-green-50"
                        : "border-slate-200 bg-white hover:border-green-300"
                    }`}
                  >
                    <Icon size={22} className="text-green-700" />
                    <p className="mt-3 font-bold text-slate-900">{label}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
                  </button>
                ))}
              </div>
            </div>

            {error && <p role="alert" className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Name */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name *
                </label>

                <div className="relative">

                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    minLength={2}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                  />

                </div>

              </div>

              {/* Email + Phone */}
              <div className="grid gap-5 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email Address *
                  </label>

                  <div className="relative">

                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-11 pr-4 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
                    />

                  </div>

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Phone Number *
                  </label>

                  <div className="relative">

                    <Phone
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-11 pr-4 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
                    />

                  </div>

                </div>

              </div>

              {/* Location */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Location *
                </label>

                <div className="relative">

                  <MapPin
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <LocationAutocomplete
                    name="location"
                    value={formData.location}
                    onChange={(location) => setFormData((current) => ({ ...current, location }))}
                    placeholder="City, State"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-11 pr-4 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
                  />

                </div>

              </div>

              {/* Password */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password *
                </label>

                <div className="relative">

                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    minLength={8}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-11 pr-12 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>

              {/* Confirm Password */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Confirm Password *
                </label>

                <div className="relative">

                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-11 pr-12 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>

              {/* Terms */}
              <label className="flex cursor-pointer items-start gap-3">

                <input
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
                />

                <span className="text-xs leading-5 text-slate-500">
                  I agree to AgriNext's{" "}
                  <button
                    type="button"
                    className="font-semibold text-green-600 hover:text-green-700"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="font-semibold text-green-600 hover:text-green-700"
                  >
                    Privacy Policy
                  </button>
                  .
                </span>

              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
              >
                {submitting ? "Creating account..." : `Create ${role === "farmer" ? "Farmer" : "Owner"} Account`}
                <ArrowRight size={18} />
              </button>

            </form>

            {/* Login */}
            <p className="mt-7 text-center text-sm text-slate-500">

              Already have an account?{" "}

              <Link
                to="/login"
                className="font-semibold text-green-600 hover:text-green-700"
              >
                Sign in
              </Link>

            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;