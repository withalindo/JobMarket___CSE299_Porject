# Job Market Platform

A comprehensive web application for job seekers and employers, featuring job postings, user authentication, resume uploads, and predictive analytics for job matching.

## Description

Job Market Platform is a modern, full-featured web application designed to revolutionize the way job seekers and employers connect. With secure authentication options (Google, LinkedIn, and custom), users can register as employees or companies and access a suite of powerful tools. Job seekers can upload resumes, browse and apply for jobs, and receive personalized job recommendations powered by advanced machine learning models. Employers benefit from streamlined job posting, application management, and an intuitive dashboard to oversee recruitment.

The platform leverages a React-based frontend for a seamless user experience, a robust Node.js/Express backend for API and business logic, and Python services for predictive analytics. Data is securely stored in MongoDB, ensuring scalability and reliability. By integrating cutting-edge web technologies and intelligent analytics, Job Market Platform delivers an efficient, effective, and elegant solution for modern hiring needs.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure) 
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Prediction Models](#prediction-models)
- [Contributing](#contributing)

## Overview

This project is a full-stack job market platform that allows users to sign up as employees or companies, post and apply for jobs, upload resumes, and leverage machine learning models for job recommendations. The platform includes both a React-based frontend and a backend powered by Node.js/Express and Python for ML tasks.

## Features

- User authentication (Google, LinkedIn, custom)
- Employee and company registration
- Job posting and management
- Resume upload and parsing
- Predictive job matching using ML models (Logistic Regression, SVM, XGBoost)
- RESTful API for frontend-backend communication
- Modern UI with multiple landing pages and dashboards

## Project Structure

```
JobMarket/
│
├── BackEnd/
│   ├── app.py                  
│   ├── server.js               
│   ├── .env.example            
│   ├── src/
│   │   ├── config/             (env, paths, passport)
│   │   ├── controllers/        
│   │   ├── middleware/         (auth guards, upload rules)
│   │   ├── models/             
│   │   ├── routes/             
│   │   ├── utils/              
│   │   ├── CompanyImage/       (company logos)
│   │   └── ResumeUploads/      (resumes)
│   ├── uploads/                (profile pictures)
│   └── requirements.txt        
│
├── predictionModels/           
│
├── public/                     
│
├── src/
│   ├── App.jsx                 
│   ├── main.jsx                
│   ├── Components/             
│   └── Pages/                  
│
├── jobs.json                   
├── package.json                
├── vite.config.js              
├── eslint.config.js            
└── README.md                   
```

## Tech Stack

- **Frontend:** React, Vite, CSS
- **Backend:** Node.js, Express, Python (Flask for ML)
- **Database:** MongoDB (via Mongoose models)
- **Authentication:** Google, LinkedIn, custom
- **Machine Learning:** scikit-learn, XGBoost, BERT, SVM, Logistic Regression.
- **LLM Model:** Google Gemini
- **Other:** ESLint, REST API

## Setup Instructions

### Prerequisites

- Node.js & npm
- Python 3.x
- MongoDB

### Backend Setup

1. Navigate to `BackEnd`:
   ```powershell
   cd .\BackEnd\
   ```
2. Install Node.js dependencies:
   ```powershell
   npm install
   ```
3. Create your environment file: copy `.env.example` to `.env` and fill it in.
   `DB_URI`, `SESSION_SECRET` and `JWT_SECRET` are required; everything else is optional
   (Google / LinkedIn sign-in and Gemini summaries are skipped when their keys are empty).
   ```powershell
   Copy-Item .env.example .env
   ```
4. Install Python dependencies (the models were trained with scikit-learn 1.6.1, which is pinned):
   ```powershell
   pip install -r requirements.txt
   ```
5. Start the Node.js server:
   ```powershell
   npm start
   ```
6. Start the Python ML server (optional - without it the resume is still saved, but no skills are detected):
   ```powershell
   python app.py
   ```

### Frontend Setup

1. Navigate to the project root:
   ```powershell
   cd ..
   ```
2. Install frontend dependencies:
   ```powershell
   npm install
   ```
3. Start the frontend development server:
   ```powershell
   npm run dev
   ```

## Usage

- Access the frontend at `http://localhost:5173` (default Vite port).
- Backend API runs at `http://localhost:5000` (Node.js) and `http://localhost:2001` (Python ML, called by the Node server).
- To point the frontend at a different backend, set `VITE_API_URL` in a `.env` file at the project root.
- Register as a company or employee, post jobs, apply, and view recommendations.

### Sign-up flow and uploads

1. **Employee:** sign up -> *Personal Information* (profile picture: JPG/PNG/WEBP/GIF, max 5 MB) -> *Skill Information*
   (resume: PDF, max 5 MB; skills are predicted by the ML service and a summary is generated with Gemini).
2. **Company:** sign up -> *Company Information* (logo: JPG/PNG/WEBP/GIF, max 5 MB) -> post jobs.
3. Signing up (or signing in with Google / LinkedIn) starts a session cookie, which is how the server knows whose
   profile, picture, resume or logo is being saved. The **Profile** page lets people change their picture / logo and resume later.

Uploaded files: profile pictures in `BackEnd/uploads/`, company logos in `BackEnd/src/CompanyImage/`, resumes in
`BackEnd/src/ResumeUploads/` (resumes are only served to logged-in users).

## API Endpoints

- `/auth/google`, `/auth/linkedin` (and `/company` variants) - OAuth sign-in; `/auth/logout`
- `POST /api/signup/employee`, `POST /api/signup/company`, `POST /api/login`, `POST /api/company-login`
- `GET /api/me` - the logged-in account; `POST /api/profile/picture` - change an employee's picture
- `POST /api/post-signup-emp` (profile + picture), `POST /api/post-signup-emp2/upload-resume` (CV),
  `POST /api/post-signup-com/add-info` (company details + logo)
- `GET /api/jobs?search=&category=`, `GET /api/all-jobs`, `POST /api/post-job` (company only)
- `GET /api/employees?search=` - employees with a completed profile
- `GET /api/landing/top-jobs`, `GET /api/landing/top-employees` - public, for the landing page
- ML service: `POST http://localhost:2001/predict` with `{ "text": "..." }`, `GET /health`

See `BackEnd/src/routes/` for detailed route definitions.

## Prediction Models

Custom-trained models are stored in `predictionModels`:
- `logistic_regression_model.joblib`
- `svm_model.joblib`
- `xgboost_model.joblib`
- `tfidf_vectorizer.joblib`
- `label_encoder.joblib`

These are used for resume parsing and job matching.

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes
4. Push to your branch (`git push origin feature-branch`)
5. Open a pull request
