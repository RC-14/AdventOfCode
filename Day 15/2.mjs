import { open } from 'node:fs/promises';

const inputHandle = await open('./input');
let input = (await inputHandle.readFile('utf8')).split('\n').join('').split(',');
inputHandle.close();

// input = 'rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7'.split(',');

const boxes = [];

const hashMap = new Map();

const hashFunc = (str) => {
	let value = hashMap.get(str);
	if (value != undefined) return value;

	value = str.split('').reduce((val, char) => ((val + char.charCodeAt(0)) * 17) % 256, 0);
	hashMap.set(str, value);

	return value;
}

for (const string of input) {
	const setAction = string.includes('=');
	const parts = string.split(setAction ? '=' : '-');
	const hash = hashFunc(parts[0]);
	if (boxes[hash] === undefined) boxes[hash] = [];
	const box = boxes[hash];

	if (setAction) {
		let found = false;

		for (let i = 0; i < box.length; i++) {
			if (box[i][0] !== parts[0]) continue;

			found = true;
			box[i][1] = parts[1];
			break;
		}

		if (!found) box.push(parts);
		continue;
	}

	for (let i = 0; i < box.length; i++) {
		if (box[i][0] !== parts[0]) continue;

		box.splice(i, 1);
		break;
	}
}

let output = 0;

for (let i = 0; i < boxes.length; i++) {
	if (boxes[i] == undefined || boxes[i].length === 0) continue;

	for (let j = 0; j < boxes[i].length; j++) {
		output += (i + 1) * (j + 1) * (+boxes[i][j][1]);
	}
}

console.log(output);
