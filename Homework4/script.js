startEl = document.getElementById("startQuiz");
questionEl = document.getElementById("question");
// answerbuttonEl = document.getElementById("answerbutton");
btn1El=document.getElementById("btn1");
btn2El=document.getElementById("btn2");
btn3El=document.getElementById("btn3");
btn4El=document.getElementById("btn4");
timeEl=document.getElementById("timer");


// timer function///////////


  

 

// add listener to start quiz button//

startEl.addEventListener("click", function(){
    
   console.log(startEl);
    
    loadquestion();

    // startEl.innerHTML = "";
   
})


// start===================start===========//

var loadquestion = function(){
    for (var i=0; i < questions.length; i++){
        console.log(questions[i].title)
        let currentQuestion = question[i].title
        if (currentQuestion < questtions.length){
            startEl.textContent = currentQuestion;
        }
        else{ alert('Game is over!')};
       
    };



// var secondsleft = 75;

// var timerfunc = setInterval (function(){
    
//     secondsleft--;          
//     timeEl.textContent = secondsleft;
 
// console.log(timerfunc);
//     if(secondsleft===0){
//         clearInterval(timerfunc);

//     }
//   } ,1000);


// checking for accuracy////////////


}



       

  
       
      


