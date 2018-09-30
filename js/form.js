'use strict';
var form = document.querySelector('.buy form');

// var contactsFields = form.querySelector('.contact-data');
// var inputName = contactsFields.querySelector('#contact-data__name');
// var inputTel = contactsFields.querySelector('#contact-data__tel');
// var inputEmail = contactsFields.querySelector('#contact-data__email');

var paymentFields = form.querySelector('.payment');
var paymentMethod = paymentFields.querySelector('.payment__method');
var paymentInputs = [].slice.call(paymentMethod.querySelectorAll('input'));
var paymentCardWrapper = paymentFields.querySelector('.payment__card-wrap');
var paymentCashWrapper = paymentFields.querySelector('.payment__cash-wrap');
var cardNumber = paymentFields.querySelector('#payment__card-number');
var cardDate = paymentFields.querySelector('#payment__card-date');
var cardCvc = paymentFields.querySelector('#payment__card-cvc');
var cardHolder = paymentFields.querySelector('#payment__cardholder');

var delivery = form.querySelector('.deliver');
var deliveryMethod = delivery.querySelector('.deliver__toggle');
var deliveryInputs = [].slice.call(deliveryMethod.querySelectorAll('input'));
var deliveryStore = delivery.querySelector('.deliver__store');
var deliveryCourier = delivery.querySelector('.deliver__courier');
var deliveryStreet = delivery.querySelector('#deliver__street');
var deliveryHouse = delivery.querySelector('#deliver__house');
var deliveryFloor = delivery.querySelector('#deliver__floor');
var deliveryRoom = delivery.querySelector('#deliver__room');

// Блоки-переключатели
var addAttrDisabled = function (element) {
  if (!element.hasAttribute('disabled')) {
    element.setAttribute('disabled', '');
  }
};

var removeAttrDisabled = function (element) {
  if (element.hasAttribute('disabled')) {
    element.removeAttribute('disabled');
  }
};

paymentInputs.forEach(function (elem) {
  elem.addEventListener('change', function () {
    if (elem.checked && elem.value === 'card') {
      paymentCardWrapper.classList.remove('visually-hidden');
      paymentCashWrapper.classList.add('visually-hidden');
      removeAttrDisabled(cardNumber);
      removeAttrDisabled(cardDate);
      removeAttrDisabled(cardCvc);
      removeAttrDisabled(cardHolder);
    } else if (elem.checked && elem.value === 'cash') {
      paymentCashWrapper.classList.remove('visually-hidden');
      paymentCardWrapper.classList.add('visually-hidden');
      addAttrDisabled(cardNumber);
      addAttrDisabled(cardDate);
      addAttrDisabled(cardCvc);
      addAttrDisabled(cardHolder);
    }
  });
});

deliveryInputs.forEach(function (elem) {
  elem.addEventListener('change', function () {
    if (elem.checked && elem.value === 'store') {
      deliveryStore.classList.remove('visually-hidden');
      deliveryCourier.classList.add('visually-hidden');
      addAttrDisabled(deliveryStreet);
      addAttrDisabled(deliveryHouse);
      addAttrDisabled(deliveryFloor);
      addAttrDisabled(deliveryRoom);
    } else if (elem.checked && elem.value === 'courier') {
      deliveryStore.classList.add('visually-hidden');
      deliveryCourier.classList.remove('visually-hidden');
      removeAttrDisabled(deliveryStreet);
      removeAttrDisabled(deliveryHouse);
      removeAttrDisabled(deliveryFloor);
      removeAttrDisabled(deliveryRoom);
    }
  });
});

// // Валидация форм
// form.addEventListener('submit', function (evt) {
//   validate(evt);
// });
//
// var validate = function (evt) {
//   if (validateContacts() && validatePayments() && validateDelivery()) {
//     evt.preventDefault();
//   }
// };
//
// var validateContacts = function () {
//   var checkName = function() {
//       return inputName.value.length === 0;
//   };
//
//   if ( || inputTel.value.length === 0 || inputEmail.value.length === 0) {
//
//   }
// };
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
