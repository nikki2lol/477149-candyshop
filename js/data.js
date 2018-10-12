'use strict';
// модуль, который создаёт данные
(function () {
  var catalogCardsElement = document.querySelector('.catalog__cards');
  window.catalogObjArray = [];
  window.basketObjArray = [];

  // функция для первичной загрузки данных и рендера каталога
  var onSuccessLoadData = function (data) {
    for (var i = 0; i < data.length; i++) {
      data[i].id = i;
      data[i].isFavorite = false;
    }

    // для первоначального фильтра
    data.sort(function (a, b) {
      return b.rating.number - a.rating.number;
    });

    window.catalogObjArray = data.slice();
    window.resetRangeFiltersValue();

    var catalogFragment = window.renderCatalog(data);
    catalogCardsElement.append(catalogFragment);

    window.setMinMaxPrices();

    catalogCardsElement.classList.remove('catalog__cards--load');
    catalogCardsElement.querySelector('.catalog__load').classList.add('visually-hidden');

    window.displayCounters();
  };

  window.load(onSuccessLoadData, window.showErrorPopup);
})();
