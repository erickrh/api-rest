const express = require('express');
const app = express();
const crypto = require('crypto');
const cors = require('cors');

const movies = require('./movies.json');
const { validateMovie, validatePartialMovie } = require('./schemas/movies');

const ACCEPTED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:8080',
    'http://localhost:1234'
];

app.use(express.json());
app.use(cors({
    origin: (origin, callback) => {
        if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    }
}));
app.disable('x-powered-by');

app.get('/', (req, res) => {
    res.json({
        message: 'REST API is running',
        endpoints: {
            movies: '/movies'
        }
    });
});

app.get('/movies', (req, res) => {
    const origin = req.header('origin');
    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        res.header('Access-Control-Allow-Origin', origin);
    }

    const { genre } = req.query;
    if (genre) {
        const filteredMovies = movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()));
        return res.json(filteredMovies);
    };
    res.json(movies);
});

app.get('/movies/:id', (req, res) => {
    const { id } = req.params;
    const movie = movies.find(movie => movie.id === id);
    if (movie) return res.json(movie);

    res.status(404).json({ message: 'Movie not found' });
});

app.post('/movies', (req, res) => {
    const result = validateMovie(req.body);

    if (result.error) {
        return res.status(400).json({error: JSON.parse(result.error.message)});
    }

    console.log(result);

    const newMovie = {
        id: crypto.randomUUID(),
        ...result.data
    }

    movies.push(newMovie);
    res.status(201).json(newMovie);
});

app.patch('/movies/:id', (req, res) => {
    const { id } = req.params;
    const result = validatePartialMovie(req.body);

    if (result.error) {
        return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const movieIndex = movies.findIndex(movie => movie.id === id);

    if (movieIndex === -1) {
        return res.status(404).json({ message: 'Movie not found' });
    }

    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }

    movies[movieIndex] = updateMovie;

    return res.status(200).json(updateMovie);
});

app.delete('/movies/:id', (req, res) => {
   const origin = req.header('origin');
    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        res.header('Access-Control-Allow-Origin', origin);
    }

    const { id } = req.params;
    const movieIndex = movies.findIndex(movie => movie.id === id);

    if (movieIndex === -1) {
        return res.status(404).json({ message: 'Movie not found' });
    }

    const titleMovie = movies[movieIndex].title;

    movies.splice(movieIndex, 1);

    return res.status(200).json({ message: `Movie ${titleMovie} deleted`});
})

app.options('/movies/:id', (req, res) => {
    const origin = req.header('origin');

    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
    }

    return res.sendStatus(204);
});

const PORT = process.env.PORT ?? 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
