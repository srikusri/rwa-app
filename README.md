# Resident Welfare Association (RWA) Management App

## Overview
A web application to manage community activities, communication, and administrative tasks for a Resident Welfare Association.

## Features
- Announcements Management
- Bookings Management (e.g., for community facilities)
- Classifieds Section
- Complaints/Issues Tracking
- Payments Management
- Rules and Regulations Display
- User Management

## Technology Stack
- Frontend: Angular
- Backend: Node.js, Express.js

## Setup and Installation
- Clone the repository: `git clone <repository-url>`
- Backend Setup:
    - Navigate to the `backend` directory: `cd backend`
    - Install dependencies: `npm install`
    - Start the server: `npm start` (The backend will run on http://localhost:3000 by default)
- Frontend Setup:
    - Navigate to the `frontend` directory: `cd frontend`
    - Install dependencies: `npm install`
    - Start the application: `npm start` or `ng serve` (The frontend will run on http://localhost:4200 by default)

## API Endpoints
- The backend provides RESTful APIs for various functionalities.
- Key API routes are available under `/api/<feature-name>` (e.g., `/api/announcements`, `/api/bookings`).
- For detailed information on routes, refer to the files in the `backend/routes/` directory.
