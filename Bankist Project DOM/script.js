'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn=>btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Navigation Bar
document.querySelector('.nav__links').addEventListener('click',function(e){
  e.preventDefault();
  if(e.target.classList.contains('nav__link')){
    const id=e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior:"smooth"});
  }
})

//Learn More Button
const btnScrollTo=document.querySelector('.btn--scroll-to');
const section1=document.querySelector('#section--1');
btnScrollTo.addEventListener('click',function(e){
  section1.scrollIntoView({behavior:"smooth"});
})

// Tabbed component
const operationTab=document.querySelectorAll('.operations__tab-container');
const operationContent=document.querySelectorAll('.operations__content');
const operationBtn=document.querySelectorAll('.operations__tab');
operationTab.forEach(op=>op.addEventListener('click',function(e){
  const btn=e.target.closest('.operations__tab');
  if(!btn)return;
  operationBtn.forEach(b=>b.classList.remove('operations__tab--active'));
  btn.classList.add('operations__tab--active');
  const dataTab=btn.dataset.tab;
  operationContent.forEach(content=>content.classList.remove('operations__content--active'));
  operationContent[dataTab-1].classList.add('operations__content--active');
}))

//Navigation Bar
const nav=document.querySelector('.nav');
function update(e){
  if(!e.target.classList.contains('nav__link'))return;
  const siblings=e.target.closest('.nav__links').querySelectorAll('.nav__link');
  siblings.forEach(child=> {
    if(child!==e.target)
      child.style.opacity = this
  });
  document.querySelector('.nav__logo').style.opacity=this;
}
nav.addEventListener('mouseover',update.bind(.5));
nav.addEventListener('mouseout',update.bind(1));


//Sticky Nav Bar (BAD PRACTICE)
// window.addEventListener('scroll',function(e){
//   const position =document.querySelector('#section--1').getBoundingClientRect().y
//   if(position<0)nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// })

//GOOD PRACTICE
const header=document.querySelector('.header');
const navHeight=nav.getBoundingClientRect().height;
const obsCallback=function (entries,observer){
  const entry=entries[0];
  if(!entry.isIntersecting)
    nav.classList.add('sticky')
  else
    nav.classList.remove('sticky')
}
const obsOptions={
  root:null,
  threshold:0,
  rootMargin:`${-navHeight}px`
}
const observer=new IntersectionObserver(obsCallback,obsOptions);
observer.observe(header);

//Reveal Sections
function sectionCallback(entries,observer){
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.remove('section--hidden');
      observer.unobserve(entry.target);
    }
  })
}
const sectionOptions={
  root:null,
  threshold: .15
}
const sectionObserver=new IntersectionObserver(sectionCallback,sectionOptions)
const sections=document.querySelectorAll('.section');
// sections.forEach(section=>section.classList.remove('section--hidden'))
sections.forEach(section=>sectionObserver.observe(section));

//Lazy Loading Images
const imgTargets=document.querySelectorAll('img[data-src]');
const imgCallback=function(entries,observer){
    const [entry]=entries;
    if(!entry.isIntersecting)return;
    entry.target.src=entry.target.dataset.src;
    entry.target.addEventListener('load',(e)=>entry.target.classList.remove('lazy-img'));
    observer.unobserve(entry.target);
}
const imgOptions={
  root:null,
  threshold:0,
  rootMargin: '200px'
}
const imgObserver=new IntersectionObserver(imgCallback,imgOptions)
imgTargets.forEach(img=>imgObserver.observe(img));


//Sliders
const slides=document.querySelectorAll('.slide');
const slideSize=slides.length;
const btnRight=document.querySelector('.slider__btn--right');
const btnLeft=document.querySelector('.slider__btn--left');
const dotContainer=document.querySelector('.dots');
slides.forEach((slide,i)=>dotContainer.insertAdjacentHTML('beforeend',`<button class="dots__dot" data-slide="${i}"></button>`))
const dots=document.querySelectorAll('.dots__dot');

let currentSlide=0;

function transformSlides(direction){
  currentSlide=(currentSlide+direction+slideSize)%slideSize;
  slides.forEach((slide,i)=>slide.style.transform=`translateX(${(i-currentSlide)*100}%)`);
  dots.forEach(dot=>dot.classList.remove('dots__dot--active'));
  dots[currentSlide].classList.add('dots__dot--active')
}
function keys(e){
  if(e.key==='ArrowLeft')transformSlides(-1);
  else if(e.key==='ArrowRight')transformSlides(1);
}
btnRight.addEventListener('click', transformSlides.bind(null,1));
btnLeft.addEventListener('click', transformSlides.bind(null,-1));
document.addEventListener('keydown',keys);
dotContainer.addEventListener('click',function (e){
  if(!e.target.classList.contains('dots__dot'))return;
  transformSlides(e.target.dataset.slide-currentSlide);
})

transformSlides(0);

