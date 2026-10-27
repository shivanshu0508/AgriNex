import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Star, Tractor } from "lucide-react";

const EquipmentCard = ({ item }) => {
	const Icon = item.icon || Tractor;

	return (
		<article className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_12px_30px_rgba(15,42,67,0.06)] transition hover:-translate-y-1 hover:shadow-xl">
			<div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-sky-50 text-emerald-700">
				{item.image ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" /> : <Icon size={64} strokeWidth={1.25} />}
				<span className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold ${item.available ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
					{item.available ? "Available" : "Booked"}
				</span>
			</div>
			<div className="p-5">
				<p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">{item.category}</p>
				<h3 className="mt-2 min-h-12 text-lg font-black text-[#102a43]">{item.name}</h3>
				<p className="mt-3 flex items-center gap-1.5 text-sm text-slate-500"><MapPin size={15} className="text-emerald-600" />{item.location}</p>
				<div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
					<p className="font-black text-[#102a43]">₹{item.price.toLocaleString()}<span className="text-xs font-normal text-slate-500">/day</span></p>
					{item.rating ? <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600"><Star size={15} className="fill-amber-400 text-amber-400" />{item.rating}</span> : null}
				</div>
				<Link to={`/equipment/${item.id}`} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#102a43] py-3 text-sm font-bold text-white transition hover:bg-[#173957]">View details <ArrowRight size={16} /></Link>
			</div>
		</article>
	);
};

export default EquipmentCard;
