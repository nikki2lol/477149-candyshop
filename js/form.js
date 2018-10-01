'use strict';
var form = document.querySelector('.buy form');

var contactsFields = form.querySelector('.contact-data');
var inputName = contactsFields.querySelector('#contact-data__name');
var inputTel = contactsFields.querySelector('#contact-data__tel');
var inputEmail = contactsFields.querySelector('#contact-data__email');

var paymentFields = form.querySelector('.payment');
var paymentMethod = paymentFields.querySelector('.payment__method');
var paymentCardWrapper = paymentFields.querySelector('.payment__card-wrap');
var paymentCard = paymentMethod.querySelector('#payment__card');
var paymentCashWrapper = paymentFields.querySelector('.payment__cash-wrap');
var paymentCash = paymentMethod.querySelector('#payment__cash');
var paymentInputs = [].slice.call(paymentCardWrapper.querySelectorAll('input'));
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
var deliveryInputs = [].slice.call(deliveryCourier.querySelectorAll('input'));
var deliveryStreet = delivery.querySelector('#deliver__street');
var deliveryHouse = delivery.querySelector('#deliver__house');
var deliveryFloor = delivery.querySelector('#deliver__floor');
var deliveryRoom = delivery.querySelector('#deliver__room');

var successPopup = document.querySelector('#modal-success');

// Блоки-переключатели
var toggleDisabled = function () {
  paymentCardWrapper.classList.toggle('visually-hidden', paymentCash.checked);
  paymentCashWrapper.classList.toggle('visually-hidden', paymentCard.checked);

  deliveryStore.classList.toggle('visually-hidden', deliveryCourierBtn.checked);
  deliveryCourier.classList.toggle('visually-hidden', deliveryStoreBtn.checked);

  paymentInputs.forEach(function (elem) {
    elem.disabled = paymentCash.checked;
  });

  deliveryInputs.forEach(function (elem) {
    elem.disabled = deliveryStoreBtn.checked;
  });
};

var onToggleBlockClick = function (evt) {
  var target = evt.target;
  target.checked = true;
  toggleDisabled();
};

paymentMethod.addEventListener('click', onToggleBlockClick);
deliveryMethod.addEventListener('click', onToggleBlockClick);

var checkInput = function (input) {
  return input.value.length !== 0;
};

var checkCardValue = function (input) {
  return input.value.length < 16;
};

var validate = function (evt) {
  if (validateRequiredInputs) {
    evt.preventDefault();
    successPopup.classList.remove('modal--hidden');
    successPopup.querySelector('.modal__close').addEventListener('click', function () {
      successPopup.classList.add('modal--hidden');
    });
  }
};

var checkCard = function (number) {
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

var validateRequiredInputs = function () {
  checkInput(inputName);
  checkInput(inputTel);
  checkInput(inputEmail);
  checkCardValue(cardNumber);
  checkCard(cardNumber.value);
  checkInput(cardDate);
  checkInput(cardCvc);
  checkInput(cardHolder);
  checkInput(deliveryStreet);
  checkInput(deliveryHouse);
  checkInput(deliveryFloor);
  checkInput(deliveryRoom);
};

// Валидация форм
form.addEventListener('submit', function (evt) {
  validate(evt);
});
