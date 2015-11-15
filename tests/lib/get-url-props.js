var $ = require('jquery'),
    parseLocation = require('react-querystring-router').uri.parseLocation;

module.exports = function(element) {
  var href = $(element).attr('href');

  return parseLocation(href);
};
