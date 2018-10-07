'use strict';
// модуль, который создаёт данные
(function () {
  var STARS_RATING = ['stars__rating--one', 'stars__rating--two', 'stars__rating--three', 'stars__rating--four', 'stars__rating--five'];
  var catalogCardsElement = document.querySelector('.catalog__cards');
  var cardTemplateElement = document.querySelector('#card').content.querySelector('.catalog__card');

  // функция для генерации дом-элементов карточек товара (каталог)
  var renderGoodsCard = function (item, id) {
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
    });

    return goodsElement;
  };

  var onSuccessLoadData = function (data) {
    window.cards = data;
    var emptyElement = document.createDocumentFragment();

    for (var i = 0; i < window.cards.length; i++) {
      window.cards[i].id = i;
      var card = renderGoodsCard(window.cards[i], i);
      emptyElement.appendChild(card);
    }
    catalogCardsElement.classList.remove('catalog__cards--load');
    catalogCardsElement.querySelector('.catalog__load').classList.add('visually-hidden');
    catalogCardsElement.appendChild(emptyElement);
  };

  window.load(onSuccessLoadData, window.showErrorPopup);
})();
