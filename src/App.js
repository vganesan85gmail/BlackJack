import React from 'react';
import Card from './Card';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = { deck: [], dealer: null, player: null, gameOver: false, message: null };
	}
	
	componentWillMount() {
		this.startNewGame();
	}
	generateCardNos() {debugger;
		const cards = [2,3,4,5,6,7,8,9,10,'J','Q','K','A'];
		const suits = ['♦','♣','♥','♠'];
		const deck = [];
		for (let i = 0; i < cards.length; i++) {
		  for (let j = 0; j < suits.length; j++) {
			deck.push({number: cards[i], suit: suits[j]});
		  }
		}
		return deck;
	}
  
	dealCards(deck) {debugger;
		const playerCard1 = this.getRandomCard(deck);
		const dealerCard1 = this.getRandomCard(playerCard1.updatedDeck);
		const playerCard2 = this.getRandomCard(dealerCard1.updatedDeck);    
		const playerStartingHand = [playerCard1.randomCard, playerCard2.randomCard];
		const dealerStartingHand = [dealerCard1.randomCard, {}];
		
		const player = {
		  cards: playerStartingHand,
		  count: this.getCount(playerStartingHand)
		};
		const dealer = {
		  cards: dealerStartingHand,
		  count: this.getCount(dealerStartingHand)
		};
		
		return {updatedDeck: playerCard2.updatedDeck, player, dealer};
	}

    startNewGame(type) {debugger;
		const deck = this.generateCardNos();
        const { updatedDeck, player, dealer } = this.dealCards(deck);

		this.setState({ deck: updatedDeck, dealer, player, gameOver: false, message: null });
    }
       
	getRandomCard(deck) {debugger;
		const updatedDeck = deck;
		const randomIndex = Math.floor(Math.random() * updatedDeck.length);
		const randomCard = updatedDeck[randomIndex];
		updatedDeck.splice(randomIndex, 1);
		return { randomCard, updatedDeck };
	}
  
    hit() {debugger;
		if (!this.state.gameOver) {
			const { randomCard, updatedDeck } = this.getRandomCard(this.state.deck);
			const player = this.state.player;
			player.cards.push(randomCard);
			player.count = this.getCount(player.cards);

			if (player.count > 21) {
			  this.setState({ player, gameOver: true, message: 'Dealer win!' });
			} else {
			  this.setState({ deck: updatedDeck, player });
			}
		} else {
			this.setState({ message: 'Game over! Please start a new game.' });
		}
    }
  
	dealerDraw(dealer, deck) {debugger;
		const { randomCard, updatedDeck } = this.getRandomCard(deck);
		dealer.cards.push(randomCard);
		dealer.count = this.getCount(dealer.cards);
		return { dealer, updatedDeck };
	}
  
	getCount(cards) {debugger;
		return cards.reduce((total, card) => {
		  if (card.number === 'J' || card.number === 'Q' || card.number === 'K') {
			return total + 10;
		  } else if (card.number === 'A') {
			return (total + 11 <= 21) ? total + 11 : total + 1;
		  } else {
			return total + (card.number || 0);
		  }
		}, 0);
	}
  
	stick() {debugger;
		if (!this.state.gameOver) {
		  const randomCard = this.getRandomCard(this.state.deck);
		  let deck = randomCard.updatedDeck;
		  let dealer = this.state.dealer;
		  dealer.cards.pop();
		  dealer.cards.push(randomCard.randomCard);
		  dealer.count = this.getCount(dealer.cards);

		  while(dealer.count < 17) {
			const draw = this.dealerDraw(dealer, deck);
			dealer = draw.dealer;
			deck = draw.updatedDeck;
		  }

		  if (dealer.count > 21) {
			this.setState({
			  deck,
			  dealer,
			  gameOver: true,
			  message: 'You win!'
			});
		  } else {
			const winner = this.getStatus(dealer, this.state.player);
			let message;
			
			if (winner === 'dealer') {
			  message = 'Dealer win!';
			} else if (winner === 'player') {
			  message = 'You win!';
			} else {
			  message = 'Both are equal.';
			}
			
			this.setState({ deck,  dealer, gameOver: true, message });
		  } 
		} else {
		  this.setState({ message: 'Game over! Please start a new game.' });
		}
	}
  
	getStatus(dealer, player) {debugger;
		if (dealer.count > player.count) {
		  return 'dealer';
		} else if (dealer.count < player.count) {
		  return 'player';
		} else {
		  return 'push';
		}
	}
  
	render() {
		return (
		  <div>
			<h1>Black Jack</h1>
			<div className="buttons">
			  <button onClick={() => {this.startNewGame()}}>New Game</button>
			  <button onClick={() => {this.hit()}}>Hit</button>
			  <button onClick={() => {this.stick()}}>Stick</button>
			</div>
			
			<p>Your Hand ({ this.state.player.count })</p>
			<table className="cards">
			 <thead></thead>
			 <tbody>
			  <tr>
				{ this.state.player.cards.map((card, i) => {
				  return <Card key={i} number={card.number} suit={card.suit}/>
				}) }
			  </tr>
			 </tbody>
			</table>
			
			<p>Dealer's Hand ({ this.state.dealer.count })</p>
			<table className="cards">
			 <thead></thead>
			 <tbody>
			  <tr>
				{ this.state.dealer.cards.map((card, i) => {
				  return <Card key={i} number={card.number} suit={card.suit}/>;
				}) }
			  </tr>
			 </tbody>
			</table>
			
			<p>{ this.state.message }</p>
		  </div>
		);
	}
};

export default App;
