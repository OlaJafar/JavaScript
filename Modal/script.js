'use strict';
const button=document.querySelectorAll('.show-modal'),
    modal=document.querySelector('.modal'),
    overlay=document.querySelector('.overlay'),
    close=document.querySelector('.close-modal');

const remove=function (){
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};
const add=function (){
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};
for(let item of button)
    item.addEventListener('click', remove);

overlay.addEventListener('click',add);

close.addEventListener('click',add);

document.addEventListener("keydown", function (e){
    if(e.key==="Escape") add();
})
