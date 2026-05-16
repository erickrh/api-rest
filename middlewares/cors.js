import cors from 'cors';

const ACCEPTED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:8080',
    'http://localhost:1234'
];

export const corsMiddleware = (options = {}) => {
    const acceptedOrigins = options.acceptedOrigins ?? ACCEPTED_ORIGINS;

    return cors({
        origin: (origin, callback) => {
            if (acceptedOrigins.includes(origin) || !origin) {
                return callback(null, true);
            }

            return callback(new Error('Not allowed by CORS'));
        }
    });
};
