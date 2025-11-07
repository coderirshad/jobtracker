# MERN Job Tracker (Portfolio-ready)

A clean Job Application Tracker you can deploy fast. Replaces basic Todos with real-world job tracking.

**Features**
- Auth (JWT): Register/Login
- Job CRUD: company, role, location, link, source, status, notes, contacts
- Filters + quick status update
- Basic stats: count by status + weekly applied
- Deploy-ready (Render for API, Vercel for client)

## Quick Start
### Server
```bash
cd server
npm install
cp .env.example .env
# set: MONGO_URI=..., JWT_SECRET=longsecret, PORT=4000
npm run dev
```
### Client
```bash
cd client
npm install
cp .env.example .env
# set: VITE_API_BASE=http://localhost:4000/api
npm run dev
```

### Deploy
- Backend → Render (Web Service)
- Frontend → Vercel
- Set envs accordingly

### Portfolio Tips
- Add demo user in seed
- Put screenshots in README
- Add short product story: problem → your solution → stack → live link
