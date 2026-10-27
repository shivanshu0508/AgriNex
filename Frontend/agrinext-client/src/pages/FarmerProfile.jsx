import { Link } from "react-router-dom";
import { ArrowLeft, CalendarDays, ShieldCheck, User } from "lucide-react";
import { useAuth } from "../auth/useAuth";
import ProfileEditor from "../components/ProfileEditor.jsx";

function FarmerProfile() {
  const { user } = useAuth();
  const initials = user?.fullName?.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="min-h-screen bg-[#f8faf8] text-slate-800">
      <section className="bg-[#103d2b]">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <Link to="/farmer/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm text-green-100 hover:text-white"><ArrowLeft size={16} />Back to Dashboard</Link>
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          <p className="mt-2 text-green-100">Account details returned by your AgriNext profile.</p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-3xl font-bold text-green-700">{initials || <User size={34} />}</div>
            <h2 className="mt-4 text-xl font-bold text-slate-900">{user?.fullName}</h2>
            <p className="mt-1 capitalize text-sm text-slate-500">{user?.role}</p>
            {user?.isVerified && <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700"><ShieldCheck size={17} />Verified account</div>}
            <Link to="/my-bookings" className="mt-7 flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-left text-sm font-medium hover:bg-slate-50"><CalendarDays size={18} className="text-green-700" />My Bookings</Link>
          </section>

          <ProfileEditor />
        </div>
      </main>
    </div>
  );
}

export default FarmerProfile;
