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
    stops: Stop[];
}

export interface Stop {
    name: string;
    code: string;
    lat: number;
    lon: number;    
}