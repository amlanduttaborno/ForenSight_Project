"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ImagePlus, Loader2, ScanSearch } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ResultDashboard } from "@/components/result-dashboard";
import { createAnalysis } from "@/lib/api";

const schema = z.object({
  caption: z.string().max(1000, "Keep the caption below 1000 characters"),
});
type FormValues = z.infer<typeof schema>;

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { caption: "" } });
  const mutation = useMutation({ mutationFn: ({ file, caption }: { file: File; caption: string }) => createAnalysis(file, caption) });

  const onDrop = useCallback((accepted: File[]) => {
    setFile(accepted[0] ?? null);
    mutation.reset();
  }, [mutation]);

  const dropzone = useDropzone({ onDrop, accept: { "image/jpeg": [], "image/png": [], "image/webp": [] }, maxFiles: 1 });

  const submit = form.handleSubmit(async ({ caption }) => {
    if (!file) return;
    mutation.mutate({ file, caption });
  });

  return (
    <div className="mx-auto max-w-7xl p-6 md:p-10">
      <div className="badge border-cyan-500/40 bg-cyan-500/10 text-cyan-200">Image + optional text input</div>
      <h1 className="mt-5 text-4xl font-black">Analyze Image</h1>
      <p className="mt-3 max-w-3xl text-slate-400">For tomorrow, this page demonstrates the production upload and multimodal input workflow. The current evidence engine is intentionally marked preliminary.</p>

      <form onSubmit={submit} className="card mt-8 p-5 md:p-7">
        <div {...dropzone.getRootProps()} className={`cursor-pointer rounded-2xl border-2 border-dashed p-7 text-center transition ${dropzone.isDragActive ? "border-cyan-300 bg-cyan-300/10" : "border-slate-700 bg-slate-950/50"}`}>
          <input {...dropzone.getInputProps()} />
          {preview ? (
            <div className="flex flex-col items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="preview" className="max-h-72 rounded-xl object-contain" />
              <div className="mt-3 text-sm text-slate-300">{file?.name}</div>
            </div>
          ) : (
            <div className="py-8"><ImagePlus className="mx-auto text-cyan-300" size={38} /><div className="mt-4 font-bold">Drop an image here or click to browse</div><div className="mt-2 text-sm text-slate-500">JPG · PNG · WEBP</div></div>
          )}
        </div>

        <label className="mt-6 block text-sm font-bold">Accompanying caption / context <span className="font-normal text-slate-500">(optional)</span></label>
        <textarea {...form.register("caption")} rows={4} placeholder="Example: A person standing beside a red vehicle..." className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-4 outline-none focus:border-cyan-400" />
        <p className="mt-2 text-xs text-slate-500">Supplying text demonstrates the final multimodal application contract. The demo does not claim final CLIP-fusion scoring.</p>

        <button disabled={!file || mutation.isPending} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-black text-slate-950 disabled:cursor-not-allowed disabled:opacity-40">
          {mutation.isPending ? <><Loader2 className="animate-spin" size={18} /> Processing...</> : <><ScanSearch size={18} /> Run preliminary analysis</>}
        </button>
        {mutation.isError && <div className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">{mutation.error.message}</div>}
      </form>

      {mutation.data && <ResultDashboard result={mutation.data} />}
    </div>
  );
}
