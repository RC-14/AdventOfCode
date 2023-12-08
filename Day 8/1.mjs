import { open } from 'node:fs/promises';

const inputHandle = await open('./input');
const input = (await inputHandle.readFile('utf8')).split('\n').filter(v => v.length > 0);
inputHandle.close();

const instructions = input[0];
const map = {};

for (let i = 1; i < input.length; i++) {
	const lineParts = input[i].split(' = ');
	const LRparts = lineParts[1].substring(1, 9).split(', ');

	map[lineParts[0]] = {
		L: LRparts[0],
		R: LRparts[1]
	}
}

let output = 0;

for (let current = 'AAA'; current != 'ZZZ'; output++) current = map[current][instructions[output % instructions.length]];

console.log(output);
