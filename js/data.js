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

  // функция для первичной загрузки данных и рендера каталога
  var onSuccessLoadData = function (data) {
    window.cards = data;
    displayCounters();
    window.findMaxAndMinPriceValue();
    window.renderCatalog(window.cards);
    window.cards.forEach(function (element) {
      element.isFavorite = false;
    });
    window.resetRangeFiltersValue();
  };

  // функция для генерации дом-элементов карточек товара (каталог)
  window.renderGoodsCard = function (item, id) {
    cardTemplateElement.classList.remove('card--in-stock');
    cardTemplateElement.querySelector('.stars__rating').classList.remove('stars__rating--five');

    var goodsElement = cardTemplateElement.cloneNode(true);

    var amountClass;
    if (item.amount > 5) {
      amountClass = 'card--in-stock';
      item.isAvailable = true;
    } else if (item.amount >= 1 && item.amount <= 5) {
      amountClass = 'card--little';
      item.isAvailable = true;
    } else {
      amountClass = 'card--soon';
      item.isAvailable = false;
    }
    goodsElement.classList.add(amountClass);
    goodsElement.querySelector('.card__title').textContent = item.name;
    goodsElement.querySelector('.card__img').src = 'img/cards/' + item.picture;
    goodsElement.querySelector('.card__price-container').textContent = item.price;
    goodsElement.querySelector('.card__weight').textContent = '/ ' + item.weight + ' Г';
    // goodsElement.querySelector('.stars__rating').textContent = item.rating.value;
    goodsElement.querySelector('.stars__rating').classList.add(STARS_RATING[item.rating.value - 1]);
    // goodsElement.classList.add(STARS_RATING[item.rating.value - 1]);
    goodsElement.querySelector('.star__count').textContent = '(' + item.rating.number + ')';
    goodsElement.querySelector('.card__characteristic').textContent = item.nutritionFacts.sugar ? 'С сахаром. ' + item.nutritionFacts.energy + ' ккал.' : 'Без сахара. ' + item.nutritionFacts.energy + ' ккал.';
    goodsElement.querySelector('.card__composition-list').textContent = item.nutritionFacts.contents;
    goodsElement.dataset.index = id;

    goodsElement.querySelector('.card__btn').addEventListener('click', function (evt) {
      evt.preventDefault();
      window.onAddButtonClick(id);
    });

    goodsElement.querySelector('.card__btn-composition').addEventListener('click', function () {
      goodsElement.querySelector('.card__composition').classList.toggle('card__composition--hidden');
    });

    goodsElement.querySelector('.card__btn-favorite').addEventListener('click', function (evt) {
      evt.preventDefault();
      goodsElement.querySelector('.card__btn-favorite').classList.toggle('card__btn-favorite--selected');

      if (goodsElement.querySelector('.card__btn-favorite').classList.contains('card__btn-favorite--selected')) {
        item.isFavorite = true;
      } else {
        item.isFavorite = false;
      }
    });

    if (item.isFavorite) {
      goodsElement.querySelector('.card__btn-favorite').classList.add('card__btn-favorite--selected');
    } else {
      goodsElement.querySelector('.card__btn-favorite').classList.remove('card__btn-favorite--selected');
    }

    return goodsElement;
  };

  window.renderCatalog = function (array) {
    var emptyElement = document.createDocumentFragment();

    for (var i = 0; i < array.length; i++) {
      var card = window.renderGoodsCard(array[i], array[i].id);
      array[i].id = i;
      array[i].dom = card;
      emptyElement.appendChild(card);
    }

    catalogCardsElement.classList.remove('catalog__cards--load');
    catalogCardsElement.querySelector('.catalog__load').classList.add('visually-hidden');
    catalogCardsElement.appendChild(emptyElement);
  };


  window.load(onSuccessLoadData, window.showErrorPopup);
})();
