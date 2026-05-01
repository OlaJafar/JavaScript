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


//Functions
const displayMovements=function (movements){
  containerMovements.innerHTML='';
  movements.forEach(function (mov,i){
    const target=mov>0?'deposit':'withdrawal';
    const html=`<div class="movements__row">\n' +
      '          <div class="movements__type movements__type--${target}">${i+1} ${target}</div>\n' +
      '          <div class="movements__value">${Math.abs(mov)}€</div>\n' +
      '        </div>`
    containerMovements.insertAdjacentHTML('afterbegin',html);
  })
}



const creatUsernames=function (accounts){
  accounts.forEach(function (acc){
    acc.username=acc.owner.toLowerCase().split(' ').map(nam=>nam[0]).join('');
  });
}
creatUsernames(accounts);


const printBalance=function (movements){
  const balance=movements.reduce(function (acc,mov,i,arr){
    return acc+mov;
  },0);
  labelBalance.textContent=`${balance}€`;
}


const printSummary=function (movements){
  const incomes=movements.filter(mov=>mov>0).reduce((acc,mov,i,arr)=>acc+mov,0);
  labelSumIn.textContent=`${incomes}€`;
  const outcomes=movements.filter(mov=>mov<0).reduce((acc,mov,i,arr)=>acc+mov,0);
  labelSumOut.textContent=`${-outcomes}€`;
  const interest = movements
      .filter(mov => mov > 0)
      .map(deposit => (deposit * currentAccount.interestRate) / 100)
      .filter((int, i, arr) => {
        return int >= 1;
      }).reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
}

function update(user){
  copyMov=[...currentAccount.movements];
  copyMov.sort((a,b)=>a-b);
  printSummary(currentAccount.movements);
  printBalance(currentAccount.movements);
  if(!isSorted)
    displayMovements(currentAccount.movements);
  else
    displayMovements(copyMov);
}
//EventListeners
let currentAccount;
let isSorted=false;
let copyMov;
btnLogin.addEventListener('click',function (e){
  e.preventDefault();
  const newAccount=accounts.find((acc)=>acc.username===inputLoginUsername.value);
  currentAccount=(newAccount?newAccount:currentAccount);
  if(currentAccount?.pin===Number(inputLoginPin.value)){
    containerApp.style.opacity=100;
    inputLoginPin.value=inputLoginUsername.value=''; inputLoginPin.blur();
    labelWelcome.textContent=`Welcome, ${currentAccount.owner.split(' ')[0]}`;
    update(currentAccount);
  }
})

btnTransfer.addEventListener('click',function (e){
  e.preventDefault();
  const amount=Number(inputTransferAmount.value);
  const name=inputTransferTo.value;
  const reciever=accounts.find(acc=>acc.username===name);
  if(amount>0&&amount<=Number(labelBalance.textContent.slice(0,-1))&&reciever?.username!==currentAccount.username) {
    reciever.movements.push(amount);
    currentAccount.movements.push(-amount);
    update(currentAccount);
  }
  inputTransferTo.value='';
  inputTransferAmount.value='';
})


btnClose.addEventListener('click',function (e){
  e.preventDefault();
  if(Number(inputClosePin.value)===currentAccount.pin&&inputCloseUsername.value===currentAccount.username){
    const currentIndex=accounts.findIndex(acc=>acc===currentAccount);
    accounts.splice(currentIndex,1);
    containerApp.style.opacity=0;
    labelWelcome.textContent=`Log in to get started`;
  }
  inputCloseUsername.value='';
  inputClosePin.value='';
})

btnLoan.addEventListener('click',function (e){
  e.preventDefault();
  const amount=Number(inputLoanAmount.value);
  const ok=currentAccount.movements.some(mov=>mov>=amount*.1);
  if(ok){
    currentAccount.movements.push(amount);
    update(currentAccount);
  }
  inputLoanAmount.value='';
})

btnSort.addEventListener('click',function(e){
  isSorted=!isSorted;
  console.log(copyMov,currentAccount.movements,isSorted);
  if(!isSorted)
    displayMovements(currentAccount.movements);
  else
    displayMovements(copyMov);
})
