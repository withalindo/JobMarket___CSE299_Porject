# Job Market

A full-stack job platform that connects job seekers with employers. Employees sign up, upload a profile picture and a CV, and get their skills detected automatically by machine-learning models. Companies sign up, add a logo and post jobs.

Built as a CSE299 course project.

**Stack:** React + Vite · Node.js / Express · MongoDB · Python (Flask) ML service · Google Gemini

---

## Table of contents

- [Features](#features)
- [How the resume analysis works](#how-the-resume-analysis-works)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Using the app](#using-the-app)
- [API reference](#api-reference)
- [Security notes](#security-notes)
- [Troubleshooting](#troubleshooting)
- [Known limitations](#known-limitations)
- [Contributing](#contributing)

---

## Features

**For employees**
- Sign up with username and password, or with Google or LinkedIn
- Profile picture upload with live preview (JPG, PNG, WEBP or GIF, up to 5 MB)
- CV upload (PDF, up to 5 MB): skills are predicted by ML models and a short summary is generated with Gemini
- Browse and search jobs, filter by category, and discover other employees
- Profile page to change the picture, replace the CV and review saved details

**For companies**
- Sign up with a company name and password, or with Google or LinkedIn
- Company logo upload, shown on every job card the company posts
- Post jobs (title, description, salary range, category)
- Dashboard with the latest jobs and employees

**Platform**
- Animated landing page showing top-paying jobs and the newest employees
- Session-based login that protects the sign-up steps and private data
- Resumes are only served to logged-in users

---

## How the resume analysis works

```
CV (PDF) ──► Node server ──► text extracted with pdf-parse
                               │
                               ├──► Python ML service (POST /predict)
                               │      TF-IDF features → Logistic Regression, SVM and XGBoost
                               │      → majority vote → predicted skill category
                               │
                               └──► Google Gemini → short resume summary
```

Both steps are optional. If the ML service or the Gemini key is unavailable, the CV is still saved and the employee's existing skills and summary are kept.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite 5, React Router 7, Axios, GSAP |
| Backend | Node.js (ES modules), Express 4, Mongoose 7, Multer, express-session |
| Authentication | bcrypt, JSON Web Tokens, Passport (Google OAuth 2.0, LinkedIn) |
| Database | MongoDB |
| ML service | Python, Flask, Waitress, scikit-learn, XGBoost, joblib |
| AI summary | Google Gemini API |
| Tooling | ESLint |

---

## Project structure

```
JobMarket/
├── BackEnd/
│   ├── server.js                Express entry point
│   ├── app.py                   Flask ML service (skill prediction)
│   ├── requirements.txt         Python dependencies
│   ├── .env.example             Template for BackEnd/.env
│   ├── uploads/                 Profile pictures (created at runtime, git-ignored)
│   └── src/
│       ├── config/              Environment, file paths, Passport setup
│       ├── controllers/         Request handlers
│       ├── middleware/          Auth guards and upload rules
│       ├── models/              Mongoose models: Employee, Company, Job
│       ├── routes/              Express routers
│       ├── utils/               Shared helpers
│       ├── CompanyImage/        Company logos (created at runtime, git-ignored)
│       └── ResumeUploads/       Resumes (created at runtime, git-ignored)
│
├── predictionModels/            Trained models (.joblib) used by the ML service
│
├── src/                         React frontend
│   ├── App.jsx                  Routes
│   ├── config.js                API URL and upload validation helpers
│   ├── hooks/useMe.js           Loads the logged-in account
│   ├── Components/              Reusable UI (cards, headers, forms, avatar, ...)
│   └── Pages/                   One folder per page
│
├── public/                      Static assets
├── jobs.json                    Sample job documents (not imported automatically)
├── package.json                 Frontend dependencies and scripts
└── vite.config.js
```

---

## Getting started

### Prerequisites

- **Node.js 18 or newer** and npm
- **MongoDB** running locally, or a MongoDB Atlas connection string
- **Python 3.12 or 3.13** for the ML service (optional, see [below](#4-start-the-ml-service-optional))

### 1. Clone and install

```powershell
git clone https://github.com/withalindo/Job_Market_CSE299_Porject.git
cd Job_Market_CSE299_Porject

# Frontend dependencies
npm install

# Backend dependencies
cd BackEnd
npm install
```

### 2. Configure the backend

Create `BackEnd/.env` from the template and fill it in (see [Environment variables](#environment-variables)):

```powershell
Copy-Item .env.example .env
```

`DB_URI`, `SESSION_SECRET` and `JWT_SECRET` are required. Everything else is optional.

### 3. Start the backend and frontend

Open two terminals.

```powershell
# Terminal 1: backend (from the BackEnd folder), http://localhost:5000
npm start
```

```powershell
# Terminal 2: frontend (from the project root), http://localhost:5173
npm run dev
```

Open **http://localhost:5173**.

> `npm start` only exists in the `BackEnd` folder. The project root uses `npm run dev`.

### 4. Start the ML service (optional)

Without it the app works fully, but uploaded CVs get no automatic skill detection.

```powershell
cd BackEnd
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

The service listens on **http://localhost:2001**.

The models in `predictionModels/` were trained with scikit-learn 1.6.1, which `requirements.txt` pins on Python 3.13 and older. Python 3.14 has no 1.6.1 build, so it installs the newest scikit-learn instead and loading the models may print a version warning.

### Scripts

| Where | Command | What it does |
|-------|---------|--------------|
| Root | `npm run dev` | Start the Vite dev server |
| Root | `npm run build` | Production build into `dist/` |
| Root | `npm run lint` | Lint the frontend and backend |
| Root | `npm run preview` | Preview the production build |
| `BackEnd` | `npm start` | Start the API server |
| `BackEnd` | `npm run dev` | Start the API server with auto-restart |

---

## Environment variables

Set these in `BackEnd/.env`. The file is git-ignored, so your secrets stay local.

| Variable | Required | Default | Purpose |
|----------|:--------:|---------|---------|
| `DB_URI` | yes | | MongoDB connection string |
| `SESSION_SECRET` | yes | random per start | Signs session cookies. If unset, everyone is logged out on every restart |
| `JWT_SECRET` | yes | `SESSION_SECRET` | Signs login tokens |
| `PORT` | no | `5000` | API server port |
| `NODE_ENV` | no | `development` | With `development`, server errors include the error message in the response |
| `CLIENT_URL` | no | `http://localhost:5173` | Frontend address (CORS and OAuth redirects) |
| `SERVER_URL` | no | `http://localhost:5000` | Public API address (OAuth callbacks) |
| `ML_SERVICE_URL` | no | `http://localhost:2001` | Python ML service address |
| `COOKIE_SECURE` | no | `false` | Set to `true` when served over HTTPS |
| `GEMINI_API_KEY` | no | | Enables resume summaries |
| `GEMINI_MODEL` | no | `gemini-2.0-flash` | Gemini model used for summaries |
| `Google_Client_ID`, `Google_Client_Secret` | no | | Enable Google sign-in |
| `LinkedIn_Client_ID`, `LinkedIn_Client_Secret` | no | | Enable LinkedIn sign-in |

The frontend talks to `http://localhost:5000` by default. To point it elsewhere, create a `.env` file in the **project root** with `VITE_API_URL=https://your-api.example.com`.

### OAuth callback URLs

Register these redirect URIs in the Google and LinkedIn developer consoles (replace the host if you changed `SERVER_URL`):

```
http://localhost:5000/auth/google/callback
http://localhost:5000/auth/google/company/callback
http://localhost:5000/auth/linkedin/callback
http://localhost:5000/auth/linkedin/company/callback
```

---

## Using the app

**Employee**
1. Sign up at `/signupEmp` (or use Google or LinkedIn).
2. **Personal information:** fill in your details and choose a profile picture.
3. **Skill information:** upload your CV as a PDF and optionally describe your experience. Detected skills and the summary appear on screen.
4. You land on your home page with your picture in the header. Use **Profile** to change the picture or CV later.

**Company**
1. Sign up at `/signupCom` (or use Google or LinkedIn).
2. **Company information:** add contact details, a description and a logo.
3. On the company home page, post jobs. They appear immediately and show your logo.

Sign in later at `/login` (employees) or `/loginCom` (companies).

| Route | Page | Access |
|-------|------|--------|
| `/` | Landing page | Public |
| `/signupEmp`, `/signupCom` | Sign up | Public |
| `/login`, `/loginCom` | Log in | Public |
| `/Jobs`, `/Users` | Browse jobs / employees | Public |
| `/PostSignupEmp`, `/PostSignupEmp2` | Employee sign-up steps | Employee |
| `/HomeUser` | Employee home | Employee |
| `/PostSignupCom`, `/HomeCom` | Company sign-up step, company home | Company |
| `/Profile` | Profile and uploads | Logged in |

---

## API reference

The API is served from `http://localhost:5000`. Authenticated routes use the session cookie, so requests from a browser need `withCredentials: true`.

### Accounts and sessions

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/signup/employee` | Public | Create an employee and start a session |
| POST | `/api/signup/company` | Public | Create a company and start a session |
| POST | `/api/login` | Public | Employee login (`username`, `password`) |
| POST | `/api/company-login` | Public | Company login (`companyName`, `password`) |
| GET | `/api/me` | Logged in | The current account (never includes the password) |
| GET | `/api/check-session` | Public | Whether a session is active |
| GET | `/auth/logout` | Logged in | End the session |
| GET | `/auth/google`, `/auth/linkedin` | Public | Start employee OAuth sign-in |
| GET | `/auth/google/company`, `/auth/linkedin/company` | Public | Start company OAuth sign-in |

### Profile and uploads

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/post-signup-emp` | Employee | Save personal details and picture (`multipart`, field `profileImage`) |
| POST | `/api/post-signup-emp2/upload-resume` | Employee | Upload CV (`multipart`, field `resume`) and run the analysis |
| POST | `/api/profile/picture` | Employee | Replace the profile picture |
| POST | `/api/post-signup-com/add-info` | Company | Save company details and logo (`multipart`, field `companyLogo`) |

Upload rules: images must be JPG, PNG, WEBP or GIF; resumes must be PDF; the limit is 5 MB each.

### Jobs and people

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/jobs?search=&category=` | Public | Search and filter jobs |
| GET | `/api/all-jobs` | Public | All jobs, newest first, with company logo |
| POST | `/api/post-job` | Company | Post a job under the logged-in company |
| GET | `/api/employees?search=` | Public | Employees with a completed profile |
| GET | `/api/landing/top-jobs` | Public | Top 3 jobs by salary |
| GET | `/api/landing/top-employees` | Public | 3 newest employees |
| GET | `/api/homeuser-info` | Employee | Name, picture, skills and summary for the header |

### Files

| Path | Access |
|------|--------|
| `/uploads/<file>` | Public (profile pictures) |
| `/companyImage/<file>` | Public (company logos) |
| `/resumes/<file>` | Logged in only |

### ML service

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `http://localhost:2001/predict` | Body `{ "text": "..." }`, returns the predictions of each model and the majority-vote `final_prediction` |
| GET | `http://localhost:2001/health` | Reports whether the models loaded |

---

## Security notes

- Passwords are hashed with bcrypt and are never returned by any endpoint.
- Sign-up steps and uploads are tied to the logged-in session, not to values typed into a form.
- Uploaded files are checked for type and size; resumes must really be PDFs and are served only to logged-in users.
- Search input is escaped before it reaches MongoDB regular expressions.
- `.env` is git-ignored. **Never commit it**, and rotate any secret that was ever pushed by accident.
- Sessions are kept in memory, which is fine for development. Use a persistent session store (for example `connect-mongo`) and set `COOKIE_SECURE=true` behind HTTPS before deploying.

---

## Troubleshooting

| Problem | Likely cause and fix |
|---------|----------------------|
| `Missing script: "start"` | `npm start` only exists in `BackEnd`. In the project root use `npm run dev` |
| Server prints `MongoDB connection error` or hangs on start | MongoDB is not running, or `DB_URI` is wrong |
| Everyone is logged out after each restart | Set `SESSION_SECRET` in `BackEnd/.env` |
| Page shows no data or login does not stick | The backend is not running, or the frontend is not on `CLIENT_URL` (default port 5173) |
| Google / LinkedIn buttons say "not configured" | Add the client ID and secret to `BackEnd/.env` and restart |
| LinkedIn sign-in is rejected | LinkedIn has deprecated the `r_liteprofile` scope. Update the scopes for your LinkedIn app |
| CV uploads but skills stay empty | The ML service is not running or unreachable at `ML_SERVICE_URL` |
| `pip install` fails for scikit-learn | The pinned 1.6.1 has no build for your Python. Use Python 3.12 or 3.13 |
| NumPy import blocked by an "Application Control policy" | A Windows security policy is blocking the native library. Run the ML service in WSL, Docker or Google Colab and set `ML_SERVICE_URL` |
| Picture or logo not displaying | Restart the backend, hard-refresh the page (Ctrl+F5), and make sure the file is under 5 MB |

---

## Known limitations

- **Apply now** on a job card is a placeholder; there is no application workflow yet.
- There is no automated test suite.
- There is no password reset or email verification.
- `jobs.json` holds sample data but there is no import script.

---

## Contributing

1. Fork the repository and create a branch: `git checkout -b feature/my-change`
2. Run `npm run lint` before committing
3. Commit, push, and open a pull request


