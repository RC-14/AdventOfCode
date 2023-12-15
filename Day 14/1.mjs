import { open } from 'node:fs/promises';

const inputHandle = await open('./input');
let input = (await inputHandle.readFile('utf8')).split('\n').filter(v => v.length > 0);
inputHandle.close();

// input = `OOOO.#.O..
// OO..#....#
// OO..O##..O
// O..#.OO...
// ........#.
// ..#....#.#
// ..O..#.O.O
// ..O.......
// #....###..
// #....#....`.split('\n').filter(v => v.length > 0);

let output = 0;

const heights = input[0].split('').map(() => 0);

for (let i = 0; i < input.length; i++) {
	for (let j = 0; j < input[0].length; j++) {
		switch (input[i][j]) {
			case 'O':
				output += input.length - heights[j];
				heights[j]++;
				break;
			case '#':
				heights[j] = i + 1;
				break;
		}
	}
}

console.log(output);
