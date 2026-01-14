import {startService} from '@rest-vir/run-service';
import {rssReaderServiceImplementation} from './service-implementation.js';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

await startService(rssReaderServiceImplementation, {
    port,
    workerCount: 1,
    host: '0.0.0.0',
});
