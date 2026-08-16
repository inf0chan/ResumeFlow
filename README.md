# ResumeFlow

## Tech stack
- **Frontend:** Angular, TypeScript, HTML5, CSS3
- **Backend:** Node.js, Express.js
- **Database:** MySQL (via Sequelize)
- **Dev & testing:** Git, GitHub, VS Code, Postman

## Project layout
```
backend/         Express API + serves the built Angular app
frontend/        Angular app (source)
```

## Running it locally

### 1. Database
```
mysql -u root -p
CREATE DATABASE resumemaker;
```
Update `backend/config/config.json` with your MySQL username/password if they
differ from the defaults already in there.

### 2. Backend
```
cd backend
cp .env.example .env        # then edit JWT_SECRET
npm install
npx sequelize-cli db:migrate
```

### 3. Frontend — build it into the backend's public/ folder
```
cd frontend
npm install
npm run build
cp -r dist/resumeflow-frontend/browser/* ../backend/public/
```
(Angular 17+ nests output under `browser/` — adjust the path if your
Angular version differs; check `frontend/dist/resumeflow-frontend/` after
building.)

### 4. Run everything
```
cd backend
npm start
```
Open **http://localhost:3000** — sign up for an account, and you're in.

### Developing the frontend with live reload instead
```
cd frontend
npm start          # ng serve, http://localhost:4200
```
Angular's dev server proxies nothing by default — for this to reach
`/api` on port 3000 during development, either add a `proxy.conf.json`
pointing `/api` → `http://localhost:3000`, or just rebuild into
`backend/public/` when you want to test the full thing together.

## API keys
This app doesn't call any third-party service — no payment processor, no
AI API, no email provider. The **only** secret it needs is `JWT_SECRET`
in `backend/.env`, used to sign login tokens. There is nothing else
to configure.
