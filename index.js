const fetch = require('node-fetch')

function status (response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

function json (response) {
  return response.json()
}

fetch('http://worldcup.sfg.io/matches')
  .then(status)
  .then(json)
  .then(matches => {
    matches.map(match => {
      if (match.status == 'completed' || match.status == 'in progress')
        console.log(`${match.home_team.country} ${match.home_team.goals} x ${match.away_team.goals} ${match.away_team.country}`)
    })
  })
  .catch(error => console.log('Request failed', error))
