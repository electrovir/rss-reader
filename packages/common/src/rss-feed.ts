export type RssFeedItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
    feedName: string;
};

export type RssFeed = {
    title: string;
    link: string;
    description: string;
    items: RssFeedItem[];
};

export type FeedUrl = {
    url: string;
    name: string;
};
