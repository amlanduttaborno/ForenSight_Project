import Link from "next/link";
import { ArrowRight, BrainCircuit, FileScan, Layers3, ShieldCheck } from "lucide-react";

const features = [
  ["Image authenticity workflow", "Upload and backend processing contract implemented", FileScan],
  ["Localization visualization", "Mask, overlay, heatmap and suspicious region UI", Layers3],
  ["Multimodal input", "Image + optional accompanying text/caption contract", BrainCircuit],
  ["Research-safe demo", "No preliminary score is presented as final model accuracy", ShieldCheck],
] as const;

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl p-6 md:p-10">
      <div className="badge border-cyan-500/40 bg-cyan-500/10 text-cyan-200">Supervisor Prototype v0.1</div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.25fr_.75fr]">
        <section>
          <h1 className="max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
            Detect what looks suspicious — and show <span className="text-cyan-300">where</span>.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Initial full-stack prototype for an explainable multimodal image-forensics platform. This demo proves the app workflow while the final AutoSplice-aligned checkpoint is being corrected and retrained.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/analyze" className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950">
              Analyze an image <ArrowRight size={18} />
            </Link>
            <Link href="/research" className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-200">
              View research status
            </Link>
          </div>
        </section>
        <aside className="card p-6">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Current model status</div>
          <div className="mt-4 text-2xl font-black">Preliminary Demo Engine</div>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            The UI and API are real. The current evidence visualization is a non-trained heuristic placeholder. Final multimodal model integration comes after corrected AutoSplice mapping and retraining.
          </p>
        </aside>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {features.map(([title, body, Icon]) => (
          <article key={title} className="card p-5">
            <Icon className="text-cyan-300" />
            <h2 className="mt-4 font-bold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
          </article>
        ))}
      </div>

      <section className="card mt-8 p-6">
        <h2 className="text-xl font-bold">Final architecture direction</h2>
        <div className="mt-5 grid gap-3 text-sm md:grid-cols-5">
          {["RGB Encoder", "Forensic Branch", "CLIP Image + Text", "Feature Fusion", "Classification + Mask"].map((item, i) => (
            <div key={item} className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-center">
              <span className="text-xs text-slate-500">0{i + 1}</span>
              <div className="mt-2 font-semibold">{item}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
