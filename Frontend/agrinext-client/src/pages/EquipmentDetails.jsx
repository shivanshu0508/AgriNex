import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, ShieldCheck, Tractor, User } from "lucide-react";
import { api } from "../lib/api";

function EquipmentDetails() {
  const { id } = useParams();
  const [equipment, setEquipment] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrentRequest = true;
    api.get(`/equipment/${id}`)
      .then((result) => {
        if (isCurrentRequest) setEquipment(result);
      })
      .catch((requestError) => {
        if (isCurrentRequest) setError(requestError.message);
      });
    return () => { isCurrentRequest = false; };
  }, [id]);

  if (error) {
    return (
      <div role="alert" className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Unable to load this listing</h1>
        <p className="mt-3 text-slate-600">{error}</p>
        <Link to="/equipment" className="mt-6 inline-block font-semibold text-green-700">Back to equipment</Link>
      </div>
    );
  }

  if (!equipment) {
    return <p className="px-6 py-16 text-center text-slate-600">Loading equipment details...</p>;
  }

  const available = equipment.status === "active" && equipment.isAvailable;
  const category = equipment.category.replaceAll("_", " ");
  const specifications = [
    ["Horsepower", equipment.specifications?.horsepower ? `${equipment.specifications.horsepower} HP` : "Not provided"],
    ["Condition", equipment.specifications?.condition || "Not provided"],
    ["Brand", equipment.brand || "Not provided"],
    ["Model", equipment.model || "Not provided"],
    ["Daily rate", `₹${equipment.pricePerDay.toLocaleString()} / day`],
  ];

  return (
    <div className="min-h-screen bg-[#f4f7f5]">
      <section className="bg-[#102a43] px-6 py-8 text-white">
        <div className="mx-auto max-w-7xl">
          <Link to="/equipment" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-white">
            <ArrowLeft size={18} /> Back to Equipment
          </Link>
          <p className="mt-6 text-sm font-bold uppercase tracking-widest text-green-300">{category}</p>
          <h1 className="mt-2 text-3xl font-black md:text-4xl">{equipment.name}</h1>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <div className="relative flex h-[420px] items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 shadow-sm md:h-[500px]">
            {equipment.images?.[0]
              ? <img src={equipment.images[0]} alt={equipment.name} className="h-full w-full object-cover" />
              : <div className="flex h-40 w-40 items-center justify-center rounded-full bg-green-600 text-white shadow-2xl"><Tractor size={90} /></div>}
            <span className={`absolute left-6 top-6 rounded-full px-4 py-2 text-sm font-bold text-white ${available ? "bg-green-600" : "bg-slate-600"}`}>
              {available ? "Available for Rent" : "Currently Unavailable"}
            </span>
          </div>

          <section className="mt-8 rounded-3xl bg-white p-7 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wider text-green-600">Equipment Overview</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">About this equipment</h2>
            <p className="mt-6 whitespace-pre-line leading-8 text-slate-600">{equipment.description}</p>
            <div className="mt-6 flex items-center gap-3 rounded-xl bg-green-50 p-4">
              <MapPin className="text-green-600" />
              <div>
                <p className="text-sm text-slate-500">Equipment Location</p>
                <p className="font-bold text-slate-800">{equipment.location}</p>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-3xl bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900">Specifications</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
              {specifications.map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-2 font-black capitalize text-slate-900">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-3xl bg-white p-7 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wider text-green-600">Equipment Owner</p>
            <div className="mt-5 flex items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700"><User size={30} /></div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">{equipment.owner?.fullName || "Equipment owner"}</h3>
                  <p className="mt-1 text-sm text-slate-500">{equipment.owner?.location || "Local equipment provider"}</p>
                </div>
              </div>
              {equipment.owner?.phone && <a href={`tel:${equipment.owner.phone}`} className="rounded-xl border border-green-600 px-5 py-3 font-bold text-green-700 hover:bg-green-50">Contact Owner</a>}
            </div>
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-green-50 p-4 text-sm text-green-800">
              <ShieldCheck size={20} /> Booking requests are sent securely through AgriNext.
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-3xl bg-white p-7 shadow-xl">
            <p className="text-sm text-slate-500">Rental Price</p>
            <p className="mt-1 text-4xl font-black text-slate-900">₹{equipment.pricePerDay.toLocaleString()} <span className="text-base font-medium text-slate-500">/ day</span></p>
            <div className="my-7 border-t border-slate-100" />
            <p className="text-sm leading-6 text-slate-600">Choose your rental dates on the next step. The owner will review your booking request.</p>
            {available
              ? <Link to={`/equipment/${equipment._id}/booking`} className="mt-6 flex w-full items-center justify-center rounded-xl bg-green-600 px-6 py-4 font-black text-white shadow-lg shadow-green-200 transition hover:bg-green-700">Book This Equipment</Link>
              : <button type="button" disabled className="mt-6 w-full rounded-xl bg-slate-300 px-6 py-4 font-black text-slate-600">Unavailable for booking</button>}
          </div>
        </aside>
      </main>
    </div>
  );
}

export default EquipmentDetails;
