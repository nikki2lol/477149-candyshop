'use strict';
// модуль, содержащий логику формы оформления заказа
(function () {
  var ESC_KEYCODE = 27;
  var MIN_NUMBER_VALUE_KEYCODE = 48;
  var MAX_NUMBER_VALUE_KEYCODE = 57;
  var orderFormElement = document.querySelector('.buy form');

  var paymentFormElement = orderFormElement.querySelector('.payment');
  var paymentMethodElement = paymentFormElement.querySelector('.payment__method');
  var paymentCardWrapperElement = paymentFormElement.querySelector('.payment__card-wrap');
  var paymentCardElement = paymentMethodElement.querySelector('#payment__card');
  var paymentCashWrapperElement = paymentFormElement.querySelector('.payment__cash-wrap');
  var paymentCashElement = paymentMethodElement.querySelector('#payment__cash');
  var paymentInputElements = paymentCardWrapperElement.querySelectorAll('input');
  var paymentRadioBtnElements = paymentMethodElement.querySelectorAll('.toggle-btn__input');
  var paymentCardStatusElement = paymentFormElement.querySelector('.payment__card-status');
  var cardInputElement = paymentFormElement.querySelector('#payment__card-number');
  var cardDateElement = paymentFormElement.querySelector('#payment__card-date');
  var cardCvcElement = paymentFormElement.querySelector('#payment__card-cvc');
  var cardHolderElement = paymentFormElement.querySelector('#payment__cardholder');

  var deliveryFormElement = orderFormElement.querySelector('.deliver');
  var deliveryMethodElement = deliveryFormElement.querySelector('.deliver__toggle');
  var deliveryStoreElement = deliveryFormElement.querySelector('.deliver__store');
  var deliveryStoreBtnElement = deliveryFormElement.querySelector('#deliver__store');
  var deliveryCourierElement = deliveryFormElement.querySelector('.deliver__courier');
  var deliveryCourierBtnElement = deliveryFormElement.querySelector('#deliver__courier');
  var deliveryRadioBtnElements = deliveryMethodElement.querySelectorAll('.toggle-btn__input');
  var deliveryStoreListElement = deliveryFormElement.querySelector('.deliver__store-list');
  var deliveryStoreItemElements = deliveryStoreListElement.querySelectorAll('.deliver__store-item');
  var deliveryStoreMapElement = deliveryFormElement.querySelector('.deliver__store-map-wrap');
  var deliveryMapImageElement = deliveryStoreMapElement.querySelector('.deliver__store-map-img');

  // Блоки-переключатели
  var togglePayment = function () {
    paymentCardWrapperElement.classList.toggle('visually-hidden', paymentCashElement.checked);
    paymentCashWrapperElement.classList.toggle('visually-hidden', paymentCardElement.checked);

    paymentInputElements.forEach(function (elem) {
      elem.disabled = paymentCashElement.checked;
    });
  };

  var toggleDelivery = function () {
    deliveryStoreElement.classList.toggle('visually-hidden', deliveryCourierBtnElement.checked);
    deliveryCourierElement.classList.toggle('visually-hidden', deliveryStoreBtnElement.checked);

    deliveryStoreElement.querySelector('.deliver__stores').disabled = deliveryCourierBtnElement.checked;
    deliveryCourierElement.querySelector('.deliver__entry-fields-wrap').disabled = deliveryStoreBtnElement.checked;
  };

  // вводимое число - только цифра
  var checkIsNumber = function (event) {
    if (event.keyCode < MIN_NUMBER_VALUE_KEYCODE || event.keyCode > MAX_NUMBER_VALUE_KEYCODE) {
      event.returnValue = false;
    }
  };

  var checkCardNumber = function (input) {
    var array = input.value.split('').map(function (element, index) {
      var numeral = parseInt(element, 10);
      if (index === 0 || index % 2 === 0) {
        var numeral2 = numeral * 2;
        return numeral2 > 9 ? numeral2 - 9 : numeral2;
      }
      return numeral;
    });

    return array.reduce(function (x, y) {
      return x + y;
    }) % 10 === 0;
  };

  paymentRadioBtnElements.forEach(function (elem) {
    elem.addEventListener('change', togglePayment);
  });

  deliveryRadioBtnElements.forEach(function (elem) {
    elem.addEventListener('change', toggleDelivery);
  });

  deliveryStoreItemElements.forEach(function (elem) {
    elem.addEventListener('click', function () {
      deliveryMapImageElement.src = 'img/map/' + elem.querySelector('input').value + '.jpg';
      deliveryMapImageElement.alt = elem.querySelector('label').textContent;
    });
  });

  cardInputElement.addEventListener('input', function (evt) {
    evt.preventDefault();
    paymentCardStatusElement.textContent = checkCardNumber(cardInputElement) ? 'Одобрен' : 'Не определён';
  });

  cardInputElement.addEventListener('keypress', checkIsNumber);
  cardCvcElement.addEventListener('keypress', checkIsNumber);

  cardInputElement.addEventListener('invalid', function () {
    var errorText = '';
    if (cardInputElement.validity.patternMismatch || cardInputElement.validity.tooShort || cardInputElement.validity.tooLong) {
      errorText = 'Номер карты должен состоять только из 16 цифр';
    } else if (cardInputElement.validity.valueMissing) {
      errorText = 'Обязательное для заполнения поле';
    }
    cardInputElement.setCustomValidity(errorText);
  });

  cardDateElement.addEventListener('invalid', function () {
    var errorText = '';
    if (cardDateElement.validity.tooShort || cardDateElement.validity.tooLong || cardDateElement.validity.patternMismatch) {
      errorText = 'Срок действия карты должен быть указан в формате ММ/ГГ';
    } else if (cardDateElement.validity.valueMissing) {
      errorText = 'Обязательное для заполнения поле';
    }
    cardDateElement.setCustomValidity(errorText);
  });

  cardCvcElement.addEventListener('invalid', function () {
    var errorText = '';
    if (cardCvcElement.validity.tooShort || cardCvcElement.validity.tooLong || cardCvcElement.validity.patternMismatch) {
      errorText = 'Поле должно содержать 3 цифры';
    } else if (cardCvcElement.validity.valueMissing) {
      errorText = 'Обязательное для заполнения поле';
    }
    cardCvcElement.setCustomValidity(errorText);
  });

  cardHolderElement.addEventListener('invalid', function () {
    var errorText = '';
    if (cardHolderElement.validity.patternMismatch) {
      errorText = 'Поле должно содержать только латинские буквы A-Z';
    } else if (cardHolderElement.validity.valueMissing) {
      errorText = 'Обязательное для заполнения поле';
    }
    cardHolderElement.setCustomValidity(errorText);
  });

  orderFormElement.addEventListener('submit', function (evt) {
    evt.preventDefault();
    if (orderFormElement.checkValidity()) {
      window.upload(new FormData(orderFormElement), window.showSuccessPopup, window.showErrorPopup);
      orderFormElement.reset();
      paymentCardStatusElement.textContent = 'Не определен';
      paymentCardElement.checked = true;
      togglePayment();
      deliveryStoreBtnElement.checked = true;
      toggleDelivery();
      window.basketObjArray = [];
      window.clearBasketGoods();
      window.checkBasketArray();
    }
  });

  window.ESC_KEYCODE = ESC_KEYCODE;
})();
