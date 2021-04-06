'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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
//displays each transaction
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ' ';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    }  ${type}</div>
          <div class="movements__value">${mov}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//creates a username for any account on the system = initals
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => /*return*/ name[0])
      .join('');
  });
};

createUsernames(accounts);

const updateUI = function (acc) {
  //Display Movements
  displayMovements(acc.movements);
  //Display balance
  calcDisplayBalance(acc);
  //display summary
  calcDisplaySummary(acc);
};
//displays the current balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur);

  labelBalance.textContent = `${acc.balance}€`;
};
//displays summary
const calcDisplaySummary = function (acc) {
  //calculates income
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;
  //calculates outgoing
  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc - mov, 0);
  labelSumOut.textContent = `${outcomes}€`;
  //calculates interest
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

//Event Handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  //prevents the form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;
    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //update. UI
    updateUI(currentAccount);
  }
});
//transfers money to another account
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  //makes sure the account is vaild and not the same account with the right amount of money
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    //Add movement to the account
    currentAccount.movements.push(amount);

    //update UI
    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('delete');

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    //delete account
    accounts.splice(index, 1);
    //hides the UI
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = '';
    inputClosePin.blur();
    labelWelcome.textContent = 'Log in to get started';
  }
});
let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/*const euroToUSD = 1.1;

const movementsUSD = movements.map(function (mov) {
  return mov * euroToUSD;
});

console.log(movements);
console.log(movementsUSD);

const movementsUSDfor = [];
for (const mov of movements) movementsUSDfor.push(mov * euroToUSD);
console.log(movementsUSDfor);

const movementsUSDsingle = movements.map(mov => mov * euroToUSD);
console.log(movementsUSDsingle);

const movementsDescriptions = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'depsoit' : 'withdrew'} ${Math.abs(
      mov
    )}`
);

console.log(movementsDescriptions);*/
/////////////////////////////////////////////////
//CODING CHALLENGE ONE ///////////////////////////////////////////////////////////////
//Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
//Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
/*const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJuliaCorrected = dogsJulia.slice();
  dogsJuliaCorrected.splice(0, 1);
  dogsJuliaCorrected.splice(-2);
  const dogs = dogsJuliaCorrected.concat(dogsKate);
  dogs.forEach(function (dog, i) {
    if (dog >= 3) {
      console.log(`Dog number ${i + 1} is an adult, and is ${dog} Years old`);
    } else {
      console.log(`Dog number ${i + 1} is still a puppy`);
    }
  });
};

checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);*/
////////////////////////////////////////////////////////////////////////////////////////////////////////

/*const deposits = movements.filter(function (mov) {
  return mov > 0;
});

console.log(movements);
console.log(deposits);

const depositsFor = [];
for (const mov of movements) if (mov > 0) depositsFor.push(mov);

console.log(depositsFor);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);*/

//console.log(movements);

//accumulator => SNOWBALL
//goes through and adds the curr to the acc step by step e.g
//const balance = movements.reduce(
// function (acc, cur, i, arr) {
//console.log(`Iteration ${i}: ${acc}`);
//  return acc + cur;
//  } /*, 0*/
//);
//onst balance = movements.reduce((acc, cur) => acc + cur);
//console.log(balance);
/*
Iteration 0: 0
script.js:173 Iteration 1: 200
script.js:173 Iteration 2: 650
script.js:173 Iteration 3: 250
script.js:173 Iteration 4: 3250
script.js:173 Iteration 5: 2600
script.js:173 Iteration 6: 2470
script.js:173 Iteration 7: 2540
*/

//let balance2 = 0;
//for (const mov of movements) balance2 += mov;
//console.log(balance2);

//maxium value of array

/*const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
});

Data1: [5, 2, 4, 1, 15, 8, 3];
Data2: [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = function (ages) {
  const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
  console.log(humanAges);

  const adults = humanAges.filter(age => age >= 18);
  console.log(adults);

  const averageAge = adults.reduce((acc, age) => acc + age) / adults.length;
  console.log(averageAge);
};

calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

const calcAverageHumanAge2 = function (ages) {
  const humanAges2 = ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
  console.log(humanAges2);
};

calcAverageHumanAge2([5, 2, 4, 1, 15, 8, 3]);*/

const firstWithdrawal = movements.find(mov => mov < 0);

console.log(firstWithdrawal);
