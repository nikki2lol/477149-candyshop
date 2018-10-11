'use strict';
// модуль для работы с фильтром
(function () {
  var PRICE_MIN = 0;
  var PRICE_MAX = 90;
  var SLIDER_WIDTH = 10;

  var filtersWrapper = document.querySelector('.catalog__sidebar');
  var rangeElement = filtersWrapper.querySelector('.range__filter');
  var rangeLeftPinElement = rangeElement.querySelector('.range__btn--left');
  var rangeRightPinElement = rangeElement.querySelector('.range__btn--right');
  var rangeLineElement = rangeElement.querySelector('.range__fill-line');
  var rangePriceMinElement = filtersWrapper.querySelector('.range__price--min');
  var rangePriceMaxElement = filtersWrapper.querySelector('.range__price--max');
  var rangeWidth = rangeElement.clientWidth;


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
        window.currentFilters.minPrice = updateRangePrice(currentPinPosition);
        // console.log(window.currentFilters.minPrice);
      }

      if (currentPin === rangeRightPinElement && currentPinPosition > rangeLeftPinElement.offsetLeft && currentPinPosition <= rangeWidth) {
        currentPin.style.left = currentPinPosition + 'px';
        rangeLineElement.style.right = rangeWidth - currentPinPosition + 'px';
        rangePriceMaxElement.textContent = updateRangePrice(currentPinPosition);
        window.currentFilters.maxPrice = updateRangePrice(currentPinPosition);
        // console.log(window.currentFilters.maxPrice);
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

  window.resetRangeFiltersValue = function () {
    rangeLeftPinElement.style.left = 0 + 'px';
    rangeRightPinElement.style.right = 0 + 'px';
    rangeLineElement.style.left = 0;
    rangeLineElement.style.right = 0;
    rangePriceMinElement.textContent = updateRangePrice(rangeLeftPinElement.offsetLeft);
    rangePriceMaxElement.textContent = updateRangePrice(rangeRightPinElement.offsetLeft + SLIDER_WIDTH);
  };
})();
