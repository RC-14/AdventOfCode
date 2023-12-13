import { open } from 'node:fs/promises';

const inputHandle = await open('./input');
let input = (await inputHandle.readFile('utf8')).split('\n').filter(v => v.length > 0).map(v => v.split(' '));
inputHandle.close();

// input = `???.### 1,1,3
// .??..??...?##. 1,1,3
// ?#?#?#?#?#?#?#? 1,3,1,6
// ????.#...#... 4,1,1
// ????.######..#####. 1,6,5
// ?###???????? 3,2,1`.split('\n').filter(v => v.length > 0).map(v => v.split(' '));

const binToStr = (bin) => bin.toString(2).split('').reverse().join('');

// let dbg = true; /*
let dbg = false; //*/

const matchWithBinMasks = (bin, binMasks, len = 0) => {
	const lenMask = 2n ** BigInt(len) - 1n;
	if (dbg) {
		console.log('-----dbg-----');
		console.log('bin:', binToStr(bin));
		console.log(Object.values(binMasks).map(v => binToStr(v)).join('\n'));
		console.log('len:', len, binToStr(lenMask));
		console.log('-----dbg-----');
	}
	let result = bin;
	result = result | binMasks['#'];
	result = result & binMasks['.'];
	if (len > 0) {
		return (result & lenMask) === (bin & lenMask);
	}
	return result === bin;
}

let output = 0n;

const recursiveSolutionFinder = (
	binMasks,
	lens,
	space,
	lenIndex = 0,
	prevVal = 0n,
	prevLen = 0
) => {
	const len = lens[lenIndex];

	let value = (2n ** BigInt(len) - 1n) << BigInt(prevLen);

	for (let i = 0; i <= space - len - prevLen; i++) {
		if (matchWithBinMasks(value + prevVal, binMasks, len + prevLen + i + 1)) {
			if (lenIndex + 1 < lens.length) {
				recursiveSolutionFinder(
					binMasks,
					lens,
					space + lens[lenIndex + 1] + 1,
					lenIndex + 1,
					value + prevVal,
					len + prevLen + i + 1
				);
			} else {
				output++;
			}
		}
		value = value << 1n;
	}
}

for (let lineIndex = 0; lineIndex < input.length; lineIndex++) {
	const line = input[lineIndex];
	const splitStr = ('?' + line[0]).repeat(5).substring(1).split('');
	const binMasks = {
		'#': splitStr.reduce((l, c, i) => c !== '#' ? l : l + 2n ** BigInt(i), 0n),
		'.': splitStr.reduce((l, c, i) => c === '.' ? l : l + 2n ** BigInt(i), 0n)
	};
	const lens = (',' + line[1]).repeat(5).substring(1).split(',').map(v => +v);

	console.log(output);
	console.log(((lineIndex + 1) + '/' + input.length).padStart(9), '\t', splitStr.join('').padEnd(30), lens);

	recursiveSolutionFinder(
		binMasks,
		lens,
		splitStr.length - lens.reduce((l, c, i) => i < 1 ? l : l + c + 1, 0)
	);
}

console.log(output);
