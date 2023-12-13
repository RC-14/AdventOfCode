import { open } from 'node:fs/promises';

const inputHandle = await open('./input');
const input = (await inputHandle.readFile('utf8')).split('\n').filter(v => v.length > 0).map(v => v.split(' '));
inputHandle.close();

let output = 0;

for (let lineIndex = 0; lineIndex < input.length; lineIndex++) {
	const line = input[lineIndex];
	const str = line[0];
	const lens = line[1].split(',').map(v => +v);
	console.log(((lineIndex+1)+'/'+input.length).padStart(9), '\t', str.padEnd(30), lens);

	// Binary number that has a 0 for each . and a 1 everywhere else
	const alwaysNegatives = str.split('').reduce((l, c, i, a) => c === '.' ? l : l + Math.pow(2, i), 0);
	// Binary number that has a 1 for each # and a 0 everywhere else
	const alwaysPositives = str.split('').reduce((l, c, i, a) => c !== '#' ? l : l + Math.pow(2, i), 0);

	let options = 0;
	const checked = [];
	for (let i = Math.pow(2, lens.reduce((a, c) => a + c, 0)) - 1; i < Math.pow(2, str.length); i++) {
		let bin = (i & alwaysNegatives) | alwaysPositives;
		if (checked.includes(bin)) continue;
		checked.push(bin);

		let valid = true;
		for (let len of lens) {
			let included = false;
			
			for (let j = 0; j < str.length; j++) {
				const bitMask = Math.pow(2, len) - 1;
				const lsbs = bin & bitMask;

				if (lsbs === bitMask) {
					bin = bin >>> len;
					
					included = true;
					break;
				}

				if (lsbs & 1 === 1) break;
				
				bin = bin >>> 1;
			}
			
			if (!included || bin & 1 === 1) {
				valid = false;
				break;
			}

			bin = bin >>> 1;
		}

		if (valid && bin === 0) {
			options++;
		}
	}

	output += options;
}

console.log(output);
