var startTime;
    var endTime;

  function displayQuestion() {
      var questionContainer = document.getElementById("question-container");
      var question = questions[currentQuestion];
      var html = "<div class='question'><div class='questiono'>Question No : " + (currentQuestion + 1) + "</div><br>" + question.question + "</div>";

      if (question.type === "mcq") {
        for (var i = 0; i < question.options.length; i++) {
          var optionHtml = "<input type='radio' id='option_" + i + "' name='option' value='" + i + "' ";

          if (question.userAnswer !== null && question.userAnswer === i) {
            optionHtml += "checked ";
          }

          optionHtml += "/>";

          optionHtml += "<label for='option_" + i + "'>" + question.options[i] + "</label><br>";

          html += optionHtml;
        }
      } else if (question.type === "integer") {
        html += "PUT ANSWER HERE: <input type='number' id='integer-answer' step='1' value='" + (question.userAnswer !== null ? question.userAnswer : "") + "'/><br>";
      }

      if (currentQuestion > 0) {
        html += "<button id='prev-btn' onclick='goToPreviousQuestion()'>Previous</button>";
      }

      questionContainer.innerHTML = html;
//    var questionIndicator = document.getElementById("questionIndicator");   "question pallete no tha yea"
 // questionIndicator.textContent = (currentQuestion + 1).toString(); 
// var qpall = document.getElementById("questionPalette");
 //   qpall.style.display = "inline-block"; 
    updateQuestionPalette();
    }
 
  

    function startQuiz() {
     
       var qppbox = document.getElementById("qpbox");
    qppbox.style.display = "block";
      
    
      var instructions = document.getElementById("instructions");
      instructions.style.display = "none";

      var startBtn = document.getElementById("start-btn");
      startBtn.style.display = "none";

      var questionContainer = document.getElementById("question-container");
      questionContainer.style.display = "block";

      var submitBtn = document.getElementById("submit-btn");
      submitBtn.style.display = "inline-block";

      var prevBtn = document.getElementById("prev-btn");
      prevBtn.style.display = "none";

      var skipBtn = document.getElementById("skip-btn");
      skipBtn.style.display = "inline-block";




      startTime = new Date();
      displayQuestion();
      // updateQuestionPalette();
    }


    function skipQuestion() {
      var question = questions[currentQuestion];
      question.skipped = true;
      question.userAnswer = null;
      question.timeTaken = getTimeTakenInSeconds();
      currentQuestion++;

      if (currentQuestion < questions.length) {
        displayQuestion();
      } else {
        showResult();
      }
    }

    function goToPreviousQuestion() {
      currentQuestion--;

      if (currentQuestion >= 0) {
        displayQuestion();
      }
    }

    function submitQuiz() {
      var question = questions[currentQuestion];

      if (question.type === "mcq") {
        var selectedOption = document.querySelector('input[name="option"]:checked');

        if (!selectedOption) {
          alert("Please select an option.");
          return;
        }

        var selectedValue = parseInt(selectedOption.value);

        question.userAnswer = selectedValue;
      } else if (question.type === "integer") {
        var integerAnswerInput = document.getElementById("integer-answer");
        var integerAnswer = Math.round(integerAnswerInput.value);

        if (isNaN(integerAnswer)) {
          alert("Please enter a valid integer.");
          return;
        }

        question.userAnswer = integerAnswer;
      }

      question.timeTaken = getTimeTakenInSeconds();

      currentQuestion++;

      if (currentQuestion < questions.length) {
        displayQuestion();
      } else {
        showResult();
      }
    }

    function showResult() {
      endTime = new Date();

      var quizContainer = document.getElementById("quiz");
      var resultContainer = document.getElementById("result");
      quizContainer.style.display = "none";
      resultContainer.style.display = "block";

      var incorrectAnswers = [];
      var score = 0;
      var skippedQuestionsCount = 0;
      var correctAnswers = 0;
      var totalTimeTaken = 0;

      var resultText = "Quiz completed.<br>";

      questions.forEach(function(question, index) {
        resultText += "<hr>";
        resultText += "<div class='questiono'>Question No " + (index + 1) + ": </div> <br><br>" + question.question + "<br><br>";

        if (question.type === "mcq") {
          resultText += "Your Answer: ";
          
          if (question.userAnswer ===null)
          {
             resultText += "<span class='incorrect-answer'>Question Skipped</span><br>";
          
              
            console.log(question.answer);
          }        

         else if (question.userAnswer === question.answer) {
            resultText += "<span class='correct-answer'>" + question.options[question.userAnswer] + "</span><br>";
            score += 4;
            correctAnswers += 1;
          } else if (question.skipped) {
            resultText += "<span class='incorrect-answer'>Question Skipped</span><br>";
            score += 0;
            skippedQuestionsCount++;
          } else {
            resultText += "<span class='incorrect-answer'>" + question.options[question.userAnswer] + "</span><br>";
            score -= 1;
            incorrectAnswers.push(index + 1);
          }
        
          resultText += "Correct Answer: <span class='correct-answer'>" + question.options[question.answer] + "</span><br>";
        } 
        else if (question.type === "integer") {
          resultText += "Your Answer: ";

          if (question.userAnswer === question.answer) {
            resultText += "<span class='correct-answer'>" + question.userAnswer + "</span><br>";
            score += 4;
            correctAnswers += 1;
          } else if (question.skipped) {
            resultText += "<span class='incorrect-answer'>Question Skipped</span><br>";
            score += 0;
            skippedQuestionsCount++;
          } else {
            resultText += "<span class='incorrect-answer'>" + question.userAnswer + "</span><br>";
            score -= 1;
            incorrectAnswers.push(index + 1);
          }

          resultText += "Correct Answer: <span class='correct-answer'>" + question.answer + "</span><br>";
        }

        totalTimeTaken += question.timeTaken;
      });

      var totalQuestions = questions.length;
      var incorrectAnswersCount = incorrectAnswers.length;

      resultText += "<hr>";
      resultText += "<h3>YOUR RESULT</h3>";
      resultText += "<br>";
      resultText += "Total Questions: " + totalQuestions + "<br>";
      resultText += "Correct Answers: " + correctAnswers + "<br>";
      resultText += "Incorrect Answers: " + incorrectAnswersCount + "<br>";
      resultText += "Skipped Questions: " + skippedQuestionsCount + "<br>";
      resultText += "Your Marks: <span id='score'>" + score + "</span><br>";
      resultText += "Total Time Taken: " + formatTime(totalTimeTaken) + "<br>";
       
      

      if (incorrectAnswers.length > 0) {
        resultText += "Incorrect Questions Number: ";
        incorrectAnswers.forEach(function(questionIndex, index) {
          resultText += questionIndex;
          if (index !== incorrectAnswers.length - 1) {
            resultText += ", ";
          
          }
        });
      }
     resultText += '<br><br><button id="attachmentButton" onclick="showPopup()">Attachments Pdf</button><br>'
      resultContainer.innerHTML = resultText;
    }

    function getTimeTakenInSeconds() {
      var currentTime = new Date();
      var timeDiff = currentTime - startTime;
      var seconds = Math.floor(timeDiff / 1000);
      return seconds;
    }

    function formatTime(seconds) {
      var hours = Math.floor(seconds / 3600);
      var minutes = Math.floor((seconds % 3600) / 60);
      var secs = seconds % 60;

      return (
        (hours < 10 ? "0" : "") +
        hours +
        ":" +
        (minutes < 10 ? "0" : "") +
        minutes +
        ":" +
        (secs < 10 ? "0" : "") +
        secs
      );
    }
    
let i=0;

  function goToQuestion(questionIndex) {
  for (let i = currentQuestion + 1; i < questions.length; i++) {
   
      questions[i].skipped = true;
     // questions[i].userAnswer = null;
    
  }
  currentQuestion = questionIndex;
   // console.log(questionIndex);
   // console.log("curr"+ currentQuestion);
   
  displayQuestion();
}


// Your existing JavaScript code here

// Updated JavaScript code for question palette highlighting
function updateQuestionPalette() {
  var questionPalette = document.getElementById("questionPalette");
  questionPalette.innerHTML = ""; // Clear existing content

  questions.forEach(function (question, index) {
    var questionNumber = index+1;
    var questionButton = document.createElement("button");
    questionButton.className = "palette-item";
    
  //  console.log(questionButton.textContent);
    if (questionNumber === currentQuestion + 1) {
      questionButton.classList.add("current"); // Add the "current" class for the current question
    }  else if (question.markedForReview) {
      questionButton.classList.add("marked-for-review");
    } 

    questionButton.textContent = questionNumber;

    questionButton.addEventListener("click", function () {
      goToQuestion(index);
    });

    questionPalette.appendChild(questionButton);
  });
}



    function toggleQuestionPalette() {
      console.log("hii 1");
  var questionPalette = document.getElementById("questionPalette");
  var questionPaletteButton = document.getElementById("question-palette-button");

  if (questionPalette.style.display === "none") {
    questionPalette.style.display = "block";
    questionPaletteButton.textContent = "Hide Questions";
  } else {
    questionPalette.style.display = "none";
    questionPaletteButton.textContent = "Show Questions";
  }
}
   
    
    

    function showPopup() {
  var popup = document.getElementById("popup");
  popup.style.display = "block"; // Show the popup
}

function closePopup() {
  var popup = document.getElementById("popup");
  popup.style.display = "none"; // Hide the popup
}

    
    function markQuestionForReview() {
      var question = questions[currentQuestion];
      console.log(question);
      question.markedForReview = true; // Set the markedForReview property to true
      question.skipped = false;
      question.userAnswer = null;
      question.timeTaken = getTimeTakenInSeconds();
      currentQuestion++;

      if (currentQuestion < questions.length) {
        displayQuestion();
      } else {
        showResult();
      }
      updateQuestionPalette();
    }
    
    
    
     updateQuestionPalette(); // Initial call to populate question palette
     
    var currentQuestion = 0;
  