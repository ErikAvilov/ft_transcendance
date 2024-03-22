⚠️ An .env file is needed to start the docker project ⚠️

You can make one yourself with these parameters

POSTGRES_USER=name

POSTGRES_HOST=db

POSTGRES_NAME=postgres

POSTGRES_PASSWORD=1234

POSTGRES_ROOT_PASSWORD=root1234

POSTGRES_PORT=5432

DJANGO_SECRET_KEY= *Put whatever for testing*

*Only needed for the 42 API*

SERVER_IP= *your personnal ip*

API_URL=

API_UID=

API_SECRET=


**TRANSCENDANCE**

42 project aimed at building a django website in a dockerized environment.

Mandatory part -

Build a single page application website on which users can play pong between themselves, organize tournaments, all from a dockerized application.
Any credentials must be either stored outside of the repository, or hashed in the database.

Chosen modules -

- Django as backend framework -
Using the django as the main backend framework, running on daphne

- User management -
Users can subscribe to the website and login in a secure way,
friend other users and visit their profile page,
display their game stats and details,
update/modify their information, such as an avatar, alias name, email address.

- Remote authentication -
Users can authenticate through the 42 API with Oauth2

- Remote players -
Users can play pong from separate computers
  
- 2FA + JWT -
Users can choose to enable a two factor authentication system with the google authenticator app as a second layer of security
Json Web Tokens are implemented for each user also as a second layer of security for authentication, backend requests, and navigation

- 3D -
The pong has 3D attributes with the help of the Three.js library

- Server-side pong -
Input validation has also been implemented into the pong to prevent lag and cheating.
Games are simultaneously played in the frontend (Javascript) and backend (Python)

- AI opponent -
Players can choose to play against an AI opponent that is constrained by a rule stating that it can only receive the ball's trajectory data once every second

- PostgreSQL as database -
The postrgreSQL should be our backend's database of choice

- Multiple language support -
The user can switch between three languages of their choices between French, English and Russian and set preferred languages for subsequent visits

- Game Stats Dashboards -
Game stats are represented in charts in the match history tab
