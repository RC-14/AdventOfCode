import { open } from 'node:fs/promises';

const inputHandle = await open('./input');
const input = (await inputHandle.readFile('utf8')).split('\n');
inputHandle.close();

const numFromString = (str) => {
	let res = 0;

	for (const char of str) {
		const num = +char;
		if (isNaN(num) || `${num}` !== char) continue;

		res = res * 10 + num;
	}

	return res;
}

const race = {
	time: numFromString(input[0]),
	distance: numFromString(input[1])
};

// (race.time - x) * x - race.distance

const pq1 = -1 * race.time / 2;
const pq2 = Math.sqrt(Math.pow(race.time / 2, 2) - race.distance);

const x1 = pq1 - pq2;
const x2 = pq1 + pq2;

const lowEnd = Math.floor(Math.min(x1, x2) + 1);
const highEnd = Math.ceil(Math.max(x1, x2) - 1);

console.log(highEnd - lowEnd + 1);
