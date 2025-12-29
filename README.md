# Kanban Backend — Local Start

Quick instructions to run the backend locally.

1. Copy the example environment file:

   cp .env.example .env

2. Install dependencies (if not already):

   npm install

3. Start the server (example using local MongoDB):

   PORT=5001 MONGO_URI="mongodb://127.0.0.1:27017/kanban" npm start

The server exposes the tasks API at `/api/tasks`.

If you prefer an environment file, set `MONGO_URI` and `PORT` in `.env`.
