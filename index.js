const fetch = require('node-fetch')
const mojiTranslate = require('moji-translate')

const MAX_COUNTRY_LENGTH = 10;
const MAX_GOALS_LENGTH = 2;


function rpad( value, char, length ) {
  if ( typeof value === 'undefined' ) {
    return undefined;
  }
  return ( value + char.repeat( length ) ).substring(0, length);
}

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

function getCountryFlag( value ) {
  return mojiTranslate.translate( value.replace(/ /g, '_'), true );
}

function toConsoleOutput(match) {
  let homeFlag = getCountryFlag( match.home_team.country );
  if ( ! homeFlag ) {
    homeFlag = '  ';
  }
  const home = rpad( match.home_team.country, ' ', MAX_COUNTRY_LENGTH );
  const homeGoals = rpad( match.home_team.goals, ' ', MAX_GOALS_LENGTH );

  const awayFlag = getCountryFlag( match.away_team.country );
  const away = rpad( match.away_team.country, ' ', MAX_COUNTRY_LENGTH );
  const awayGoals = rpad( match.away_team.goals, ' ', MAX_GOALS_LENGTH );

  return `${homeFlag} ${home} ${homeGoals} x  ${awayGoals} ${away} ${awayFlag}`;
}

fetch('http://worldcup.sfg.io/matches')
  .then(status)
  .then(json)
  .then(matches => {
    matches
           .filter( isCompletedOrInProgress )
           .map( toConsoleOutput )
           .forEach( r => console.log( r ) );
  })
  .catch(error => console.log('Request failed', error))
