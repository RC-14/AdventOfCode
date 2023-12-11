import { open } from 'node:fs/promises';

const inputHandle = await open('./input');
const input = (await inputHandle.readFile('utf8')).split('\n').filter(v => v.length > 0).map(v => v.split(''));
inputHandle.close();

const universe = [];
const galaxies = [];

for (const line of input) {
	if (!line.includes('#')) universe.push([...line]);
	universe.push([...line]);
}

for (let i = 0; i < universe[0].length; i++) {
	if (universe.some(v => v[i] === '#')) continue;

	for (let j = 0; j < universe.length; j++) {
		universe[j].splice(i, 0, '.');
	}
	i++;
}

for (let i = 0; i < universe.length; i++) {
	for (let j = 0; j < universe[i].length; j++) {
		if (universe[i][j] === '#') galaxies.push({ x: j, y: i });
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
