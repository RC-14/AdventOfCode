import { open } from 'node:fs/promises';

const inputHandle = await open('./input');
let output = 0;

for await (const line of inputHandle.readLines()) {
	const splitIdAndGame = line.split(': ');
	const gameParts = splitIdAndGame[1]
		.split('; ').map(
			v=>v.split(', ').map(
				v=>v.split(' ').map((v, i)=>i===0 ? +v : v)
			)
		);

	const cubeMin = {
		red: 0,
		green: 0,
		blue: 0
	};

	for (const gamePart of gameParts) {
		for (const cube of gamePart) {
			console.log(cube[0], cube[1], cubeMin[cube[1]]);
			if (cubeMin[cube[1]] < cube[0]) cubeMin[cube[1]] = cube[0];
		}
		console.log('');
	}

	console.log(cubeMin);
	console.log('\n');

	output += cubeMin.red * cubeMin.green * cubeMin.blue;
}

console.log(output);
