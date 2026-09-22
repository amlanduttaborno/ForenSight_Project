# ForenSight — Initial Supervisor Demo App

এই repository-টি **আগামী supervisor update/demo-এর জন্য একটি working initial prototype**।

> গুরুত্বপূর্ণ: এই version-এ final validated AutoSplice multimodal checkpoint connect করা নেই। Backend একটি clearly-labelled **DEMO forensic heuristic** ব্যবহার করে mask/overlay/region visualization তৈরি করে। তাই app flow, frontend/backend integration, upload, caption input, localization visualization, history এবং report দেখানো যাবে — কিন্তু demo score-কে final research accuracy/probability বলা যাবে না।

## Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- TanStack Query
- Zustand
- React Hook Form
- Zod
- React Dropzone
- Recharts
- Lucide React

### Backend
- FastAPI
- Pydantic
- SQLAlchemy
- SQLite by default for fastest demo setup
- PostgreSQL-ready through `DATABASE_URL`
- Pillow + OpenCV + NumPy
- ReportLab
- Redis/Celery dependencies included for later async production workflow

---

# 1. Folder structure

```text
forensight_initial_demo/
├── backend/
├── frontend/
├── scripts/
├── docker-compose.yml
└── README.md
```

---

# 2. Fastest way to run for tomorrow's demo

## Requirements

- Python 3.11/3.12 recommended
- Node.js 20+
- npm

You do **not** need PostgreSQL, Redis, Docker, AutoSplice, or `best.pt` to run the initial demo.

---

# 3. Run backend

Open Terminal 1:

```bash
cd backend
python -m venv .venv
```

### Windows PowerShell

```powershell
.venv\Scripts\Activate.ps1
```

### macOS/Linux

```bash
source .venv/bin/activate
```

Install packages:

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Create `.env`:

### Windows

```powershell
Copy-Item .env.example .env
```

### macOS/Linux

```bash
cp .env.example .env
```

Start API:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Check:

- API: `http://localhost:8000`
- Swagger: `http://localhost:8000/docs`
- Health: `http://localhost:8000/api/v1/health`

---

# 4. Run frontend

Open Terminal 2:

```bash
cd frontend
npm install
```

Create `.env.local`:

### Windows

```powershell
Copy-Item .env.local.example .env.local
```

### macOS/Linux

```bash
cp .env.local.example .env.local
```

Run:

```bash
npm run dev
```

Open:

`http://localhost:3000`

---

# 5. What to show the supervisor

1. Home/Dashboard — project overview and current research status.
2. Analyze — upload any JPG/PNG/WEBP image.
3. Add optional caption — demonstrates the app's multimodal input contract.
4. Run analysis — backend creates a preliminary mask, heatmap, overlay, suspicious regions and metadata.
5. Result dashboard — show Original / Overlay / Mask / Heatmap.
6. History — previous analyses are saved in local SQLite.
7. Research page — clearly shows completed pipeline work and pending final AutoSplice-specific multimodal retraining.
8. PDF report — generated from the backend.

---

# 6. What the demo score means

The current score is called:

`Preliminary Forensic Evidence Score`

It is **not** a trained AI authenticity probability. It is generated from image residual/edge irregularity only to prove the end-to-end app pipeline.

The UI deliberately displays:

`DEMO / PRELIMINARY — FINAL MULTIMODAL CHECKPOINT NOT CONNECTED`

This protects the research presentation from making a false model-performance claim.

---

# 7. How final `best.pt` will be connected later

The interface is already prepared in:

```text
backend/app/services/trained_inference.py
```

Later workflow:

```text
Correct AutoSplice manifest
→ true image + caption + mask alignment
→ retrain model
→ validate test results
→ save best.pt
→ copy best.pt to backend/checkpoints/best.pt
→ replace DemoInferenceEngine with TrainedInferenceEngine
```

The frontend API contract can remain almost unchanged.

---

# 8. Optional PostgreSQL + Redis

The demo defaults to SQLite because it is fastest for tomorrow.

For the previously planned production stack, run:

```bash
docker compose up -d postgres redis
```

Then use this backend env:

```env
DATABASE_URL=postgresql+psycopg://forensight:forensight@localhost:5432/forensight
REDIS_URL=redis://localhost:6379/0
```

Restart FastAPI.

---

# 9. Supervisor-safe explanation

Use this wording:

> "This is our initial full-stack application prototype. The upload, multimodal input contract, backend processing, localization visualization, report generation and history workflow are implemented. The current evidence visualization is running in a clearly marked preliminary demo mode. We have already implemented and exercised the research model pipeline, and our next step is correcting the AutoSplice-specific image-mask-caption alignment and retraining the final multimodal checkpoint before replacing the demo engine."

