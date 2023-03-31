'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2022-08-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-08-18T17:01:17.194Z',
    '2022-08-15T23:36:17.929Z',
    '2022-08-17T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  containerMovements.innerHTML = '';
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
  <div class="movements__row">
  <div class="movements__type movements__type--${type}">${i + 1} ${type} </div>
  <div class="movements__date">${displayDate}</div>
  <div class="movements__value">${formattedMov}</div>
</div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySumarry = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserNames(accounts);

const updateUI = function (acc) {
  //display movements
  displayMovements(acc);

  //display balance
  calcPrintBalance(acc);

  //display summary
  calcDisplaySumarry(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    //in each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    //when 0 second,stop timer and log out
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'log in to get started';
      containerApp.style.opacity = 0;
    }
    //decrase
    time = time - 1;
  };

  let time = 120;

  // call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

//eVENT HANDLERS
let currentAccount,timer;
//fake always logged in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;
//expersimenting with date API

btnLogin.addEventListener('click', function (e) {
  //prevent form from subbmiting

  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display ui and welcome message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //current date with API
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };
    // const locale = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // // create current date
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
if(timer) clearInterval(timer);
    timer = startLogOutTimer();

    //display
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = acc.find(acc => acc.username === inputTransferTo.value);
  inputTransferAmount.value = '';
  inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //doing transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //give a date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    //update ui
    updateUI(currentAccount);

    //reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      //add movement
      currentAccount.movements.push(amount);
      //add loan date
      currentAccount.movementsDates.push(new Date().toISOString());
      //updateUI
      updateUI(currentAccount);
      //reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    //delete account
    accounts.splice(index, 1);
    //hide ui
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputCloseUsername = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

//////////
//Lectures
/*
console.log(23 === 23.0);

// base 10-0 to 9
//binary base 2 - 0 1

console.log(0.1+0.2);

// conversion 
console.log(Number(23));
console.log(+'23');

// parsing
//base dziesiatkowy
console.log(Number.parseInt('30px',10));
console.log(Number.parseInt('e30x',10));

console.log(Number.parseFloat('2.5rem'));
console.log(Number.parseInt('2.5rem'));


console.log(Number.isNaN(23));
console.log(Number.isNaN('20'));
console.log(Number.isNaN(+'20X'));
console.log(Number.isNaN(23/0));

// checking if value is a  number
console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));
console.log(Number.isFinite(+'20x'));
console.log(Number.isFinite(20/0));

console.log(Number.isInteger(20));
console.log(Number.isInteger('20'));
console.log(Number.isInteger(+'20X'));
console.log(Number.isInteger(23/0));
*/

// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));

// const randomInt = (min, max) =>
//   Math.trunc(Math.random() * (max - min) + 1) + min;
// //00...1 -> 0... (max-min) -> min...max
// console.log(randomInt(10, 20));

// const isEven = n => n%2 === 0;
// console.log(isEven(8));
// console.log(isEven(23));
//287,460,000,000
// const diameter = 287_600_000_000;
// console.log(diameter);
// const price = 435_99;
// console.log(price);

// const transferFee = 15_00;

// const PI = 3.14_15;
// console.log(PI);

// console.log(Number('230_000'));

// console.log(2**53-1);
// console.log(Number.MAX_SAFE_INTEGER);

/*
//create a date
const now = new Date();
console.log(now);
console.log(new Date('Aug 18 2022 09:43:37'));


console.log(new Date(account1.movementsDates[0]));

//working with dates
const future = new Date(2037,10,19,15,23)
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.toISOString());
console.log(future.getTime());
*/

//pizzatimer
const ingredients = ['spinach', 'orange'];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}`),
  3000,
  ...ingredients
);
console.log('waiting...');
if (ingredients.includes('orange')) clearTimeout(pizzaTimer);

//setTimeout
setInterval(function () {
  const now = new Date();
  console.log(now.getMinutes());
}, 1000000);
