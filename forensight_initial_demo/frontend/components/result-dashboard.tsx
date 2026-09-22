"use client";

import { useState } from "react";
import { AlertTriangle, Download, MessageSquareText } from "lucide-react";
import { API_URL, absoluteArtifact } from "@/lib/api";
import type { Analysis } from "@/lib/types";

const tabs = ["original", "overlay", "mask", "heatmap"] as const;
type Tab = (typeof tabs)[number];

export function ResultDashboard({ result }: { result: Analysis }) {
  const [tab, setTab] = useState<Tab>("overlay");
  return (
    <div className="mt-8 space-y-5">
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-100">
        <div className="flex gap-3"><AlertTriangle size={20} className="shrink-0" /><div><strong>Preliminary demo output.</strong> {result.warning}</div></div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Metric title="Verdict" value={result.verdict} small />
        <Metric title="Evidence score" value={`${(result.preliminary_score * 100).toFixed(1)}%`} />
        <Metric title="Highlighted area" value={`${result.manipulated_area_pct.toFixed(2)}%`} />
        <Metric title="Regions" value={`${result.region_count}`} />
      </div>

      <div className="card overflow-hidden">
        <div className="flex flex-wrap gap-2 border-b border-slate-800 p-4">
          {tabs.map((name) => (
            <button key={name} onClick={() => setTab(name)} className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize ${tab === name ? "bg-cyan-400 text-slate-950" : "bg-slate-950 text-slate-300"}`}>
              {name}
            </button>
          ))}
          <a href={absoluteArtifact(result.artifacts.report)} target="_blank" className="ml-auto inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm">
            <Download size={16} /> PDF report
          </a>
        </div>
        <div className="grid gap-5 p-5 lg:grid-cols-[1.25fr_.75fr]">
          <div className="flex min-h-80 items-center justify-center rounded-xl bg-black/30 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={absoluteArtifact(result.artifacts[tab])} alt={tab} className="max-h-[620px] max-w-full rounded-lg object-contain" />
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-800 p-4">
              <div className="flex items-center gap-2 font-bold"><MessageSquareText size={18} className="text-cyan-300" /> Multimodal input</div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{result.multimodal_status}</p>
              <div className="mt-3 rounded-lg bg-slate-950 p-3 text-sm text-slate-300">
                {result.caption_provided ? result.caption : "No caption supplied."}
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 p-4 text-sm">
              <div className="font-bold">Image metadata</div>
              <div className="mt-3 space-y-2 text-slate-400">
                <div>{result.filename}</div>
                <div>{result.width} × {result.height} pixels</div>
                <div>Analysis ID: {result.id}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-bold">Suspicious regions</h3>
        {result.regions.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">No connected high-evidence region passed the demo size filter.</p>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {result.regions.map((region) => (
              <div key={region.index} className="rounded-xl bg-slate-950 p-4 text-sm">
                <div className="font-bold text-cyan-300">Region #{region.index}</div>
                <div className="mt-2 text-slate-400">bbox: {region.x}, {region.y}, {region.width}, {region.height}</div>
                <div className="mt-1 text-slate-400">area: {region.area_pct.toFixed(3)}%</div>
                <div className="mt-1 text-slate-400">evidence: {(region.mean_evidence * 100).toFixed(1)}%</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ title, value, small = false }: { title: string; value: string; small?: boolean }) {
  return (
    <div className="card p-5">
      <div className="text-xs uppercase tracking-wider text-slate-500">{title}</div>
      <div className={`mt-3 font-black ${small ? "text-lg" : "text-3xl"}`}>{value}</div>
    </div>
  );
}
