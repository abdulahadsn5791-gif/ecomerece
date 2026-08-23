import type { IEventHandler } from '@ecomerece/domain/events/event-bus.interface';
import type { UserSignedInEvent } from '@ecomerece/domain';

export class UserSignedInHandler implements IEventHandler<UserSignedInEvent['payload']> {
    async handle(event: UserSignedInEvent) {
        console.log('User signed in:', event.payload);
    }
}
