export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
        <p className="text-slate-500 font-extrabold text-sm tracking-wide">
          লোডিং অ্যাডমিন প্যানেল...
        </p>
      </div>
    </div>
  );
}
