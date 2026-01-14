import type {FeedUrl, RssFeedItem} from '@rss-reader/common';
import {asyncProp, css, defineElement, html, listen, renderAsync} from 'element-vir';
import {LoaderAnimated24Icon, ViraIcon} from 'vira';
import {deleteFeedUrl, fetchFeedItems, fetchFeedUrls, updateFeedUrls} from '../../api-client.js';
import {AppRoute, appRouter, type AppFullRoute} from '../../app-router.js';
import {VirReaderPage} from './vir-reader-page.element.js';
import {VirSettingsPage} from './vir-settings-page.element.js';

export const VirApp = defineElement()({
    tagName: 'vir-app',
    styles: css`
        :host {
            display: flex;
            flex-direction: column;
            font-family: sans-serif;
            height: 100%;
            width: 100%;
        }

        .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
        }
    `,
    state() {
        return {
            currentRoute: appRouter.readCurrentRoute() as AppFullRoute,
            feedUrls: asyncProp({
                defaultValue: fetchFeedUrls(),
            }),
            feedItems: [] as RssFeedItem[],
            isLoadingFeeds: false,
            hasLoadedFeeds: false,
        };
    },
    init({updateState}) {
        appRouter.listen(true, (route) => {
            updateState({currentRoute: route as AppFullRoute});
        });
    },
    render({state, updateState}) {
        const loadFeeds = async () => {
            updateState({isLoadingFeeds: true});
            try {
                const items = await fetchFeedItems();
                updateState({feedItems: items, isLoadingFeeds: false, hasLoadedFeeds: true});
            } catch {
                updateState({isLoadingFeeds: false, hasLoadedFeeds: true});
            }
        };

        return renderAsync(
            state.feedUrls,
            html`
                <div class="loading">
                    <${ViraIcon.assign({icon: LoaderAnimated24Icon})}></${ViraIcon}>
                </div>
            `,
            (feedUrls) => {
                if (
                    state.currentRoute.paths[0] === AppRoute.Reader &&
                    !state.hasLoadedFeeds &&
                    feedUrls.length > 0 &&
                    !state.isLoadingFeeds
                ) {
                    void loadFeeds();
                }

                if (state.currentRoute.paths[0] === AppRoute.Settings) {
                    return html`
                        <${VirSettingsPage.assign({feedUrls})}
                            ${listen(VirSettingsPage.events.feedUrlsChange, async (event) => {
                                const newFeedUrls = await updateFeedUrls(event.detail as FeedUrl[]);
                                state.feedUrls.setValue(newFeedUrls);
                            })}
                            ${listen(VirSettingsPage.events.deleteFeed, async (event) => {
                                const newFeedUrls = await deleteFeedUrl(event.detail);
                                state.feedUrls.setValue(newFeedUrls);
                            })}
                            ${listen(VirSettingsPage.events.navigateToReader, () => {
                                appRouter.setRoute({paths: [AppRoute.Reader]});
                                updateState({hasLoadedFeeds: false});
                                void loadFeeds();
                            })}
                        ></${VirSettingsPage}>
                    `;
                }

                return html`
                    <${VirReaderPage.assign({
                        feedUrls,
                        feedItems: state.feedItems,
                        isLoading: state.isLoadingFeeds,
                    })}
                        ${listen(VirReaderPage.events.navigateToSettings, () => {
                            appRouter.setRoute({paths: [AppRoute.Settings]});
                        })}
                        ${listen(VirReaderPage.events.refresh, () => {
                            updateState({hasLoadedFeeds: false});
                            void loadFeeds();
                        })}
                    ></${VirReaderPage}>
                `;
            },
        );
    },
});
