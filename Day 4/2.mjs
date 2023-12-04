import { open } from 'node:fs/promises';

const inputHandle = await open('./input');
const input = (await inputHandle.readFile('utf8')).split('\n').filter(v=>v!=='');
inputHandle.close();

let output = 0;

const multipliers = [0];

const stringToNumArray = (str) => {
	const arr = [];

	str.split(' ').forEach(v => {
		if (v === '') return;
		arr.push(+v);
	});

	return arr;
}

for (let i = 0; i < input.length; i++) {
	const splitLine = input[i].split(' | ');
	
	const winningNumbers = stringToNumArray(splitLine[0].split(': ')[1]);
	const ownNumbers = stringToNumArray(splitLine[1]);

	const ownWinningNumbers = ownNumbers.filter(v => winningNumbers.includes(v));

	multipliers[i] = multipliers[i] ?? 0;

	for (let j = 1; j <= ownWinningNumbers.length; j++) {
		multipliers[i + j] = (multipliers[i + j] ?? 0) + 1 * (multipliers[i] + 1);
	}

	output += 1 * (multipliers[i] + 1);
}

console.log(output);
