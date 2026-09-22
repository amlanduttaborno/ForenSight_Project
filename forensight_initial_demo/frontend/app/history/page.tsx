"use client";

import { useQuery } from "@tanstack/react-query";
import { Clock3 } from "lucide-react";
import { absoluteArtifact, getAnalyses } from "@/lib/api";

export default function HistoryPage() {
  const query = useQuery({ queryKey: ["analyses"], queryFn: getAnalyses });
  return (
    <div className="mx-auto max-w-7xl p-6 md:p-10">
      <h1 className="text-4xl font-black">Analysis History</h1>
      <p className="mt-3 text-slate-400">Saved locally through the FastAPI + SQLAlchemy backend.</p>
      <div className="mt-8 space-y-3">
        {query.isLoading && <div className="card p-5">Loading...</div>}
        {query.data?.length === 0 && <div className="card p-5 text-slate-400">No analysis yet. Upload an image first.</div>}
        {query.data?.map((item) => (
          <article key={item.id} className="card grid gap-4 p-4 md:grid-cols-[110px_1fr_auto] md:items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={absoluteArtifact(item.artifacts.overlay)} alt="overlay" className="h-24 w-28 rounded-lg object-cover" />
            <div>
              <div className="font-bold">{item.filename}</div>
              <div className="mt-1 text-sm text-slate-400">{item.verdict}</div>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-500"><Clock3 size={14} /> {new Date(item.created_at).toLocaleString()}</div>
            </div>
            <div className="text-left md:text-right">
              <div className="text-2xl font-black">{(item.preliminary_score * 100).toFixed(1)}%</div>
              <div className="text-xs text-slate-500">demo evidence score</div>
              <a target="_blank" href={absoluteArtifact(item.artifacts.report)} className="mt-2 inline-block text-sm font-semibold text-cyan-300">Open PDF report →</a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
