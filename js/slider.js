'use strict';
// модуль для работы с фильтром
(function () {
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
    var minPrice = window.filters.currentFilters.minPrice;
    var maxPrice = window.filters.currentFilters.maxPrice;
    return ((maxPrice - minPrice) * currentPosition / 100 + minPrice).toFixed(0);
  };

  var onSliderMouseDown = function (evt) {

    evt.preventDefault();
    var currentPinElement = evt.target;
    var startCoordX = currentPinElement.offsetLeft;

    var onSliderMouseMove = function (event) {
      event.preventDefault();
      window.filters.setMinMaxPrices();
      var currentPinPosition = startCoordX - (evt.clientX - event.clientX);
      if (currentPinElement === rangeLeftPinElement && currentPinPosition < rangeRightPinElement.offsetLeft && currentPinPosition >= 0) {
        currentPinElement.style.left = currentPinPosition + 'px';
        rangeLineElement.style.left = currentPinPosition + 'px';
        rangePriceMinElement.textContent = updateRangePrice(currentPinPosition);
        window.filters.currentFilters.minPrice = updateRangePrice(currentPinPosition);
      }

      if (currentPinElement === rangeRightPinElement && currentPinPosition > rangeLeftPinElement.offsetLeft && currentPinPosition <= rangeWidth) {
        currentPinElement.style.left = currentPinPosition + 'px';
        rangeLineElement.style.right = rangeWidth - currentPinPosition + 'px';
        rangePriceMaxElement.textContent = updateRangePrice(currentPinPosition);
        window.filters.currentFilters.maxPrice = updateRangePrice(currentPinPosition);
      }

      window.utils.debounce(window.filters.sortAndFilterCatalog());

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

  window.slider = {
    resetRangeFiltersValue: function () {
      rangeLeftPinElement.style.left = 0 + 'px';
      rangeRightPinElement.style.left = rangeWidth - SLIDER_WIDTH + 'px';
      rangeLineElement.style.left = 0;
      rangeLineElement.style.right = 0;
      rangePriceMinElement.textContent = updateRangePrice(rangeLeftPinElement.offsetLeft);
      rangePriceMaxElement.textContent = updateRangePrice(rangeRightPinElement.offsetLeft + SLIDER_WIDTH);
    }
  };
})();
