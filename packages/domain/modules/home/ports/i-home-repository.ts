import type { HomeAggregate } from '../home.aggregate';
import type { Id } from '../../../value-objects/id.vo';

export interface IHomeRepository {
    findById(id: Id): Promise<HomeAggregate | null>;
    Save(home: HomeAggregate): Promise<void>;
    create(home: HomeAggregate): Promise<void>;
}