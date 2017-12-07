const { PORT = 3000 } = process.env
import * as http from "http"
import { RecentTracksConverter, RecentTracks, Track } from "./RecentTracks";
import * as requestPromise from 'request-promise-native';
import { resolve } from "url";
const LastfmAPI = require('lastfmapi')

require('dotenv').config({
    path: `${__dirname}/.env`,
})

http.createServer(async (req, res) => {
    try {
        var tracks = await getRecentTracks();
        let lastTrack = `${tracks[0].artist['#text']} - ${tracks[0].name}`;
        await updateSlackStatus(lastTrack);
        res.end(lastTrack);
    }
    catch (e) {
        res.end(e);
    }
}).listen(PORT);

async function getRecentTracks(): Promise<Track[]> {
    let lastfmApiWrapper = new LastfmAPI({
        api_key: process.env.LASTFM_KEY,
        secret: process.env.LASTFM_SECRET,
    });

    return new Promise<Track[]>(resolve => {
        lastfmApiWrapper.user.getRecentTracks({
            user: process.env.LASTFM_USERNAME
        }, (err: any, data: any) => {
            err ? resolve([]) : resolve(RecentTracksConverter.toRecentTracks(JSON.stringify(data)).track);
        });
    });
}

async function updateSlackStatus(lastTrack: string) {
    return Promise.all(process.env.SLACK_TOKEN.split(',').map(token => {
        return requestPromise.post('https://slack.com/api/users.profile.set', {
            form: {
                token: token,
                profile: JSON.stringify({
                    "status_text": lastTrack,
                    "status_emoji": ':musical_note:',
                })
            }
        }).then((resolve) => resolve())
    }));
}