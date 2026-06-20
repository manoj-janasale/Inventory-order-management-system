import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

export function AdminPanelLayout({
  title,
  description,
  countLabel,
  countValue,
  tableHeaders,
  tableRows,
  createForm,
  deleteForm,
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start" });
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSlideIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  return (
    <div className="mt-6 space-y-8 animate-in fade-in duration-200">
      
      {/* 1. View Header Info Container */}
      <header>
        <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </header>

      {/* 2. Primary KPI Counter Card */}
      <div className="bg-white border rounded-xl p-6 shadow-sm max-w-sm flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">{countLabel}</span>
        <span className="text-3xl font-bold tracking-tight text-slate-900 mt-1">{countValue.toLocaleString()}</span>
        <span className="text-xs text-green-600 mt-1">✓ Connected Database Value</span>
      </div>

      {/* 3. Form Carousel Block */}
      <section className="bg-white border rounded-xl p-6 shadow-sm max-w-2xl">
        <header className="flex items-center justify-between border-b pb-4 mb-4">
          <div>
            <h2 className="text-lg font-bold">Action Window Carousel</h2>
            <p className="text-xs text-slate-500">Swipe or click tabs to toggle operational configurations.</p>
          </div>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg shrink-0">
            <button type="button" onClick={() => emblaApi?.scrollTo(0)} className={`text-xs px-2.5 py-1 font-medium rounded-md transition-all ${slideIndex === 0 ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
              Create Row
            </button>
            <button type="button" onClick={() => emblaApi?.scrollTo(1)} className={`text-xs px-2.5 py-1 font-medium rounded-md transition-all ${slideIndex === 1 ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
              Delete Row
            </button>
          </div>
        </header>

        <div ref={emblaRef} className="overflow-hidden cursor-grab active:cursor-grabbing">
          <div className="flex">
            {/* Slide 1: Create Form */}
            <div className="flex-[0_0_100%] min-w-0 px-1 select-none">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Add Entry Record Parameters</h3>
              {createForm}
            </div>
            {/* Slide 2: Delete Form */}
            <div className="flex-[0_0_100%] min-w-0 px-1 select-none">
              <h3 className="text-sm font-bold text-red-600 mb-3">Remove Operational Reference Log</h3>
              {deleteForm}
            </div>
          </div>
        </div>
      </section>

      {/* 4. 100 Recent Items Unified Data Table View */}
      <section className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b">
          <h2 className="text-lg font-bold text-slate-900">Recent Database Inventory Logs</h2>
          <p className="text-xs text-slate-500">Showing the latest 100 data records queried sorted chronologically.</p>
        </div>
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 sticky top-0 border-b text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                {tableHeaders.map((head, index) => (
                  <th key={index} className="px-6 py-3 font-medium text-slate-600">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y text-slate-700">
              {tableRows.map((row, index) => (
                <tr key={index} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-3 font-mono text-xs font-semibold text-slate-900">{row.col1}</td>
                  <td className="px-6 py-3 font-medium">{row.col2}</td>
                  <td className="px-6 py-3">{row.col3}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.col4.includes("In Stock") || row.col4.includes("Delivered") || row.col4.includes("Active") ? "bg-green-50 text-green-700 border border-green-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                      {row.col4}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
