import { open } from 'node:fs/promises';

const inputHandle = await open('./input');
const input = (await inputHandle.readFile('utf8')).split('\n\n').filter(v => v !== '');
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

const seeds = stringToNumArray(input[0]);
const maps = input.slice(1).map(v => {
	const lines = v.split('\n');

	const splitFirstLine = lines[0].split('-to-');
	const map = {
		from: splitFirstLine[0],
		to: splitFirstLine[1].split(' ')[0],
		ranges: lines.splice(1).map(v => {
			const numArr = stringToNumArray(v);

			return {
				sourceStart: numArr[1],
				destinationStart: numArr[0],
				length: numArr[2]
			};
		})
	};

	return map;
});

let output = Number.POSITIVE_INFINITY;

for (const seed of seeds) {
	let value = seed;
	let currentType = 'seed';

	for (let i = 0; i < maps.length; i++) {
		if (currentType === 'location') break;

		const map = maps.filter(map => map.from === currentType)[0];
		currentType = map.to;

		const range = map.ranges.filter(range => range.sourceStart <= value && value < range.sourceStart + range.length - 1)[0];

		if (range === undefined) continue;

		value = value + range.destinationStart - range.sourceStart;
	}

	if (output > value) output = value;
}

console.log(output);
