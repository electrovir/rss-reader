import {rssReaderService} from '@rss-reader/common';
import {HttpStatus, implementService} from '@rest-vir/implement-service';
import {addFeedUrl, getFeedUrls, removeFeedUrl, saveFeedUrls} from './feed-storage.js';
import {fetchAllFeeds} from './rss-fetcher.js';

export const rssReaderServiceImplementation = implementService({
    service: rssReaderService,
})({
    endpoints: {
        '/api/feeds'() {
            return {
                statusCode: HttpStatus.Ok,
                responseData: getFeedUrls(),
            };
        },
        '/api/feeds/add'({requestData}) {
            if (!requestData.url || !requestData.name) {
                return {
                    statusCode: HttpStatus.BadRequest,
                };
            }
            const feedUrls = addFeedUrl(requestData);
            return {
                statusCode: HttpStatus.Ok,
                responseData: feedUrls,
            };
        },
        '/api/feeds/update'({requestData}) {
            saveFeedUrls(requestData);
            return {
                statusCode: HttpStatus.Ok,
                responseData: requestData,
            };
        },
        '/api/feeds/delete/:index'({pathParams}) {
            const index = parseInt(pathParams.index, 10);
            if (isNaN(index)) {
                return {
                    statusCode: HttpStatus.BadRequest,
                };
            }
            const feedUrls = removeFeedUrl(index);
            return {
                statusCode: HttpStatus.Ok,
                responseData: feedUrls,
            };
        },
        async '/api/items'() {
            const feedUrls = getFeedUrls();
            const items = await fetchAllFeeds(feedUrls);
            return {
                statusCode: HttpStatus.Ok,
                responseData: items,
            };
        },
    },
});
