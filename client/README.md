Coy Discover
A swipe-based Discover feature built for the Coy SDE Intern assignment. Users browse profiles one at a time, Like or Pass, and see a match only when both people have liked each other.
Features
- Browse profiles one at a time
- Like or Pass using buttons or by dragging the card
- A mutual Like creates a match with an "It's a match!" popup
- Matches tab lists all mutual matches
- Swiped profiles never reappear
- Swipes and matches persist across reloads and server restarts
- Empty state when all profiles have been viewed
- Responsive, mobile-first interface
Tech Stack
Frontend: React, Vite, CSS, Lucide React
Backend: Node.js, Express.js
Data Storage: JSON files
Project Structure
coy-discover/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── data/
│   │   ├── profiles.json
│   │   └── swipes.json
│   ├── index.js
│   └── package.json
├── .gitignore
└── README.md


Getting Started
1. Clone the repository
git clone https://github.com/divyanshib020-code/coy-discover.git
cd coy-discover


2. Install backend dependencies
cd server
npm install


3. Start the backend
node index.js


The backend will run at http://localhost:5000.
4. Install frontend dependencies
Open another terminal in the project folder:
cd client
npm install


5. Start the frontend
npm run dev


The frontend will run at http://localhost:5173.
API Endpoints
GET /feed
Returns profiles the user has not swiped on yet.

Profiles that have already liked the user are not identified in the response.
POST /swipe
Records a Like or Pass and checks whether it creates a mutual match.

Request body:
{
  "profileId": 12,
  "action": "like"
}


action can be "like" or "pass".

Response when a match is created:
{
  "message": "It's a match!",
  "match": true,
  "profile": {}
}


The profile field contains the matched profile's information.

Response when no match is created:
{
  "message": "Swipe saved successfully.",
  "match": false
}


Error responses:
- 400 — Invalid profile ID or action
- 404 — Profile not found
- 409 — Profile has already been swiped on
GET /matches
Returns the user's mutual matches.

Only profiles that the user has Liked and that have also liked the user are included.
How Privacy Is Kept
Coy's core promise is that nobody learns who liked them unless it is mutual.
- The server decides whether a swipe creates a match.
- Profiles that have already liked the user are not identified in the /feed response.
- A non-mutual Like and a Pass return the same match: false result.
- The /matches endpoint returns only mutual matches.
Data Persistence
- profiles.json holds the 30 mock profiles.
- swipes.json stores swipe actions.
Swipe data persists across page reloads and server restarts.
Reset Demo Data
To start fresh:
1. Stop the backend server.
2. Open server/data/swipes.json.
3. Replace its contents with:
{
  "swipes": []
}


4. Save the file.
5. Restart the backend server.
Notes and Trade-offs
- JSON files are used for simplicity. A real product would use a database.
- Profile photos are placeholders.
- There is no login. The app assumes a single logged-in user, as allowed by the assignment.
Assignment Scope
This is a standalone demonstration created for the Coy SDE Intern assignment. It uses mock profiles and a single logged-in user.