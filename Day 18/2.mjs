import { open } from 'node:fs/promises';

const inputHandle = await open('./input');
let input = (await inputHandle.readFile('utf8')).split('\n').filter(v => v.length > 0).map(v => v.split(' '));
inputHandle.close();

// input = `
// R 6 (#70c710)
// D 5 (#0dc571)
// L 2 (#5713f0)
// D 2 (#d2c081)
// R 2 (#59c680)
// D 2 (#411b91)
// L 5 (#8ceee2)
// U 2 (#caa173)
// L 1 (#1b58a2)
// U 2 (#caa171)
// R 2 (#7807d2)
// U 3 (#a77fa3)
// L 2 (#015232)
// U 2 (#7a21e3)
// `.split('\n').filter(v => v.length > 0).map(v => v.split(' '));

const map = [['#']];

let x, y;

const ensureNonNegativeX = () => {
	for (; x < 0; x++) {
		for (let i = 0; i < map.length; i++) map[i].unshift(undefined);
	}
}

const ensureNonNegativeY = () => {
	for (; y < 0; y++) {
		map.unshift([]);
	}
}

for (let i = 0; i < input.length; i++) {
	console.log(`${i + 1}`.padStart(input.length.toString().length) + '/' + input.length);

	const instruction = input[i];
	const direction = instruction[0];
	const length = parseInt(instruction[2].substring(2, instruction[2].length - 2), 16);

	const lastDirection = input.at(i - 1)[0];
	const nextDiretion = input[(i + 1) % input.length][0];

	for (let j = 0; j < length; j++) {
		if (x === undefined && y === undefined) {
			x = 0;
			y = 0;

			if ((direction === 'R' || direction === 'L') && length > 1) map[y][x] = lastDirection === 'U' ? '+' : '-';
			continue;
		}

		switch (direction) {
			case 'U':
				y--;
				ensureNonNegativeY();
				if (map[y] === undefined) map[y] = [];
				map[y][x] = '#';
				break;

			case 'D':
				y++;
				if (map[y] === undefined) map[y] = [];
				map[y][x] = '#';
				break;

			case 'L':
				if (j === 0) map[y][x] = lastDirection === 'U' ? '+' : '-';
				x--;
				ensureNonNegativeX();
				map[y][x] = j === length - 1 ? nextDiretion === 'D' ? '+' : '-' : '#';
				break;

			case 'R':
				if (j === 0) map[y][x] = lastDirection === 'U' ? '+' : '-';
				x++;
				map[y][x] = j === length - 1 ? nextDiretion === 'D' ? '+' : '-' : '#';
				break;
		}
	}

	if (i < input.length - 1) continue;

	if (direction === 'U' && map[y - 1][x] === '+') continue;
	if (direction === 'D' && map[y + 1][x] === '-') continue;

	if (map[y][x - 1] !== undefined) {
		map[y][x] = map[y][x - 1];
		map[y][x - 1] = '#';
		continue;
	}

	map[y][x] = map[y][x + 1];
	map[y][x + 1] = '#';
}


let output = 0;
let inHole = false;
let onEgdeEntry = null;

for (let i = 0; i < map.length; i++) {
	inHole = false;

	for (let j = 0; j < map[i].length; j++) {
		if (map[i][j] === '+' || map[i][j] === '-') {
			output++;
			if (onEgdeEntry === null) {
				onEgdeEntry = map[i][j];
				continue;
			}
			if (onEgdeEntry !== map[i][j]) inHole = !inHole;
			onEgdeEntry = null;
			continue;
		}

		if (map[i][j] === '#') {
			output++;

			if (onEgdeEntry !== null) continue;

			inHole = !inHole;
			continue;
		}

		if (inHole) output++;
	}
}

console.log(output);
