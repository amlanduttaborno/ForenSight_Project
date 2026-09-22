"use client";

import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, CircleDashed, FlaskConical } from "lucide-react";
import { getResearchStatus } from "@/lib/api";

export default function ResearchPage() {
  const query = useQuery({ queryKey: ["research-status"], queryFn: getResearchStatus });
  const data = query.data;
  return (
    <div className="mx-auto max-w-7xl p-6 md:p-10">
      <div className="flex items-center gap-3"><FlaskConical className="text-cyan-300" /><h1 className="text-4xl font-black">Research Status</h1></div>
      <p className="mt-3 max-w-4xl text-slate-400">This page is designed specifically for the supervisor update: what is working, what was audited, and what comes next.</p>
      {!data ? <div className="card mt-8 p-5">Loading backend research status...</div> : (
        <>
          <div className="card mt-8 p-6">
            <div className="text-sm text-cyan-300">Current stage</div>
            <div className="mt-2 text-2xl font-black">{data.current_stage}</div>
            <p className="mt-4 text-sm leading-6 text-slate-300">{data.demo_message}</p>
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <section className="card p-6"><h2 className="font-bold">Completed / demonstrated</h2><div className="mt-4 space-y-3">{data.completed.map((item) => <div key={item} className="flex gap-3 text-sm text-slate-300"><CheckCircle2 size={18} className="shrink-0 text-emerald-300" />{item}</div>)}</div></section>
            <section className="card p-6"><h2 className="font-bold">Immediate next steps</h2><div className="mt-4 space-y-3">{data.pending.map((item) => <div key={item} className="flex gap-3 text-sm text-slate-300"><CircleDashed size={18} className="shrink-0 text-amber-300" />{item}</div>)}</div></section>
          </div>
          <div className="card mt-5 p-6">
            <h2 className="font-bold">Model architecture to connect after retraining</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{["RGB Encoder", "Forensic CNN", "CLIP Image + Text", "Fusion", "Classifier + Segmentation"].map((x) => <div key={x} className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-center text-sm font-semibold">{x}</div>)}</div>
          </div>
        </>
      )}
    </div>
  );
}
