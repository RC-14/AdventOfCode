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
const calls = [];
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

const getEnergizedTileCount = (direction, start, offset) => {
	calls.push([
		direction,
		start ? 1 : -1,
		direction ? offset : start ? -1 : input[0].length,
		!direction ? offset : start ? -1 : input.length
	]);
	
	while (calls.length > 0) {
		const call = calls.shift()

		const callString = `${call[0]} ${call[1]} ${call[2]} ${call[3]}`;
		if (handledCalls.includes(callString)) continue;
		handledCalls.push(callString);

		recursiveSoluionFinder(...call);
	}

	handledCalls.splice(0);

	const result = energizedTiles.size;
	energizedTiles.clear();

	return result;
}

let output = 0;

for (let i = 0; i < input.length; i++) {
	console.log(`${i+1}/${input.length} 1`);
	output = Math.max(
		output,
		getEnergizedTileCount(false, true, i),
		getEnergizedTileCount(false, false, i)
	);
}

for (let i = 0; i < input[0].length; i++) {
	console.log(`${i+1}/${input[0].length} 2`);
	output = Math.max(
		output,
		getEnergizedTileCount(true, true, i),
		getEnergizedTileCount(true, false, i)
	);
}

console.log(output);
