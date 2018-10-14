'use strict';
// модуль, который создаёт данные
(function () {
  var catalogCardsElement = document.querySelector('.catalog__cards');

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

    window.data.catalogObjArray = data.slice();
    window.slider.resetRangeFiltersValue();

    var catalogFragment = window.catalog.renderCatalog(data);
    catalogCardsElement.append(catalogFragment);

    window.filters.setMinMaxPrices();

    window.utils.disableOrderForm(true);

    catalogCardsElement.classList.remove('catalog__cards--load');
    catalogCardsElement.querySelector('.catalog__load').classList.add('visually-hidden');

    window.filters.displayCounters();
  };

  window.data = {
    catalogObjArray: [],
    basketObjArray: []
  };

  window.backend.load(onSuccessLoadData, window.backend.showErrorPopup);
})();
