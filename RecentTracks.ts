export interface RecentTracks {
    "@attr": Attr;   
    track:   Track[];
}

export interface Track {
    album:      Artist; 
    artist:     Artist; 
    date:       Date;   
    image:      Image[];
    mbid:       string; 
    name:       string; 
    streamable: string; 
    url:        string; 
}

export interface Image {
    "#text": string;
    size:    string;
}

export interface Date {
    "#text": string;
    uts:     string;
}

export interface Artist {
    "#text": string;
    mbid:    string;
}

export interface Attr {
    page:       string;
    perPage:    string;
    total:      string;
    totalPages: string;
    user:       string;
}

// Converts JSON strings to/from your types
export module RecentTracksConverter {
    export function toRecentTracks(json: string): RecentTracks {
        return JSON.parse(json);
    }

    export function recentTracksToJson(value: RecentTracks): string {
        return JSON.stringify(value, null, 2);
    }
}
