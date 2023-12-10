import { open } from 'node:fs/promises';

const inputHandle = await open('./input');
const input = (await inputHandle.readFile('utf8')).split('\n').filter(v => v.length > 0);
inputHandle.close();

const start = (() => {
	const result = { y: -1, x: -1 };
	
	for (let i = 0; i < input.length; i++) {
		result.x = input[i].indexOf('S');
		if (result.x === -1) continue;

		result.y = i;
		break;
	}

	return result;
})();

const path = [start];

if (['|', '7', 'F'].includes(input[start.y - 1][start.x])) {
	path.push({ y: start.y - 1, x: start.x });
} else if (['-', 'L', 'F'].includes(input[start.y][start.x - 1])) {
	path.push({ y: start.y, x: start.x - 1 });
} else {
	path.push({ y: start.y + 1, x: start.x });
}

while (path.at(-1).y !== start.y || path.at(-1).x !== start.x) {
	const last = path.at(-2);
	const current = path.at(-1);
	const part = input[current.y][current.x];

	const next = { y: current.y, x: current.x };

	switch (part) {
		case '|':
			if (last.y < current.y) {
				next.y++;
			} else {
				next.y--;
			}
			break;

		case '-':
			if (last.x < current.x) {
				next.x++;
			} else {
				next.x--;
			}
			break;

		case 'L':
			if (last.y < current.y) {
				next.x++;
			} else {
				next.y--;
			}
			break;

		case 'J':
			if (last.y < current.y) {
				next.x--;
			} else {
				next.y--;
			}
			break;

		case '7':
			if (last.y > current.y) {
				next.x--;
			} else {
				next.y++;
			}
			break;

		case 'F':
			if (last.y > current.y) {
				next.x++;
			} else {
				next.y++;
			}
			break;
	}

	path.push(next);
}

console.log((path.length - 1) / 2);
