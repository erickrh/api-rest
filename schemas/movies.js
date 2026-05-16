import  z from 'zod';

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'Title must be a string',
        required_error: 'Title is required'
    }),
    year: z.number().int().min(1888, 'Year must be greater than or equal to 1888').max(new Date().getFullYear(), `Year must be less than or equal to ${new Date().getFullYear()}`),
    director: z.string(),
    duration: z.number().int().positive(),
    poster: z.string().url({message: 'Poster must be a valid URL'}),
    genre: z.array(
        z.enum(['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Thriller', 'Western'], {
            required_error: 'Genre is required',
            invalid_type_error: 'Genre must be an array of strings'
        })
    ),
    rating : z.number().min(0).max(10).optional()
});

export function validateMovie(object) {
    return movieSchema.safeParse(object);
};

export function validatePartialMovie(object) {
    return movieSchema.partial().safeParse(object);
}