'use strict';
// врееменно добавлю две константы для показа функицонала фильтра
var PRICE_MIN = 100;
var PRICE_MAX = 1500;
var SLIDER_WIDTH = 10; // или лучше PIN_WIDTH?
var catalogRangeWrapperElement = document.querySelector('.catalog__filter.range');
var rangeElement = catalogRangeWrapperElement.querySelector('.range__filter');
var rangeLeftPinElement = rangeElement.querySelector('.range__btn--left');
var rangeRightPinElement = rangeElement.querySelector('.range__btn--right');
var rangeLineElement = rangeElement.querySelector('.range__fill-line');
var rangePriceMinElement = catalogRangeWrapperElement.querySelector('.range__price--min');
var rangePriceMaxElement = catalogRangeWrapperElement.querySelector('.range__price--max');
var rangeWidth = rangeElement.clientWidth;

// может не coordX а просто X, по идее понятно все равно будет, что это координата
var updatePrice = function (coordX) {
  var currentPosition = coordX * 100 / (rangeWidth - SLIDER_WIDTH);
  return ((PRICE_MAX - PRICE_MIN) * currentPosition / 100 + PRICE_MIN).toFixed(0);
};

// как вариант назвать onSliderMouseDown/onPinMouseDown = function () {....}
// evt на разных уровнях я бы тоже переименовал как mouseDownEvt и mouseMoveEvt
var onSliderMouseDown = function (evt) {
  evt.preventDefault();
  var currentPin = evt.target;
  var startCoordX = currentPin.offsetLeft;

  // мы вставили обработчик событий в обработчик событий, чтобы пока пишешь обработчик событий, мог писать обработчик событий
  var onSliderMouseMove = function (event) {
    event.preventDefault();
    var currentSliderPosition = startCoordX - (evt.clientX - event.clientX);
    if (currentPin === rangeLeftPinElement && currentSliderPosition < rangeRightPinElement.offsetLeft && currentSliderPosition >= 0) {
      currentPin.style.left = currentSliderPosition + 'px';
      rangeLineElement.style.left = currentSliderPosition + SLIDER_WIDTH / 2 + 'px';
      rangePriceMinElement.textContent = updatePrice(currentSliderPosition);
    }

    if (currentPin === rangeRightPinElement && currentSliderPosition > rangeLeftPinElement.offsetLeft && currentSliderPosition <= rangeWidth) {
      currentPin.style.left = currentSliderPosition + 'px';
      rangeLineElement.style.right = rangeWidth - currentSliderPosition + 'px';
      rangePriceMaxElement.textContent = updatePrice(currentSliderPosition);
    }
  };

  var onSliderMouseUp = function () {
    document.removeEventListener('mousemove', onSliderMouseMove);
    document.removeEventListener('mouseup', onSliderMouseUp);
  };

  document.addEventListener('mousemove', onSliderMouseMove);
  document.addEventListener('mouseup', onSliderMouseUp);
};

rangeLeftPinElement.addEventListener('mousedown', onSliderMouseDown);
rangeRightPinElement.addEventListener('mousedown', onSliderMouseDown);
