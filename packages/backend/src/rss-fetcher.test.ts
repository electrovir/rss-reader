import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import {fetchRssFeed} from './rss-fetcher.js';

describe('fetchRssFeed', () => {
    it('fetches Reddit Atom feed', async () => {
        const feed = await fetchRssFeed(
            'https://www.reddit.com/r/simracing/top.rss?t=week',
            'simracing',
        );

        assert.ok(feed.title, 'Feed should have a title');
        assert.ok(feed.items.length > 0, 'Feed should have items');
        assert.ok(feed.items[0]!.title, 'First item should have a title');
        assert.ok(feed.items[0]!.link, 'First item should have a link');
        assert.equal(feed.items[0]!.feedName, 'simracing');
    });

    it('fetches standard RSS feed', async () => {
        // Using a known RSS 2.0 feed
        const feed = await fetchRssFeed(
            'https://hnrss.org/frontpage',
            'hackernews',
        );

        assert.ok(feed.title, 'Feed should have a title');
        assert.ok(feed.items.length > 0, 'Feed should have items');
        assert.ok(feed.items[0]!.title, 'First item should have a title');
    });
});
