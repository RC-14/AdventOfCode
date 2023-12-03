import { open } from 'node:fs/promises';

const inputHandle = await open('./input');
let output = 0;

const limits = {
	red: 12,
	green: 13,
	blue: 14
};

for await (const line of inputHandle.readLines()) {
	const splitIdAndGame = line.split(': ');
	const gameParts = splitIdAndGame[1]
		.split('; ').map(
			v=>v.split(', ').map(
				v=>v.split(' ').map((v, i)=>i===0 ? +v : v)
			)
		);

	let possible = true;

	for (const gamePart of gameParts) {
		for (const cube of gamePart) {
			if (limits[cube[1]] < cube[0]) {
				possible = false;
				break;
			}
		}
		if (!possible) break;
	}

	if (possible) output += +splitIdAndGame[0].split(' ')[1];
}

console.log(output);
