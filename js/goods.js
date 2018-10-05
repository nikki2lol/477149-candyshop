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
var catalogCardsElement = document.querySelector('.catalog__cards');
var cardTemplateElement = document.querySelector('#card').content.querySelector('.catalog__card');
var basketCardsElement = document.querySelector('.goods__cards');
var basketEmptyElement = basketCardsElement.querySelector('.goods__card-empty');
var basketTemplateElement = document.querySelector('#card-order').content.querySelector('.goods_card');
var basketHeaderElement = document.querySelector('.main-header__basket');
var picturesArray = PICTURES.slice();
var namesArray = NAMES.slice();
var basketObjArray = [];

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
      contents: getRandomArray(CONTENTS).join(', ')
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

// исходный массив с объектами карточек
var objArray = generateItemsArray(CATALOG_COUNT);

// скопированный и видоизмененный массив для корзины
var copyObj = function (index) {
  var basketObj = Object.assign({}, objArray[index]);
  basketObj.orderedAmount = 1;
  basketObj.amount = objArray[index].amount;
  objArray[index].amount = objArray[index].amount - 1;
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

// функция для генерации дом-элементов карточек товара (каталог)
var renderGoodsCard = function (item) {
  cardTemplateElement.classList.remove('card--in-stock');

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
  goodsElement.querySelector('.card__btn').addEventListener('click', function (evt) {
    evt.preventDefault();
    onAddButtonClick(item.index);
  });

  goodsElement.querySelector('.card__btn-composition').addEventListener('click', function () {
    goodsElement.querySelector('.card__composition').classList.toggle('card__composition--hidden');
  });

  goodsElement.querySelector('.card__btn-favorite').addEventListener('click', function (evt) {
    evt.preventDefault();
    goodsElement.querySelector('.card__btn-favorite').classList.toggle('card__btn-favorite--selected');
  });

  catalogCardsElement.appendChild(goodsElement);
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

  if (objArray[index].amount > 0 || objArray[index].amount === 0 && delta < 0) {
    objArray[index].amount = objArray[index].amount - delta;
    currentBasketObj.orderedAmount += delta;
    card.querySelector('.card-order__count').value = currentBasketObj.orderedAmount;
  }

  // для удаления
  if (currentBasketObj.orderedAmount === 0) {
    objArray[index].amount = currentBasketObj.amount;
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
  if (objArray[index].amount > 5) {
    amountClass = 'card--in-stock';
  } else if (objArray[index].amount >= 1 && objArray[index].amount <= 5) {
    amountClass = 'card--little';
  } else {
    amountClass = 'card--soon';
  }
  renderedCard.classList.add(amountClass);
};

var onAddButtonClick = function (i) {
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

var createGoodsArray = function (array) {
  for (var j = 0; j < array.length; j++) {
    renderGoodsCard(array[j]);
  }
};

catalogCardsElement.classList.remove('catalog__cards--load');
catalogCardsElement.querySelector('.catalog__load').classList.add('visually-hidden');
createGoodsArray(objArray);
