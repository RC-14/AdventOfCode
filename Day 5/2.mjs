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

const seedRanges = stringToNumArray(input[0]).reduce((a, c, i, arr) => {
	if (i % 2 === 1) return a;

	a.push({
		start: c,
		length: arr[i + 1]
	});

	return a;
}, []);
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
const path = [];
let currentType = 'seed';
for (let i = 0; i < maps.length; i++) {
	if (currentType === 'location') break;

	for (let j = 0; j < maps.length; j++) {
		if (maps[j].from !== currentType) continue;

		path.push(j);
		currentType = maps[j].to;
		break;
	}
}

let output = Number.POSITIVE_INFINITY;

let counter = 0;
for (const seedRange of seedRanges) {
	counter++;
	console.log((counter + '/' + seedRanges.length).padStart(5) + '\tstart=' + seedRange.start + '\tlength=' + seedRange.length);

	for (let seed = seedRange.start; seed < seedRange.start + seedRange.length; seed++) {
		let value = seed;

		for (let i = 0; i < path.length; i++) {
			const map = maps[path[i]];

			for (const range of map.ranges) {
				if (range.sourceStart > value || value >= range.sourceStart + range.length) continue;

				value = value + range.destinationStart - range.sourceStart;
				break;
			}
		}

		if (output > value) output = value;
	}
}

console.log(output);
