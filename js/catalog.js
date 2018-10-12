'use strict';
// модуль, который работает с карточками товаров и корзиной
(function () {
  // var catalogCardsElement = document.querySelector('.catalog__cards');
  var basketCardsElement = document.querySelector('.goods__cards');
  var basketEmptyElement = basketCardsElement.querySelector('.goods__card-empty');
  var basketTemplateElement = document.querySelector('#card-order').content.querySelector('.goods_card');
  var basketHeaderElement = document.querySelector('.main-header__basket');

  // window.changeValue = function (delta, card) {
  //   var currentCatalogArray = window.catalogObjArray;
  //   var currentBasketArray = window.basketObjArray;
  //   var id = card.getAttribute('id');
  //   var catalogGood = window.getGoodsItem(id, currentCatalogArray);
  //   var basketGood = window.getGoodsItem(id, currentBasketArray);
  //   var index = currentBasketArray.indexOf(catalogGood);
  //
  //   if (catalogGood.amount > 0 || catalogGood.amount === 0 && delta < 0) {
  //     catalogGood.amount = catalogGood.amount - delta;
  //     basketGood.orderedAmount += delta;
  //     card.querySelector('.card-order__count').value = basketGood.orderedAmount;
  //   }
  //
  //   // для удаления
  //   if (basketGood.orderedAmount === 0) {
  //     catalogGood.amount = basketGood.amount;
  //     basketGood.orderedAmount = 0;
  //     card.querySelector('.card-order__count').value = basketGood.orderedAmount;
  //     card.parentNode.removeChild(card);
  //     currentBasketArray.splice(index, 1);
  //   }
  //
  //   refreshData(index);
  //   window.checkBasketArray();
  // };

  var onBasketGoodsClick = function (evt) {
    var clickedCard = evt.currentTarget;
    // console.log(clickedCard);
    // создам дополнительные переменные для сокращения кода + ориентира внутри этой функции
    var catalogArray = window.catalogObjArray;
    var basketArray = window.basketObjArray;
    var id = +clickedCard.getAttribute('id');
    // console.log(id);
    // и найду объекты этой карточки в массиве объектов каталога/корзины
    var clickedCardInCatalog = window.getGoodsItem(id, catalogArray);
    // console.log(clickedCardInCatalog, 'clickedCardInCatalog');
    var clickedCardInBasket = window.getGoodsItem(id, basketArray);
    // console.log(clickedCardInBasket, 'clickedCardInBasket');
    // index для того чтобы его вырезать потом из корзины
    var index = basketArray.indexOf(clickedCardInCatalog);
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
        basketArray.splice(index, 1);
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
      basketArray.splice(index, 1);
    }

    window.checkBasketArray();
    window.refreshClasses(id);

  };

  // функция для генерации дом-элементов карточек товара (корзина)
  window.createBasketGoods = function (obj) {
    var goodsElement = basketTemplateElement.cloneNode(true);
    goodsElement.querySelector('.card-order__title').textContent = obj.name;
    goodsElement.querySelector('.card-order__img').src = 'img/cards/' + obj.picture;
    goodsElement.querySelector('.card-order__price-value').textContent = obj.price;
    goodsElement.querySelector('.card-order__count').value = obj.orderedAmount;
    goodsElement.setAttribute('id', obj.id);

    // goodsElement.querySelector('.card-order__close').addEventListener('click', function (evt) {
    //   evt.preventDefault();
    //   // window.changeValue(-obj.orderedAmount, goodsElement);
    // });
    //
    // goodsElement.querySelector('.card-order__btn--decrease').addEventListener('click', function (evt) {
    //   evt.preventDefault();
    //   // window.changeValue(-1, goodsElement);
    // }, false);
    //
    // goodsElement.querySelector('.card-order__btn--increase').addEventListener('click', function (evt) {
    //   evt.preventDefault();
    //   // window.changeValue(1, goodsElement);
    // }, false);

    // basketCardsElement.appendChild(goodsElement);

    // window.checkBasketArray();
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
  window.getGoodsItem = function (dataIndex, array) {
    // console.log(dataIndex, 'dataIndex');
    // console.log(array, 'array');
    // console.log(correctIndex, 'correctIndex');
    for (var i = 0; i < array.length; i++) {
      if (array[i].id === dataIndex) {
        return array[i];
      }
    }
    return undefined;
  };
})();
