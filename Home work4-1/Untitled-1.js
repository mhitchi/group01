startEl = document.getElementById("startQuiz");
questionEl = document.getElementById("question");
// answerbuttonEl = document.getElementById("answerbutton");
btn1El=document.getElementById("btn1");
btn2El=document.getElementById("btn2");
btn3El=document.getElementById("btn3");
btn4El=document.getElementById("btn4");
timeEl=document.getElementById("timer");


// timer function///////////

var timerfunc = setInterval(function(){
    var secondsleft = 75;
    secondsleft--;          
    timeEl.textContent = secondsleft;
 

    if(secondsleft===0){
        clearInterval(timerfunc);

    }
  } ,1000);
  

  nextquestion();

// add listener to start quiz button//

startEl.addEventListener("click", function(event){
    event.preventDefault();
   
    
    startquiz();

    // startEl.innerHTML = "";
   
})

var startquiz = function(){
    // console.log("started")

   nextquestion();
   timerfunc();  
}

function nextquestion(){
    
for (var i=0; i < questions.length; i++){ 



   console.log (questions[i].title);
   var curquestion = questions[i].title;
   questionEl.textContent = curquestion;

  
    

}
}


// checking for accuracy////////////






       

  
       
      


