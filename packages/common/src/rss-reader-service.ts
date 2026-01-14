import {AnyOrigin, defineService, HttpMethod} from '@rest-vir/define-service';
import type {FeedUrl, RssFeedItem} from './rss-feed.js';

const defaultPort = 3001;

function getServiceOrigin(): string {
    // In browser, use window.location.hostname so it works from any device
    if (typeof window !== 'undefined') {
        return `http://${window.location.hostname}:${defaultPort}`;
    }
    // Node.js backend
    if (typeof process !== 'undefined' && process.env.PORT) {
        return `http://localhost:${process.env.PORT}`;
    }
    return `http://localhost:${defaultPort}`;
}

export const rssReaderService = defineService({
    serviceName: 'rss-reader',
    serviceOrigin: getServiceOrigin(),
    requiredClientOrigin: AnyOrigin,
    endpoints: {
        '/api/feeds': {
            requestDataShape: undefined,
            responseDataShape: [
                {
                    url: '',
                    name: '',
                },
            ] as FeedUrl[],
            methods: {
                [HttpMethod.Get]: true,
            },
        },
        '/api/feeds/add': {
            requestDataShape: {
                url: '',
                name: '',
            } as FeedUrl,
            responseDataShape: [
                {
                    url: '',
                    name: '',
                },
            ] as FeedUrl[],
            methods: {
                [HttpMethod.Post]: true,
            },
        },
        '/api/feeds/update': {
            requestDataShape: [
                {
                    url: '',
                    name: '',
                },
            ] as FeedUrl[],
            responseDataShape: [
                {
                    url: '',
                    name: '',
                },
            ] as FeedUrl[],
            methods: {
                [HttpMethod.Put]: true,
            },
        },
        '/api/feeds/delete/:index': {
            requestDataShape: undefined,
            responseDataShape: [
                {
                    url: '',
                    name: '',
                },
            ] as FeedUrl[],
            methods: {
                [HttpMethod.Delete]: true,
            },
        },
        '/api/items': {
            requestDataShape: undefined,
            responseDataShape: [
                {
                    title: '',
                    link: '',
                    description: '',
                    pubDate: '',
                    feedName: '',
                },
            ] as RssFeedItem[],
            methods: {
                [HttpMethod.Get]: true,
            },
        },
    },
});
