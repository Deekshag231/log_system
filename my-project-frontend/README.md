# Log Monitor Frontend

A production-ready React dashboard for monitoring system logs and alerts. 
Built with **React 18**, **Tailwind CSS v4.0**, and **Vite**.

## Features
- **Dashboard**: KPI cards and log distribution charts using Recharts.
- **Log Ingestion**: Form with Zod validation for pushing logs to Kafka/ES.
- **Advanced Search**: Filter logs by service, level, or message.
- **Real-time Alerts**: Active incident monitoring with detail modals.
- **Dark Mode**: Fully reactive theme switching.

## Tech Stack
- **Framework**: Vite + React + TypeScript
- **Styling**: Tailwind CSS v4.0 (Vite Plugin)
- **Data Fetching**: Axios + TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## Setup & Running

1. **Install Dependencies**:
   ```bash
   npm install