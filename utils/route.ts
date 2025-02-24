import { HSLRoute, SingleRoute } from "../types/routeTypes";

export async function fetchOneRoute(id: string): Promise<{ data: { route: SingleRoute } }> {
    const res = await fetch(process.env.NEXT_PUBLIC_DIGITRANSIT_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'digitransit-subscription-key': process.env.NEXT_PUBLIC_DIGITRANSIT_SUBSCRIPTION_KEY,
        },
        body: JSON.stringify({
            query: `
                query {
                    route(id: "HSL:${id}") {
                        gtfsId
                        longName
                        shortName
                        mode
                        patterns {
                            name
                            stops {
                                name
                                code
                                lat
                                lon
                            }
                        }
                    }
                }
                `
        })
    });

    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return res.json();
}

export async function fetchRoutes(routeName?: string, routeType?: string): Promise<{ data: { routes: HSLRoute[] } }> {
    const res = await fetch(process.env.NEXT_PUBLIC_DIGITRANSIT_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'digitransit-subscription-key': process.env.NEXT_PUBLIC_DIGITRANSIT_SUBSCRIPTION_KEY,
        },
        body: JSON.stringify({
            query: `
                query {
                    routes(name: "${routeName}"${routeType ? `, transportModes: [${routeType}]` : ''}) {
                        gtfsId
                        longName
                        shortName
                        mode
                    }
                }
            `
        }),
    });

    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return res.json();
}
