module.exports.get = function(k) {
  try {
    return JSON.parse(localStorage.getItem(k));
  }
  catch(e) {
    return null;
  }
};

module.exports.set = function(k, v) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  }
  catch(e) {
    return null;
  }
};
