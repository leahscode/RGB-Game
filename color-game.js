var square = document.getElementsByClassName('square');
var color = [];
var mainBackground;
var headerBackground;
var boardComplete;
var difficulty;
var currentScore;
var scores = [];
var gameOver = false;
var hintsOn = false;
var numSquares = "4";

function getRandomNumber(max) {
	var random = Math.random();
	random = Math.floor(random * max);
	return random;
};
function addSquares(level) {
	$(".removeable").remove();
	while (square.length < level){
		$("#container").append('<div class="removeable ' + square[0].classList + '"></div>');
	};
};
function getColors() {
	return "rgb(" + getRandomNumber(256) + ", " + getRandomNumber(256) + ", " + getRandomNumber(256) + ")";
};
function squareFill() {
	color = [];
	$(".square").css("display", "block");
	$(".square").css("backgroundColor", function(){
	cssColor = getColors();
		color.push(cssColor);
		$(this).css("backgroundColor", cssColor);
	});
};
function displayHeader(level) {
	guessingColor = color[getRandomNumber(level)];
	$("#h1").text(guessingColor);
};//end
function changeTextContents(newButton, message, header, messageColor) {
	$("#new").text(newButton);
	$("#message").text(message);
	$("#header").css("backgroundColor", header);
	$("#message").css("color", "rgb" + messageColor);
};
function calculateScoreTotal(){
	scoreTotal = 0;
	var storedScores = localStorage.getItem("rgb " + difficulty);
	if (storedScores === null) {
		scores[difficulty] = [];
	} else {
		scores[difficulty] = storedScores.split(",");
		scores[difficulty].forEach(function(score){
			scoreTotal += parseInt(score);
		});
	}	
	return scoreTotal;
};
function round(num) {
	if (Math.floor(num) !== num) {
		num = (num).toFixed(2);
	};
	return num;
};
function displayScore() {
	var average = calculateScoreTotal() / scores[difficulty].length;
	if (isNaN(average)) {
		average = 0;
	};
	var percentPerItem = 100 / numSquares;
	var totalPercent = average * percentPerItem;
	$("#percent").text(round(totalPercent));
	$("#average").text(round(average));	
	$("#current").text(currentScore);
	$("#totalBoards").text(scores[difficulty].length);
	$("#totalScore").text(calculateScoreTotal());
}
function clearScores() {
	scores[difficulty] = [];
	localStorage.removeItem("rgb " + difficulty);
	displayScore();
};
function correctGuess() {
	changeTextContents("PLAY AGAIN?", "Correct!", guessingColor, "(30, 200, 140)");
	$("#new").focus();
	$(".square").css("backgroundColor", guessingColor);
	boardComplete = true;
	scores[difficulty].push(parseInt(currentScore));
	localStorage.setItem("rgb " + difficulty, scores[difficulty].join());
	displayScore();
	if (!hintsOn) {
		$(".rgbHints").toggleClass("rgbToggle");
	};
};
function gameLost() {
	gameOver = true;
	changeTextContents(":-(", "Game Over", guessingColor, "(20, 100, 180)");
	scores[difficulty].push(parseInt(currentScore));
	localStorage.setItem("rgb " + difficulty, scores[difficulty].join());
	displayScore();
	// scores[difficulty] = [];//for no local storage
	localStorage.removeItem("rgb " + difficulty);
	$("#newGame").focus();
};
function wrongGuess(thiss) {
	thiss.css("backgroundColor", mainBackground);
	$("#message").text("Try Again");
	$("#message").css("color", "rgb(200, 10, 140)");
	currentScore --;
	if (currentScore === 1) {
		gameLost();
	};
};
function newBoard(level) {
	squareFill();
	displayHeader(level);
	boardComplete = false;
	currentScore = level;
	changeTextContents("NEW COLORS", "Go Ahead!", headerBackground, "(240, 200, 20)");
	$("#current").text("");
	if (!hintsOn) {
		$("#rgbDemos").addClass("rgbToggle");
		$("#rgbSpace").removeClass("rgbToggle");
	};
};
function levelSetup(button, level) {
	addSquares(level);
	difficulty = button.attr("id");
	displayScore();
	newBoard(level);
	$(".levels").removeClass("selected");
	$(button).addClass("selected");
};//end
$(document).ready(function(){
	mainBackground = $("body").css("backgroundColor");
	headerBackground = $("header").css("backgroundColor");
	$(".levels").each(function(){
		scores[$(this).attr("id")] = [];
	});

	levelSetup($("#easy"), $("#easy").val());
	
	$(".size").click(function(){
		$(".square").removeClass("small med large");
		$(".square").addClass($(this).attr("id"));
		$(".size").removeClass("selected");
		$(this).addClass("selected");
	});//end
	if (localStorage.rgbcustomValue !== undefined) {
		$("#customBlock").children().val(localStorage.rgbcustomValue);
	};
	$("#custom").hover(function(){
		$(this).next().select();
	});
	$("#custom").click(function(){
		if ($("#customNumber").val() !== $("#custom").val()) {
			$("#custom").val($("#customNumber").val());
			localStorage.rgbcustomValue = $("#customNumber").val();
			difficulty = "custom";
			clearScores();
		};
	});
	$("#customNumber").on("keypress", function(event){
		if (event.keyCode === 13) {
	    	$("#custom").click();
		};
	});
	$(".levels").click(function(){
		if (numSquares !== $(this).val() || difficulty !== $(this).attr("id")) {
			numSquares = $(this).val();
			levelSetup($(this), $(this).val());
			$(".levels").removeClass("selected");
			$(this).addClass("selected");
		};
	});//end
	$("#new").click(function(){
		if (!gameOver) {
			newBoard(numSquares);
		};
	});
	$("#newGame").click(function(){
		clearScores();
		gameOver = false;
		newBoard(numSquares);
	});
	$("#container").on("click", ".square", function(){
		if (!boardComplete && $(this).css("backgroundColor") !== mainBackground/* && !gameOver*/){
			var compare = $(this).css("backgroundColor");
			compare === guessingColor ? correctGuess() : wrongGuess($(this));
		};
	});
	$("#rgbDemos span").css("color", function(){
		$(this).css("color", $(this).text());
	});
	$("#hints").click(function(){
		$(".rgbHints").toggleClass("rgbToggle");
		boardComplete ? hintsOn = false : hintsOn = !hintsOn;
	});
	$("button").click(function(){
		$(this).blur();
	});

});//end ready