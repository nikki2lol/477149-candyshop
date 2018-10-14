'use strict';
// вспомогательный модуль
(function () {
  var DEBOUNCE_TIME = 500;
  var ESC_KEYCODE = 27;
  var orderFormElement = document.querySelector('.buy form');
  var orderFormInputElements = orderFormElement.querySelectorAll('input');
  var orderSubmitElement = orderFormElement.querySelector('.buy__submit-btn');

  window.utils = {
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
    },
    showPopup: function (popup) {
      var btnClose = popup.querySelector('.modal__close');

      var onPopupEscPress = function (evt) {
        if (evt.keyCode === ESC_KEYCODE) {
          popup.classList.add('modal--hidden');
        }
      };

      var onClickCloseButton = function () {
        popup.classList.add('modal--hidden');
        document.removeEventListener('keydown', onPopupEscPress);
      };

      popup.classList.remove('modal--hidden');
      btnClose.addEventListener('click', onClickCloseButton);
      document.addEventListener('keydown', onPopupEscPress);
    },

    disableOrderForm: function (flag) {
      orderFormInputElements.forEach(function (element) {
        element.disabled = flag;
      });

      orderSubmitElement.disabled = flag;
    }
  };
})();
