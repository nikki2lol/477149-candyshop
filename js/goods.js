'use strict';
var NAMES = [
  'Чесночные сливки',
  'Огуречный педант',
  'Молочная хрюша',
  'Грибной шейк',
  'Баклажановое безумие',
  'Паприколу итальяно',
  'Нинзя-удар васаби',
  'Хитрый баклажан',
  'Горчичный вызов',
  'Кедровая липучка',
  'Корманный портвейн',
  'Чилийский задира',
  'Беконовый взрыв',
  'Арахис vs виноград',
  'Сельдерейная душа',
  'Початок в бутылке',
  'Чернющий мистер чеснок',
  'Раша федераша',
  'Кислая мина',
  'Кукурузное утро',
  'Икорный фуршет',
  'Новогоднее настроение',
  'С пивком потянет',
  'Мисс креветка',
  'Бесконечный взрыв',
  'Невинные винные',
  'Бельгийское пенное',
  'Острый язычок'
];
var PICTURES = [
  'img/cards/gum-cedar.jpg',
  'img/cards/gum-chile.jpg',
  'img/cards/gum-eggplant.jpg',
  'img/cards/gum-mustard.jpg',
  'img/cards/gum-portwine.jpg',
  'img/cards/gum-wasabi.jpg',
  'img/cards/ice-cucumber.jpg',
  'img/cards/ice-eggplant.jpg',
  'img/cards/ice-garlic.jpg',
  'img/cards/ice-italian.jpg',
  'img/cards/ice-mushroom.jpg',
  'img/cards/ice-pig.jpg',
  'img/cards/marmalade-beer.jpg',
  'img/cards/marmalade-caviar.jpg',
  'img/cards/marmalade-corn.jpg',
  'img/cards/marmalade-new-year.jpg',
  'img/cards/marmalade-sour.jpg',
  'img/cards/marshmallow-bacon.jpg',
  'img/cards/marshmallow-beer.jpg',
  'img/cards/marshmallow-shrimp.jpg',
  'img/cards/marshmallow-spicy.jpg',
  'img/cards/marshmallow-wine.jpg',
  'img/cards/soda-bacon.jpg',
  'img/cards/soda-celery.jpg',
  'img/cards/soda-cob.jpg',
  'img/cards/soda-garlic.jpg',
  'img/cards/soda-peanut-grapes.jpg',
  'img/cards/soda-russian.jpg'
];
var MIN_AMOUNT = 0;
var MAX_AMOUNT = 20;
var MIN_PRICE = 100;
var MAX_PRICE = 1500;
var MIN_WEIGHT = 30;
var MAX_WEIGHT = 300;
var MIN_RATING = 1;
var MAX_RATING = 5;
var MIN_QUANTITY_RATING = 10;
var MAX_QUANTITY_RATING = 900;
var MIN_ENERGY = 70;
var MAX_ENERGY = 500;
var CONTENTS = [
  'молоко',
  'сливки',
  'вода',
  'пищевой краситель',
  'патока',
  'ароматизатор бекона',
  'ароматизатор свинца',
  'ароматизатор дуба, идентичный натуральному',
  'ароматизатор картофеля',
  'лимонная кислота',
  'загуститель',
  'эмульгатор',
  'консервант: сорбат калия',
  'посолочная смесь: соль, нитрит натрия',
  'ксилит',
  'карбамид',
  'вилларибо',
  'виллабаджо',
];
var STARS_RATING = ['stars__rating--one', 'stars__rating--two', 'stars__rating--three', 'stars__rating--four', 'stars__rating--five'];
var CATALOG_COUNT = 26;
var catalogCards = document.querySelector('.catalog__cards');
var cardTemplate = document.querySelector('#card').content.querySelector('.catalog__card');
var basketCards = document.querySelector('.goods__cards');
var basketTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');
var basketHeader = document.querySelector('.main-header__basket');
var picturesArray = PICTURES.slice();
var namesArray = NAMES.slice();

// Функция для нахождения случайного числа(включая min и max)
var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// А эта функция для переработки массива в новый с рандомным количеством значений, взятых из первого массива
var getRandomArray = function (array) {
  var newLength = Math.floor(Math.random() * array.length);
  var newArray = array.concat();

  for (var i = 0; i < array.length - newLength; i++) {
    newArray.splice(Math.floor(Math.random() * newArray.length), 1);
  }

  return newArray;
};

// Функция для создания случайного товара
var makeRandomGoods = function (i) {
  return {
    name: namesArray.splice(getRandomNumber(0, namesArray.length - 1), 1),
    picture: picturesArray.splice(getRandomNumber(0, picturesArray.length - 1), 1),
    amount: getRandomNumber(MIN_AMOUNT, MAX_AMOUNT),
    price: getRandomNumber(MIN_PRICE, MAX_PRICE),
    weight: getRandomNumber(MIN_WEIGHT, MAX_WEIGHT),
    rating: {
      value: getRandomNumber(MIN_RATING, MAX_RATING),
      number: getRandomNumber(MIN_QUANTITY_RATING, MAX_QUANTITY_RATING),
    },
    nutritionFacts: {
      sugar: Math.random() > 0.5,
      energy: getRandomNumber(MIN_ENERGY, MAX_ENERGY),
      contents: getRandomArray(CONTENTS),
    },
    index: i
  };
};

var generateItemsArray = function (count) {
  var array = [];

  for (var i = 0; i < count; i++) {
    array[i] = makeRandomGoods(i);
  }

  return array;
};

var objArray = generateItemsArray(CATALOG_COUNT);

var generateItem = function (item) {
  cardTemplate.classList.remove('card--in-stock');

  var goodsElement = cardTemplate.cloneNode(true);

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

  goodsElement.querySelector('.card__img').src = item.picture;

  goodsElement.querySelector('.card__price-container').textContent = item.price;

  goodsElement.querySelector('.card__weight').textContent = '/ ' + item.weight + ' Г';

  goodsElement.querySelector('.stars__rating').textContent = item.rating.value;

  var goodsRating = goodsElement.querySelector('.stars__rating');

  goodsRating.classList.remove('stars__rating--five');

  goodsRating.classList.add(STARS_RATING[item.rating.value - 1]);

  goodsElement.querySelector('.star__count').textContent = '(' + item.rating.number + ')';

  goodsElement.querySelector('.card__characteristic').textContent = item.nutritionFacts.sugar ? 'С сахаром. ' + item.nutritionFacts.energy + ' ккал.' : 'Без сахара. ' + item.nutritionFacts.energy + ' ккал.';

  goodsElement.querySelector('.card__composition-list').textContent = item.nutritionFacts.contents;

  goodsElement.dataset.index = item.index;

  catalogCards.appendChild(goodsElement);
};

var copyObj = function (index) {
  var basketObj;
  basketObj = Object.assign({}, objArray[index]);
  basketObj.orderedAmount = 1;
  delete basketObj.rating;
  delete basketObj.nutritionFacts;
  delete basketObj.weight;

  return basketObj;
};

var createBasketGoods = function (obj) {

  var goodsElement = basketTemplate.cloneNode(true);

  goodsElement.dataset.index = obj.index;

  goodsElement.querySelector('.card-order__title').textContent = obj.name;

  goodsElement.querySelector('.card-order__img').src = obj.picture;

  goodsElement.querySelector('.card-order__price-value').textContent = obj.price;

  goodsElement.dataset.price = obj.price;

  goodsElement.querySelector('.card-order__count').value = obj.orderedAmount;

  goodsElement.querySelector('.card-order__close').addEventListener('click', function (evt) {
    evt.preventDefault();
    obj.amount = obj.amount + goodsElement.querySelector('.card-order__count').value;
    goodsElement.querySelector('.card-order__count').value = 0;
    goodsElement.parentNode.removeChild(goodsElement);
    checkBasketArray();
  });

  goodsElement.querySelector('.card-order__btn--decrease').addEventListener('click', function (evt) {
    evt.preventDefault();
    var value = +goodsElement.querySelector('.card-order__count').value;
    if (value <= 1) {
      return;
    } else {
      value = value - 1;
      goodsElement.querySelector('.card-order__count').value = value;
      refreshPrice(goodsElement);
    }

  });

  goodsElement.querySelector('.card-order__btn--increase').addEventListener('click', function (evt) {
    evt.preventDefault();
    var value = +goodsElement.querySelector('.card-order__count').value;
    if (value >= obj.amount) {
      return;
    } else {
      value = value + 1;
      goodsElement.querySelector('.card-order__count').value = value;
      refreshPrice(goodsElement);
    }
  });

  basketCards.appendChild(goodsElement);
};

var checkBasketArray = function () {
  var basketArray = [].slice.call(document.querySelectorAll('.goods_card.card-order'));
  var basketValue = [];
  var basketPrice = [];

  if (basketArray.length === 0) {
    basketCards.classList.add('goods__cards--empty');
    basketCards.querySelector('.goods__card-empty').classList.remove('visually-hidden');
    basketHeader.textContent = 'В корзине ничего нет';
  } else {
    basketArray.forEach(function (element) {
      basketValue.push(+element.querySelector('.card-order__count').value);
    });

    var basketTotalValue = basketValue.reduce(function (a, b) {
      return a + b;
    });

    basketArray.forEach(function (element) {
      basketPrice.push(+element.querySelector('.card-order__price-value').textContent);
    });

    var basketTotalPrice = basketPrice.reduce(function (a, b) {
      return a + b;
    });

    basketCards.classList.remove('goods__cards--empty');
    basketCards.querySelector('.goods__card-empty').classList.add('visually-hidden');
    basketHeader.textContent = 'В Вашей корзине ' + basketTotalValue + ' товаров на сумму ' + basketTotalPrice + ' Р';
  }
};

var refreshPrice = function (e) {
  e.querySelector('.card-order__price-value').textContent = +e.getAttribute('data-price') * +e.querySelector('.card-order__count').value;
};

// var increaseValue = function (el) {
//   el.querySelector('.card-order__count').value = el.querySelector('.card-order__count').value + 1;
// };
//
// var decreaseValue = function (el) {
//   if (el.querySelector('.card-order__count').value === 0) {
//     return;
//   } else {
//     el.querySelector('.card-order__count').value = el.querySelector('.card-order__count').value - 1;
//   }
// };

var onFavouriteButtonsClick = function () {
  var favouriteButtons = [].slice.call(document.querySelectorAll('.card__btn-favorite'));
  favouriteButtons.forEach(function (element) {
    element.addEventListener('click', function (evt) {
      evt.preventDefault();
      element.classList.toggle('card__btn-favorite--selected');
    });
  });
};

var checkCards = function () {
  var renderedGoodsArray = [].slice.call(document.querySelectorAll('.catalog__card'));
  var addButtons = [].slice.call(document.querySelectorAll('.card__btn'));
  var clickedCard;
  var index;
  var currentCopiedObject;

  addButtons.forEach(function (element) {
    element.addEventListener('click', function (evt) {
      evt.preventDefault();
      clickedCard = evt.target.closest('.catalog__card');
      index = renderedGoodsArray.indexOf(clickedCard);
      currentCopiedObject = copyObj(index);
      var duplicateBasketCard = document.querySelector('.goods_card[data-index="' + currentCopiedObject.index + '"]');

      if (renderedGoodsArray[index].classList.contains('card--soon')) {
        return;
      }

      if (duplicateBasketCard !== null && duplicateBasketCard.querySelector('.card-order__count').value < currentCopiedObject.amount) {
        duplicateBasketCard.querySelector('.card-order__count').value = +duplicateBasketCard.querySelector('.card-order__count').value + 1;
      } else if (duplicateBasketCard !== null && duplicateBasketCard.querySelector('.card-order__count').value >= currentCopiedObject.amount) {
        return;
      } else {
        createBasketGoods(currentCopiedObject);
      }

      refreshPrice(document.querySelector('.goods_card[data-index="' + currentCopiedObject.index + '"]'));
      checkBasketArray();
    });
  });
};

var createGoodsArray = function (array) {
  for (var j = 0; j < array.length; j++) {
    generateItem(array[j]);
  }

  onFavouriteButtonsClick();
  checkCards();

  return array;
};

catalogCards.classList.remove('catalog__cards--load');
catalogCards.querySelector('.catalog__load').classList.add('visually-hidden');
createGoodsArray(objArray);
