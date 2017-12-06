const http = require('http')
const { PORT = 3000 } = process.env

const LastfmAPI = require('lastfmapi')
const request = require('request-promise-native')

require('dotenv').config({
  path: `${__dirname}/.env`,
})

let lastfm = new LastfmAPI({
  api_key: process.env.LASTFM_KEY,
  secret: process.env.LASTFM_SECRET,
})
let username = process.env.LASTFM_USERNAME
let currentTracks = []

var promise = new Promise(function (resolve, reject) {
  lastfm.user.getRecentTracks({
    user: username,
  }, (err, data) => {

    if (err) {
      console.log(err)
      return
    }

    let track = data.track[0],
      info = `${track.artist['#text']} - ${track.name}`
    if (currentTracks.includes(info)) {
      return
    }

    currentTracks.unshift(info)
    if (currentTracks.length > 2) {
      currentTracks.pop()
    }

    Promise.all(process.env.SLACK_TOKEN.split(',').map(token => {
      return request.post('https://slack.com/api/users.profile.set', {
        form: {
          token: token,
          profile: JSON.stringify({
            "status_text": info,
            "status_emoji": ':musical_note:',
          })
        }
      })
    }))
      .then(() => {
        resolve(info)
      })
  })

})


http.createServer((req, res) => {
  promise.then(function (result) {
    res.end(result)
  }, function (err) {
    res.end(`An error occured`)
  });
}).listen(PORT)