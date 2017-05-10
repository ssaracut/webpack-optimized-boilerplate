const testImage = require('../../www/images/spinner-small.gif');

module.exports = function main() {
  console.log('VERSION is: ' + VERSION);
  console.log('API_URL is: ' + API_URL);
  console.log('PORT is: ' + PORT);
  const element = document.createElement('h1');
  element.className = 'pure-button';
  element.innerHTML = 'Hello World!';
  return element;
};
