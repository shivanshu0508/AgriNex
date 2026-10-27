import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Tractor,
} from "lucide-react";
import { api } from "../lib/api";
import LocationAutocomplete from "../components/LocationAutocomplete.jsx";

function AddEquipment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    location: "",
    horsepower: "",
    brand: "",
    model: "",
    condition: "excellent",
    image: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/equipment", {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        brand: formData.brand,
        model: formData.model,
        pricePerDay: Number(formData.price),
        location: formData.location,
        images: formData.image.trim() ? [formData.image.trim()] : [],
        specifications: {
          ...(formData.horsepower ? { horsepower: Number(formData.horsepower) } : {}),
          condition: formData.condition,
        },
      });
      navigate("/owner/equipment", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7faf7]">

      {/* Header */}
      <section className="bg-[#103d2b] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <Link
            to="/owner/dashboard"
            className="mb-6 inline-flex items-center gap-2 text-sm text-green-100 hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-green-300">
            Equipment Owner
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Add New Equipment
          </h1>

          <p className="mt-3 max-w-2xl text-green-100">
            List your agricultural equipment and make it available to farmers
            through AgriNext.
          </p>

        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        <form onSubmit={handleSubmit} className="space-y-7">

          {/* Basic Information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="mb-7">
              <h2 className="text-xl font-bold text-slate-900">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Provide the basic details of your agricultural equipment.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Equipment Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Example: Mahindra 575 DI XP Plus"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Category *
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                >
                  <option value="">Select category</option>
                  <option value="tractor">Tractor</option>
                  <option value="plough">Plough</option>
                  <option value="cultivator">Cultivator</option>
                  <option value="seed_drill">Seed drill</option>
                  <option value="harvester">Harvester</option>
                  <option value="sprayer">Sprayer</option>
                  <option value="rotavator">Rotavator</option>
                  <option value="irrigation">Irrigation</option>
                  <option value="thresher">Thresher</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Rental Price / Day *
                </label>

                <div className="flex">
                  <span className="flex items-center rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 px-4 text-sm font-semibold text-slate-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="2200"
                    min="1"
                    required
                    className="w-full rounded-r-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description *
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  required
                  placeholder="Describe the equipment, its uses and important features..."
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

            </div>
          </section>

          {/* Equipment Specifications */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="mb-7">
              <h2 className="text-xl font-bold text-slate-900">
                Equipment Specifications
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add technical information to help farmers choose the right
                equipment.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Horsepower
                </label>

                <input
                  type="number"
                  name="horsepower"
                  value={formData.horsepower}
                  onChange={handleChange}
                  placeholder="Example: 47"
                  min="0"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Brand
                </label>

                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Model
                </label>

                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Condition
                </label>

                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                >
                  <option value="new">New</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>

            </div>
          </section>

          {/* Location */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="mb-7">
              <h2 className="text-xl font-bold text-slate-900">
                Equipment Location
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Tell farmers where the equipment is located.
              </p>
            </div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Location *
            </label>

            <div className="relative">
              <MapPin
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600"
              />

              <LocationAutocomplete
                name="location"
                value={formData.location}
                onChange={(location) => setFormData((current) => ({ ...current, location }))}
                required
                placeholder="Example: Lucknow, Uttar Pradesh"
                className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

          </section>

          {/* Image URL */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="mb-7">
              <h2 className="text-xl font-bold text-slate-900">
                Equipment Images
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add a publicly accessible image URL (uploads are not enabled by this API).
              </p>
            </div>

            <label className="block text-sm font-semibold text-slate-700">
              Image URL
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/equipment.jpg"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </label>

          </section>

          {/* Preview */}
          <section className="rounded-2xl border border-green-200 bg-green-50 p-6 sm:p-8">

            <div className="flex gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white">
                <Tractor
                  size={25}
                  className="text-green-700"
                />
              </div>

              <div>
                <h2 className="font-bold text-green-900">
                  Before you publish
                </h2>

                <p className="mt-1 text-sm leading-6 text-green-800">
                  Make sure the equipment details, rental price, location and
                  image URL are accurate. Farmers will use this information to
                  decide whether to book your equipment.
                </p>
              </div>

            </div>

          </section>

          {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <Link
              to="/owner/dashboard"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              <CheckCircle2 size={18} />
              {submitting ? "Publishing..." : "List Equipment"}
            </button>

          </div>

        </form>

      </main>
    </div>
  );
}

export default AddEquipment;