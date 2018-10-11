'use strict';
// модуль, который экспортирует в глобальную область видимости функции для взаимодействия с удаленным севером через XHR
(function () {
  var GET_URL = 'https://js.dump.academy/candyshop/data';
  var SUBMIT_URL = 'https://js.dump.academy/candyshop';
  var STATUS_SUCCESS = 200;
  var STATUS_NOT_FOUND = 404;
  var STATUS_SERVER_ERROR = 500;
  var TIMEOUT_TIME = 10000;

  var setupRequest = function (xhr, successCallback, errorCallback) {
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case STATUS_SUCCESS:
          successCallback(xhr.response);
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
      errorCallback('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      errorCallback('Запрос не успел выполниться за ' + TIMEOUT_TIME + 'мс');
    });

    xhr.timeout = TIMEOUT_TIME;
  };

  window.load = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    setupRequest(xhr, onSuccess, onError);
    xhr.open('GET', GET_URL);
    xhr.send();
  };

  window.upload = function (data, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    setupRequest(xhr, onSuccess, onError);
    xhr.open('POST', SUBMIT_URL);
    xhr.send(data);
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
    var succesPopupElement = document.querySelector('#modal-success');
    var btnClose = succesPopupElement.querySelector('.modal__close');

    var onClickCloseButton = function () {
      succesPopupElement.classList.add('modal--hidden');
    };

    succesPopupElement.classList.remove('modal--hidden');
    btnClose.addEventListener('click', onClickCloseButton);
  };
})();
