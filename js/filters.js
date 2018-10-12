'use strict';
// модуль для работы с фильтрами
(function () {
  var filtersWrapper = document.querySelector('.catalog__sidebar');
  var filtersForm = document.querySelector('form');
  var independentFilters = [].slice.call(filtersWrapper.querySelectorAll('.input-btn__input--independent'));
  var catalogCardsElement = document.querySelector('.catalog__cards');
  var resetFiltersElement = filtersWrapper.querySelector('.catalog__submit');

  var filterFavoriteInputElement = filtersWrapper.querySelector('#filter-favorite');
  var filterAvailabilityInputElement = filtersWrapper.querySelector('#filter-availability');

  // словарь для сопоставления value типа мороженого и его брата в объекте
  var typeOfKind = {
    'Мороженое': 'icecream',
    'Газировка': 'soda',
    'Жевательная резинка': 'gum',
    'Мармелад': 'marmalade',
    'Зефир': 'marshmallows'
  };

  // словарь для nutritionFacts
  var typeOfNutrition = {
    'sugar-free': 'sugar',
    'vegetarian': 'vegetarian',
    'gluten-free': 'gluten'
  };

  var showNoResultBlock = function () {
    var noResultTemplate = document.querySelector('#empty-filters').content.cloneNode(true);
    catalogCardsElement.appendChild(noResultTemplate.querySelector('.catalog__empty-filter'));
  };

  // функция для обновления фильтров
  var makeFiltersGreatAgain = function () {
    window.currentFilters.foodType = [];
    window.currentFilters.foodProperty = [];
    var inputFoodTypeElements = [].slice.call(filtersWrapper.querySelectorAll('input[name="food-type"]:checked'));
    var inputFoodPropertyFilters = [].slice.call(filtersWrapper.querySelectorAll('input[name="food-property"]:checked'));
    inputFoodTypeElements.forEach(function (elem) {
      window.currentFilters.foodType.push(elem.value);
    });
    inputFoodPropertyFilters.forEach(function (elem) {
      window.currentFilters.foodProperty.push(typeOfNutrition[elem.value]);
    });
    window.currentFilters.isFavorite = filtersWrapper.querySelector('#filter-favorite').checked;
    window.currentFilters.amount = filtersWrapper.querySelector('#filter-availability').checked;
    window.currentFilters.currentSort = filtersWrapper.querySelector('input[name="sort"]:checked').value;
  };

  // функция сравнения популярности
  var comparePopularity = function (a, b) {
    return b.rating.number - a.rating.number;
  };

  // функция сравнения цен (от большего к меньшему)
  var compareExpensivePrices = function (a, b) {
    return b.price - a.price;
  };

  // функция сравнения цен (от большего к меньшему), хотя можно было просто параметры переставить местами при ее вызове, но да ладно
  var compareCheapPrices = function (a, b) {
    return a.price - b.price;
  };

  // функция сравнения рейтинга
  var compareRatings = function (a, b) {
    return b.rating.value - a.rating.value;
  };

  // функция для отлавливания типа сортировки
  var selectCurrentSort = function (a, b) {
    var sortType;
    switch (window.currentFilters.currentSort) {
      case 'popular':
        sortType = comparePopularity(a, b);
        break;
      case 'expensive':
        sortType = compareExpensivePrices(a, b);
        break;
      case 'cheep':
        sortType = compareCheapPrices(a, b);
        break;
      case 'rating':
        sortType = compareRatings(a, b);
        break;
    }
    return sortType;
  };

  // вынесу проверку type & property в отдельные функции, чтобы возвращать сразу true либо false
  var checkType = function (elem) {
    var ind = typeOfKind[elem.kind];
    return window.currentFilters.foodType.indexOf(ind) > -1;
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

    if (window.currentFilters.foodType.length > 0) {
      foodTypeMatch = checkType(elem);
    } else {
      foodTypeMatch = true;
    }

    if (window.currentFilters.foodProperty.length > 0) {
      foodPropertyMatch = checkProperty(elem);
    } else {
      foodPropertyMatch = true;
    }

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
    makeFiltersGreatAgain();
    return array.filter(filterCatalogGoods).sort(selectCurrentSort);
  };

  // функция для удаления всех карточек перед прорисовкой отфильтрованных
  var deleteCardsFromCatalog = function () {
    var cards = catalogCardsElement.querySelectorAll('.catalog__card');

    for (var i = 0; i < cards.length; i++) {
      catalogCardsElement.removeChild(cards[i]);
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

    window.debounce(window.generateNewOnFilterChanges());
  };

  var makeNewCatalog = function (array) {
    deleteCardsFromCatalog();
    catalogCardsElement.appendChild(window.renderCatalog(array));
  };

  window.generateNewOnFilterChanges = function () {
    window.filteredCards = applyFilters(window.cards);
    makeNewCatalog(window.filteredCards);

    if (window.filteredCards.length === 0) {
      showNoResultBlock();
    }
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
    filtersForm.reset();
    window.debounce(window.generateNewOnFilterChanges());
    window.debounce(window.resetRangeFiltersValue());
  });

  filtersForm.addEventListener('change', onFormChange);

})();
