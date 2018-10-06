'use strict';
// модуль, который работает с карточками товаров и корзиной
(function () {
  var catalogCardsElement = document.querySelector('.catalog__cards');
  var basketCardsElement = document.querySelector('.goods__cards');
  var basketEmptyElement = basketCardsElement.querySelector('.goods__card-empty');
  var basketTemplateElement = document.querySelector('#card-order').content.querySelector('.goods_card');
  var basketHeaderElement = document.querySelector('.main-header__basket');
  var basketObjArray = [];

  // скопированный и видоизмененный массив для корзины
  var copyObj = function (index) {
    var basketObj = Object.assign({}, window.objArray[index]);
    basketObj.orderedAmount = 1;
    basketObj.amount = window.objArray[index].amount;
    window.objArray[index].amount = window.objArray[index].amount - 1;
    basketObjArray.push(basketObj);
    return basketObj;
  };

  var getGoodsItemIndex = function (dataIndex) {
    var found;
    for (var i = 0; i < basketObjArray.length; i++) {
      if (basketObjArray[i].index === dataIndex) {
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
    var currentBasketObj = basketObjArray[getGoodsItemIndex(index)];

    if (window.objArray[index].amount > 0 || window.objArray[index].amount === 0 && delta < 0) {
      window.objArray[index].amount = window.objArray[index].amount - delta;
      currentBasketObj.orderedAmount += delta;
      card.querySelector('.card-order__count').value = currentBasketObj.orderedAmount;
    }

    // для удаления
    if (currentBasketObj.orderedAmount === 0) {
      window.objArray[index].amount = currentBasketObj.amount;
      currentBasketObj.orderedAmount = 0;
      card.querySelector('.card-order__count').value = currentBasketObj.orderedAmount;
      card.parentNode.removeChild(card);
      basketObjArray.splice(getGoodsItemIndex(index), 1);
    }

    refreshData(index);
    checkBasketArray();
  };

  // функция для генерации дом-элементов карточек товара (корзина)
  var createBasketGoods = function (obj) {
    var goodsElement = basketTemplateElement.cloneNode(true);
    goodsElement.dataset.index = obj.index;
    goodsElement.querySelector('.card-order__title').textContent = obj.name;
    goodsElement.querySelector('.card-order__img').src = obj.picture;
    goodsElement.querySelector('.card-order__price-value').textContent = obj.price;
    goodsElement.dataset.price = obj.price;
    goodsElement.querySelector('.card-order__count').value = obj.orderedAmount;

    goodsElement.querySelector('.card-order__close').addEventListener('click', function (evt) {
      evt.preventDefault();
      changeValue(-obj.orderedAmount, goodsElement, obj.index);
    });

    goodsElement.querySelector('.card-order__btn--decrease').addEventListener('click', function (evt) {
      evt.preventDefault();
      changeValue(-1, goodsElement, obj.index);
    }, false);

    goodsElement.querySelector('.card-order__btn--increase').addEventListener('click', function (evt) {
      evt.preventDefault();
      changeValue(1, goodsElement, obj.index);
    }, false);

    basketCardsElement.appendChild(goodsElement);
  };

  var refreshData = function (index) {
    var renderedCard = catalogCardsElement.querySelector('.card[data-index="' + index + '"]');
    var amountClass;
    renderedCard.classList.remove('card--in-stock', 'card--little', 'card--soon');
    if (window.objArray[index].amount > 5) {
      amountClass = 'card--in-stock';
    } else if (window.objArray[index].amount >= 1 && window.objArray[index].amount <= 5) {
      amountClass = 'card--little';
    } else {
      amountClass = 'card--soon';
    }
    renderedCard.classList.add(amountClass);
  };

  window.onAddButtonClick = function (i) {
    var curBasketObj = basketObjArray[getGoodsItemIndex(i)];

    var existObj = basketObjArray.some(function (element) {
      return element === curBasketObj;
    });

    if (existObj) {
      changeValue(1, basketCardsElement.querySelector('.goods_card[data-index="' + i + '"]'), i);
    } else {
      createBasketGoods(copyObj(i));
    }

    refreshData(i);
    checkBasketArray();
  };
})();
