'use strict';
// врееменно добавлю две константы для показа функицонала фильтра
var PRICE_MIN = 100;
var PRICE_MAX = 1500;
var catalogRangeWrapperElement = document.querySelector('.catalog__filter.range');
var rangeElement = catalogRangeWrapperElement.querySelector('.range__filter');
var rangeLeftElement = rangeElement.querySelector('.range__btn--left');
var rangeRightElement = rangeElement.querySelector('.range__btn--right');
var rangeLineElement = rangeElement.querySelector('.range__fill-line');
var rangePriceMinElement = catalogRangeWrapperElement.querySelector('.range__price--min');
var rangePriceMaxElement = catalogRangeWrapperElement.querySelector('.range__price--max');

rangeElement.addEventListener('click', function (evt) {
  var rangeWidth = rangeElement.offsetWidth;
  var offsetLeft = rangeElement.offsetLeft;
  var offsetRight = offsetLeft + rangeWidth;
  var leftValue = (evt.clientX - offsetLeft) * 100 / rangeWidth;
  var rightValue = (100 - (evt.clientX - offsetLeft) * 100 / rangeWidth);

  if (evt.clientX <= offsetLeft) {
    rangeLeftElement.style.left = 0;
    rangeLineElement.style.left = 0;
    rangePriceMinElement.textContent = 0;
  } else if (evt.clientX >= offsetRight) {
    rangeRightElement.style.right = 0;
    rangeLineElement.style.right = 0;
    rangePriceMaxElement.textContent = 1000;
  } else if (evt.clientX > offsetLeft && evt.clientX <= offsetLeft + rangeWidth / 2) {
    rangeLeftElement.style.left = leftValue + '%';
    rangeLineElement.style.left = leftValue + '%';
    rangePriceMinElement.textContent = (PRICE_MIN + leftValue / 100 * PRICE_MAX).toFixed(0);
  } else if (evt.clientX > offsetLeft && evt.clientX > offsetLeft + rangeWidth / 2) {
    rangeRightElement.style.right = rightValue + '%';
    rangeLineElement.style.right = rightValue + '%';
    rangePriceMaxElement.textContent = (leftValue / 100 * PRICE_MAX).toFixed(0);
  }
});
