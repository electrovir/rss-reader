import {type FullSpaRoute, SpaRouter} from 'spa-router-vir';

export enum AppRoute {
    Reader = 'reader',
    Settings = 'settings',
}

export type ValidRouterPaths = [AppRoute.Reader] | [AppRoute.Settings];

export type AppFullRoute = Readonly<FullSpaRoute<ValidRouterPaths, undefined, undefined>>;

function sanitizePaths(rawRoute: Readonly<Pick<FullSpaRoute, 'paths'>>): ValidRouterPaths {
    const topLevelPath = rawRoute.paths[0];

    if (topLevelPath === AppRoute.Settings) {
        return [AppRoute.Settings];
    } else {
        return [AppRoute.Reader];
    }
}

export const appRouter = new SpaRouter<ValidRouterPaths, undefined, undefined>({
    sanitizeRoute(rawRoute) {
        return {
            paths: sanitizePaths(rawRoute),
            search: undefined,
            hash: undefined,
        };
    },
});
