'use strict';
// модуль, который экспортирует в глобальную область видимости функции для взаимодействия с удаленным севером через XHR
(function () {
  var URL = 'https://js.dump.academy/candyshop/data';
  var SUBMIT_URL = 'https://js.dump.academy/candyshop';
  var STATUS_SUCCESS = 200;
  var STATUS_NOT_FOUND = 404;
  var STATUS_SERVER_ERROR = 500;
  var TIMEOUT_TIME = 10000;

  var getServerAnswer = function (request, success, error) {
    var answer;
    switch (request) {
      case STATUS_SUCCESS:
        answer = success(request.response);
        break;
      case STATUS_NOT_FOUND:
        answer = error('Ошибка ' + STATUS_NOT_FOUND + ' ' + request.statusText);
        break;
      case STATUS_SERVER_ERROR:
        answer = error('Произошла ошибка соединения');
        break;
      case TIMEOUT_TIME:
        answer = error('Запрос не успел выполниться за ' + TIMEOUT_TIME + 'мс');
        break;
    }
    return answer;
  };

  var makeVariablesAnswers = function (request, success, error) {
    request.addEventListener('load', function () {
      getServerAnswer(request, success, error);
    });

    request.addEventListener('error', function () {
      getServerAnswer(request, success, error);
    });

    request.addEventListener('error', function () {
      getServerAnswer(request, success, error);
    });
  };

  // создам объект с доступом к 1) функции загрузки данных для каталога 2) загрузки формы на сервер 3) показа окна с ошибкой 4) показа окна с успешно отправленными данными
  window.server = {
    loadData: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'JSON';

      makeVariablesAnswers(onLoad, onError);

      xhr.open('GET', URL);
      xhr.send();
      makeVariablesAnswers();

    },

    uploadFormData: function (data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'JSON';

      makeVariablesAnswers(data, onLoad, onError);

      xhr.open('POST', SUBMIT_URL);
      xhr.send(data);
    },

    showError: function (errorNumber, errorText) {
      var popupErrorElement = document.querySelector('#modal-error');
      var popupMessageErrorElement = popupErrorElement.querySelector('.modal__message--error');
      var popupMessageTextElement = popupErrorElement.querySelector('.modal__message--text');
      var btnClose = popupErrorElement.querySelector('.modal__close');
      popupMessageErrorElement.textContent = 'Код ошибки: ' + errorNumber + '.';
      popupMessageTextElement.textContent = errorText;

      var onClickCloseButton = function () {
        popupErrorElement.classList.add('modal--hidden');
      };
      popupErrorElement.classList.remove('modal--hidden');
      btnClose.addEventListener('click', onClickCloseButton);
    },

    showSuccess: function () {
      var popupSuccessElement = document.querySelector('.modal--success');
      var btnClose = popupSuccessElement.querySelector('.modal__close');
      var onClickCloseButton = function () {
        popupSuccessElement.classList.add('modal--hidden');
      };
      popupSuccessElement.classList.remove('modal--hidden');
      btnClose.addEventListener('click', onClickCloseButton);
    }
  };
})();
