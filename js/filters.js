'use strict';
// модуль для работы с фильтрами
(function () {
  var filtersWrapper = document.querySelector('.catalog__sidebar');
  var filtersForm = document.querySelector('form');
  var independentFilters = [].slice.call(filtersWrapper.querySelectorAll('.input-btn__input--independent'));
  var catalogCardsElement = document.querySelector('.catalog__cards');
  // var resetFiltersElement = filtersWrapper.querySelector('.catalog__submit');

  var filterFavoriteInputElement = filtersWrapper.querySelector('#filter-favorite');
  var filterAvailabilityInputElement = filtersWrapper.querySelector('#filter-availability');
  // var noResultBLock = document.querySelector('#empty-filters').content.querySelector('div');

  // словарь для сопоставления value типа мороженого и его брата в объекте
  var typeOfKind = {
    'filter-icecream': 'icecream',
    'filter-soda': 'soda',
    'filter-gum': 'gum',
    'filter-marmalade': 'marmalade',
    'filter-marshmallows': 'marshmallows'
  };

  // словарь для nutritionFacts
  var typeOfNutrition = {
    'sugar-free': 'sugar',
    'vegetarian': 'vegetarian',
    'gluten-free': 'gluten'
  };

  // функция для обновления фильтров
  var makeFiltersGreatAgain = function () {
    window.currentFilters.foodType = [];
    window.currentFilters.foodProperty = [];
    var inputFoodTypeElements = [].slice.call(filtersWrapper.querySelectorAll('input[name="food-type"]:checked'));
    var inputFoodPropertyFilters = [].slice.call(filtersWrapper.querySelectorAll('input[name="food-property"]:checked'));
    inputFoodTypeElements.forEach(function (elem) {
      window.currentFilters.foodType.push(elem.id);
    });
    inputFoodPropertyFilters.forEach(function (elem) {
      window.currentFilters.foodProperty.push(typeOfNutrition[elem.id]);
    });
    window.currentFilters.isFavourite = filtersWrapper.querySelector('#filter-availability').checked;
    window.currentFilters.isAvailable = filtersWrapper.querySelector('#filter-availability').checked;
    window.currentFilters.currentSort = filtersWrapper.querySelector('input[name="sort"]:checked').id;
  };

  // функция сравнения популярности
  var comparePopularity = function (a, b) {
    return b.rating.number - a.rating.number;
  };

  // функция сравнения цен (от большего к меньшему)
  var compareExpensivePrices = function (a, b) {
    return b.price > a.price;
  };

  // функция сравнения цен (от большего к меньшему), хотя можно было просто параметры переставить местами при ее вызове, но да ладно
  var compareCheapPrices = function (a, b) {
    return a.price > b.price;
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

  // Объединяю все фильтры в одну функцию для проверки элемента
  var filterCatalogGoods = function (elem) {
    var foodTypeMatch = false;
    var foodPropertyMatch = false;
    // с ценой пока не знаю что делать
    // var foodPropertyMatch = false;

    if (window.currentFilters.foodType.length > 0) {
      foodTypeMatch = function (el) {
        var ind = typeOfKind[el.kind];
        // console.log(flag);
        return window.currentFilters.foodType.indexOf(ind) > -1;
      };
    } else {
      foodTypeMatch = true;
      // присваиваю true, чтобы на финальной проверке этот фильтр не мешал другим
    }

    if (window.currentFilters.foodProperty.length > 0) {
      foodPropertyMatch = function (el) {
        // window.currentFilters.forEach(function (element, index) {
        //   return el.nutritionFacts[window.currentFilters.foodProperty[index]];
        // });
        for (var i = 0; i < window.currentFilters.foodProperty.length; i++) {
          if (el.nutritionFacts[window.currentFilters.foodProperty[i]]) {
            return el.nutritionFacts[window.currentFilters.foodProperty[i]];
          }
        }
        return false;
      };
    }

    if (window.currentFilters.isFavourite) {
      return elem.isFavourite;
    }
    // return foodTypeMatch && foodPropertyMatch && isFavourite && isAvailable;
    return foodTypeMatch && foodPropertyMatch;

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
  };

  var refreshCatalog = function () {
    var newArray = applyFilters(window.cards);
    deleteCardsFromCatalog();
    var newCatalog = window.renderCatalog(newArray);
    catalogCardsElement.appendChild(newCatalog);
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
      window.resetRangeFiltersValue();
    }
    window.debounce(refreshCatalog());
  };

  filtersForm.addEventListener('change', onFormChange);

  // объект для хранения данных о текущих примененных фильтрах
  window.currentFilters = {
    foodType: null,
    foodProperty: null,
    minPrice: null,
    maxPrice: null,
    isFavourite: false,
    isAvailable: false,
    currentSort: null
  };

})();
