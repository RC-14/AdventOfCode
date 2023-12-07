import { open } from 'node:fs/promises';

const inputHandle = await open('./input');
const input = (await inputHandle.readFile('utf8')).split('\n').filter(v => v.length > 0);
inputHandle.close();

const tieBreaker = (a, b) => {
	for (let i = 0; i < a.cards.length; i++) {
		if (cardArray.indexOf(a.cards[i]) > cardArray.indexOf(b.cards[i])) return 1;
		if (cardArray.indexOf(a.cards[i]) < cardArray.indexOf(b.cards[i])) return -1;
	}
}

const cardArray = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'].reverse();
const hands = input.map(v => {
	const tmp = v.split(' ');
	return {
		bid: +tmp[1],
		cards: tmp[0].split('')
	};
}).sort((a, b) => {
	// Five of a kind
	if (a.cards.every((v, i, a) => v === a[0]) && !b.cards.every((v, i, a) => v === a[0])) return 1;
	if (!a.cards.every((v, i, a) => v === a[0]) && b.cards.every((v, i, a) => v === a[0])) return -1;
	if (a.cards.every((v, i, a) => v === a[0]) && b.cards.every((v, i, a) => v === a[0])) return tieBreaker(a, b);

	const cardOccurencesA = a.cards.reduce((a, c) => { a[c] ? a[c]++ : a[c] = 1; return a }, {});
	const cardOccurencesB = b.cards.reduce((a, c) => { a[c] ? a[c]++ : a[c] = 1; return a }, {});

	const differentCardsA = Object.keys(cardOccurencesA).length;
	const differentCardsB = Object.keys(cardOccurencesB).length;

	const minA = Math.min(...Object.values(cardOccurencesA));
	const minB = Math.min(...Object.values(cardOccurencesB));

	const maxA = Math.max(...Object.values(cardOccurencesA));
	const maxB = Math.max(...Object.values(cardOccurencesB));

	// Four of a kind
	if (differentCardsA === 2 && minA === 1 && !(differentCardsB === 2 && minB === 1)) return 1;
	if (!(differentCardsA === 2 && minA === 1) && differentCardsB === 2 && minB === 1) return -1;
	if (differentCardsA === 2 && minA === 1 && differentCardsB === 2 && minB === 1) return tieBreaker(a, b);

	// Full house
	if (differentCardsA === 2 && minA === 2 && !(differentCardsB === 2 && minB === 2)) return 1;
	if (!(differentCardsA === 2 && minA === 2) && differentCardsB === 2 && minB === 2) return -1;
	if (differentCardsA === 2 && minA === 2 && differentCardsB === 2 && minB === 2) return tieBreaker(a, b);

	// Three of a kind
	if (differentCardsA === 3 && maxA === 3 && !(differentCardsB === 3 && maxB === 3)) return 1;
	if (!(differentCardsA === 3 && maxA === 3) && differentCardsB === 3 && maxB === 3) return -1;
	if (differentCardsA === 3 && maxA === 3 && differentCardsB === 3 && maxB === 3) return tieBreaker(a, b);

	// Two pair
	if (differentCardsA === 3 && maxA === 2 && !(differentCardsB === 3 && maxB === 2)) return 1;
	if (!(differentCardsA === 3 && maxA === 2) && differentCardsB === 3 && maxB === 2) return -1;
	if (differentCardsA === 3 && maxA === 2 && differentCardsB === 3 && maxB === 2) return tieBreaker(a, b);

	// One pair
	if (differentCardsA === 4 && maxA === 2 && !(differentCardsB === 4 && maxB === 2)) return 1;
	if (!(differentCardsA === 4 && maxA === 2) && differentCardsB === 4 && maxB === 2) return -1;
	if (differentCardsA === 4 && maxA === 2 && differentCardsB === 4 && maxB === 2) return tieBreaker(a, b);

	// High card
	return tieBreaker(a, b);
});

let output = 0;

for (let i = 0; i < hands.length; i++) {
	output += hands[i].bid * (i + 1);
}

console.log(output);
