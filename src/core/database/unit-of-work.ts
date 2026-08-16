import mongoose, { type ClientSession } from 'mongoose';
import { transactionContext } from './transaction-context';

export class UnitOfWork {
    async transaction<T>(callback: () => Promise<T>, retries = 3): Promise<T> {
        const existingSession = transactionContext.getStore()?.session;

        if (existingSession) {
            return callback();
        }

        let lastError: unknown;

        for (let attempt = 1; attempt <= retries; attempt++) {
            const session = await mongoose.startSession();

            try {
                session.startTransaction();

                const result = await transactionContext.run({ session }, async () => callback());

                await session.commitTransaction();

                return result;
            } catch (error: any) {
                lastError = error;

                await session.abortTransaction();

                const transient = error?.errorLabels?.includes('TransientTransactionError');

                if (!transient || attempt === retries) {
                    throw error;
                }
            } finally {
                await session.endSession();
            }
        }

        throw lastError;
    }

    getSession(): ClientSession {
        const session = transactionContext.getStore()?.session;

        if (!session) {
            throw new Error('No active transaction');
        }

        return session;
    }

    isInTransaction() {
        return !!transactionContext.getStore();
    }
}
