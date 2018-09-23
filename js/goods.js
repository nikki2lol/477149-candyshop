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
var picturesArray = PICTURES.slice();
var namesArray = NAMES.slice();
// var headerBasket = document.querySelector('.main-header__basket');

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
var makeRandomGoods = function () {
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
    }
  };
};

var generateItemsArray = function (count) {
  var cardArray = [];
  var basketArray = [];
  var basketObj;

  for (var i = 0; i < count; i++) {
    cardArray[i] = makeRandomGoods();
    basketObj = Object.assign({}, cardArray[i]);
    basketObj.orderedAmount = 1;
    delete basketObj.amount;
    delete basketObj.rating;
    delete basketObj.nutritionFacts;
    delete basketObj.weight;
    basketArray[i] = basketObj;
  }

  return {
    cardArray: cardArray,
    basketArray: basketArray
  };
};

var generateItem = function (item) {
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

  catalogCards.appendChild(goodsElement);
};

var createBasketGoods = function (index) {
  // for (var j = 0; j < 3; j++) {
  var renderedGoodsArray = [].slice.call(document.querySelectorAll('.catalog__card'));
  var goodsElement = basketTemplate.cloneNode(true);

  goodsElement.querySelector('.card-order__title').textContent = renderedGoodsArray[index].querySelector('.card__title').textContent;

  goodsElement.querySelector('.card-order__img').src = renderedGoodsArray[index].querySelector('.card__img').getAttribute('src');

  goodsElement.querySelector('.card-order__price').textContent = renderedGoodsArray[index].querySelector('.card__price-container').textContent + ' ₽';

  goodsElement.querySelector('.card-order__count').textContent = 1;

  basketCards.appendChild(goodsElement);
  // }
};

var addToCard = function () {

};

var onFavouriteButtonsClick = function () {
  var favouriteButtons = [].slice.call(document.querySelectorAll('.card__btn-favorite'));
  favouriteButtons.forEach(function (element) {
    element.addEventListener('click', function (evt) {
      evt.preventDefault();
      element.classList.toggle('card__btn-favorite--selected');
    });
  });
};

var onAddButtonClick = function () {
  var renderedGoodsArray = [].slice.call(document.querySelectorAll('.catalog__card'));
  var addButtons = [].slice.call(document.querySelectorAll('.card__btn'));
  addButtons.forEach(function (element) {
    element.addEventListener('click', function (evt) {
      evt.preventDefault();
      var index = renderedGoodsArray.indexOf(evt.target.closest('.catalog__card'));
      addToCard();
      createBasketGoods(index);
    });
  });
  // basketCount > 0 ? headerBasket.textContent = basketCount : headerBasket.textContent = 'В корзине ничего нет';
};

var createGoodsArray = function (array) {
  for (var j = 0; j < array.length; j++) {
    generateItem(array[j]);
  }

  onFavouriteButtonsClick();
  onAddButtonClick();

  return array;
};

catalogCards.classList.remove('catalog__cards--load');
catalogCards.querySelector('.catalog__load').classList.add('visually-hidden');
// cardTemplate.classList.remove('card--in-stock');
// basketCards.classList.remove('goods__cards--empty');
// basketCards.querySelector('.goods__card-empty').classList.add('visually-hidden');
createGoodsArray(generateItemsArray(CATALOG_COUNT).cardArray);
