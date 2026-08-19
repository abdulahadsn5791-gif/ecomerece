import type { EmailVO } from '../../../core/domain/value-objects/email.vo';
import type { Id } from '../../../core/domain/value-objects/id.vo';
import { MongoRepository } from '../../../core/repository/mongo.repository';
import { ConcurrencyError, NotFoundError } from '../../../errors/app-error';
import type { IUserRepository } from '../domain/ports/i-user-repository';
import type { UserAggregate } from '../domain/user.aggregate';
import { UserMapper } from './user.mapper';
import { UserModel, type UserPersistence } from './user.models';

export class UserRepository extends MongoRepository<UserPersistence> implements IUserRepository {
    constructor() {
        super(UserModel);
    }
    async FindById(id: Id): Promise<UserAggregate | null> {
        const doc = await super.findById(id.value);
        if (!doc) return null;
        return UserMapper.persistenceToAggregate(doc);
    }

    async FindByIds(id: Id[]): Promise<UserAggregate[]> {
        const ids = id.map((value) => (value.value));
        const filter = {
            _id: { $in: ids }
        };

        const docs = await super.find(filter);
        return docs.map((value) => UserMapper.persistenceToAggregate(value));
    }

    async FindByEmail(email: EmailVO): Promise<UserAggregate | null> {
        const doc = await super.findOne({ email: email.value });
        if (!doc) return null;
        return UserMapper.persistenceToAggregate(doc);
    }

    async FindByIdOrThrow(id: Id): Promise<UserAggregate> {
        const doc = await super.findById(id.value);
        if (!doc) throw new NotFoundError('User not found with this Id');
        return UserMapper.persistenceToAggregate(doc);
    }
    async FindByEmailOrThrow(email: EmailVO): Promise<UserAggregate> {
        const doc = await super.findOne({ email: email.value });
        if (!doc) throw new NotFoundError('User not found with this email');
        return UserMapper.persistenceToAggregate(doc);
    }

    async Save(user: UserAggregate): Promise<void> {
        const data = UserMapper.aggregateToPersistence(user);

        const result = await UserModel.updateOne(
            { _id: user.id.value, version: user.version.value },
            {
                $set: data,
                $inc: { version: 1 },
            },
        );

        if (result.modifiedCount === 0) throw new ConcurrencyError();
    }

    async Delete(id: Id): Promise<void> {
        await super.findByIdAndDelete(id.value);
    }
    async Exists(id: Id): Promise<boolean> {
        return !!(await super.exists({
            _id: id.value,
        }));
    }
}
