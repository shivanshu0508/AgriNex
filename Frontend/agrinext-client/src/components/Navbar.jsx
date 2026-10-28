import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, LogOut, Menu, Tractor, X } from "lucide-react";
import { getDashboardPath } from "../auth/authUtils";
import { useAuth } from "../auth/useAuth";

const Navbar = () => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const isOwner = pathname.startsWith("/owner");
  const isFarmer = pathname.startsWith("/farmer")
    || pathname === "/my-bookings"
    || (pathname === "/equipment" && user?.role === "farmer");
  const isWorkspace = isOwner || isFarmer;
  const isAuth = pathname === "/login" || pathname === "/register";

  const links = isOwner
    ? [["/owner/dashboard", "Overview"], ["/owner/equipment", "My Equipment"], ["/owner/requests", "Requests"], ["/owner/earnings", "Earnings"], ["/owner/settings", "Profile"]]
    : isFarmer
      ? [["/farmer/dashboard", "Overview"], ["/my-bookings", "My Bookings"], ["/equipment", "Find Equipment"], ["/farmer/profile", "Profile"]]
      : [["/", "Home"], ["/equipment", "Equipment"], ["/#how-it-works", "How it works"], ["/#about", "About"]];

  if (isAuth) {
    return (
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-black text-[#102a43]"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white"><Tractor size={19} /></span>Agri<span className="text-emerald-600">Next</span></Link>
          <Link to="/equipment" className="text-sm font-semibold text-slate-600 hover:text-emerald-700">Browse equipment</Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`sticky top-0 z-50 border-b backdrop-blur-lg ${isWorkspace ? "border-white/10 bg-[#102a43] text-white" : "border-emerald-100 bg-white/95"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        <Link to={isOwner ? "/owner/dashboard" : isFarmer ? "/farmer/dashboard" : "/"} className={`flex items-center gap-2 text-xl font-black ${isWorkspace ? "text-white" : "text-[#102a43]"}`}><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-900/10"><Tractor size={19} /></span>Agri<span className="text-emerald-400">Next</span></Link>
        <div className={`hidden items-center gap-1 ${isOwner ? "xl:flex" : "lg:flex"}`}>
          {links.map(([to, label]) => <Link key={to} to={to} className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${pathname === to ? "bg-emerald-500/15 text-emerald-400" : isWorkspace ? "text-slate-300 hover:bg-white/10 hover:text-white" : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"}`}>{label}</Link>)}
        </div>
        <div className={`hidden items-center gap-3 ${isOwner ? "xl:flex" : "lg:flex"}`}>
          {user ? (
            <>
              <Link to={getDashboardPath(user)} className={`text-sm font-semibold ${isWorkspace ? "text-slate-200" : "text-slate-600 hover:text-emerald-700"}`}>{user.fullName}</Link>
              <button type="button" onClick={logout} className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${isWorkspace ? "border-white/15 text-slate-200 hover:bg-white/10" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}><LogOut size={16} /> Log out</button>
            </>
          ) : isWorkspace ? <Link to="/" className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"><LayoutDashboard size={16} /> Public site</Link> : <><Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-emerald-700">Log in</Link><Link to="/register" className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700">Get started</Link></>}
        </div>
        <button type="button" onClick={() => setIsOpen((open) => !open)} className={`${isOwner ? "xl:hidden" : "lg:hidden"} ${isWorkspace ? "text-white" : "text-slate-700"}`} aria-label="Toggle navigation">{isOpen ? <X size={24} /> : <Menu size={24} />}</button>
      </div>
      {isOpen && <div className={`border-t px-6 py-4 ${isOwner ? "xl:hidden" : "lg:hidden"} ${isWorkspace ? "border-white/10 bg-[#102a43]" : "border-slate-200 bg-white"}`}><div className="flex flex-col gap-2">{links.map(([to, label]) => <Link key={to} onClick={() => setIsOpen(false)} to={to} className={`rounded-lg px-3 py-3 text-sm font-semibold ${isWorkspace ? "text-slate-200 hover:bg-white/10" : "text-slate-700 hover:bg-emerald-50"}`}>{label}</Link>)}{user ? <button type="button" onClick={() => { logout(); setIsOpen(false); }} className={`mt-2 inline-flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-bold ${isWorkspace ? "bg-emerald-500 text-[#102a43]" : "bg-emerald-600 text-white"}`}><LogOut size={16} /> Log out</button> : <Link onClick={() => setIsOpen(false)} to="/login" className={`mt-2 rounded-lg px-3 py-3 text-sm font-bold ${isWorkspace ? "bg-emerald-500 text-[#102a43]" : "bg-emerald-600 text-white"}`}>Log in</Link>}</div></div>}
    </nav>
  );
};

export default Navbar;