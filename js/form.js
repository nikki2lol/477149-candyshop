'use strict';
var form = document.querySelector('.buy form');

var contactsFields = form.querySelector('.contact-data');
var inputName = contactsFields.querySelector('#contact-data__name');
var inputTel = contactsFields.querySelector('#contact-data__tel');
var inputEmail = contactsFields.querySelector('#contact-data__email');

var paymentFields = form.querySelector('.payment');
var paymentMethod = paymentFields.querySelector('.payment__method');
var paymentInputs = [].slice.call(paymentMethod.querySelectorAll('input'));
var paymentCardWrapper = paymentFields.querySelector('.payment__card-wrap');
var paymentCashWrapper = paymentFields.querySelector('.payment__cash-wrap');
// var cardNumber = paymentFields.querySelector('#payment__card-number');
// var cardDate = paymentFields.querySelector('#payment__card-date');
// var cardCvc = paymentFields.querySelector('#payment__card-cvc');
// var cardHolder = paymentFields.querySelector('#payment__cardholder');

var delivery = form.querySelector('.deliver');
var deliveryMethod = delivery.querySelector('.deliver__toggle');
var deliveryInputs = [].slice.call(deliveryMethod.querySelectorAll('input'));
var deliveryStore = delivery.querySelector('.deliver__store');
var deliveryCourier = delivery.querySelector('.deliver__courier');
// var deliveryStreet = delivery.querySelector('#deliver__street');
// var deliveryHouse = delivery.querySelector('#deliver__house');
// var deliveryFloor = delivery.querySelector('#deliver__floor');
// var deliveryRoom = delivery.querySelector('#deliver__room');

// Блоки-переключатели
var addAttrDisabled = function (container) {
  [].slice.call(container.querySelectorAll('input')).forEach(function (e) {
    e.disabled = true;
  });
};

var removeAttrDisabled = function (container) {
  [].slice.call(container.querySelectorAll('input')).forEach(function (e) {
    e.disabled = false;
  });
};

paymentInputs.forEach(function (elem) {
  elem.addEventListener('change', function (evt) {
    var target = evt.target;
    paymentCardWrapper.classList.toggle('visually-hidden');
    addAttrDisabled(paymentCardWrapper);
    paymentCashWrapper.classList.toggle('visually-hidden');
    addAttrDisabled(paymentCashWrapper);
    removeAttrDisabled(form.querySelector('.' + target.id + '-wrap'));
  });
});

deliveryInputs.forEach(function (elem) {
  elem.addEventListener('change', function (evt) {
    var target = evt.target;
    deliveryStore.classList.toggle('visually-hidden');
    addAttrDisabled(deliveryStore);
    deliveryCourier.classList.toggle('visually-hidden');
    addAttrDisabled(deliveryCourier);
    removeAttrDisabled(form.querySelector('.' + target.id));
  });
});

// Валидация форм
form.addEventListener('submit', function (evt) {
  validate(evt);
});

var validate = function (evt) {
  if (validateContacts()) {
    evt.preventDefault();
  }
};

var checkInput = function (input) {
  return input.value.length !== 0;
};

var validateContacts = function () {
  checkInput(inputName);
  checkInput(inputTel);
  checkInput(inputEmail);
};

//
// var checkCard = function (number) {
//   var array = number.value.split('').map(function (element, index) {
//     var numeral = parseInt(element, 10);
//     if (index === 0 || index % 2 === 0) {
//       var numeral2 = numeral * 2;
//       return numeral > 9 ? numeral - 9 : numeral2;
//     }
//     return numeral;
//   });
//
//   if (array.reduce(function (x, y) {
//     return x + y;
//   })
//     % 10 !== 0) {
//     return false;
//   } else {
//     return true;
//   }
// };
//
// var validatePayments = function () {
//   if (paymentMethod.querySelector('input[checked]').value === 'card') {
//     if (cardNumber.value.length === 0 || !checkCard(cardNumber) || cardDate.value.length === 0 || cardCvc.value.length === 0 || cardHolder.value.length === 0) {
//       return false;
//     } else {
//       return true;
//     }
//   } else {
//     return true;
//   }
// };
//
// var validateDelivery = function () {
//   if (deliveryMethod.querySelector('input[checked]').value === 'courier') {
//     if (deliveryStreet.value.length === 0 || deliveryHouse.value.length === 0 || deliveryFloor.value.length === 0 || deliveryRoom.value.length === 0) {
//       return false;
//     } else {
//       return true;
//     }
//   } else {
//     return true;
//   }
// };
