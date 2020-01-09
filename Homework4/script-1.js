var timeEl = document.querySelector("#timer");
var mainEl = document.querySelector("#main");
var startEl = document.getElementById("startQuiz");
var questionEl = document.getElementById("question");
var btnEl= document.getElementById("btn");
var answerbuttonEl = document.getElementById("answerbutton");

// Questions to ask
// 1. Clear screen from start quiz button
// 2. Get rid of answers building up
// 3. how to get to next question after the answer
// 4. How to set up right or wrong answer
//5. How to stop timer and record time



// add listener to start quiz button//

startEl.addEventListener("click", function(){
    
    start();

    console.log(startEl)
})

// creating a function after start button is pressed that leads to a timer and a question///
    var start = function(){
       var secondsleft = 15;
       
       var timeQuestion = setInterval(function(){
           secondsleft--;
           timeEl.textContent = secondsleft;
            questloop();
        //    for(i=0; i < questions.length; i++){
        //     questionEl.textContent= (questions[i].title);
           
        // }

           if(secondsleft===0){
               clearInterval(timeQuestion);

           }
       },1000);
        
        
}



var arr = 

// ---------------------------//////////
// looping through questions////
// ----------------------------////////

// function questloop(){

//     //---To show question//
//     for(i=0; i < questions.length; i++){
//     questionEl.textContent= (questions[i].title);   
   
//  }

//  //--To get answer choices//
   
 


}




// object with questions/////////
var questions = [
    {
      title: "Commonly used data types DO NOT include:",
      choices: ["strings", "booleans", "alerts", "numbers"],
      answer: "alerts"
    },
    {
      title: "The condition in an if / else statement is enclosed within ____.",
      choices: ["quotes", "curly brackets", "parentheses", "square brackets"],
      answer: "parentheses"
    },

    {
        title: "JavaScript File Has An Extension Of____",
        choices: [".Java",".Js","javascript","xml"],
        answer: ".Js"
    },

    {
        title: "Which built-in method returns the length of the string?",
        choices:["length","size", "index", "none of the above"],
        answer: "length"
    },

    {
        title:"Which of the following function of String object returns a string representing the specified object?",
        choices:["toUpperCase()", "toLowerCase()", "toString()", "substring()"],
        answer:"toString()"
    }

]

