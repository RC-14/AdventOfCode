import { open } from 'node:fs/promises';

const inputHandle = await open('./input');
const input = (await inputHandle.readFile('utf8')).split('\n').filter(v => v.length > 0);
inputHandle.close();

const numbersFromString = (str) => str.split(' ').map(v => +v);

const histories = input.map(numbersFromString);

const predictFuture = (history) => {
	const differences = [];
	differences.push(history);

	do {
		const arr = [];

		for (let i = 1; i < differences.at(-1).length; i++) {
			arr.push(differences.at(-1)[i] - differences.at(-1)[i - 1]);
		}

		differences.push(arr);
	} while (differences.at(-1).some(v => v !== 0));

	differences[differences.length - 1].push(0);

	for (let i = differences.length - 2; i >= 0; i--) {
		differences[i].push(differences[i].at(-1) + differences[i + 1].at(-1));
	}

	return differences[0].at(-1);
}

let output = 0;

for (const history of histories) {
	output += predictFuture(history);
}

console.log(output);
