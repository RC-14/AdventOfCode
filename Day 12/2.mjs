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

let dbgm = false;

const matchWithBinMasks = (bin, binMasks, len = 0) => {
	const lenMask = Math.pow(2, len) - 1;
	let result = bin;
	
	if (dbgm) console.log('dbgm', binToStr(bin), ...Object.values(binMasks).map(v => binToStr(v)), len, binToStr(lenMask));
	if (dbgm) console.log('dbgm', binToStr(result));
	
	result = result | binMasks['#'];
	
	if (dbgm) console.log('dbgm', binToStr(result));
	
	result = result & binMasks['.'];
	
	if (dbgm) console.log('dbgm', binToStr(result & lenMask), binToStr(bin & lenMask));
	
	if (len > 0) {
		const tmp = (result & lenMask) === (bin & lenMask);
		
		if (dbgm) console.log('dbgm', tmp)
		dbgm = false;
		
		return tmp;
	}
	return result === bin;
}

let output = 0;

for (let lineIndex = 0; lineIndex < input.length; lineIndex++) {
	const line = input[lineIndex];
	const splitStr = ('?' + line[0]).repeat(5).substring(1).split('');
	const binMasks = {
		'#': splitStr.reduce((l, c, i, a) => c !== '#' ? l : l + Math.pow(2, i), 0),
		'.': splitStr.reduce((l, c, i, a) => c === '.' ? l : l + Math.pow(2, i), 0)
	};
	const lens = (',' + line[1]).repeat(5).substring(1).split(',').map(v => +v);
	console.log(((lineIndex+1)+'/'+input.length).padStart(9), '\t', splitStr.join('').padEnd(30), lens);
	const dodbg = false;//lens.length === 4 && lens[0] === 1 && lens[1] === 1 && lens[2] === 1 && lens[3] === 3 && line[0] === '.?????#?.???';

	let lastTemp = null;
	for (let lenIndex = 0; lenIndex < lens.length; lenIndex++) {
		const len = lens[lenIndex];
		const temp = [];
		const space = splitStr.length - lens.reduce((l, c, i, a) => i <= lenIndex ? l : l + c + 1, 0);

		if (lastTemp === null) {
			let value = Math.pow(2, len) - 1;
			for (let i = 0; i <= space - len; i++) {
				if (matchWithBinMasks(value, binMasks, len + i + 1)) temp.push({ len: i + len, val: value });
				value = value << 1;
			}
			lastTemp = temp;
			continue;
		}

		for (const start of lastTemp) {
			const prevLen = start.len + 1;
			let value = (Math.pow(2, len) - 1) << prevLen;
			
			if (dodbg) console.log('b', space, len, prevLen);
			
			for (let i = 0; i <= space - len - prevLen; i++) {
				
				if (dodbg) {
					console.log('a', len, i, binToStr(value));
					console.log('a', binToStr(binMasks['#']), '\n' + binToStr(binMasks['.']));
					dbgm = true;
				}
				
				if (matchWithBinMasks(value + start.val, binMasks, len + i + prevLen + 1)) temp.push({ len: i + len + prevLen, val: value + start.val });
				value = value << 1;
			}
		}

		lastTemp = temp;
	}

	if (lastTemp.length === 0 && false) {
		const dgbLen = line[0].length;
		console.log(...lens);
		console.log(splitStr.join(''));
		console.log(binToStr(binMasks['#']).padEnd(dgbLen, '0'), '\n' + binToStr(binMasks['.']).padEnd(dgbLen, '0'));
		console.log(''.padStart(dgbLen, '-'))
		console.log(lastTemp.map(v => binToStr(v.val).padEnd(debug, '0')).join('\n'));
		console.log(lastTemp.length, output);
	}
	
	output += lastTemp.filter(v => matchWithBinMasks(v.val, binMasks)).length;
}

console.log(output);
