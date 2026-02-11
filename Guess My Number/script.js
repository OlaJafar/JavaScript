'use strict'
let goal = Math.floor(Math.random() * 20) + 1;
const number=document.querySelector('.number'),
    check=document.querySelector('.check'),
    message=document.querySelector('.message'),
    score=document.querySelector('.score'),
    highscore=document.querySelector('.highscore'),
    again=document.querySelector('.again');

check.addEventListener('click',function (){
    let result;
    if(!Number(score.textContent)){
        result='💥 You lost the game!';
        document.querySelector('.guess').disabled=true;
        check.disabled=true;
    }
    else{
        let userNumber=Number(document.querySelector('.guess').value);
        if(goal===userNumber){
            document.querySelector('body').style.backgroundColor='#60b347';
            result='🎉 Correct Number!';
            document.querySelector('.guess').disabled=true;
            check.disabled=true;
            number.textContent=goal;
            highscore.textContent=Math.max(
                Number(highscore.textContent),
                Number(score.textContent)
            );
        }
        else{
            result=goal<userNumber?'📈 Too high!':'📉 Too low!';
            score.textContent--;
            if (!Number(score.textContent)) {
                result = '💥 You lost the game!';
                document.querySelector('body').style.backgroundColor='red';
            }
        }
    }
    message.textContent=result;
})

again.addEventListener('click',function (){
    goal = Math.floor(Math.random() * 20) + 1
    document.querySelector('.guess').disabled=false;
    check.disabled=false;
    score.textContent='20';
    number.textContent='?';
    message.textContent='Start guessing...';
    document.querySelector('body').style.backgroundColor='#222222';
    document.querySelector('.guess').value='';
})