"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, FlaskConical, History, ScanSearch } from "lucide-react";

const links = [
  { href: "/", label: "Dashboard", icon: Activity },
  { href: "/analyze", label: "Analyze", icon: ScanSearch },
  { href: "/history", label: "History", icon: History },
  { href: "/research", label: "Research", icon: FlaskConical },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <aside className="border-b border-slate-800 bg-slate-950/90 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="p-6">
        <div className="text-xl font-black tracking-tight">ForenSight</div>
        <div className="mt-1 text-xs text-cyan-300">AI Image Forensics Prototype</div>
      </div>
      <nav className="flex gap-2 overflow-x-auto px-3 pb-4 md:flex-col">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex min-w-fit items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                active ? "bg-cyan-400 text-slate-950" : "text-slate-300 hover:bg-slate-900"
              }`}
            >
              <Icon size={18} /> {label}
            </Link>
          );
        })}
      </nav>
      <div className="m-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-100">
        <strong>DEMO / PRELIMINARY</strong>
        <p className="mt-2 leading-relaxed">Final validated multimodal checkpoint is intentionally not connected yet.</p>
      </div>
    </aside>
  );
}
