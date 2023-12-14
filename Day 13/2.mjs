// I have no idea what I did wrong but this only works for the test  input

import { open } from 'node:fs/promises';

const inputHandle = await open('./input');
let input = (await inputHandle.readFile('utf8')).split('\n\n').map(v => v.split('\n').filter(v => v.length > 0));
inputHandle.close();

// input = [
// 	[
// 		'#.##..##.',
// 		'..#.##.#.',
// 		'##......#',
// 		'##......#',
// 		'..#.##.#.',
// 		'..##..##.',
// 		'#.#.##.#.'
// 	],
// 	[
// 		'#...##..#',
// 		'#....#..#',
// 		'..##..###',
// 		'#####.##.',
// 		'#####.##.',
// 		'..##..###',
// 		'#....#..#'
// 	]
// ];

const findReflection = (pattern) => {
	for (let i = 1; i < pattern.length; i++) {
		for (let j = 0; j < i + 1; j++) {
			if (pattern[i + j] === undefined || pattern[i - (j + 1)] === undefined) return i;
			if (pattern[i + j] !== pattern[i - (j + 1)]) break;
		}
	}
}

const desmudge = (pattern, row, column) => {
	const output = [...pattern];

	const str = output[row];
	const char = str[column] === '.' ? '#' : '.';

	output[row] = str.substring(0, column) + char + str.substring(column + 1);

	return output;
}

let output = 0;

for (const smudgedPattern of input) {
	let match = (findReflection(smudgedPattern) ?? 0) * 100;
	if (match === undefined) {
		direction = true;

		const rotatedSmudgedPattern = [];

		for (let i = 0; i < smudgedPattern.length; i++) {
			for (let j = 0; j < smudgedPattern[0].length; j++) {
				if (rotatedSmudgedPattern[j] === undefined) rotatedSmudgedPattern[j] = '';
				rotatedSmudgedPattern[j] += smudgedPattern[i][j];
			}
		}

		match = findReflection(rotatedSmudgedPattern);
	}

	let result = 0;
	let row = 0;
	let column = 0;

	while (result === 0 || result === match) {
		result = 0;

		const pattern = desmudge(smudgedPattern, row, column);

		result = (findReflection(pattern) ?? 0) * 100;

		if (result === 0) {
			const rotatedPattern = [];

			for (let i = 0; i < pattern.length; i++) {
				for (let j = 0; j < pattern[0].length; j++) {
					if (rotatedPattern[j] === undefined) rotatedPattern[j] = '';
					rotatedPattern[j] += pattern[i][j];
				}
			}

			result = findReflection(rotatedPattern) ?? 0;
		}

		column++;
		if (column === smudgedPattern[0].length) {
			column = 0;
			row++;
		}
	}

	output += result;
}

console.log(output);
