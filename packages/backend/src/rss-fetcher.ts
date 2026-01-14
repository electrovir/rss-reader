import type {FeedUrl, RssFeed, RssFeedItem} from '@rss-reader/common';
import {XMLParser} from 'fast-xml-parser';

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
});

function getStringValue(value: unknown, fallback: string): string {
    if (value == null) {
        return fallback;
    }
    if (typeof value === 'string') {
        return value;
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
    }
    return fallback;
}

function getAtomLink(link: unknown): string {
    if (typeof link === 'string') {
        return link;
    }
    if (link && typeof link === 'object') {
        const linkObj = link as Record<string, unknown>;
        // Atom links have href attribute
        if ('@_href' in linkObj) {
            return getStringValue(linkObj['@_href'], '');
        }
    }
    return '';
}

export async function fetchRssFeed(url: string, feedName: string): Promise<RssFeed> {
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'rss-reader/1.0',
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch RSS feed: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    const parsed = parser.parse(text);

    // Handle RSS format
    const channel = parsed.rss?.channel;
    if (channel) {
        const rawItems = Array.isArray(channel.item)
            ? channel.item
            : channel.item
              ? [channel.item]
              : [];

        const items: RssFeedItem[] = rawItems.map((item: Record<string, unknown>): RssFeedItem => {
            return {
                title: getStringValue(item.title, 'No title'),
                link: getStringValue(item.link, ''),
                description: getStringValue(item.description, ''),
                pubDate: getStringValue(item.pubDate, ''),
                feedName,
            };
        });

        return {
            title: getStringValue(channel.title, 'Unknown Feed'),
            link: getStringValue(channel.link, ''),
            description: getStringValue(channel.description, ''),
            items,
        };
    }

    // Handle Atom format (used by Reddit)
    const feed = parsed.feed;
    if (feed) {
        const rawEntries = Array.isArray(feed.entry)
            ? feed.entry
            : feed.entry
              ? [feed.entry]
              : [];

        const items: RssFeedItem[] = rawEntries.map(
            (entry: Record<string, unknown>): RssFeedItem => {
                return {
                    title: getStringValue(entry.title, 'No title'),
                    link: getAtomLink(entry.link),
                    description: getStringValue(entry.content ?? entry.summary, ''),
                    pubDate: getStringValue(entry.published ?? entry.updated, ''),
                    feedName,
                };
            },
        );

        return {
            title: getStringValue(feed.title, 'Unknown Feed'),
            link: getAtomLink(feed.link),
            description: getStringValue(feed.subtitle, ''),
            items,
        };
    }

    throw new Error('Invalid feed: neither RSS nor Atom format detected');
}

export async function fetchAllFeeds(feedUrls: ReadonlyArray<FeedUrl>): Promise<RssFeedItem[]> {
    const results = await Promise.allSettled(
        feedUrls.map(async (feed) => fetchRssFeed(feed.url, feed.name)),
    );

    const allItems: RssFeedItem[] = [];

    for (const result of results) {
        if (result.status === 'fulfilled') {
            allItems.push(...result.value.items);
        } else {
            console.error('Failed to fetch feed:', result.reason);
        }
    }

    return allItems.sort((a, b) => {
        const dateA = new Date(a.pubDate).getTime();
        const dateB = new Date(b.pubDate).getTime();
        return dateB - dateA;
    });
}
