import { open } from 'node:fs/promises';

const inputHandle = await open('./input');
const input = (await inputHandle.readFile('utf8')).split('\n').filter(v => v.length > 0).map(v => v.split(''));
inputHandle.close();

const expanded = {
	y: [],
	x: []
};
const galaxies = [];

for (let i = 0; i < input.length; i++) {
	if (input[i].some(v => v === '#')) continue;

	expanded.y.push(i);
}

for (let i = 0; i < input[0].length; i++) {
	if (input.some(v => v[i] === '#')) continue;

	expanded.x.push(i);
}

for (let i = 0; i < input.length; i++) {
	for (let j = 0; j < input[i].length; j++) {
		if (input[i][j] !== '#') continue;
		
		let x = 0;
		let y = 0;

		for (let k = 0; k < i; k++) {
			if (expanded.y.includes(k)) y += 999_999;
			y++;
		}
		
		for (let k = 0; k < j; k++) {
			if (expanded.x.includes(k)) x += 999_999;
			x++;
		}
		
		galaxies.push({ x, y });
	}
}

let output = 0;

for (let i = 0; i < galaxies.length - 1; i++) {
	const galaxy = galaxies[i];

	for (let j = i + 1; j < galaxies.length; j++) {
		output += Math.abs(galaxies[j].x - galaxy.x) + Math.abs(galaxies[j].y - galaxy.y);
	}
}

console.log(output);
