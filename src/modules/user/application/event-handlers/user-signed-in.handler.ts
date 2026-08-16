import type { IEventHandler } from '../../../../core/domain/events/event-bus.interface';
import type { UserSignedInEvent } from '../../domain/events/user-signed-in.event';

export class UserSignedInHandler implements IEventHandler<UserSignedInEvent['payload']> {
    async handle(event: UserSignedInEvent) {
        console.log('User signed in:', event.payload);
    }
}
