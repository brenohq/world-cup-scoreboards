const fetch = require('node-fetch')
const translate = require('moji-translate')

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

function isCompletedOrInProgress(match) {
    return match.status === 'completed' || match.status === 'in progress';
}

function buildResult(match) {
  return translate.translate(`${match.home_team.country}`.replace(/ /g, '_'), true) + ` ${match.home_team.country} ${match.home_team.goals} x ${match.away_team.goals} ${match.away_team.country} ` + translate.translate(`${match.away_team.country}`.replace(/ /g, '_'), true);
}

fetch('http://worldcup.sfg.io/matches')
  .then(status)
  .then(json)
  .then(matches => {
    matches.filter( isCompletedOrInProgress )
           .map( buildResult )
           .forEach( r => console.log( r ) );
  })
  .catch(error => console.log('Request failed', error))
