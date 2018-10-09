'use strict';
// модуль для работы с фильтром
(function () {
  var PRICE_MIN = 0;
  var PRICE_MAX = 100;
  var SLIDER_WIDTH = 10;
  var catalogRangeWrapperElement = document.querySelector('.catalog__filter.range');
  var rangeElement = catalogRangeWrapperElement.querySelector('.range__filter');
  var rangeLeftPinElement = rangeElement.querySelector('.range__btn--left');
  var rangeRightPinElement = rangeElement.querySelector('.range__btn--right');
  var rangeLineElement = rangeElement.querySelector('.range__fill-line');
  var rangePriceMinElement = catalogRangeWrapperElement.querySelector('.range__price--min');
  var rangePriceMaxElement = catalogRangeWrapperElement.querySelector('.range__price--max');
  var rangeWidth = rangeElement.clientWidth;

  var catalogCardsElement = document.querySelector('.catalog__cards');
  var inputPopularFilterElement = document.querySelector('#filter-popular');
  var inputExpensiveFilterElement = document.querySelector('#filter-expensive');
  var inputCheepFilterElement = document.querySelector('#filter-cheep');
  var inputRatingFilterElement = document.querySelector('#filter-rating');

  // var noResultElement = document.querySelector('#empty-filters').content.querySelector('div');

  var updateRangePrice = function (coordX) {
    var currentPosition = coordX * 100 / rangeWidth;
    return ((PRICE_MAX - PRICE_MIN) * currentPosition / 100 + PRICE_MIN).toFixed(0);
  };

  var onSliderMouseDown = function (evt) {
    evt.preventDefault();
    var currentPin = evt.target;
    var startCoordX = currentPin.offsetLeft;

    var onSliderMouseMove = function (event) {
      event.preventDefault();
      var currentPinPosition = startCoordX - (evt.clientX - event.clientX);
      if (currentPin === rangeLeftPinElement && currentPinPosition < rangeRightPinElement.offsetLeft && currentPinPosition >= 0) {
        currentPin.style.left = currentPinPosition + 'px';
        rangeLineElement.style.left = currentPinPosition + SLIDER_WIDTH / 2 + 'px';
        rangePriceMinElement.textContent = updateRangePrice(currentPinPosition);
      }

      if (currentPin === rangeRightPinElement && currentPinPosition > rangeLeftPinElement.offsetLeft && currentPinPosition <= rangeWidth) {
        currentPin.style.left = currentPinPosition + 'px';
        rangeLineElement.style.right = rangeWidth - currentPinPosition + 'px';
        rangePriceMaxElement.textContent = updateRangePrice(currentPinPosition);
      }
    };

    var onSliderMouseUp = function () {
      document.removeEventListener('mousemove', onSliderMouseMove);
      document.removeEventListener('mouseup', onSliderMouseUp);
    };

    document.addEventListener('mousemove', onSliderMouseMove);
    document.addEventListener('mouseup', onSliderMouseUp);
  };

  // общая функция рендера для фильтров
  var makeSortedList = function (array) {
    catalogCardsElement.innerHTML = '';

    array.forEach(function (elem) {
      var domElement = elem.dom;
      catalogCardsElement.appendChild(domElement);
    });
  };
  // Функция для показа блока "Хм... Что-то ты перемудрил с фильтрами."
  // var showNoResults = function () {
  //   catalogCardsElement.innerHTML = '';
  //   catalogCardsElement.appendChild(noResultElement);
  // };

  inputPopularFilterElement.addEventListener('click', function () {
    var newArray = window.cards.slice(0).sort(function (a, b) {
      return b.rating.number - a.rating.number;
    });
    makeSortedList(newArray);
  });

  inputExpensiveFilterElement.addEventListener('click', function () {
    var newArray = window.cards.slice(0).sort(function (a, b) {
      return b.price - a.price;
    });
    makeSortedList(newArray);
  });

  inputCheepFilterElement.addEventListener('click', function () {
    var newArray = window.cards.slice(0).sort(function (a, b) {

      return a.price - b.price;
    });
    makeSortedList(newArray);
  });


  inputRatingFilterElement.addEventListener('click', function () {
    var newArray = window.cards.slice(0).sort(function (a, b) {
      return b.rating.value - a.rating.value;
    });
    makeSortedList(newArray);
  });

  rangeLeftPinElement.addEventListener('mousedown', onSliderMouseDown);
  rangeRightPinElement.addEventListener('mousedown', onSliderMouseDown);

  window.resetRangeFiltersValue = function () {
    rangeLeftPinElement.style.left = 0 + 'px';
    rangeRightPinElement.style.right = 0 + 'px';
    rangeLineElement.style.left = 0;
    rangeLineElement.style.right = 0;
    rangePriceMinElement.textContent = updateRangePrice(rangeLeftPinElement.offsetLeft);
    rangePriceMaxElement.textContent = updateRangePrice(rangeRightPinElement.offsetLeft + SLIDER_WIDTH);
  };
})();
