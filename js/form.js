'use strict';
var ESC_KEYCODE = 27;
var form = document.querySelector('.buy form');

// var contactsFields = form.querySelector('.contact-data');
// var inputName = contactsFields.querySelector('#contact-data__name');
// var inputTel = contactsFields.querySelector('#contact-data__tel');
// var inputEmail = contactsFields.querySelector('#contact-data__email');

var paymentFields = form.querySelector('.payment');
var paymentMethod = paymentFields.querySelector('.payment__method');
var paymentCardWrapper = paymentFields.querySelector('.payment__card-wrap');
var paymentCard = paymentMethod.querySelector('#payment__card');
var paymentCashWrapper = paymentFields.querySelector('.payment__cash-wrap');
var paymentCash = paymentMethod.querySelector('#payment__cash');
var paymentInputs = [].slice.call(paymentCardWrapper.querySelectorAll('input'));
var paymentRadioBtn = [].slice.call(paymentMethod.querySelectorAll('.toggle-btn__input'));
var paymentCardStatus = paymentFields.querySelector('.payment__card-status');
var cardNumber = paymentFields.querySelector('#payment__card-number');
var cardDate = paymentFields.querySelector('#payment__card-date');
var cardCvc = paymentFields.querySelector('#payment__card-cvc');
var cardHolder = paymentFields.querySelector('#payment__cardholder');

var delivery = form.querySelector('.deliver');
var deliveryMethod = delivery.querySelector('.deliver__toggle');
var deliveryStore = delivery.querySelector('.deliver__store');
var deliveryStoreBtn = delivery.querySelector('#deliver__store');
var deliveryCourier = delivery.querySelector('.deliver__courier');
var deliveryCourierBtn = delivery.querySelector('#deliver__courier');
var deliveryRadioBtn = [].slice.call(deliveryMethod.querySelectorAll('.toggle-btn__input'));
// var deliveryStreet = delivery.querySelector('#deliver__street');
// var deliveryHouse = delivery.querySelector('#deliver__house');
// var deliveryFloor = delivery.querySelector('#deliver__floor');
// var deliveryRoom = delivery.querySelector('#deliver__room');
var deliveryStoreList = delivery.querySelector('.deliver__store-list');
var deliveryStoreItems = [].slice.call(deliveryStoreList.querySelectorAll('.deliver__store-item'));
var deliveryStoreMap = delivery.querySelector('.deliver__store-map-wrap');
var deliveryMapImage = deliveryStoreMap.querySelector('.deliver__store-map-img');

var successPopup = document.querySelector('#modal-success');

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeSuccessPopup();
  }
};

var showSuccessPopup = function () {
  successPopup.classList.remove('modal--hidden');
  document.addEventListener('keydown', onPopupEscPress);
};

var closeSuccessPopup = function () {
  successPopup.classList.add('modal--hidden');
  document.removeEventListener('keydown', onPopupEscPress);
};

// Блоки-переключатели
var togglePayment = function () {
  paymentCardWrapper.classList.toggle('visually-hidden', paymentCash.checked);
  paymentCashWrapper.classList.toggle('visually-hidden', paymentCard.checked);

  paymentInputs.forEach(function (elem) {
    elem.disabled = paymentCash.checked;
  });
};

var toggleDelivery = function () {
  deliveryStore.classList.toggle('visually-hidden', deliveryCourierBtn.checked);
  deliveryCourier.classList.toggle('visually-hidden', deliveryStoreBtn.checked);

  deliveryStore.querySelector('.deliver__stores').disabled = deliveryCourierBtn.checked;
  deliveryCourier.querySelector('.deliver__entry-fields-wrap').disabled = deliveryStoreBtn.checked;
};

paymentRadioBtn.forEach(function (elem) {
  elem.addEventListener('change', togglePayment);
});

deliveryRadioBtn.forEach(function (elem) {
  elem.addEventListener('change', toggleDelivery);
});

deliveryStoreItems.forEach(function (elem) {
  elem.addEventListener('click', function () {
    deliveryMapImage.src = 'img/map/' + elem.querySelector('input').value + '.jpg';
    deliveryMapImage.alt = elem.querySelector('label').textContent;
  });
});

// вводимое число - только цифра
var isNumber = function (event) {
  if (event.keyCode < 48 || event.keyCode > 57) {
    event.returnValue = false;
  }
};

cardNumber.addEventListener('keypress', isNumber);
cardCvc.addEventListener('keypress', isNumber);

cardNumber.addEventListener('invalid', function () {
  var errorText = '';
  if (cardNumber.validity.patternMismatch || cardNumber.validity.tooShort || cardNumber.validity.tooLong) {
    errorText = 'Номер карты должен состоять только из 16 цифр';
  } else if (cardNumber.validity.valueMissing) {
    errorText = 'Обязательное для заполнения поле';
  }
  cardNumber.setCustomValidity(errorText);
});

cardDate.addEventListener('invalid', function () {
  var errorText = '';
  if (cardDate.validity.tooShort || cardDate.validity.tooLong || cardDate.validity.patternMismatch) {
    errorText = 'Срок действия карты должен быть указан в формате ММ/ГГ';
  } else if (cardDate.validity.valueMissing) {
    errorText = 'Обязательное для заполнения поле';
  }
  cardDate.setCustomValidity(errorText);
});

cardCvc.addEventListener('invalid', function () {
  var errorText = '';
  if (cardCvc.validity.tooShort || cardCvc.validity.tooLong || cardCvc.validity.patternMismatch) {
    errorText = 'Поле должно содержать 3 цифры';
  } else if (cardCvc.validity.valueMissing) {
    errorText = 'Обязательное для заполнения поле';
  }
  cardCvc.setCustomValidity(errorText);
});

cardHolder.addEventListener('invalid', function () {
  var errorText = '';
  if (cardHolder.validity.patternMismatch) {
    errorText = 'Поле должно содержать только заглавные латинские буквы';
  } else if (cardHolder.validity.valueMissing) {
    errorText = 'Обязательное для заполнения поле';
  }
  cardHolder.setCustomValidity(errorText);
});

var checkCardNumber = function (number) {
  var array = number.value.split('').map(function (element, index) {
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

var validateCardData = function () {
  paymentCardStatus.textContent = checkCardNumber(cardNumber) ? 'Одобрен' : 'Не определён';
  return checkCardNumber(cardNumber);
};

var validate = function (evt) {
  if (validateCardData()) {
    evt.preventDefault();
    showSuccessPopup();
    successPopup.querySelector('.modal__close').addEventListener('click', closeSuccessPopup);
  }
};

// Валидация форм
form.addEventListener('submit', function (evt) {
  validate(evt);
});
