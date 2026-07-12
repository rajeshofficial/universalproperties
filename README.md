# Universal Group MERN Website

React + Vite frontend, Express API, MongoDB/Mongoose database, and a protected property admin dashboard.

## Features

- Public property listings loaded from MongoDB
- Categories, locations, area, price, bedrooms, bathrooms and status
- Featured properties on the homepage
- JPG, PNG and WebP uploads (maximum 5MB)
- Images stored in MongoDB with the property record
- Protected `/admin` dashboard
- Add, edit and delete property listings
- Change the admin password securely from the dashboard (stored as a salted hash in MongoDB)
- Six starter listings inserted automatically when the database is empty

## Local setup

1. Install Node.js 20 or 22 and MongoDB.
2. Copy `.env.example` to `.env`.
3. Set `MONGODB_URI`, `ADMIN_PASSWORD` and `JWT_SECRET`.
4. Run:

```bash
npm install
npm run dev
```

Frontend: `http://localhost:5173`  
Admin: `http://localhost:5173/admin`  
API: `http://localhost:3001/api/health`

## Production commands

```bash
npm run build
npm start
```

The Express server serves both the API and the built React application when `NODE_ENV=production`.

## Required production environment variables

```text
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
ADMIN_USERNAME=admin
ADMIN_PASSWORD=use-a-long-unique-password
JWT_SECRET=use-at-least-32-random-characters
```

Do not upload a real `.env` file to GitHub. Add these values in Hostinger's environment-variable screen.

## Hostinger overview

1. Create a MongoDB Atlas cluster and database user.
2. Push this project to GitHub.
3. In Hostinger hPanel choose **Websites → Add website → Node.js Web App**.
4. Connect the GitHub repository.
5. Choose Node.js 22.
6. Build command: `npm run build`
7. Start command: `npm start`
8. Add the required environment variables above.
9. Deploy, then visit `/api/health` and `/admin`.

The MongoDB database is created automatically on first start. The `properties` collection and starter records are also created automatically.

The initial admin username is `ADMIN_USERNAME` (or `admin` when omitted), and the initial password is `ADMIN_PASSWORD`. After the first successful login, a salted password hash is stored in MongoDB. The admin can then use **Change password** in the dashboard; the original environment password will no longer authenticate.
