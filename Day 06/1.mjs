import { open } from 'node:fs/promises';

const inputHandle = await open('./input');
const input = (await inputHandle.readFile('utf8')).split('\n');
inputHandle.close();

const stringToNumArray = (str) => {
	const arr = [];

	const splitString = str.split(' ');

	for (const part of splitString) {
		if (part === '') continue;

		const num = +part;
		if (isNaN(num)) continue;

		arr.push(num);
	}

	return arr;
}

const times = stringToNumArray(input[0]);
const distances = stringToNumArray(input[1]);

const races = [];

for (let i = 0; i < times.length; i++) {
	races.push({
		time: times[i],
		distance: distances[i]
	});
}

let output = 1;

for (const race of races) {
	// (race.time - x) * x - race.distance

	const pq1 = -1 * race.time / 2;
	const pq2 = Math.sqrt(Math.pow(race.time / 2, 2) - race.distance);
	
	const x1 = pq1 - pq2;
	const x2 = pq1 + pq2;

	const lowEnd = Math.floor(Math.min(x1, x2) + 1);
	const highEnd = Math.ceil(Math.max(x1, x2) - 1);

	output *= highEnd - lowEnd + 1;
}

console.log(output);
