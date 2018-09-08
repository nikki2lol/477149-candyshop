'use strict';
var GOODS_COUNT = 26;
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
var SUGAR = [true, false];
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
var catalogCards = document.querySelector('.catalog__cards');
catalogCards.classList.remove('catalog__cards--load');
catalogCards.querySelector('.catalog__load').classList.add('visually-hidden');
var cardTemplate = document.querySelector('#card').content.querySelector('.catalog__card');
cardTemplate.classList.remove('card--in-stock');


// Функция для нахождения случайного числа(включая min и max)
var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Получениe случайного значения из массива
var getRandomArrayValue = function (array) {
  return array[Math.floor(Math.random() * array.length)];
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
var makeRandomGood = function () {
  return {
    name: getRandomArrayValue(NAMES),
    pictures: getRandomArrayValue(PICTURES),
    amount: getRandomNumber(MIN_AMOUNT, MAX_AMOUNT),
    price: getRandomNumber(MIN_PRICE, MAX_PRICE),
    weight: getRandomNumber(MIN_WEIGHT, MAX_WEIGHT),
    rating: {
      value: getRandomNumber(MIN_RATING, MAX_RATING),
      number: getRandomNumber(MIN_QUANTITY_RATING, MAX_QUANTITY_RATING),
    },
    nutritionFacts: {
      sugar: getRandomArrayValue(SUGAR),
      energy: getRandomNumber(MIN_ENERGY, MAX_ENERGY),
      contents: getRandomArray(CONTENTS),
    }


  };
};

// вот тут застрял
var makeGoodsArray = function (count) {
  var array = [];

  for (var i = 0; i < count; i++) {
    array[i] = makeRandomGood();
  }

  return array;
};

(function makeDomElements() {
  // var goodElement = cardTemplate.cloneNode(true);


  makeGoodsArray(GOODS_COUNT);
})();

// var fragment = document.createDocumentFragment();
// for (var i = 0, )
// catalogCards.appendChild(fragment);
