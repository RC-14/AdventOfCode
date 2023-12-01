import { open } from 'node:fs/promises';

const inputHandle = await open('./input');
let output = 0;

for await (const line of inputHandle.readLines()) {
	let firstDigit, lastDigit;

	for (const char of line) {
		const num = +char;
		if (isNaN(num)) continue;

		if (firstDigit === undefined) firstDigit = num;
		lastDigit = num;
	}

	output += firstDigit * 10 + lastDigit;
}

console.log(output);
