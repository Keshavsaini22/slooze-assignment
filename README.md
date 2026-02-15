# Slooze Food Ordering Application

## Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Getting Started](#getting-started)

  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Database Setup](#database-setup)
  * [Running the Project](#running-the-project)
* [Accessing Database with pgAdmin](#accessing-database-with-pgadmin)
* [Important Notes](#important-notes)
* [Tech Stack](#tech-stack)

---

## Overview

The **Slooze Food Ordering Application** is a full-stack web application that allows users to browse food items, place orders, and manage food ordering workflows.
The application is built using **NestJS** for the backend and **Next.js** for the frontend, with **PostgreSQL** as the database.

This README explains how to set up and run the application locally using a **hybrid setup** (Docker + local development). <a name="overview"></a>

---

## Features

* Food listing and ordering
* Backend REST APIs using NestJS
* Modern frontend using Next.js
* PostgreSQL database with Prisma ORM
* Dockerized database and pgAdmin
* Easy local development setup <a name="features"></a>

---

## Getting Started

These instructions will help you set up and run the Slooze Food Ordering Application on your local machine. <a name="getting-started"></a>

---

### Prerequisites

Ensure you have the following installed:

* Node.js (v18+)
* Docker & Docker Compose
* PostgreSQL (only if not using Docker) <a name="prerequisites"></a>

---

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate into the project directory:

   ```bash
   cd slooza-assignment
   ```

3. Start Docker services (PostgreSQL + pgAdmin):

   ```bash
   docker-compose up -d
   ```

This will start:

* PostgreSQL on `localhost:5433`
* pgAdmin on `http://localhost:5050` <a name="installation"></a>

---

### Database Setup

The backend uses **Prisma** for database management.

1. Navigate to backend:

   ```bash
   cd backend
   ```

2. Create environment file:

   ```bash
   cp .env.example .env
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Generate Prisma client:

   ```bash
   npx prisma generate
   ```

5. Run migrations:

   ```bash
   npx prisma migrate dev --name init
   ```

6. Seed the database:

   ```bash
   npx prisma db seed
   ```

<a name="database-setup"></a>

---

### Running the Project

#### Backend (NestJS)

1. Navigate to backend:

   ```bash
   cd backend
   ```

2. Start backend server:

   ```bash
   npm run start:dev
   ```

Backend will be available at:
`http://localhost:3001`

---

#### Frontend (Next.js)

1. Open a new terminal and navigate to frontend:

   ```bash
   cd frontend
   ```

2. Create environment file:

   ```bash
   cp .env.example .env
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start frontend:

   ```bash
   npm run dev
   ```

Frontend will be available at:
`http://localhost:3000`

<a name="running-the-project"></a>

---

## Accessing Database with pgAdmin

1. Open:

   ```
   http://localhost:5050
   ```

2. Login with:

   * Email: `admin@admin.com`
   * Password: `admin`

3. Click **Add New Server**

4. General Tab:

   * Name: `Slooze Local`

5. Connection Tab:

   * Host name/address: `database`
   * Port: `5432`
   * Maintenance database: `slooze`
   * Username: `postgres`
   * Password: `postgres`

6. Click **Save** <a name="accessing-database-with-pgadmin"></a>

---

## Important Notes

* Database and pgAdmin run inside Docker
* Backend and Frontend run locally
* Prisma handles schema, migrations, and seeding
* PostgreSQL is exposed on port `5433` for local access <a name="important-notes"></a>

---

## Tech Stack

### Backend

* NestJS
* Prisma
* PostgreSQL

### Frontend

* Next.js
* React
* Tailwind CSS

### Infrastructure

* Docker
* Docker Compose <a name="tech-stack"></a>

---
