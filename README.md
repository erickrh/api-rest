# REST API Movies

A simple REST API built with Node.js and Express. The project exposes movie endpoints, validates request bodies with Zod, uses CORS configuration, and keeps the current data in memory from a local JSON file.

## Tech Stack

- Node.js
- Express
- Zod
- CORS
- pnpm

## Requirements

- Node.js 18 or higher
- pnpm installed globally

If you do not have pnpm yet:

```bash
npm install -g pnpm
```

## Installation

Clone the project and install dependencies:

```bash
pnpm install
```

## Run The Server

```bash
pnpm start
```

The API runs by default at:

```txt
http://localhost:3000
```

You can also set a custom port:

```bash
PORT=4000 pnpm start
```

## Project Structure

```txt
.
├── app.js                  # Express app entry point
├── middlewares/
│   └── cors.js             # CORS configuration
├── movies.json             # Initial movie data
├── routes/
│   └── movies.js           # Movie API routes
├── schemas/
│   └── movies.js           # Zod validation schemas
├── requests.http           # Example HTTP requests
├── package.json
└── pnpm-lock.yaml
```

## API Overview

### Health Check

```http
GET /
```

Returns a small JSON response confirming that the API is running.

### Movies

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/movies` | Get all movies |
| GET | `/movies?genre=Action` | Get movies filtered by genre |
| GET | `/movies/:id` | Get one movie by id |
| POST | `/movies` | Create a new movie |
| PATCH | `/movies/:id` | Update part of a movie |
| DELETE | `/movies/:id` | Delete a movie |

## Movie Model

When creating or updating a movie, the API validates the body with Zod.

```json
{
  "title": "The Matrix",
  "year": 1999,
  "director": "Lana Wachowski",
  "duration": 136,
  "poster": "https://example.com/poster.jpg",
  "genre": ["Action", "Fantasy"],
  "rating": 8.7
}
```

### Fields

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `title` | string | Yes | Movie title |
| `year` | number | Yes | Integer from 1888 to the current year |
| `director` | string | Yes | Movie director |
| `duration` | number | Yes | Positive integer, in minutes |
| `poster` | string | Yes | Valid URL |
| `genre` | string[] | Yes | List of accepted genres |
| `rating` | number | No | Number from 0 to 10 |

Accepted genres:

```txt
Action, Comedy, Drama, Fantasy, Horror, Mystery, Romance, Thriller, Western
```

## Example Requests

Get all movies:

```bash
curl http://localhost:3000/movies
```

Get movies by genre:

```bash
curl "http://localhost:3000/movies?genre=Action"
```

Get one movie:

```bash
curl http://localhost:3000/movies/c8a7d63f-3b04-44d3-9d95-8782fd7dcfaf
```

Create a movie:

```bash
curl -X POST http://localhost:3000/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Axe Knight",
    "year": 2012,
    "director": "Erick Riaño",
    "duration": 777,
    "poster": "https://cdna.artstation.com/p/assets/images/images/079/215/436/large/brian-kim-axeboi-1.jpg?1724289879",
    "genre": ["Fantasy"],
    "rating": 10
  }'
```

Update a movie:

```bash
curl -X PATCH http://localhost:3000/movies/dcdd0fad-a94c-4810-8acc-5f108d3b18c3 \
  -H "Content-Type: application/json" \
  -d '{
    "year": 1993
  }'
```

Delete a movie:

```bash
curl -X DELETE http://localhost:3000/movies/dcdd0fad-a94c-4810-8acc-5f108d3b18c3
```

## Notes

- The API currently stores changes in memory. New, updated, or deleted movies are not written back to `movies.json`.
- The project uses ES Modules with `"type": "module"` in `package.json`.
- CORS allows requests from `http://localhost:3000`, `http://localhost:8080`, and `http://localhost:1234`.

## License

MIT
