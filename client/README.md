# Coy Discover

A swipe-based Discover feature built as part of the Coy SDE Intern assignment.

## Features

- Discover profiles one at a time.
- Swipe right to Like and left to Pass.
- Drag cards on mobile and desktop.
- Like and Pass buttons for users who prefer clicking.
- Mutual likes create a match.
- Match notification popup.
- View mutual matches in the Matches tab.
- Swiped profiles are not shown again.
- Empty state when all profiles have been swiped.
- Persistent swipe and match data.

## Tech Stack

**Frontend:** React.js, Vite, CSS  
**Backend:** Node.js, Express.js  
**Data Storage:** JSON files  
**Icons:** Lucide React

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/divyanshib020-code/coy-discover.git
cd coy-discover
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Start the frontend

```bash
npm run dev
```

The frontend will run at:

http://localhost:5173

### 4. Start the backend

Open another terminal:

```bash
cd server
npm install
node index.js
```

The backend will run at:

http://localhost:5000

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/feed` | Get available profiles |
| POST | `/swipe` | Record a Like or Pass |
| GET | `/matches` | Get mutual matches |

## Project Structure

```text
coy-discover/
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── data/
│   │       └── profiles.js
│   └── package.json
├── server/
│   ├── data/
│   │   ├── profiles.json
│   │   └── swipes.json
│   ├── index.js
│   └── package.json
├── .gitignore
└── README.md
```

## Data Persistence

Swipe actions and matches are stored in JSON files on the backend. The data persists across page reloads and server restarts.

## Assignment Scope

This project is a standalone demonstration of the Discover and mutual matching functionality. It uses mock profiles and assumes a single logged-in user.