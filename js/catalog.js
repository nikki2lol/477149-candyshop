'use strict';
// модуль, который работает с карточками товаров и корзиной
(function () {
  var catalogCardsElement = document.querySelector('.catalog__cards');
  var basketCardsElement = document.querySelector('.goods__cards');
  var basketEmptyElement = basketCardsElement.querySelector('.goods__card-empty');
  var basketTemplateElement = document.querySelector('#card-order').content.querySelector('.goods_card');
  var basketHeaderElement = document.querySelector('.main-header__basket');
  window.basketObjArray = [];

  // скопированный и видоизмененный массив для корзины
  var copyObj = function (index) {
    var basketObj = Object.assign({}, window.cards[index]);
    basketObj.orderedAmount = 1;
    basketObj.amount = window.cards[index].amount;
    window.cards[index].amount = window.cards[index].amount - 1;
    window.basketObjArray.push(basketObj);
    return basketObj;
  };

  var getGoodsItemIndex = function (dataIndex) {
    var found;
    for (var i = 0; i < window.basketObjArray.length; i++) {
      if (window.basketObjArray[i].id === dataIndex) {
        found = i;
        return found;
      }
    }
    return found;
  };

  // Функция для пересчета товаров, суммы и шапки корзины
  var checkBasketArray = function () {
    if (basketObjArray.length === 0) {
      basketCardsElement.classList.add('goods__cards--empty');
      basketEmptyElement.classList.remove('visually-hidden');
      basketHeaderElement.textContent = 'В корзине ничего нет';
    } else {
      var basketTotalCount = basketObjArray.length;
      var basketTotalPrice = 0;
      basketObjArray.forEach(function (element) {
        basketTotalPrice = basketTotalPrice + (element.price * element.orderedAmount);
      });

      basketCardsElement.classList.remove('goods__cards--empty');
      basketEmptyElement.classList.add('visually-hidden');
      basketHeaderElement.textContent = 'В Вашей корзине ' + basketTotalCount + ' товаров на сумму ' + basketTotalPrice + ' Р';
    }
  };

  var changeValue = function (delta, card, index) {
    var currentBasketObj = window.basketObjArray[getGoodsItemIndex(index)];

    if (window.cards[index].amount > 0 || window.cards[index].amount === 0 && delta < 0) {
      window.cards[index].amount = window.cards[index].amount - delta;
      currentBasketObj.orderedAmount += delta;
      card.querySelector('.card-order__count').value = currentBasketObj.orderedAmount;
    }

    // для удаления
    if (currentBasketObj.orderedAmount === 0) {
      window.cards[index].amount = currentBasketObj.amount;
      currentBasketObj.orderedAmount = 0;
      card.querySelector('.card-order__count').value = currentBasketObj.orderedAmount;
      card.parentNode.removeChild(card);
      window.basketObjArray.splice(getGoodsItemIndex(index), 1);
    }

    refreshData(index);
    window.checkBasketArray();
  };

  // функция для генерации дом-элементов карточек товара (корзина)
  var createBasketGoods = function (obj) {
    var goodsElement = basketTemplateElement.cloneNode(true);
    goodsElement.dataset.index = obj.id;
    goodsElement.querySelector('.card-order__title').textContent = obj.name;
    goodsElement.querySelector('.card-order__img').src = 'img/cards/' + obj.picture;
    goodsElement.querySelector('.card-order__price-value').textContent = obj.price;
    goodsElement.dataset.price = obj.price;
    goodsElement.querySelector('.card-order__count').value = obj.orderedAmount;

    goodsElement.querySelector('.card-order__close').addEventListener('click', function (evt) {
      evt.preventDefault();
      changeValue(-obj.orderedAmount, goodsElement, obj.id);
    });

    goodsElement.querySelector('.card-order__btn--decrease').addEventListener('click', function (evt) {
      evt.preventDefault();
      changeValue(-1, goodsElement, obj.id);
    }, false);

    goodsElement.querySelector('.card-order__btn--increase').addEventListener('click', function (evt) {
      evt.preventDefault();
      changeValue(1, goodsElement, obj.id);
    }, false);

    basketCardsElement.appendChild(goodsElement);
  };

  var refreshData = function (index) {
    var renderedCard = catalogCardsElement.querySelector('.card[data-index="' + index + '"]');
    var amountClass;
    renderedCard.classList.remove('card--in-stock', 'card--little', 'card--soon');
    if (window.cards[index].amount > 5) {
      amountClass = 'card--in-stock';
    } else if (window.cards[index].amount >= 1 && window.cards[index].amount <= 5) {
      amountClass = 'card--little';
    } else {
      amountClass = 'card--soon';
    }
    renderedCard.classList.add(amountClass);
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

  window.onAddButtonClick = function (i) {
    var curBasketObj = window.basketObjArray[getGoodsItemIndex(i)];

    var existObj = window.basketObjArray.some(function (element) {
      return element === curBasketObj;
    });

    if (existObj) {
      changeValue(1, basketCardsElement.querySelector('.goods_card[data-index="' + curBasketObj.id + '"]'), curBasketObj.id);
    } else {
      createBasketGoods(copyObj(i));
    }

    refreshData(i);
    window.checkBasketArray();
  };
})();
