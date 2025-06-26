
const store = {};

function set(shortcode, data) {
  store[shortcode] = data;
}

function get(shortcode) {
  return store[shortcode];
}

function exists(shortcode) {
  return !!store[shortcode];
}

module.exports = { set, get, exists };
