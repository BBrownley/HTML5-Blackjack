//These select amount to bet
const betAmountButtons = document.querySelectorAll(".bet-amount-button");

//This is the classname that belongs to the bet button that is selected
const activebetAmountButtonClass = "bet-button-active";

//This will default to bet the maximum
const betMax = document.getElementById("bet-max-button");

//This will bet whichever amount is selected
let betSelected = document.getElementById("bet-selected-button");

const hitButton = document.getElementById("hit-button");
const standButton = document.getElementById("stand-button");

//Element that displays the player has left to bet
let creditsRemainingElement = document.getElementById("credits-remaining");

let bettingEnabled = true;

const highestPossibleBet = 3; //Refactor to loop through each button and get thier textContent

const cardValues = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
const cardSuits = ["Spades", "Hearts", "Clubs", "Diamonds"];
const hands = ["Player", "Dealer"];

function generateRandom(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

class Player {
  constructor() {
    this.cards = [];
    this.totalCardValue = 0;
    this.totalCardValueDisplay = document.getElementById("player-hand-value");
    this.isSoft = false;
    this.canHit = true;
    this.busted = false;
    this.name = "Player";
    this.cardContainer = document.getElementById("player-hand-cards");
    console.log("Constructor called");
  }

  generateCard() {
  	return [cardValues[generateRandom(cardValues.length)], cardSuits[generateRandom(cardSuits.length)]];
  }

  hit() {

  	if (this.canHit) {

  	console.log("Hit method called")

	  	let nextCard = this.generateCard();
	  	this.displayCard(nextCard[0], this.cardContainer); //Create HTML element

	  	console.log(`${this.name} received a ${nextCard[0]} of ${nextCard[1]}`);

	  	this.cards.push(nextCard);

	  	if (Number.isInteger(nextCard[0])) {
	  		this.totalCardValue += nextCard[0];
	  	} else {
	  		if (nextCard[0] == "A") { //It's an Ace
	  			if (!this.isSoft && this.totalCardValue <= 10) {
	  				this.totalCardValue += 11;
	  				this.isSoft = true;
	  			} else {
	  				this.totalCardValue += 1;
	  			}
	  		} else { //It's a Jack/Queen/King
	  			this.totalCardValue += 10;
	  		}
	  	}

	  	this.totalCardValueDisplay.textContent = this.totalCardValue;

	  	this.evaluateHand();

    } else {
    	console.log(`${this.name} cannot hit anymore`);
    }
  }

  displayCard(value, container) { //Update it so that the suit is also shown on the card

  	let cardObj = document.createElement("div");
  	cardObj.classList.add("card");
  	cardObj.appendChild(document.createTextNode(value));
  	container.appendChild(cardObj);

  }

 //  evaluateHand() { //Checks the new state of the object's hand and displays new result in totalCardValueDisplay

 //  /*

	//  parts:

	// 1 - Checks if the hand went over 21
	// 2 - Displays the new state of the hand in the innerHTML
	// 3 - Updates new value of hand

 //  */

 //  	if (this.totalCardValue >= 22) {
 //  		if (this.isSoft) {
 //  			this.isSoft = false;
 //  			this.totalCardValue -= 10;
 //  			this.totalCardValueDisplay.innerHTML = `${this.totalCardValue}`;
 //  			this.evaluateHand();
 //  		} else {
 //  			this.canHit = false;
 //  			this.busted = true;
 //  			console.log(`${this.name} busted with a ${this.totalCardValue}`);
 //  			this.totalCardValueDisplay.style.color = "red";
 //  			this.totalCardValueDisplay.innerHTML = `${this.totalCardValueDisplay.innerHTML} - Busted!`
 //  			dealerPlay(this);
 //  		}
 //  	} else if (this.totalCardValue == 21) {
 //  		this.canHit = false;
 //  		if (this.cards.length == 2) {
 //  			console.log(`${this.name} got a blackjack!`)
 //  			this.totalCardValueDisplay.style.color = "lightgreen";
 //  			this.totalCardValueDisplay.innerHTML = `${this.totalCardValueDisplay.innerHTML} - Blackjack!`
 //  			dealerPlay(this);
 //  		} else {
 //  			console.log(`${this.name} got a 21!`);
 //  			this.totalCardValueDisplay.style.color = "lightgreen";
 //  			this.totalCardValueDisplay.innerHTML = `${this.totalCardValueDisplay.innerHTML}!`
 //  		}
 //  	} else {
 //  		console.log(`The ${this.name}'s hand value is ${this.totalCardValue}`);
 //  	}

 //  	if (this.isSoft && this.canHit) {
 //  		this.totalCardValueDisplay.innerHTML = `${this.totalCardValueDisplay.innerHTML} (Soft)`;
 //  	}

 //  }

  checkForBust() { //Checks if hand went over 21
  	if (this.totalCardValue >= 22) {

  		if (!this.isSoft) {

  			this.canHit = false;
  			this.busted = true;

  			this.updateHTML(this.totalCardValue, "Busted");

  		} else {

  			this.isSoft = false;
  			this.totalCardValue -= 10;
  			this.updateHTML(this.totalCardValue);

  		}

  	}

  }

  checkForTwentyOne() { //Checks if hand is 21

  	if (this.totalCardValue == 21) {
  		this.canHit = false;

  		if (this.cards.length == 2) {
  			this.updateHTML(this.totalCardValue, "Blackjack!");
  		} else {
  			this.updateHTML("21!");
  		}

  	}

  }

  updateHTML(handValue, status) { //handValue = total of the player's hand, status = state of player's hand

  }

  stand() {
  	console.log(`${this.name} chose to stand with a ${this.totalCardValue}`);
  	console.log(`${this.name} bust = ${this.busted}`);
  	this.canHit = false;
  	dealerPlay(this);
  }

  talk() {
	console.log(`I am the ${this.name}.`);
  }

  reset() {
  	this.cards = [];
  	this.totalCardValue = 0;
    this.isSoft = false;
    this.canHit = true;
    console.log("Player has reset");
  }

}

class Dealer extends Player {
	constructor() {
		console.log("Dealer constructor called");
		super();
		this.limit = 17;
		this.name = "Dealer";
		this.cardContainer = document.getElementById("dealer-hand-cards");
		this.totalCardValueDisplay = document.getElementById("dealer-hand-value");
	}
	play(playerObj) {

		console.log(`Dealer is now playing vs. ${playerObj.name}`);
		console.log(`Player bust = ${playerObj.busted}`);

		if (this.totalCardValue < this.limit && this.busted == false) {
			this.hit();
			this.play(playerObj);
		} else {
			this.compareHands(playerObj);
		}

	}
	compareHands(playerObj) {

		console.log(`Comparing hands...`);

		//Win conditions depending on which hands were over 21

		if (playerObj.busted == false && this.busted == false) { //If both hands didn't bust at the end of the hand
			if (playerObj.totalCardValue > this.totalCardValue) {
				console.log("Player wins!");
			} else if (playerObj.totalCardValue == this.totalCardValue) {
				console.log("It's a tie!");
			} else {
				console.log("Dealer wins!");
			}
		} else if (playerObj.busted == false && this.busted == true) {
			console.log("Player wins!");
		} else if (playerObj.busted == true && this.busted == false) {
			console.log("Dealer wins!");
		} else if (playerObj.busted == true && dealerObj.busted == true) {
			console.log("Nobody wins!");
		} else {
			console.log("Error: Was not able to determine winner");
		}

	}
}

function resetGame() {

	if (player) {
		player.reset();
	}

	if (dealer) {
		dealer.reset();
	}

}

function dealCard(whichPlayer) {



}

function startGame() {

	player.hit();
	dealer.hit();
	player.hit();
	dealer.hit();

	hitButton.addEventListener("click", function() { //Set up player options
		player.hit();
	});

	standButton.addEventListener("click", function() { //Set up player options
		player.stand();
	});

	betAmountButtons.forEach(function(betAmountButton) {
		betAmountButton.removeEventListener("click");
	});



}

function dealerPlay(playerObj) {
	dealer.play(playerObj);
}

betMax.addEventListener("click", function() {
	if (bettingEnabled) {

		bettingEnabled = false;
		creditsRemainingElement.innerHTML = parseInt(creditsRemainingElement.textContent) - 3;

		startGame();
	}
});

betSelected.addEventListener("click", function() {

	if (bettingEnabled) {

		bettingEnabled = false;

		//Find the active bet button and get its value
		let betAmount;

		betAmountButtons.forEach(function(betAmountButton) {
			if (betAmountButton.classList.contains(activebetAmountButtonClass)) {
				betAmount = parseInt(betAmountButton.textContent);
			}
		});

		creditsRemainingElement.innerHTML = parseInt(creditsRemainingElement.textContent) - betAmount;

		startGame();

	}

});

function removeBetActiveClass() {
	betAmountButtons.forEach(function(betAmountButton) {
		if (betAmountButton.classList.contains(activebetAmountButtonClass)) {
			betAmountButton.classList.remove(activebetAmountButtonClass);
		}
	});
}

function betAmountButtonHandler() {

}

betAmountButtons.forEach(function(betAmountButton) {
	betAmountButton.addEventListener("click", function() {
		removeBetActiveClass();
		betAmountButton.classList.add(activebetAmountButtonClass);
	})
});

const player = new Player();
const dealer = new Dealer();
