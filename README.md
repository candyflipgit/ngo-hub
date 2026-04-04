# NGO Hub - SaaS Platform MVP

## Setup Instructions

1. **Start the Database**
```bash
docker-compose up -d
```

2. **Backend Setup**
```bash
cd backend
npm install
npx prisma db push
npx prisma generate
npm run prisma:seed # To seed database users and events
npm run start:dev
```
> The API will be available at http://localhost:3001

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```
> The web application will be available at http://localhost:3000

## Seed Accounts
- Admin: `admin@ngohub.com` / `password123`
- NGO: `ngo@example.com` / `password123`
- Volunteer: `volunteer@example.com` / `password123`
