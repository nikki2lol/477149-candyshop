'use strict';
// модуль для работы с фильтрами
(function () {
  var filtersWrapperElement = document.querySelector('.catalog__sidebar');
  var filtersFormElement = document.querySelector('form');
  var independentFilters = filtersWrapperElement.querySelectorAll('.input-btn__input--independent');
  var catalogCardsElement = document.querySelector('.catalog__cards');
  var resetFiltersElement = filtersWrapperElement.querySelector('.catalog__submit');

  var filterFavoriteInputElement = filtersWrapperElement.querySelector('#filter-favorite');
  var filterAvailabilityInputElement = filtersWrapperElement.querySelector('#filter-availability');

  // counters
  var countElements = document.querySelectorAll('.input-btn__item-count');

  // создам объект для счетчиков
  var countsObject = {
    iceCream: 0,
    soda: 0,
    gum: 0,
    marmalade: 0,
    marshmallows: 0,
    sugarFree: 0,
    vegetarian: 0,
    gluten: 0,
    isFavorite: 0,
    isAvailable: 0
  };

  // словарь для сопоставления value типа мороженого и его брата в объекте
  var KindTypes = {
    'Мороженое': 'icecream',
    'Газировка': 'soda',
    'Жевательная резинка': 'gum',
    'Мармелад': 'marmalade',
    'Зефир': 'marshmallows'
  };

  // словарь для nutritionFacts
  var NutritionTypes = {
    'sugar-free': 'sugar',
    'vegetarian': 'vegetarian',
    'gluten-free': 'gluten'
  };

  var showNoResultBlock = function () {
    var noResultTemplate = document.querySelector('#empty-filters').content.cloneNode(true);
    catalogCardsElement.appendChild(noResultTemplate.querySelector('.catalog__empty-filter'));
  };

  // функция для обновления фильтров
  var resetFilters = function () {
    window.currentFilters.foodType = [];
    window.currentFilters.foodProperty = [];
    var inputFoodTypeElements = filtersWrapperElement.querySelectorAll('input[name="food-type"]:checked');
    var inputFoodPropertyFilters = filtersWrapperElement.querySelectorAll('input[name="food-property"]:checked');
    inputFoodTypeElements.forEach(function (elem) {
      window.currentFilters.foodType.push(elem.value);
    });
    inputFoodPropertyFilters.forEach(function (elem) {
      window.currentFilters.foodProperty.push(NutritionTypes[elem.value]);
    });
    window.currentFilters.isFavorite = filtersWrapperElement.querySelector('#filter-favorite').checked;
    window.currentFilters.amount = filtersWrapperElement.querySelector('#filter-availability').checked;
    window.currentFilters.currentSort = filtersWrapperElement.querySelector('input[name="sort"]:checked').value;
  };

  // функция сравнения популярности
  var sortByPopularity = function (a, b) {
    return b.rating.number - a.rating.number;
  };

  // функция сравнения цен (от большего к меньшему)
  var sortByPriceDescending = function (a, b) {
    return b.price - a.price;
  };

  // функция сравнения цен (от большего к меньшему), хотя можно было просто параметры переставить местами при ее вызове, но да ладно
  var sortByPriceAscending = function (a, b) {
    return a.price - b.price;
  };

  // функция сравнения рейтинга
  var sortByRating = function (a, b) {
    return b.rating.value - a.rating.value;
  };

  // функция для отлавливания типа сортировки
  var selectCurrentSort = function (a, b) {
    var sortType;
    switch (window.currentFilters.currentSort) {
      case 'popular':
        sortType = sortByPopularity(a, b);
        break;
      case 'expensive':
        sortType = sortByPriceDescending(a, b);
        break;
      case 'cheep':
        sortType = sortByPriceAscending(a, b);
        break;
      case 'rating':
        sortType = sortByRating(a, b);
        break;
    }
    return sortType;
  };

  // вынесу проверку type & property в отдельные функции, чтобы возвращать сразу true либо false
  var checkType = function (elem) {
    var index = KindTypes[elem.kind];
    return window.currentFilters.foodType.indexOf(index) > -1;
  };

  var checkProperty = function (elem) {
    for (var i = 0; i < window.currentFilters.foodProperty.length; i++) {
      if (elem.nutritionFacts[window.currentFilters.foodProperty[i]]) {
        return elem.nutritionFacts[window.currentFilters.foodProperty[i]];
      }
    }
    return false;
  };

  // Объединяю все фильтры в одну функцию для проверки элемента
  var filterCatalogGoods = function (elem) {
    var foodTypeMatch = false;
    var foodPropertyMatch = false;
    var priceMatch = false;

    foodTypeMatch = window.currentFilters.foodType.length > 0 ? checkType(elem) : true;
    foodPropertyMatch = window.currentFilters.foodProperty.length > 0 ? checkProperty(elem) : true;

    if (elem.price >= window.currentFilters.minPrice && elem.price <= window.currentFilters.maxPrice) {
      priceMatch = true;
    }

    if (window.currentFilters.isFavorite) {
      return elem.isFavorite;
    }

    if (window.currentFilters.amount) {
      return elem.amount > 0;
    }

    return foodTypeMatch && foodPropertyMatch && priceMatch;

  };

  // и здесь выношу в глобальную область видимости функцию, которая принимает в аргумент массив, применяет нужные фильтры и возращает измененный массив
  var applyFilters = function (array) {
    resetFilters();
    return array.filter(filterCatalogGoods).sort(selectCurrentSort);
  };

  // функция для удаления всех карточек перед прорисовкой отфильтрованных
  var deleteCardsFromCatalog = function () {
    var cardElements = catalogCardsElement.querySelectorAll('.catalog__card');

    for (var i = 0; i < cardElements.length; i++) {
      catalogCardsElement.removeChild(cardElements[i]);
    }

    var noResultsCatalogElement = document.querySelector('.catalog__empty-filter');
    if (noResultsCatalogElement) {
      catalogCardsElement.removeChild(noResultsCatalogElement);
    }
  };

  // здесь я отлавливаю какие фильтры нажаты и как они друг на друга повлияют
  var onFormChange = function (evt) {
    if (evt.target === filterFavoriteInputElement && filterAvailabilityInputElement.checked) {
      filterAvailabilityInputElement.checked = false;
    }

    if (evt.target === filterAvailabilityInputElement && filterFavoriteInputElement.checked) {
      filterFavoriteInputElement.checked = false;
    }

    if (evt.target === filterAvailabilityInputElement || evt.target === filterFavoriteInputElement) {
      independentFilters.forEach(function (elem) {
        elem.checked = false;
      });
    }

    window.debounce(window.sortAndFilterCatalog());
  };

  var makeNewCatalog = function (array) {
    deleteCardsFromCatalog();
    catalogCardsElement.appendChild(window.renderCatalog(array));
  };

  window.displayCounters = function () {
    window.catalogObjArray.forEach(function (element) {
      if (element.kind === 'Мороженое') {
        countsObject.iceCream += 1;
      }

      if (element.kind === 'Газировка') {
        countsObject.soda += 1;
      }

      if (element.kind === 'Жевательная резинка') {
        countsObject.gum += 1;
      }

      if (element.kind === 'Мармелад') {
        countsObject.marmalade += 1;
      }

      if (element.kind === 'Зефир') {
        countsObject.marshmallows += 1;
      }

      if (element.nutritionFacts.sugar) {
        countsObject.sugarFree += 1;
      }

      if (element.nutritionFacts.vegetarian) {
        countsObject.vegetarian += 1;
      }

      if (element.nutritionFacts.gluten) {
        countsObject.gluten += 1;
      }

      if (element.isFavorite) {
        countsObject.isFavorite += 1;
      }

      if (element.amount > 0) {
        countsObject.isAvailable += 1;
      }

    });

    countElements[0].textContent = '(' + countsObject.iceCream + ')';
    countElements[1].textContent = '(' + countsObject.soda + ')';
    countElements[2].textContent = '(' + countsObject.gum + ')';
    countElements[3].textContent = '(' + countsObject.marmalade + ')';
    countElements[4].textContent = '(' + countsObject.marshmallows + ')';
    countElements[5].textContent = '(' + countsObject.sugarFree + ')';
    countElements[6].textContent = '(' + countsObject.vegetarian + ')';
    countElements[7].textContent = '(' + countsObject.gluten + ')';
    countElements[8].textContent = '(' + countsObject.isFavorite + ')';
    countElements[9].textContent = '(' + countsObject.isAvailable + ')';

    // потому что все подходят изначально под ценовой диапозон и это значение не должно меняться, воообще непонятная логика зачем этот счетчик для цены

    document.querySelector('.range__count').textContent = '(' + window.catalogObjArray.length + ')';
  };

  window.sortAndFilterCatalog = function () {
    window.filteredCards = applyFilters(window.catalogObjArray);
    makeNewCatalog(window.filteredCards);

    if (window.filteredCards.length === 0) {
      showNoResultBlock();
    }
  };

  window.setMinMaxPrices = function () {
    var sortedGoods = window.catalogObjArray.sort(function (a, b) {
      return a.price - b.price;
    });

    window.currentFilters.minPrice = sortedGoods[0].price;
    window.currentFilters.maxPrice = sortedGoods[sortedGoods.length - 1].price;
  };

  // объект для хранения данных о текущих примененных фильтрах
  window.currentFilters = {
    foodType: null,
    foodProperty: null,
    minPrice: 0,
    maxPrice: 90,
    isFavorite: false,
    amount: false,
    currentSort: null
  };

  resetFiltersElement.addEventListener('click', function (evt) {
    evt.preventDefault();
    filtersFormElement.reset();
    window.setMinMaxPrices();
    window.resetRangeFiltersValue();
    window.sortAndFilterCatalog();
  });

  filtersFormElement.addEventListener('change', onFormChange);

})();
