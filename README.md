# CareBridge - Hack2Heal 2.0

> Post-discharge healthcare continuity platform bridging patients, caregivers, and clinicians.

---

## 🌟 Overview & Architecture

CareBridge transforms discharge summaries, clinical notes, and medical prescriptions into an active, verified care plan. It provides:
- **Intelligent OCR & AI Extraction Pipeline**: Extracts medications, appointments, diagnostic tests, and care instructions.
- **Clinician & Patient Verification**: Allows patients and clinicians to verify, adjust, and approve extracted clinical entities before promoting them to active care plans.
- **Medications & Daily Care Checklist**: Real-time adherence tracking with symptom and pain level check-ins.
- **Clinician Follow-Up Summary**: Algorithmic synthesis of adherence metrics and patient-reported check-ins without speculative diagnosis.
- **Unified Full-Stack Integration**: Frontend (React + TypeScript + Vite) and Backend (Express + TypeScript) seamlessly integrated with dual-mode storage (PostgreSQL with zero-config in-memory mock store fallback).

---

## 🚀 Quick Start

### 1. Unified Concurrent Development Mode
From the root directory, run both Backend (port 4000) and Frontend (port 5173 with auto-proxying):
```bash
npm run dev
```
- Frontend UI: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:4000](http://localhost:4000)

### 2. Standalone Unified Production Server
Build and serve the entire application from a single Express server:
```bash
npm run build
npm start
```
Open [http://localhost:4000](http://localhost:4000).

---

## 🔑 Pre-Seeded Demo Accounts (1-Click Login Available)

| Role | Email | Password | Features |
|---|---|---|---|
| **Patient** | `patient@carebridge.com` | `password123` | Active care plan, medications, daily care, symptom check-in |
| **Clinician** | `clinician@carebridge.com` | `password123` | Patient follow-up summary, adherence review, audit logs |
| **Caregiver** | `caregiver@carebridge.com` | `password123` | Active caregiver hub, notification monitoring, task updates |

---

## 🧪 Running Tests & Typechecks

Run the full automated test suite:
```bash
npm test
```
All 15 integration and middleware tests pass with zero errors.

To build and check frontend types:
```bash
npm run build:frontend
```
