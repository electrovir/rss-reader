import {fetchEndpoint} from '@rest-vir/define-service';
import type {FeedUrl, RssFeedItem} from '@rss-reader/common';
import {rssReaderService} from '@rss-reader/common';

declare const VITE_BACKEND_PORT: number | undefined;

function getBackendPort(): number | undefined {
    if (typeof VITE_BACKEND_PORT !== 'undefined') {
        return VITE_BACKEND_PORT;
    }
    return undefined;
}

function getServiceOrigin(): string {
    const backendPort = getBackendPort() ?? 3001;
    return `http://${window.location.hostname}:${backendPort}`;
}

function createServiceWithOrigin() {
    const origin = getServiceOrigin();
    // Create a new service object with updated serviceOrigin on all endpoints
    const endpoints = Object.fromEntries(
        Object.entries(rssReaderService.endpoints).map(
            ([
                key,
                endpoint,
            ]) => [
                key,
                {
                    ...endpoint,
                    serviceOrigin: origin,
                },
            ],
        ),
    ) as unknown as typeof rssReaderService.endpoints;

    return {
        ...rssReaderService,
        serviceOrigin: origin,
        endpoints,
    };
}

const service = createServiceWithOrigin();

export async function fetchFeedUrls(): Promise<FeedUrl[]> {
    const result = await fetchEndpoint(service.endpoints['/api/feeds'], {});
    if (!result.ok) {
        throw new Error('Failed to fetch feed URLs');
    }
    return result.data;
}

export async function addFeedUrl(feedUrl: FeedUrl): Promise<FeedUrl[]> {
    const result = await fetchEndpoint(service.endpoints['/api/feeds/add'], {
        requestData: feedUrl,
    });
    if (!result.ok) {
        throw new Error('Failed to add feed URL');
    }
    return result.data;
}

export async function updateFeedUrls(feedUrls: FeedUrl[]): Promise<FeedUrl[]> {
    const result = await fetchEndpoint(service.endpoints['/api/feeds/update'], {
        requestData: feedUrls,
    });
    if (!result.ok) {
        throw new Error('Failed to update feed URLs');
    }
    return result.data;
}

export async function deleteFeedUrl(index: number): Promise<FeedUrl[]> {
    const result = await fetchEndpoint(service.endpoints['/api/feeds/delete/:index'], {
        pathParams: {index: String(index)},
    });
    if (!result.ok) {
        throw new Error('Failed to delete feed URL');
    }
    return result.data;
}

export async function fetchFeedItems(): Promise<RssFeedItem[]> {
    const result = await fetchEndpoint(service.endpoints['/api/items'], {});
    if (!result.ok) {
        throw new Error('Failed to fetch feed items');
    }
    return result.data;
}
