import { open } from 'node:fs/promises';

const inputHandle = await open('./input');
let input = (await inputHandle.readFile('utf8')).split('\n').join('').split(',');
inputHandle.close();

// input = 'rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7'.split(',');

const hash = (str) => str.split('').reduce((val, char) => ((val + char.charCodeAt(0)) * 17) % 256, 0);

let output = 0;

for (const string of input) {
	output += hash(string);
}

console.log(output);
