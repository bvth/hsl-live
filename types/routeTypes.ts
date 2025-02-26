export interface HSLRoute {
    gtfsId: string;
    shortName: string;
    longName: string;
    mode: string;
}

export interface SingleRoute extends HSLRoute {
    patterns: Pattern[];
}

export interface Pattern {
    name: string;
    directionId: number;
    stops: Stop[];
    avgDelay?: number;
}

export interface Stop {
    name: string;
    code: string;
    lat: number;
    lon: number;
    away: StopTime[]
    return: StopTime[]
}

export interface StopTime {
    arrivalDelay: number;
    departureDelay: number;
    headsign: string;
    realtime: boolean;
    realtimeArrival: number;
    realtimeDeparture: number;
    realtimeState: string;
    scheduledArrival: number;
    scheduledDeparture: number;
    serviceDay: number;
    stopPosition: number;
}
