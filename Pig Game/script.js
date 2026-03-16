'use strict';

//Elements
const score0=document.querySelector('#score--0')
const score1=document.querySelector('#score--1')
const current0=document.querySelector('#current--0');
const current1=document.querySelector('#current--1');
const dice=document.querySelector('.dice');
const btnRoll=document.querySelector('.btn--roll');
const btnHold=document.querySelector('.btn--hold');
const btnNew=document.querySelector('.btn--new');
//Logic
score0.textContent='0';
score1.textContent='0';
dice.style.opacity='0';
btnNew.addEventListener('click',function (){
    score0.textContent='0';
    score1.textContent='0';
    current0.textContent='0';
    current1.textContent='0';
    dice.style.opacity='0';
})
let currentPlayer=0;
function switchPlayer(){
    const player=document.querySelector(`.player--${currentPlayer}`);
    const opposite=document.querySelector(`.player--${1-currentPlayer}`);
    const current=document.querySelector(`#current--${currentPlayer}`);
    player.classList.remove('player--active');
    opposite.classList.add('player--active')
    current.textContent='0';
    currentPlayer=1-currentPlayer;
}
btnRoll.addEventListener('click',function(){
    const current=document.querySelector(`#current--${currentPlayer}`);
    const number = Math.floor(Math.random() * 6) + 1;
    dice.style.opacity='100';     dice.src=`dice-${number}.png`;
    if(number===1)
        switchPlayer();
    else
        current.textContent=`${Number(current.textContent)+number}`;
})
btnHold.addEventListener('click',function (){
    const current=document.querySelector(`#current--${currentPlayer}`);
    const score=document.querySelector(`#score--${currentPlayer}`);
    score.textContent=`${Number(score.textContent)+Number(current.textContent)}`;
    switchPlayer();
})