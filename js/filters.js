'use strict';
// врееменно добавлю две константы для показа функицонала фильтра
var PRICE_MIN = 100;
var PRICE_MAX = 1500;
var catalogRangeFilter = document.querySelector('.catalog__filter.range');
var range = catalogRangeFilter.querySelector('.range__filter');
var rangeLeft = range.querySelector('.range__btn--left');
var rangeRight = range.querySelector('.range__btn--right');
var rangeLine = range.querySelector('.range__fill-line');
var rangePriceMin = catalogRangeFilter.querySelector('.range__price--min');
var rangePriceMax = catalogRangeFilter.querySelector('.range__price--max');

range.addEventListener('click', function (evt) {
  var rangeWidth = range.offsetWidth;
  var offsetLeft = range.offsetLeft;
  var offsetRight = offsetLeft + rangeWidth;
  var leftValue = (evt.clientX - offsetLeft) * 100 / rangeWidth;
  var rightValue = (100 - (evt.clientX - offsetLeft) * 100 / rangeWidth);

  if (evt.clientX <= offsetLeft) {
    rangeLeft.style.left = 0;
    rangeLine.style.left = 0;
    rangePriceMin.textContent = 0;
  } else if (evt.clientX >= offsetRight) {
    rangeRight.style.right = 0;
    rangeLine.style.right = 0;
    rangePriceMax.textContent = 1000;
  } else if (evt.clientX > offsetLeft && evt.clientX <= offsetLeft + rangeWidth / 2) {
    rangeLeft.style.left = leftValue + '%';
    rangeLine.style.left = leftValue + '%';
    rangePriceMin.textContent = (PRICE_MIN + leftValue / 100 * PRICE_MAX).toFixed(0);
  } else if (evt.clientX > offsetLeft && evt.clientX > offsetLeft + rangeWidth / 2) {
    rangeRight.style.right = rightValue + '%';
    rangeLine.style.right = rightValue + '%';
    rangePriceMax.textContent = (leftValue / 100 * PRICE_MAX).toFixed(0);
  }
});
