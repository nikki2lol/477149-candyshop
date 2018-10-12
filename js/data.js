'use strict';
// модуль, который создаёт данные
(function () {
  var STARS_RATING = ['stars__rating--one', 'stars__rating--two', 'stars__rating--three', 'stars__rating--four', 'stars__rating--five'];
  var catalogCardsElement = document.querySelector('.catalog__cards');
  var catalogBasketElement = document.querySelector('.goods__cards');
  var cardTemplateElement = document.querySelector('#card').content.querySelector('.catalog__card');
  window.catalogObjArray = [];
  window.basketObjArray = [];

  // counters
  var countElements = [].slice.call(document.querySelectorAll('.input-btn__item-count'));

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

    document.querySelector('.range__count').textContent = '(' + window.catalogObjArray.length + ')';
  };

  var onGoodsElementClick = function (evt) {
    var clickedCard = event.currentTarget;
    var id = +clickedCard.getAttribute('id');
    // console.log(id);
    // console.log(window.catalogObjArray, 'window.catalogObjArray');
    var favoriteButton = clickedCard.querySelector('.card__btn-favorite');

    // объект соответственно этой карточке
    var cardInCatalog = window.getGoodsItem(id, window.catalogObjArray);

    if (evt.target === favoriteButton) {
      evt.preventDefault();
      favoriteButton.classList.toggle('card__btn-favorite--selected');
      cardInCatalog.isFavorite = !cardInCatalog.isFavorite;
    }

    if (evt.target === clickedCard.querySelector('.card__btn')) {
      evt.preventDefault();
      if (cardInCatalog.amount > 0) {
        // поиск его в корзине
        var clickedCardInOrder = window.getGoodsItem(id, window.basketObjArray);
        // console.log(clickedCardInOrder);
        if (clickedCardInOrder === undefined) {
          clickedCardInOrder = Object.assign({}, cardInCatalog);
          clickedCardInOrder.orderedAmount = 0;
          window.basketObjArray.push(clickedCardInOrder);
          catalogBasketElement.appendChild(window.createBasketGoods(clickedCardInOrder));
        }
        // вынесу повторящуюся часть из условия
        clickedCardInOrder.orderedAmount += 1;
        cardInCatalog.amount = cardInCatalog.amount - 1;
        // console.log(catalogBasketElement.querySelector('[id="' + id + '"]'));
        catalogBasketElement.querySelector('[id="' + id + '"]').querySelector('.card-order__count').value = clickedCardInOrder.orderedAmount;
      }
      window.checkBasketArray();
      window.refreshClasses(id);
    }
  };

  // функция для генерации дом-элементов карточек товара (каталог)
  var renderGoodsCard = function (item) {
    cardTemplateElement.classList.remove('card--in-stock');
    cardTemplateElement.querySelector('.stars__rating').classList.remove('stars__rating--five');

    var goodsElement = cardTemplateElement.cloneNode(true);

    var amountClass;
    if (item.amount > 5) {
      amountClass = 'card--in-stock';
    } else if (item.amount >= 1 && item.amount <= 5) {
      amountClass = 'card--little';
    } else {
      amountClass = 'card--soon';
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
    goodsElement.setAttribute('id', item.id);

    goodsElement.addEventListener('click', onGoodsElementClick);

    // goodsElement.querySelector('.card__btn').addEventListener('click', function (evt) {
    //   evt.preventDefault();
    //   var goodsElementInCatalog = window.catalogObjArray[item.id];
    //   if (window.catalogObjArray[item.id].amount >= 1) {
    //
    //     var foundCard = window.getGoodsItem(item.id, window.catalogObjArray);
    //
    //     if (foundCard === undefined) {
    //       foundCard = Object.assign({}, goodsElementInCatalog);
    //       foundCard.orderedAmount = 0;
    //       window.basketObjArray.push(foundCard);
    //       window.createBasketGoods(foundCard);
    //     }
    //
    //     window.changeValue(1, goodsElement);
    //
    //   }
    // });

    // goodsElement.querySelector('.card__btn-composition').addEventListener('click', function () {
    //   goodsElement.querySelector('.card__composition').classList.toggle('card__composition--hidden');
    // });

    var favoriteButton = goodsElement.querySelector('.card__btn-favorite');
    favoriteButton.classList.toggle('card__btn-favorite--selected', item.isFavorite);

    return goodsElement;
  };

  // функция для первичной загрузки данных и рендера каталога
  var onSuccessLoadData = function (data) {
    // console.log(data);
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

    // catalogCardsElement.appendChild(window.renderCatalog(window.catalogObjArray));

    var catalogFragment = window.renderCatalog(data);
    catalogCardsElement.append(catalogFragment);

    var sortForPrice = window.catalogObjArray.sort(function (a, b) {
      return a.price - b.price;
    });

    window.currentFilters.minPrice = sortForPrice[0].price;
    window.currentFilters.maxPrice = sortForPrice[sortForPrice.length - 1].price;

    catalogCardsElement.classList.remove('catalog__cards--load');
    catalogCardsElement.querySelector('.catalog__load').classList.add('visually-hidden');

    displayCounters();
  };

  window.refreshClasses = function (id) {
    var renderedCard = catalogCardsElement.querySelector('[id="' + id + '"]');
    var renderedCardObject = window.getGoodsItem(id, window.catalogObjArray);

    var amountClass;
    renderedCard.classList.remove('card--in-stock', 'card--little', 'card--soon');
    if (renderedCardObject.amount > 5) {
      amountClass = 'card--in-stock';
    } else if (renderedCardObject.amount >= 1 && renderedCardObject.amount <= 5) {
      amountClass = 'card--little';
    } else {
      amountClass = 'card--soon';
    }
    renderedCard.classList.add(amountClass);
  };

  window.renderCatalog = function (data) {
    var catalogElement = document.createDocumentFragment();

    for (var i = 0; i < data.length; i++) {
      var card = renderGoodsCard(data[i]);
      // console.log(data[i]);
      catalogElement.appendChild(card);
    }

    return catalogElement;
  };

  window.load(onSuccessLoadData, window.showErrorPopup);
})();
