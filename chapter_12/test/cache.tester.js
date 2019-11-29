import Cache from '../cache.js';
import { promises as fsPromises } from 'fs';

test('Adds a file to the cache', async () => {
    const cache = new Cache();
    const file = await fsPromises.readFile('./test/test_cache.txt');
    cache.add(file, '/local');
    const data = cache.get("/local");
    expect(data).toEqual(file);
})
