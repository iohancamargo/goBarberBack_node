import Redis, { Redis as ReadisClient } from 'ioredis';
import cacheConfig from '@config/cache';
import ICacheProvider from '../models/ICacheProvider';

export default class RedisCacheProvider implements ICacheProvider {
    private client: ReadisClient;

    constructor() {
        this.client = new Redis(cacheConfig.config.redis);
    }

    public async save(key: string, value: string): Promise<void> {
        await this.client.set(key, JSON.stringify(value));
    }

    public async recover(key: string): Promise<string | null> {
        const data = await this.client.get(key);
        return data;
    }

    public async invalidate(key: string): Promise<void> {
        //
    }
}