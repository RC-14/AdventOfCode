import { open } from 'node:fs/promises';

const inputHandle = await open('./input');
const input = (await inputHandle.readFile('utf8')).split('\n').filter(v=>v!=='');
inputHandle.close();

let output = 0;

const stringToNumArray = (str) => {
	const arr = [];

	str.split(' ').forEach(v => {
		if (v === '') return;
		arr.push(+v);
	});

	return arr;
}

for (const line of input) {
	const splitLine = line.split(' | ');
	
	const winningNumbers = stringToNumArray(splitLine[0].split(': ')[1]);
	const ownNumbers = stringToNumArray(splitLine[1]);

	const ownWinningNumbers = ownNumbers.filter(v => winningNumbers.includes(v));

	if (ownWinningNumbers.length === 0) continue;
	
	output += Math.pow(2, ownWinningNumbers.length - 1);
}

console.log(output);
