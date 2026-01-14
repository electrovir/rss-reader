import type {FeedUrl} from '@rss-reader/common';
import {css, defineElement, defineElementEvent, html, listen} from 'element-vir';
import {CloseX24Icon, ViraButton, ViraIcon, ViraInput} from 'vira';

export const VirSettingsPage = defineElement<{
    feedUrls: ReadonlyArray<FeedUrl>;
}>()({
    tagName: 'vir-settings-page',
    events: {
        feedUrlsChange: defineElementEvent<ReadonlyArray<FeedUrl>>(),
        deleteFeed: defineElementEvent<number>(),
        navigateToReader: defineElementEvent<void>(),
    },
    state() {
        return {
            newFeedName: '',
            newFeedUrl: '',
        };
    },
    styles: css`
        :host {
            display: flex;
            flex-direction: column;
            gap: 24px;
            padding: 32px;
            max-width: 800px;
            margin: 0 auto;
        }

        h1 {
            margin: 0;
            font-size: 24px;
        }

        .add-feed-form {
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 16px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            background: #f9f9f9;
        }

        .form-row {
            display: flex;
            gap: 12px;
            align-items: flex-end;
        }

        .feed-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .feed-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            background: white;
        }

        .feed-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
            flex: 1;
            min-width: 0;
        }

        .feed-name {
            font-weight: bold;
        }

        .feed-url {
            font-size: 12px;
            color: #666;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .delete-button {
            cursor: pointer;
            color: #999;
            transition: color 0.2s;
            background: none;
            border: none;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .delete-button:hover {
            color: #ff4444;
        }

        .empty-state {
            text-align: center;
            padding: 32px;
            color: #666;
        }

        ${ViraInput} {
            flex: 1;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    `,
    render({inputs, state, updateState, dispatch, events}) {
        const handleAddFeed = () => {
            if (!state.newFeedName.trim() || !state.newFeedUrl.trim()) {
                return;
            }

            const newFeed: FeedUrl = {
                name: state.newFeedName.trim(),
                url: state.newFeedUrl.trim(),
            };

            dispatch(
                new events.feedUrlsChange([
                    ...inputs.feedUrls,
                    newFeed,
                ]),
            );
            updateState({newFeedName: '', newFeedUrl: ''});
        };

        const feedListTemplate =
            inputs.feedUrls.length > 0
                ? html`
                      <div class="feed-list">
                          ${inputs.feedUrls.map(
                              (feed, index) => html`
                                  <div class="feed-item">
                                      <div class="feed-info">
                                          <span class="feed-name">${feed.name}</span>
                                          <span class="feed-url">${feed.url}</span>
                                      </div>
                                      <button
                                          class="delete-button"
                                          title="Remove feed"
                                          ${listen('click', () => {
                                              dispatch(new events.deleteFeed(index));
                                          })}
                                      >
                                          <${ViraIcon.assign({icon: CloseX24Icon})}></${ViraIcon}>
                                      </button>
                                  </div>
                              `,
                          )}
                      </div>
                  `
                : html`
                      <div class="empty-state">
                          No RSS feeds configured yet. Add your first feed above!
                      </div>
                  `;

        return html`
            <div class="header">
                <h1>RSS Feed Settings</h1>
                <${ViraButton.assign({text: 'Back to Reader'})}
                    ${listen('click', () => {
                        dispatch(new events.navigateToReader());
                    })}
                ></${ViraButton}>
            </div>

            <div class="add-feed-form">
                <h3 style="margin: 0;">Add New Feed</h3>
                <div class="form-row">
                    <${ViraInput.assign({
                        value: state.newFeedName,
                        placeholder: 'Feed name',
                        label: 'Name',
                    })}
                        ${listen(ViraInput.events.valueChange, (event) => {
                            updateState({newFeedName: event.detail});
                        })}
                    ></${ViraInput}>
                    <${ViraInput.assign({
                        value: state.newFeedUrl,
                        placeholder: 'https://example.com/rss',
                        label: 'URL',
                    })}
                        ${listen(ViraInput.events.valueChange, (event) => {
                            updateState({newFeedUrl: event.detail});
                        })}
                    ></${ViraInput}>
                </div>
                <${ViraButton.assign({
                    text: 'Add Feed',
                    disabled: !state.newFeedName.trim() || !state.newFeedUrl.trim(),
                })}
                    ${listen('click', handleAddFeed)}
                ></${ViraButton}>
            </div>

            <h2 style="margin: 0;">Your Feeds</h2>
            ${feedListTemplate}
        `;
    },
});
