# GMDB – Game Management Database

GMDB is a comprehensive web application designed to help gamers track their gaming journey. Inspired by IMDb's movie tracking system, GMDB brings a similar experience tailored specifically for video games. Whether you're currently playing, have completed, or planning to play a game, GMDB allows you to manage and monitor your entire gaming collection in one place.

### Screenshots

![signup-page](screenshots/0.jpg)

![landing-page](screenshots/1.jpg)

![game-detail-page](screenshots/2.jpg)

![completed-list-page](screenshots/3.jpg)

![playlist-page](screenshots/4.jpg)

***

### Features
- **User Authentication**: Secure login and signup functionality with JWT-based authentication
- **Game Tracking**: Add games to your personal collection and update their status
- **Search Functionality**: Powerful search feature to discover and add games to your collection
- **Rating System**: Rate games on a scale and share your personal gaming experiences
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices

***

### Technologies Used
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Version Control**: Git & GitHub

***

### Installation & Setup
1) Clone the repository:
```bash
git clone https://github.com/shresthrajgupta/gmdb.git
cd gmdb
```

2) Setup the backend:
```bash
cd server
npm install
npm start
```

3) Setup the frontend:
```bash
cd ../client
npm install
npm start
```

4) Access the application:
Open your browser and navigate to `http://localhost:3000`