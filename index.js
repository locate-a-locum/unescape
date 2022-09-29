'use strict';

var extend = require('extend-shallow');
var regexCache = {};
var all;

const defaultCharSet = {
  '&quot;': '"',
  '&#34;': '"',

  '&apos;': '\'',
  '&#39;': '\'',

  '&amp;': '&',
  '&#38;': '&',

  '&nbsp;': '\u00a0',
  '&#160;': '\u00a0',

  '&plus;': '+',
  '&#43;': '+',

  '&commat;': '@',
  '&#64;': '@'
};

const urlCharSet = {
  ...defaultCharSet,

  '&equals;': '=',
  '&#61;': '='
};

const extrasCharSet = {
  '&cent;': '¢',
  '&#162;': '¢',

  '&copy;': '©',
  '&#169;': '©',

  '&euro;': '€',
  '&#8364;': '€',

  '&pound;': '£',
  '&#163;': '£',

  '&reg;': '®',
  '&#174;': '®',

  '&yen;': '¥',
  '&#165;': '¥',

  '&gt;': '>',
  '&#62;': '>',

  '&lt;': '<',
  '&#60;': '<'
};

const charSets = {
  default: defaultCharSet,
  extras: extrasCharSet,
  url: urlCharSet
};

// don't merge char sets unless "all" is explicitly called
Object.defineProperty(charSets, 'all', {
  get: function() {
    return all || (all = extend({}, charSets.default, charSets.extras, charSets.url));
  }
});

/**
 * Convert HTML entities to HTML characters.
 *
 * @param  {String} `str` String with HTML entities to un-escape.
 * @return {String}
 */
function unescape(str, type) {
  if (!isString(str)) {
    return '';
  }

  const chars = charSets[type || 'default'];
  const regex = toRegex(type, chars);
  return str.replace(regex, function(m) {
    return chars[m];
  });
}

function toRegex(type, chars) {
  if (regexCache[type]) {
    return regexCache[type];
  }

  const keys = Object.keys(chars).join('|');
  const regex = new RegExp('(?=(' + keys + '))\\1', 'g');
  regexCache[type] = regex;
  return regex;
}

/**
 * Returns true if str is a non-empty string
 */

function isString(str) {
  return str && typeof str === 'string';
}

/**
 * Expose charSets
 */

unescape.defaultChars = charSets.default;
unescape.extrasChars = charSets.extras;
unescape.urlChars = charSets.url;

// don't trip the "charSets" getter unless it's explicitly called
Object.defineProperty(unescape, 'all', {
  get: function() {
    return charSets.all;
  }
});

/**
 * Expose `unescape`
 */

module.exports = unescape;
