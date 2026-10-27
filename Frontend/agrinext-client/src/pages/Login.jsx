import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import { getDashboardPath } from "../auth/authUtils";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Leaf,
  Lock,
  Mail,
  Tractor,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
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
    setError("");
    setSubmitting(true);

    try {
      const user = await login(
        { email: formData.email, password: formData.password },
        formData.remember
      );
      const requestedPath = location.state?.from?.pathname;
      const isOwnerPath = requestedPath?.startsWith("/owner/");
      const canUseRequestedPath = isOwnerPath
        ? user.role === "owner"
        : user.role === "farmer";
      const destination = requestedPath && canUseRequestedPath
        ? requestedPath
        : getDashboardPath(user);
      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7faf7]">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left Branding Section */}
        <div className="relative hidden overflow-hidden bg-[#103d2b] lg:flex">

          {/* Decorative Elements */}
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-green-800/40" />

          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-green-900/50" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500">
                <Leaf
                  size={25}
                  className="text-white"
                />
              </div>

              <span className="text-2xl font-bold text-white">
                Agri<span className="text-green-400">Next</span>
              </span>
            </Link>

            {/* Main Content */}
            <div className="max-w-lg">

              <div className="mb-7 flex h-20 w-20 items-center justify-center rounded-2xl bg-green-500/15">
                <Tractor
                  size={46}
                  strokeWidth={1.4}
                  className="text-green-400"
                />
              </div>

              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-400">
                Welcome Back
              </p>

              <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                Smart farming starts with the right equipment.
              </h1>

              <p className="mt-6 text-base leading-7 text-green-100">
                Sign in to AgriNext and find reliable agricultural equipment
                available for rent near you.
              </p>

              {/* Benefits */}
              <div className="mt-8 space-y-4">

                <div className="flex items-center gap-3 text-sm text-green-100">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                    ✓
                  </div>
                  Find equipment near your location
                </div>

                <div className="flex items-center gap-3 text-sm text-green-100">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                    ✓
                  </div>
                  Compare rental prices easily
                </div>

                <div className="flex items-center gap-3 text-sm text-green-100">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                    ✓
                  </div>
                  Book equipment from trusted owners
                </div>

              </div>

            </div>

            {/* Bottom */}
            <p className="text-sm text-green-200">
              © 2026 AgriNext. Empowering modern agriculture.
            </p>

          </div>
        </div>

        {/* Right Login Section */}
        <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-12 xl:px-20">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <div className="mb-10 flex justify-center lg:hidden">

              <Link
                to="/"
                className="flex items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600">
                  <Leaf
                    size={25}
                    className="text-white"
                  />
                </div>

                <span className="text-2xl font-bold text-[#103d2b]">
                  Agri<span className="text-green-600">Next</span>
                </span>
              </Link>

            </div>

            {/* Heading */}
            <div className="mb-8">

              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-green-600">
                AgriNext Account
              </p>

              <h2 className="text-3xl font-bold text-slate-900">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Sign in to continue to your AgriNext account.
              </p>

            </div>

            {error && <p role="alert" className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Email */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                  />

                </div>

              </div>

              {/* Password */}
              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label className="text-sm font-semibold text-slate-700">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-semibold text-green-600 hover:text-green-700"
                  >
                    Forgot Password?
                  </button>

                </div>

                <div className="relative">

                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>

              </div>

              {/* Remember */}
              <div className="flex items-center">

                <label className="flex cursor-pointer items-center gap-2">

                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
                  />

                  <span className="text-sm text-slate-600">
                    Remember me
                  </span>

                </label>

              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
              >
                {submitting ? "Signing in..." : "Sign In"}
                <ArrowRight size={18} />
              </button>

            </form>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">

              <div className="h-px flex-1 bg-slate-200" />

              <span className="text-xs text-slate-400">
                OR
              </span>

              <div className="h-px flex-1 bg-slate-200" />

            </div>

            {/* Google UI */}
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full font-bold text-sm">
                G
              </span>

              Continue with Google
            </button>

            {/* Register */}
            <p className="mt-8 text-center text-sm text-slate-500">

              Don't have an account?{" "}

              <Link
                to="/register"
                className="font-semibold text-green-600 hover:text-green-700"
              >
                Create an account
              </Link>

            </p>

            {/* Security */}
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
              <Lock size={13} />
              Your information is securely protected
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;