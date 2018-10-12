'use strict';
// модуль, который работает с карточками товаров и корзиной
(function () {
  var STARS_RATING = ['stars__rating--one', 'stars__rating--two', 'stars__rating--three', 'stars__rating--four', 'stars__rating--five'];
  var catalogBasketElement = document.querySelector('.goods__cards');
  var cardTemplateElement = document.querySelector('#card').content.querySelector('.catalog__card');
  var catalogCardsElement = document.querySelector('.catalog__cards');
  var basketCardsElement = document.querySelector('.goods__cards');
  var basketEmptyElement = basketCardsElement.querySelector('.goods__card-empty');
  var basketTemplateElement = document.querySelector('#card-order').content.querySelector('.goods_card');
  var basketHeaderElement = document.querySelector('.main-header__basket');

  var checkAmountClasses = function (elem) {
    var amountClass;
    if (elem.amount > 5) {
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
    var renderedCard = catalogCardsElement.querySelector('[id="' + id + '"]');
    var renderedCardObject = getGoodsItem(id, window.catalogObjArray);
    renderedCard.classList.remove('card--in-stock', 'card--little', 'card--soon');
    renderedCard.classList.add(checkAmountClasses(renderedCardObject));
  };

  var onGoodsElementClick = function (evt) {
    var clickedCard = event.currentTarget;
    var id = +clickedCard.getAttribute('id');
    var favoriteButton = clickedCard.querySelector('.card__btn-favorite');

    // объект соответственно этой карточке
    var cardInCatalog = getGoodsItem(id, window.catalogObjArray);

    if (evt.target === favoriteButton) {
      evt.preventDefault();
      favoriteButton.classList.toggle('card__btn-favorite--selected');
      cardInCatalog.isFavorite = !cardInCatalog.isFavorite;
    }

    if (evt.target === clickedCard.querySelector('.card__btn')) {
      evt.preventDefault();
      if (cardInCatalog.amount > 0) {
        // поиск его в корзине
        var clickedCardInOrder = getGoodsItem(id, window.basketObjArray);
        if (!clickedCardInOrder) {
          clickedCardInOrder = Object.assign({}, cardInCatalog);
          clickedCardInOrder.orderedAmount = 0;
          window.basketObjArray.push(clickedCardInOrder);
          catalogBasketElement.appendChild(createBasketGoods(clickedCardInOrder));
        }
        // вынесу повторящуюся часть из условия
        clickedCardInOrder.orderedAmount += 1;
        cardInCatalog.amount = cardInCatalog.amount - 1;
        catalogBasketElement.querySelector('[id="' + id + '"]').querySelector('.card-order__count').value = clickedCardInOrder.orderedAmount;
      }
      window.checkBasketArray();
      refreshClasses(id);
    }
  };

  var onBasketGoodsClick = function (evt) {
    var clickedCard = evt.currentTarget;
    // создам дополнительные переменные для сокращения кода + ориентира внутри этой функции
    var catalogArray = window.catalogObjArray;
    var basketArray = window.basketObjArray;
    var id = +clickedCard.getAttribute('id');
    // и найду объекты этой карточки в массиве объектов каталога/корзины
    var clickedCardInCatalog = getGoodsItem(id, catalogArray);
    var clickedCardInBasket = getGoodsItem(id, basketArray);
    // index для того чтобы его вырезать потом из корзины
    var buttonDecrease = clickedCard.querySelector('.card-order__btn--decrease');
    var buttonIncrease = clickedCard.querySelector('.card-order__btn--increase');
    var buttonClose = clickedCard.querySelector('.card-order__close');
    var countInput = clickedCard.querySelector('.card-order__count');

    if (evt.target === buttonDecrease) {
      evt.preventDefault();
      clickedCardInCatalog.amount += 1;
      clickedCardInBasket.orderedAmount = clickedCardInBasket.orderedAmount - 1;

      if (clickedCardInBasket.orderedAmount === 0) {
        basketCardsElement.removeChild(clickedCard);
        basketArray.splice(basketArray.indexOf(clickedCardInBasket), 1);
      } else {
        countInput.value = clickedCardInBasket.orderedAmount;
      }
    }

    if (evt.target === buttonIncrease && clickedCardInCatalog.amount > 0) {
      evt.preventDefault();
      clickedCardInCatalog.amount = clickedCardInCatalog.amount - 1;
      clickedCardInBasket.orderedAmount += 1;
      countInput.value = clickedCardInBasket.orderedAmount;
    }

    if (evt.target === buttonClose) {
      evt.preventDefault();
      clickedCardInCatalog.amount += clickedCardInBasket.orderedAmount;
      basketCardsElement.removeChild(clickedCard);
      basketArray.splice(basketArray.indexOf(clickedCardInBasket), 1);
    }
    window.checkBasketArray();
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
    goodsElement.setAttribute('id', item.id);

    goodsElement.addEventListener('click', onGoodsElementClick);

    var favoriteButton = goodsElement.querySelector('.card__btn-favorite');
    favoriteButton.classList.toggle('card__btn-favorite--selected', item.isFavorite);

    return goodsElement;
  };

  // функция для генерации дом-элементов карточек товара (корзина)
  var createBasketGoods = function (obj) {
    var goodsElement = basketTemplateElement.cloneNode(true);
    goodsElement.querySelector('.card-order__title').textContent = obj.name;
    goodsElement.querySelector('.card-order__img').src = 'img/cards/' + obj.picture;
    goodsElement.querySelector('.card-order__price-value').textContent = obj.price;
    goodsElement.querySelector('.card-order__count').value = obj.orderedAmount;
    goodsElement.setAttribute('id', obj.id);
    goodsElement.addEventListener('click', onBasketGoodsClick);

    return goodsElement;
  };

  // Функция для пересчета товаров, суммы и шапки корзины
  window.checkBasketArray = function () {
    if (window.basketObjArray.length === 0) {
      basketCardsElement.classList.add('goods__cards--empty');
      basketEmptyElement.classList.remove('visually-hidden');
      basketHeaderElement.textContent = 'В корзине ничего нет';
    } else {
      var basketTotalCount = window.basketObjArray.length;
      var basketTotalPrice = 0;
      window.basketObjArray.forEach(function (element) {
        basketTotalPrice = basketTotalPrice + (element.price * element.orderedAmount);
      });

      basketCardsElement.classList.remove('goods__cards--empty');
      basketEmptyElement.classList.add('visually-hidden');
      basketHeaderElement.textContent = 'В Вашей корзине ' + basketTotalCount + ' товаров на сумму ' + basketTotalPrice + ' Р';
    }
  };

  window.clearBasketGoods = function () {
    var currentBasketArray = [].slice.call(basketCardsElement.querySelectorAll('.goods_card'));
    for (var j = 0; j < currentBasketArray.length; j++) {
      basketCardsElement.removeChild(currentBasketArray[j]);
    }
  };

  window.renderCatalog = function (data) {
    var catalogElement = document.createDocumentFragment();

    for (var i = 0; i < data.length; i++) {
      var card = renderGoodsCard(data[i]);
      catalogElement.appendChild(card);
    }

    return catalogElement;
  };
})();
