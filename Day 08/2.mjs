import { open } from 'node:fs/promises';

const inputHandle = await open('./input');
const input = (await inputHandle.readFile('utf8')).split('\n').filter(v => v.length > 0);
inputHandle.close();

const instructions = input[0];
const map = {};

for (let i = 1; i < input.length; i++) {
	const lineParts = input[i].split(' = ');
	const LRparts = lineParts[1].substring(1, 9).split(', ');

	map[lineParts[0]] = {
		L: LRparts[0],
		R: LRparts[1]
	}
}

let output = 0;

let ends = Object.keys(map).filter(v => v.endsWith('A')).map(v => ({ start: v, end: undefined, steps: [] }));

for (let current = Object.keys(map).filter(v => v.endsWith('A')); !current.every(v => v.endsWith('Z')); output++) {
	for (let i = 0; i < current.length; i++) {
		current[i] = map[current[i]][instructions[output % instructions.length]];

		if (current[i].endsWith('Z')) {
			ends[i].end = current[i];
			ends[i].steps.push(output + 1);
		}
	}

	if (ends.every(v => v.steps.length > 0)) {
		console.log(ends.sort((a, b) => a.steps[0] - b.steps[0]));
		break;
	}
}

const leastCommonMultiple = (arr) => {
    const gcd = (a, b) => {
		while (b) {
			[a, b] = [b, a % b];
		}

		return a;
	}
	
    let multiple = arr[0];
	for (const num of arr) multiple = (multiple * num) / gcd(multiple, num);

    return multiple;
}

output = leastCommonMultiple(ends.map(v=>v.steps[0]));
console.log(output);
