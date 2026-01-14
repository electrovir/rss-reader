import type {FeedUrl} from '@rss-reader/common';
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const currentDir = dirname(fileURLToPath(import.meta.url));
const dataFilePath = join(currentDir, '..', 'data', 'feeds.json');

export function getFeedUrls(): FeedUrl[] {
    if (!existsSync(dataFilePath)) {
        return [];
    }

    const data = readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data) as FeedUrl[];
}

export function saveFeedUrls(feedUrls: FeedUrl[]): void {
    writeFileSync(dataFilePath, JSON.stringify(feedUrls, null, 4), 'utf-8');
}

export function addFeedUrl(feedUrl: FeedUrl): FeedUrl[] {
    const feedUrls = getFeedUrls();
    feedUrls.push(feedUrl);
    saveFeedUrls(feedUrls);
    return feedUrls;
}

export function removeFeedUrl(index: number): FeedUrl[] {
    const feedUrls = getFeedUrls();
    feedUrls.splice(index, 1);
    saveFeedUrls(feedUrls);
    return feedUrls;
}
