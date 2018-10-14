'use strict';
// устранение дребезга
(function () {
  var DEBOUNCE_TIME = 500; // ms

  window.debounce = {
    debounce: function (fun) {
      var lastTimeout = null;

      return function () {
        var args = arguments;
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(function () {
          fun.apply(null, args);
        }, DEBOUNCE_TIME);
      };
    }
  };
})();
