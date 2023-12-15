import { open } from 'node:fs/promises';

const inputHandle = await open('./input');
let input = (await inputHandle.readFile('utf8')).split('\n').filter(v => v.length > 0);
inputHandle.close();

// input = `
// O....#....
// O.OO#....#
// .....##...
// OO.#O....O
// .O.....O#.
// O.#..O.#.#
// ..O..#O..O
// .......O..
// #....###..
// #OO..#....
// `.split('\n').filter(v => v.length > 0);

let spinned = input;
let cycleStart = spinned;

for (let quarterCycle = 0; quarterCycle < 4_000_000_000; quarterCycle++) {
	const newSpinned = [];

	for (let i = 0; i < spinned.length; i++) {
		for (let j = 0; j < spinned[0].length; j++) {
			if (newSpinned[j] === undefined) newSpinned[j] = '';

			switch (spinned[i][j]) {
				case 'O':
					newSpinned[j] = 'O' + newSpinned[j];
					break;
					
				case '#':
					newSpinned[j] = '#' + newSpinned[j].padStart(i, '.');
					break;
			}
		}
	}

	let done = quarterCycle % 4 === 3;
	if (quarterCycle % 4 === 0) cycleStart = spinned;

	for (let i = 0; i < newSpinned.length; i++) {
		newSpinned[i] = newSpinned[i].padStart(spinned.length, '.');

		if (done) done = newSpinned[i] === cycleStart[i];
	}

	spinned = newSpinned;
	
	if (done) break;

	if (quarterCycle % 4 === 0 && quarterCycle % 100000 === 0) console.log(quarterCycle);
}

let output = 0;

for (let i = 0; i < spinned.length; i++) {
	for (let j = 0; j < spinned[0].length; j++) {
		if (spinned[i][j] === 'O') output += spinned.length - i;
	}
}

console.log(output);
