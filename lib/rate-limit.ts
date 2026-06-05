import { Redis } from "@upstash/redis";

let redis: Redis | null | undefined;

function getRedis(): Redis | null {
  if (redis !== undefined) return redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    try {
      redis = new Redis({ url, token });
    } catch {
      redis = null;
    }
  } else {
    redis = null;
  }

  return redis;
}

const store = new Map<string, { count: number; expiresAt: number }>();

export async function rateLimitByKey(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ success: boolean; remaining: number }> {
  const client = getRedis();

  if (client) {
    try {
      const count = await client.incr(key);
      if (count === 1) {
        await client.pexpire(key, windowMs);
      }
      if (count > limit) {
        return { success: false, remaining: 0 };
      }
      return { success: true, remaining: limit - count };
    } catch {
      // Redis error, fall through to in-memory
    }
  }

  const now = Date.now();
  const record = store.get(key);

  if (!record || now > record.expiresAt) {
    store.set(key, { count: 1, expiresAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }

  record.count++;
  return { success: true, remaining: limit - record.count };
}
