import cache from 'memory-cache';

export async function wrapWithCache(func, name, timeout, caching = true) {
    let result = caching ? cache.get(name) : null;
    if (result)
        return result;
    result = await func();
    if (caching) {
        cache.put(name, result, timeout);
    }
    return result;
}