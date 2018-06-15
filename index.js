const fetch = require('node-fetch');
const translate = require('moji-translate');

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
        console.log(translate.translate(`${match.home_team.country}`.replace(/ /g,'_'), true) + ` ${match.home_team.country} ${match.home_team.goals} x ${match.away_team.goals} ${match.away_team.country} ` + translate.translate(`${match.away_team.country}`.replace(/ /g,'_'), true));
    })
  })
  .catch(error => console.log('Request failed', error))
