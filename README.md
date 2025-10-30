# SMW-v1

SMW-v1 is a full-stack student management platform composed of a Django REST API and a Next.js client. The backend exposes authentication, admissions, courses, and finance services, while the frontend delivers the public- and admin-facing experience.

## Tech Stack
- Backend: Django 5, Django REST Framework, PostgreSQL, Celery (optional)
- Frontend: Next.js 15 (React 19, TypeScript), Tailwind CSS
- Tooling: dotenv configuration, JWT auth, Turbopack dev server

## Project Structure
```
SMW-v1/
  Backend/
    admissions/           # Admissions domain endpoints
    authentication/       # Custom user model, JWT auth
    courses_app/          # Course catalog APIs
    financials/           # Financial services APIs
    smw/                  # Django project configuration
    users/                # Shared user utilities
    manage.py
    requirements.txt
    .env                  # Sample environment variables
  frontend/
    public/               # Static assets
    src/
      app/                # Next.js pages and layouts
      components/         # Reusable UI building blocks
      lib/                # Shared utilities
    package.json
    tsconfig.json
  PROJECT_STRUCTURE.txt   # Auto-generated tree (see print_structure.py)
  print_structure.py      # Helper script to refresh structure summary
```

## Backend Setup (Django API)
Prerequisites:
- Python 3.10+ (matches Django 5 support timeline)
- PostgreSQL available locally (or adjust `DATABASE_URL` in `.env`)

Steps:
1. Open a terminal and switch to the backend folder:  
   `cd Backend`
2. Create and activate a virtual environment:
   - Windows PowerShell: `python -m venv .venv` then `.\.venv\Scripts\Activate.ps1`
   - macOS/Linux: `python -m venv .venv` then `source .venv/bin/activate`
3. Install dependencies:  
   `pip install -r requirements.txt`
4. Copy `Backend/.env` and update secrets, database credentials, and optional Redis/Celery URLs.  
   - Prefer setting a single `DATABASE_URL=postgresql://user:pass@host:port/dbname`  
   - Or keep the split values (`USER`, `PASSWORD`, `HOST`, `PORT`, `DBNAME`)
5. Apply database migrations:  
   `python manage.py migrate`
6. (Optional) Create a superuser for Django admin:  
   `python manage.py createsuperuser`
7. Start the API server:  
   `python manage.py runserver`
   - The API listens on `http://127.0.0.1:8000/`

Optional workers:
- Celery: `celery -A smw worker -l info` (requires Redis running and `REDIS_URL` set)
- Scheduled tasks: `celery -A smw beat -l info` if you enable periodic jobs

Useful backend commands:
- Run tests: `python manage.py test`
- Collect static files (prod): `python manage.py collectstatic`

## Frontend Setup (Next.js client)
Prerequisites:
- Node.js 20+ and npm (or pnpm/yarn if you prefer)

Steps:
1. In a new terminal, switch to the frontend directory:  
   `cd frontend`
2. Install packages:  
   `npm install`
3. (Optional) Configure environment variables in `frontend/.env.local` if you expose different API URLs (defaults target `http://127.0.0.1:8000`).
4. Start the development server:  
   `npm run dev`
   - Served at `http://localhost:3000/`

Production build commands:
- `npm run build` to compile the Next.js app
- `npm run start` to serve the compiled build
- `npm run lint` for ESLint checks

## Running the Full Stack
- Start the Django API first (`python manage.py runserver` on port 8000).
- Start the Next.js dev server (`npm run dev` on port 3000).
- The frontend proxies API requests to the backend using the dev URLs configured in CORS (`http://localhost:3000` / `http://127.0.0.1:3000`).

## Additional Notes
- Update `Backend/.env` when deploying (strong secrets, production database, `DJANGO_DEBUG=False`, allowed hosts, etc.).
- Regenerate the project tree summary with `python print_structure.py > PROJECT_STRUCTURE.txt` after adding/removing files.
- Consider containerization or process managers (Gunicorn + reverse proxy, PM2/Vercel) for production environments.
