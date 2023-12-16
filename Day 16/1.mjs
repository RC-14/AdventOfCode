import { open } from 'node:fs/promises';

const inputHandle = await open('./input');
let input = (await inputHandle.readFile('utf8')).split('\n').filter(v => v.length > 0);
inputHandle.close();

// input = `.|...\\....
// |.-.\\.....
// .....|-...
// ........|.
// ..........
// .........\\
// ..../.\\\\..
// .-.-/..|..
// .|....-|.\\
// ..//.|....`.split('\n').filter(v => v.length > 0);

const energizedTiles = new Map();
const calls = [[false, 1, -1, 0]];
const handledCalls = [];

const recursiveSoluionFinder = (direction, stepLength, x, y) => {
	if (direction) {
		y += stepLength;
	} else {
		x += stepLength;
	}

	if (y < 0 || x < 0 || input.length <= y || input[0].length <= x) return;

	const coordStr = `${x} ${y}`;
	if (!energizedTiles.get(coordStr)) energizedTiles.set(coordStr, true);

	const char = input[y][x];
	if (char === '.' || !direction && char === '-' || direction && char === '|') {
		calls.push([direction, stepLength, x, y]);
		return;
	}

	if (char === '-' || char === '|') {
		direction = !direction;
		calls.push([direction, stepLength * -1, x, y]);
		calls.push([direction, stepLength, x, y]);
		return;
	}

	if (char === '/') stepLength *= -1;
	calls.push([!direction, stepLength, x, y]);
}

while (calls.length > 0) {
	const call = calls.shift()

	const callString = `${call[0]} ${call[1]} ${call[2]} ${call[3]}`;
	if (handledCalls.includes(callString)) continue;
	handledCalls.push(callString);
	console.log(callString);

	recursiveSoluionFinder(...call);
}

console.log(energizedTiles.size);
