import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, MapPin, Tractor } from "lucide-react";

const Footer = () => (
  <footer className="bg-[#102a43] text-white">
    <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
      <div>
        <Link to="/" className="flex items-center gap-2 text-2xl font-black"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600"><Tractor size={21} /></span>Agri<span className="text-emerald-400">Next</span></Link>
        <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">A local equipment rental network helping farmers get the right machine for every season.</p>
        <div className="mt-6 flex items-center gap-2 text-sm text-slate-300"><MapPin size={16} className="text-emerald-400" /> Serving farming communities across India</div>
      </div>
      <div>
        <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-300">Explore</h3>
        <div className="mt-5 flex flex-col gap-3 text-sm text-slate-300"><Link to="/equipment" className="hover:text-white">Find equipment</Link><Link to="/register" className="hover:text-white">List equipment</Link><Link to="/login" className="hover:text-white">Sign in</Link></div>
      </div>
      <div>
        <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-300">Need help?</h3>
        <div className="mt-5 space-y-3 text-sm text-slate-300"><p className="flex items-center gap-2"><Mail size={16} className="text-emerald-400" /> support@agrinext.com</p><Link to="/equipment" className="inline-flex items-center gap-2 font-semibold text-emerald-300 hover:text-emerald-200">Browse the marketplace <ArrowUpRight size={15} /></Link></div>
      </div>
    </div>
    <div className="border-t border-white/10"><div className="mx-auto max-w-7xl px-6 py-5 text-sm text-slate-400">© 2026 AgriNext. Built for smarter farming.</div></div>
  </footer>
);

export default Footer;