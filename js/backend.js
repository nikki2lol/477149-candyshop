'use strict';
// модуль, который экспортирует в глобальную область видимости функции для взаимодействия с удаленным севером через XHR
(function () {
  var GET_URL = 'https://js.dump.academy/candyshop/data';
  var SUBMIT_URL = 'https://js.dump.academy/candyshop';
  var METHOD_GET = 'GET';
  var METHOD_POST = 'POST';
  var STATUS_SUCCESS = 200;
  var STATUS_NOT_FOUND = 404;
  var STATUS_SERVER_ERROR = 500;
  var TIMEOUT_TIME = 10000;

  var makeRequest = function (successEvent, errorEvent, requestType, URL, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case STATUS_SUCCESS:
          successEvent(xhr.response);
          break;

        case STATUS_NOT_FOUND:
          error = 'Ничего не найдено';
          break;

        case STATUS_SERVER_ERROR:
          error = 'Сервер не отвечает';
          break;

        default:
          error = 'Cтатус ответа: : ' + xhr.status + ' ' + xhr.statusText;
      }
      if (error) {
        xhr(error);
      }
    });
    xhr.addEventListener('error', function () {
      errorEvent('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      errorEvent('Запрос не успел выполниться за ' + TIMEOUT_TIME + 'мс');
    });
    xhr.open(requestType, URL);
    xhr.send(data);
  };

  window.load = function (onSuccess, onError) {
    makeRequest(onSuccess, onError, METHOD_GET, GET_URL, null);
  };

  window.upload = function (onSuccess, onError, data) {
    makeRequest(onSuccess, onError, METHOD_POST, SUBMIT_URL, data);
  };

  window.showErrorPopup = function () {
    var succesPopupElement = document.querySelector('#modal-error');
    var btnClose = succesPopupElement.querySelector('.modal__close');
    // var errorNumberElement = succesPopupElement.querySelector('.moda__message--error');

    var onClickCloseButton = function () {
      succesPopupElement.classList.add('modal--hidden');
    };
    // errorNumberElement.textContent = 'Код ошибки: ' + xhr.status + '.';
    succesPopupElement.classList.remove('modal--hidden');

    btnClose.addEventListener('click', onClickCloseButton);
  };

  window.showSuccessPopup = function () {
    // console.log('grats');
    var succesPopupElement = document.querySelector('#modal-success');
    var btnClose = succesPopupElement.querySelector('.modal__close');

    var onClickCloseButton = function () {
      succesPopupElement.classList.add('modal--hidden');
    };

    succesPopupElement.classList.remove('modal--hidden');
    btnClose.addEventListener('click', onClickCloseButton);
  };
})();
