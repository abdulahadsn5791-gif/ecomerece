import { getTimeWindows } from '@ecomerece/domain';
import { type EntityType, emptyMetrics, type Metrics } from '@ecomerece/shared';
import { statsRepository } from '../infrastructure/StatsRepository';

export class StatsQueryService {
  async getLifetimeStats(entityType: EntityType, entityId: string): Promise<Metrics> {
    const doc = await statsRepository.getEntityStats(entityType, entityId, 'lifetime');
    return doc?.metrics ?? emptyMetrics();
  }

  async getStatsForDate(entityType: EntityType, entityId: string, date: string): Promise<Metrics> {
    const doc = await statsRepository.getEntityStats(entityType, entityId, 'daily', {
      'dimensions.date': date,
    });
    return doc?.metrics ?? emptyMetrics();
  }

  async getToday(entityType: EntityType, entityId: string): Promise<Metrics> {
    const { date } = getTimeWindows(new Date());
    return this.getStatsForDate(entityType, entityId, date);
  }

  async getDailyTimeSeries(entityType: EntityType, entityId: string, from: string, to: string) {
    return statsRepository.getTimeSeries(entityType, entityId, 'daily', from, to);
  }

  async getWeeklyTimeSeries(entityType: EntityType, entityId: string, from: string, to: string) {
    return statsRepository.getTimeSeries(entityType, entityId, 'weekly', from, to);
  }

  async getMonthlyTimeSeries(entityType: EntityType, entityId: string, from: string, to: string) {
    return statsRepository.getTimeSeries(entityType, entityId, 'monthly', from, to);
  }

  async getTopByMetric(
    entityType: EntityType,
    aggregation: 'daily' | 'weekly' | 'monthly' | 'lifetime',
    metric: string,
    limit = 10,
  ) {
    return statsRepository.getTopEntities(entityType, aggregation, metric, limit);
  }
}

export const statsQueryService = new StatsQueryService();
