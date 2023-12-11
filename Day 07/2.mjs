import { open } from 'node:fs/promises';

const inputHandle = await open('./input');
const input = (await inputHandle.readFile('utf8')).split('\n').filter(v => v.length > 0);
inputHandle.close();

const tieBreaker = (a, b) => {
	for (let i = 0; i < a.cards.length; i++) {
		if (cardArray.indexOf(a.cards[i]) > cardArray.indexOf(b.cards[i])) return 1;
		if (cardArray.indexOf(a.cards[i]) < cardArray.indexOf(b.cards[i])) return -1;
	}
	return 0;
}

const cardArray = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'].reverse();
const hands = input.map(v => {
	const tmp = v.split(' ');
	return {
		bid: +tmp[1],
		cards: tmp[0].split('')
	};
}).sort((a, b) => {
	const cardOccurencesA = a.cards.reduce((a, c) => { a[c] ? a[c]++ : a[c] = 1; return a }, {});
	const cardOccurencesB = b.cards.reduce((a, c) => { a[c] ? a[c]++ : a[c] = 1; return a }, {});

	const differentCardsA = Object.keys(cardOccurencesA).length;
	const differentCardsB = Object.keys(cardOccurencesB).length;

	const minA = Math.min(...Object.values(cardOccurencesA));
	const minB = Math.min(...Object.values(cardOccurencesB));

	const maxA = Math.max(...Object.values(cardOccurencesA));
	const maxB = Math.max(...Object.values(cardOccurencesB));

	// Five of a kind
	const fiveA = maxA === 5 || differentCardsA === 2 && cardOccurencesA['J'] > 0;
	const fiveB = maxB === 5 || differentCardsB === 2 && cardOccurencesB['J'] > 0;
	if (fiveA && !fiveB) return 1;
	if (!fiveA && fiveB) return -1;
	if (fiveA && fiveB) return tieBreaker(a, b);

	// Four of a kind
	const fourA = maxA === 4 || maxA === 3 && cardOccurencesA['J'] > 0 || differentCardsA === 3 && cardOccurencesA['J'] === 2;
	const fourB = maxB === 4 || maxB === 3 && cardOccurencesB['J'] > 0 || differentCardsB === 3 && cardOccurencesB['J'] === 2;
	if (fourA && !fourB) return 1;
	if (!fourA && fourB) return -1;
	if (fourA && fourB) return tieBreaker(a, b);

	// Full house
	const fullA = maxA === 3 && minA == 2 || differentCardsA === 3 && cardOccurencesA['J'] > 0;
	const fullB = maxB === 3 && minB == 2 || differentCardsB === 3 && cardOccurencesB['J'] > 0;
	if (fullA && !fullB) return 1;
	if (!fullA && fullB) return -1;
	if (fullA && fullB) return tieBreaker(a, b);

	// Three of a kind
	const threeA = maxA === 3 || differentCardsA === 4 && cardOccurencesA['J'] > 0;
	const threeB = maxB === 3 || differentCardsB === 4 && cardOccurencesB['J'] > 0;
	if (threeA && !threeB) return 1;
	if (!threeA && threeB) return -1;
	if (threeA && threeB) return tieBreaker(a, b);

	// Two pair
	const twoA = differentCardsA === 3;
	const twoB = differentCardsB === 3;
	if (twoA && !twoB) return 1;
	if (!twoA && twoB) return -1;
	if (twoA && twoB) return tieBreaker(a, b);

	// One pair
	const pairA = maxA === 2 || cardOccurencesA['J'] > 0;
	const pairB = maxB === 2 || cardOccurencesB['J'] > 0;
	if (pairA && !pairB) return 1;
	if (!pairA && pairB) return -1;
	if (pairA && pairB) return tieBreaker(a, b);

	// High card
	return tieBreaker(a, b);
});

let output = 0;

for (let i = 0; i < hands.length; i++) {
	output += hands[i].bid * (i + 1);
}

console.log(output);
