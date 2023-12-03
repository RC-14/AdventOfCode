import { open } from 'node:fs/promises';

const inputHandle = await open('./input');
const input = (await inputHandle.readFile('utf8')).split('\n');
inputHandle.close();

let output = 0;

const getNumberFromLocation = (lineIndex, charIndex) => {
	if (lineIndex < 0 || lineIndex > input.length - 1) return null;
	if (charIndex < 0 || charIndex > input[lineIndex].length - 1) return null;

	let num = +input[lineIndex][charIndex];
	if (isNaN(num)) return null;
	
	let i = 1;
	while (charIndex - i >= 0) {
		let digit = +input[lineIndex][charIndex - i];
		if (isNaN(digit)) break;

		num += digit * Math.pow(10, i);

		i++;
	}

	i = 1;
	while (charIndex + i < input[lineIndex].length) {
		let digit = +input[lineIndex][charIndex + i];
		if (isNaN(digit)) break;

		num = num * 10 + digit;

		i++;
	}

	return num;
}

for (let i = 0; i < input.length; i++) {
	for (let j = 0; j < input[i].length; j++) {
		if (!isNaN(+input[i][j])) continue;
		if (input[i][j] === '.') continue;

		const numbers = [[],[],[]];
		
		numbers[0][0] = getNumberFromLocation(i - 1, j - 1);
		numbers[0][1] = getNumberFromLocation(i - 1, j);
		numbers[0][2] = getNumberFromLocation(i - 1, j + 1);
		if (numbers[0][1] !== null) {
			numbers[0] = numbers[0][1];
		}
		
		numbers[1][0] = getNumberFromLocation(i, j - 1);
		numbers[1][1] = getNumberFromLocation(i, j + 1);
		
		numbers[2][0] = getNumberFromLocation(i + 1, j - 1);
		numbers[2][1] = getNumberFromLocation(i + 1, j);
		numbers[2][2] = getNumberFromLocation(i + 1, j + 1);
		if (numbers[2][1] !== null) {
			numbers[2] = numbers[2][1];
		}

		output += numbers.flat().reduce((a, c) => c === null ? a : a + c, 0);
	}
}

console.log(output);
