'use strict';
// модуль, который экспортирует в глобальную область видимости функции для взаимодействия с удаленным севером через XHR
(function () {
  var GET_URL = 'https://js.dump.academy/candyshop/data';
  var SUBMIT_URL = 'https://js.dump.academy/candyshop';
  var STATUS_SUCCESS = 200;
  var STATUS_NOT_FOUND = 404;
  var STATUS_SERVER_ERROR = 500;
  var TIMEOUT_TIME = 10000;

  var makeRequest = function (request, successCallback, errorCallback) {

    request.addEventListener('load', function () {
      var error;
      switch (request.status) {
        case STATUS_SUCCESS:
          successCallback(request.response);
          break;

        case STATUS_NOT_FOUND:
          error = 'Ничего не найдено';
          break;

        case STATUS_SERVER_ERROR:
          error = 'Сервер не отвечает';
          break;

        default:
          error = 'Cтатус ответа: : ' + request.status + ' ' + request.statusText;
      }
      if (error) {
        request(error);
      }
    });
    request.addEventListener('error', function () {
      errorCallback('Произошла ошибка соединения');
    });
    request.addEventListener('timeout', function () {
      errorCallback('Запрос не успел выполниться за ' + TIMEOUT_TIME + 'мс');
    });

  };

  window.load = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    makeRequest(xhr, onSuccess, onError);

    xhr.timeout = 10000;

    xhr.open('GET', GET_URL);
    xhr.send();
  };

  window.upload = function (onSuccess, onError, data) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    makeRequest(xhr, onSuccess, onError, data);

    xhr.timeout = 10000;

    xhr.open('HEAD', SUBMIT_URL);
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
