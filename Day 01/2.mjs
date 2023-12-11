import { open } from 'node:fs/promises';

const inputHandle = await open('./input');
const spelledDigitArray = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const spelledDigitLengths = spelledDigitArray.map(v => v.length).filter((v, i, a) => i !== a.indexOf(v));
let output = 0;

for await (const line of inputHandle.readLines()) {
	let firstDigit, lastDigit;

	for (let i = 0; i < line.length; i++) {
		let num = +line[i];
		if (isNaN(num)) {
			for (const len of spelledDigitLengths) {
				num = 1 + spelledDigitArray.indexOf(line.substring(i, i + len));
				if (num !== 0) break;
			}

			if (num === 0) continue;
		}

		if (firstDigit === undefined) firstDigit = num;
		lastDigit = num;
	}

	output += firstDigit * 10 + lastDigit;
}

console.log(output);
