import type {FeedUrl, RssFeedItem} from '@rss-reader/common';
import {css, defineElement, defineElementEvent, html, listen} from 'element-vir';
import {ExternalLink24Icon, LoaderAnimated24Icon, Options24Icon, ViraButton, ViraIcon} from 'vira';

export const VirReaderPage = defineElement<{
    feedUrls: ReadonlyArray<FeedUrl>;
    feedItems: ReadonlyArray<RssFeedItem>;
    isLoading: boolean;
}>()({
    tagName: 'vir-reader-page',
    events: {
        navigateToSettings: defineElementEvent<void>(),
        refresh: defineElementEvent<void>(),
    },
    styles: css`
        :host {
            display: flex;
            flex-direction: column;
            height: 100%;
            font-family: sans-serif;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 32px;
            border-bottom: 1px solid #e0e0e0;
            background: #f9f9f9;
        }

        h1 {
            margin: 0;
            font-size: 24px;
        }

        .header-actions {
            display: flex;
            gap: 8px;
        }

        .feed-container {
            flex: 1;
            overflow-y: auto;
            padding: 16px 32px;
        }

        .feed-item {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 16px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            margin-bottom: 12px;
            background: white;
            transition: box-shadow 0.2s;
        }

        .feed-item:hover {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .feed-item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 12px;
        }

        .feed-item-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            text-decoration: none;
            flex: 1;
        }

        .feed-item-title:hover {
            color: #0a89ff;
        }

        .feed-item-meta {
            display: flex;
            gap: 16px;
            font-size: 12px;
            color: #666;
        }

        .feed-item-source {
            font-weight: bold;
            color: #0a89ff;
        }

        .feed-item-description {
            color: #555;
            line-height: 1.5;
            max-height: 4.5em;
            overflow: hidden;
        }

        .external-link {
            color: #666;
            display: flex;
            align-items: center;
            flex-shrink: 0;
        }

        .external-link:hover {
            color: #0a89ff;
        }

        .empty-state {
            text-align: center;
            padding: 64px 32px;
            color: #666;
        }

        .empty-state h2 {
            margin-bottom: 16px;
        }

        .loading-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 64px;
            gap: 16px;
            color: #666;
        }
    `,
    render({inputs, dispatch, events}) {
        const formatDate = (dateStr: string) => {
            if (!dateStr) {
                return '';
            }
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) {
                return dateStr;
            }
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        };

        const stripHtml = (html: string) => {
            const div = document.createElement('div');
            div.innerHTML = html;
            return div.textContent || div.innerText || '';
        };

        let contentTemplate;

        if (inputs.feedUrls.length === 0) {
            contentTemplate = html`
                <div class="empty-state">
                    <h2>Welcome to RSS Reader</h2>
                    <p>You haven't added any RSS feeds yet.</p>
                    <${ViraButton.assign({text: 'Add Feeds'})}
                        ${listen('click', () => dispatch(new events.navigateToSettings()))}
                    ></${ViraButton}>
                </div>
            `;
        } else if (inputs.isLoading) {
            contentTemplate = html`
                <div class="loading-state">
                    <${ViraIcon.assign({icon: LoaderAnimated24Icon})}></${ViraIcon}>
                    <span>Loading feeds...</span>
                </div>
            `;
        } else if (inputs.feedItems.length === 0) {
            contentTemplate = html`
                <div class="empty-state">
                    <h2>No items found</h2>
                    <p>
                        Could not load any items from your feeds. Check your feed URLs in settings.
                    </p>
                    <${ViraButton.assign({text: 'Refresh'})}
                        ${listen('click', () => dispatch(new events.refresh()))}
                    ></${ViraButton}>
                </div>
            `;
        } else {
            contentTemplate = html`
                <div class="feed-container">
                    ${inputs.feedItems.map(
                        (item) => html`
                            <article class="feed-item">
                                <div class="feed-item-header">
                                    <a
                                        class="feed-item-title"
                                        href=${item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        ${item.title}
                                    </a>
                                    <a
                                        class="external-link"
                                        href=${item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Open in new tab"
                                    >
                                        <${ViraIcon.assign({
                                            icon: ExternalLink24Icon,
                                        })}></${ViraIcon}>
                                    </a>
                                </div>
                                <div class="feed-item-meta">
                                    <span class="feed-item-source">${item.feedName}</span>
                                    <span>${formatDate(item.pubDate)}</span>
                                </div>
                                <div class="feed-item-description">
                                    ${stripHtml(item.description)}
                                </div>
                            </article>
                        `,
                    )}
                </div>
            `;
        }

        return html`
            <header class="header">
                <h1>RSS Reader</h1>
                <div class="header-actions">
                    <${ViraButton.assign({
                        text: 'Refresh',
                        disabled: inputs.isLoading || inputs.feedUrls.length === 0,
                    })}
                        ${listen('click', () => dispatch(new events.refresh()))}
                    ></${ViraButton}>
                    <${ViraButton.assign({icon: Options24Icon, text: 'Settings'})}
                        ${listen('click', () => dispatch(new events.navigateToSettings()))}
                    ></${ViraButton}>
                </div>
            </header>
            ${contentTemplate}
        `;
    },
});
