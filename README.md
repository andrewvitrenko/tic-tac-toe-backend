# Tic Tac Toe

This repo is a back-end part of the application. The front-end part can be
found [here](https://github.com/andrewvitrenko/tic-tac-toe-frontend).

## Introduction

Tic-tac-toe is a simple, two-player game that, if played optimally by both
players, will always result in a tie. The game is also called noughts and
crosses or Xs and Os.

## Rules

The game is played on a 3x3 grid. One player is X and the other player is O.
Players take turns placing their X or O. If a player gets three of their marks
on the grid in a row, column, or one of the two diagonals, they win. When the
grid is full and no player has won, the game is a tie.

## Installation

### Requirements

- [Node.js](https://nodejs.org/en/download/), LTS version or higher
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- Modern browser: Chrome, Firefox, Safari, Edge

### Instructions

1. Clone the repository:
2. Create `.env` file with the following variables:
   ```bash
   DATABASE_URL=postgresql://postgres:password@localhost:5432/tic_tac_toe
   JWT_SECRET=secret
   ```
3. Setup the database:
   ```bash
    docker-compose up && npx prisma migrate deploy
    ```
4. Install dependencies:
    ```bash
    npm ci
    ```
   This will install all dependencies from the `package-lock.json` file.
5. Build the project:
   ```bash
   npm run build
   ```
6. Start the project:
   ```bash
    npm start
    ```

Your server is running on [http://localhost:8000](http://localhost:8000).

You can change the database url to your own in the `.env` file.

## Modules

The project is divided into modules:

### Auth

This module provides a basic, yet powerful JWT-based authentication. It
uses [passport.js](https://docs.nestjs.com/recipes/passport) under the hood to
create and manage all the strategies. This module provides the following public
endpoints:

- `/auth/sign-up`
- `/auth/login`

`/auth/login` endpoint is protected by local authentication strategy. For more
details
see [Local auth](https://docs.nestjs.com/recipes/passport#implementing-passport-local).

### Database

To make requests to the database, the project
uses [Prisma](https://www.prisma.io/) - one of the best ORMs today.

### Users

This module is responsible for any interaction with `users` table in database -
create, read, update, delete operations. It exposes only one endpoint `/me`
which is protected with JWT guards.

### Games

This module handles all the game-related logic. It handles creating, joining and
playing
game logic. It exposes http endpoints and also uses websockets for real-time
communication.

For security reasons every endpoint and and every WebSocket event are covered
with special guards, which ensures stability and security of the application.
