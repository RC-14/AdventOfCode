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

const findReflection = (pattern, dbg = false) => {
	let output = 0;
	
	for (let i = 1; i < pattern.length; i++) {
		for (let j = 0; j < i + 1; j++) {
			if (pattern[i + j] === undefined || pattern[i - (j + 1)] === undefined) {
				output += i;
				break;
			}
			if (pattern[i + j] !== pattern[i - (j + 1)]) break;
		}
	}

	return output;
}

let output = 0;

for (const pattern of input) {
	output += findReflection(pattern) * 100;

	const rotatedPattern = [];

	for (let i = 0; i < pattern.length; i++) {
		for (let j = 0; j < pattern[0].length; j++) {
			if (rotatedPattern[j] === undefined) rotatedPattern[j] = '';
			rotatedPattern[j] += pattern[i][j]
		}
	}

	output += findReflection(rotatedPattern, true);
}

console.log(output);
