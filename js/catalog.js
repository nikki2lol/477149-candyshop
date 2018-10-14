'use strict';
// модуль, который работает с карточками товаров и корзиной
(function () {
  var STARS_RATING = ['stars__rating--one', 'stars__rating--two', 'stars__rating--three', 'stars__rating--four', 'stars__rating--five'];
  var IN_STOCK_AMOUNT = 5;
  var catalogBasketElement = document.querySelector('.goods__cards');
  var cardTemplateElement = document.querySelector('#card').content.querySelector('.catalog__card');
  var catalogCardsElement = document.querySelector('.catalog__cards');
  var basketCardsElement = document.querySelector('.goods__cards');
  var basketEmptyElement = basketCardsElement.querySelector('.goods__card-empty');
  var basketTemplateElement = document.querySelector('#card-order').content.querySelector('.goods_card');
  var basketHeaderElement = document.querySelector('.main-header__basket');

  var checkAmountClasses = function (elem) {
    var amountClass;
    if (elem.amount > IN_STOCK_AMOUNT) {
      amountClass = 'card--in-stock';
    } else if (elem.amount >= 1 && elem.amount <= 5) {
      amountClass = 'card--little';
    } else {
      amountClass = 'card--soon';
    }
    return amountClass;
  };

  var getGoodsItem = function (dataIndex, array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].id === dataIndex) {
        return array[i];
      }
    }
    return null;
  };

  var refreshClasses = function (id) {
    var renderedCardElement = catalogCardsElement.querySelector('[data-id="' + id + '"]');

    if (renderedCardElement) {
      var renderedCardObject = getGoodsItem(id, window.data.catalogObjArray);
      renderedCardElement.classList.remove('card--in-stock', 'card--little', 'card--soon');
      renderedCardElement.classList.add(checkAmountClasses(renderedCardObject));
    }
  };

  var onGoodsElementClick = function (evt, id) {
    var clickedCardElement = evt.currentTarget;
    var favoriteButtonElement = clickedCardElement.querySelector('.card__btn-favorite');

    // объект соответственно этой карточке
    var cardInCatalog = getGoodsItem(id, window.data.catalogObjArray);

    if (evt.target === favoriteButtonElement) {
      evt.preventDefault();
      favoriteButtonElement.classList.toggle('card__btn-favorite--selected');
      cardInCatalog.isFavorite = !cardInCatalog.isFavorite;
    }

    if (evt.target === clickedCardElement.querySelector('.card__btn')) {
      evt.preventDefault();
      if (cardInCatalog.amount > 0) {
        // поиск его в корзине
        var clickedCardInOrder = getGoodsItem(id, window.data.basketObjArray);
        if (!clickedCardInOrder) {
          clickedCardInOrder = Object.assign({}, cardInCatalog);
          clickedCardInOrder.orderedAmount = 0;
          window.data.basketObjArray.push(clickedCardInOrder);
          catalogBasketElement.appendChild(createBasketGoods(clickedCardInOrder));
        }
        changeValue(1, clickedCardElement, id);
      }
    }
  };

  var onBasketGoodsClick = function (evt, id) {
    var clickedCardElement = evt.currentTarget;

    var buttonDecreaseElement = clickedCardElement.querySelector('.card-order__btn--decrease');
    var buttonIncreaseElement = clickedCardElement.querySelector('.card-order__btn--increase');
    var buttonCloseElement = clickedCardElement.querySelector('.card-order__close');

    if (evt.target === buttonDecreaseElement) {
      evt.preventDefault();
      changeValue(-1, clickedCardElement, id);
    }

    if (evt.target === buttonIncreaseElement) {
      evt.preventDefault();
      changeValue(1, clickedCardElement, id);
    }

    if (evt.target === buttonCloseElement) {
      evt.preventDefault();
      changeValue(-getGoodsItem(id, window.data.basketObjArray).orderedAmount, clickedCardElement, id);
    }
  };

  var changeValue = function (delta, card, id) {
    var catalogGoods = window.data.catalogObjArray;
    var basketGoods = window.data.basketObjArray;
    var clickedCardInCatalog = getGoodsItem(id, catalogGoods);
    var clickedCardInBasket = getGoodsItem(id, basketGoods);
    if (clickedCardInCatalog.amount > 0 || clickedCardInCatalog.amount === 0 && delta < 0) {
      clickedCardInCatalog.amount = clickedCardInCatalog.amount - delta;
      clickedCardInBasket.orderedAmount += delta;
      catalogBasketElement.querySelector('[data-index="' + id + '"]').querySelector('.card-order__count').value = clickedCardInBasket.orderedAmount;
    }

    // для удаления
    if (clickedCardInBasket.orderedAmount === 0) {
      clickedCardInCatalog.amount = clickedCardInBasket.amount;
      clickedCardInBasket.orderedAmount = 0;
      card.parentNode.removeChild(card);
      window.data.basketObjArray.splice(basketGoods.indexOf(clickedCardInBasket), 1);
    }

    window.catalog.checkBasketArray();
    refreshClasses(id);
  };

  // функция для генерации дом-элементов карточек товара (каталог)
  var renderGoodsCard = function (item) {
    cardTemplateElement.classList.remove('card--in-stock');
    cardTemplateElement.querySelector('.stars__rating').classList.remove('stars__rating--five');

    var goodsElement = cardTemplateElement.cloneNode(true);
    goodsElement.classList.add(checkAmountClasses(item));
    goodsElement.querySelector('.card__title').textContent = item.name;
    goodsElement.querySelector('.card__img').src = 'img/cards/' + item.picture;
    goodsElement.querySelector('.card__price-container').textContent = item.price;
    goodsElement.querySelector('.card__weight').textContent = '/ ' + item.weight + ' Г';
    goodsElement.querySelector('.stars__rating').classList.add(STARS_RATING[item.rating.value - 1]);
    goodsElement.querySelector('.star__count').textContent = '(' + item.rating.number + ')';
    goodsElement.querySelector('.card__characteristic').textContent = item.nutritionFacts.sugar ? 'С сахаром. ' + item.nutritionFacts.energy + ' ккал.' : 'Без сахара. ' + item.nutritionFacts.energy + ' ккал.';
    goodsElement.querySelector('.card__composition-list').textContent = item.nutritionFacts.contents;
    goodsElement.querySelector('.card__btn-composition').addEventListener('click', function () {
      goodsElement.querySelector('.card__composition').classList.toggle('card__composition--hidden');
    });
    goodsElement.dataset.id = item.id;

    goodsElement.addEventListener('click', function (evt) {
      onGoodsElementClick(evt, item.id);
    });

    var favoriteButtonElement = goodsElement.querySelector('.card__btn-favorite');
    favoriteButtonElement.classList.toggle('card__btn-favorite--selected', item.isFavorite);

    return goodsElement;
  };

  // функция для генерации дом-элементов карточек товара (корзина)
  var createBasketGoods = function (obj) {
    var goodsElement = basketTemplateElement.cloneNode(true);
    goodsElement.querySelector('.card-order__title').textContent = obj.name;
    goodsElement.querySelector('.card-order__img').src = 'img/cards/' + obj.picture;
    goodsElement.querySelector('.card-order__price-value').textContent = obj.price;
    goodsElement.querySelector('.card-order__count').value = obj.orderedAmount;
    goodsElement.dataset.index = obj.id;
    goodsElement.addEventListener('click', function (evt) {
      onBasketGoodsClick(evt, obj.id);
    });

    return goodsElement;
  };

  window.catalog = {
    // Функция для пересчета товаров, суммы и шапки корзины
    checkBasketArray: function () {
      if (window.data.basketObjArray.length === 0) {
        basketCardsElement.classList.add('goods__cards--empty');
        basketEmptyElement.classList.remove('visually-hidden');
        basketHeaderElement.textContent = 'В корзине ничего нет';
      } else {
        var basketTotalCount = window.data.basketObjArray.length;
        var basketTotalPrice = 0;
        window.data.basketObjArray.forEach(function (element) {
          basketTotalPrice = basketTotalPrice + (element.price * element.orderedAmount);
        });

        basketCardsElement.classList.remove('goods__cards--empty');
        basketEmptyElement.classList.add('visually-hidden');
        basketHeaderElement.textContent = 'В Вашей корзине ' + basketTotalCount + ' товаров на сумму ' + basketTotalPrice + ' Р';
      }

      window.order.disableInputs(window.data.basketObjArray.length === 0);
    },

    clearBasketGoods: function () {
      var currentBasketArray = basketCardsElement.querySelectorAll('.goods_card');
      for (var j = 0; j < currentBasketArray.length; j++) {
        basketCardsElement.removeChild(currentBasketArray[j]);
      }
    },

    renderCatalog: function (data) {
      var catalogElement = document.createDocumentFragment();

      for (var i = 0; i < data.length; i++) {
        var cardElement = renderGoodsCard(data[i]);
        catalogElement.appendChild(cardElement);
      }

      return catalogElement;
    }
  };
})();
