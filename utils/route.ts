import { HSLRoute, SingleRoute } from '@/types/routeTypes';

/**
 * Fetches detailed information for a single HSL transit route by ID
 * @param id - The route ID (without 'HSL:' prefix)
 * @returns Promise containing route data including patterns, stops and realtime information
 * @throws Error if the API request fails
 */
export async function fetchOneRoute(id: string): Promise<{ data: { route: SingleRoute } }> {
    const res = await fetch(process.env.NEXT_PUBLIC_DIGITRANSIT_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'digitransit-subscription-key': process.env.NEXT_PUBLIC_DIGITRANSIT_SUBSCRIPTION_KEY
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
                            code
                            directionId
                            stops {
                                name
                                code
                                lat
                                lon
                                away:stopTimesForPattern(id: "HSL:${id}:1:01") {
                                    arrivalDelay
                                    departureDelay
                                    headsign
                                    realtime
                                    realtimeArrival
                                    realtimeDeparture
                                    realtimeState
                                    scheduledArrival
                                    scheduledDeparture
                                    serviceDay
                                    stopPosition
                                }
                                return:stopTimesForPattern(id: "HSL:${id}:0:01") {
                                    arrivalDelay
                                    departureDelay
                                    headsign
                                    realtime
                                    realtimeArrival
                                    realtimeDeparture
                                    realtimeState
                                    scheduledArrival
                                    scheduledDeparture
                                    serviceDay
                                    stopPosition
                                }
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

/**
 * Fetches a list of HSL transit routes with optional filtering
 * @param routeName - Optional filter by route name/number
 * @param routeType - Optional filter by transport mode (BUS, TRAM, RAIL, SUBWAY, FERRY)
 * @returns Promise containing array of matching routes with basic information
 * @throws Error if the API request fails
 */
export async function fetchRoutes(routeName?: string, routeType?: string): Promise<{ data: { routes: HSLRoute[] } }> {
    const res = await fetch(process.env.NEXT_PUBLIC_DIGITRANSIT_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'digitransit-subscription-key': process.env.NEXT_PUBLIC_DIGITRANSIT_SUBSCRIPTION_KEY
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
        })
    });

    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return res.json();
}
