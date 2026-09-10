import type { IHomeRepository, HomeAggregate } from '@ecomerece/domain';
import type { Id } from '@ecomerece/domain/value-objects/id.vo';
import { MongoRepository } from '../../../core/repository/mongo.repository';
import { ConcurrencyError } from '../../../errors/app-error';
import { HomeMapper } from './home.mapper';
import { HomeModel, type HomePersistence } from './home.models';

export class HomeRepository extends MongoRepository<HomePersistence> implements IHomeRepository {
    constructor() { super(HomeModel); }

    async findById(id: Id): Promise<HomeAggregate | null> {
        const doc = await super.findById(id.value);
        return doc ? HomeMapper.persistenceToAggregate(doc) : null;
    }

    async save(home: HomeAggregate): Promise<void> {
        const data = HomeMapper.aggregateToPersistence(home);
        const result = await HomeModel.updateOne({ _id: home.id.value }, { $set: data, $inc: { version: 1 } });
        if (result.matchedCount === 0) throw new Error('Home aggregate not found');
        if (result.modifiedCount === 0) throw new ConcurrencyError('Home aggregate was modified by another process');
    }

    async create(home: HomeAggregate): Promise<void> {
        const doc = new HomeModel(HomeMapper.aggregateToPersistence(home));
        await super.create(doc);
    }
}