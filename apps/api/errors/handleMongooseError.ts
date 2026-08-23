import mongoose from 'mongoose';
import { BadRequestError, ConflictError } from './app-error';

export function handleMongooseError(err: any): Error {
    if (err instanceof mongoose.Error.ValidationError) {
        const messages = Object.values(err.errors).map((e) => e.message);
        return new BadRequestError(messages.join(', '));
    }

    if (err instanceof mongoose.Error.CastError) {
        return new BadRequestError('Invalid ID format');
    }

    if (err?.code === 11000) {
        const field = Object.keys(err.keyPattern || {})[0];
        return new ConflictError(`${field} already exists`);
    }

    return err;
}
