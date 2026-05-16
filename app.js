import express, { json } from 'express';
import { moviesRouter } from './routes/movies.js';
import { corsMiddleware } from './middlewares/cors.js';

const app = express();
app.use(json());
app.use(corsMiddleware());
app.disable('x-powered-by');

app.get('/', (req, res) => {
    res.json({
        message: 'REST API is running',
        endpoints: {
            movies: '/movies'
        }
    });
});

app.use('/movies', moviesRouter);

const PORT = process.env.PORT ?? 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
