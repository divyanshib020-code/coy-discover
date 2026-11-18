\# Coy Discover



A swipe-based Discover feature built as part of the Coy SDE Intern assignment. The application allows users to browse profiles, Like or Pass on them, and discover mutual matches.



\## Features



\- Browse profiles one at a time.

\- Like or Pass on profiles using buttons.

\- Swipe profiles using drag gestures.

\- Mutual Likes create a match.

\- Match notification popup.

\- View mutual matches in the Matches tab.

\- Swiped profiles do not reappear.

\- Persistent swipe and match data.

\- Empty state when all profiles have been viewed.

\- Responsive, mobile-first interface.



\## Tech Stack



\*\*Frontend\*\*

\- React

\- Vite

\- CSS

\- Lucide React



\*\*Backend\*\*

\- Node.js

\- Express.js

\- JSON files for data persistence



\## Project Structure



```text

coy-discover/

├── client/

│   ├── public/

│   ├── src/

│   ├── package.json

│   └── vite.config.js

├── server/

│   ├── data/

│   │   ├── profiles.json

│   │   └── swipes.json

│   ├── index.js

│   └── package.json

└── README.md

```



\## Getting Started



\### Prerequisites



\- Node.js

\- npm



\### 1. Clone the repository



```bash

git clone <repository-url>

cd coy-discover

```



\### 2. Start the backend



Open a terminal:



```bash

cd server

npm install

node index.js

```



The backend runs at:



```text

http://localhost:5000

```



\### 3. Start the frontend



Open another terminal:



```bash

cd client

npm install

npm run dev

```



The frontend runs at:



```text

http://localhost:5173

```



Open the frontend URL in your browser.



\## API Endpoints



\### GET /feed



Returns profiles that the user has not swiped on yet.



\### POST /swipe



Records a Like or Pass action and checks whether a mutual match has been created.



\### GET /matches



Returns the user's mutual matches.



\## Data Persistence



The application uses JSON files to store mock profiles and swipe data.



\- `profiles.json` contains the mock profile data.

\- `swipes.json` stores swipe actions and matching information.



The data persists across page reloads.



\## Assignment Scope



This is a standalone demonstration application created for the Coy SDE Intern assignment. It uses mock profiles and assumes a single logged-in user.



