'use strict';
// модуль, который создаёт данные
(function () {
  var STARS_RATING = ['stars__rating--one', 'stars__rating--two', 'stars__rating--three', 'stars__rating--four', 'stars__rating--five'];
  var catalogCardsElement = document.querySelector('.catalog__cards');
  var cardTemplateElement = document.querySelector('#card').content.querySelector('.catalog__card');

  // counters
  var countElements = [].slice.call(document.querySelectorAll('.input-btn__item-count'));
  // var typeOfFilters = ['Мороженое', 'Газировка', 'Жевательная резинка', 'Мармелад', 'Зефир', 'sugar', 'vegetarian', 'gluten'];

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

  var displayCounters = function () {
    window.cards.forEach(function (element) {
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

    countElements.forEach(function (elem) {
      elem.textContent = '(' + countsObject.iceCream + ')';
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

    document.querySelector('.range__count').textContent = '(' + window.cards.length + ')';
  };

  // функция для генерации дом-элементов карточек товара (каталог)
  var renderGoodsCard = function (item) {
    cardTemplateElement.classList.remove('card--in-stock');
    cardTemplateElement.querySelector('.stars__rating').classList.remove('stars__rating--five');

    var goodsElement = cardTemplateElement.cloneNode(true);

    var amountClass;
    if (item.amount > 5) {
      amountClass = 'card--in-stock';
      // item.isAvailable = true;
    } else if (item.amount >= 1 && item.amount <= 5) {
      amountClass = 'card--little';
      // item.isAvailable = true;
    } else {
      amountClass = 'card--soon';
      // item.isAvailable = false;
    }
    goodsElement.classList.add(amountClass);
    goodsElement.querySelector('.card__title').textContent = item.name;
    goodsElement.querySelector('.card__img').src = 'img/cards/' + item.picture;
    goodsElement.querySelector('.card__price-container').textContent = item.price;
    goodsElement.querySelector('.card__weight').textContent = '/ ' + item.weight + ' Г';
    goodsElement.querySelector('.stars__rating').classList.add(STARS_RATING[item.rating.value - 1]);
    goodsElement.querySelector('.star__count').textContent = '(' + item.rating.number + ')';
    goodsElement.querySelector('.card__characteristic').textContent = item.nutritionFacts.sugar ? 'С сахаром. ' + item.nutritionFacts.energy + ' ккал.' : 'Без сахара. ' + item.nutritionFacts.energy + ' ккал.';
    goodsElement.querySelector('.card__composition-list').textContent = item.nutritionFacts.contents;
    goodsElement.dataset.index = item.id;

    goodsElement.querySelector('.card__btn').addEventListener('click', function (evt) {
      evt.preventDefault();
      window.onAddButtonClick(item.id);
    });

    goodsElement.querySelector('.card__btn-composition').addEventListener('click', function () {
      goodsElement.querySelector('.card__composition').classList.toggle('card__composition--hidden');
    });

    var btnFavourite = goodsElement.querySelector('.card__btn-favorite');
    btnFavourite.classList.toggle('card__btn-favourite--selected', item.isFavorite);

    btnFavourite.addEventListener('click', function (evt) {
      evt.preventDefault();
      btnFavourite.classList.toggle('card__btn-favorite--selected');

      if (item.isFavorite) {
        item.isFavorite = false;
      } else {
        item.isFavorite = true;
      }
    });

    return goodsElement;
  };

  // функция для первичной загрузки данных и рендера каталога
  var onSuccessLoadData = function (data) {
    for (var i = 0; i < data.length; i++) {
      data[i].id = i;
      data[i].isFavourite = false;
    }

    // для первоначального фильтра
    data.sort(function (a, b) {
      return b.rating.number - a.rating.number;
    });

    window.cards = data.slice();
    window.resetRangeFiltersValue();

    catalogCardsElement.appendChild(window.renderCatalog(data));
    catalogCardsElement.classList.remove('catalog__cards--load');
    catalogCardsElement.querySelector('.catalog__load').classList.add('visually-hidden');

    var sortForPrice = window.cards.sort(function (a, b) {
      return a.price - b.price;
    });

    window.currentFilters.minPrice = sortForPrice[0].price;
    window.currentFilters.maxPrice = sortForPrice[sortForPrice.length - 1].price;
    displayCounters();
  };

  window.renderCatalog = function (data) {
    var catalogElement = document.createDocumentFragment();
    for (var i = 0; i < data.length; i++) {
      var card = renderGoodsCard(data[i]);
      catalogElement.appendChild(card);
    }

    return catalogElement;
  };

  window.load(onSuccessLoadData, window.showErrorPopup);
})();
