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

let startPart = '';
if (path[1].y !== start.y && path.at(-2).y !== start.y) {
	startPart = '|';
} else if (path[1].x !== start.x && path.at(-2).x !== start.x) {
	startPart = '-';
} else if (path[1].x > start.x && path.at(-2).y < start.y || path.at(-2).x > start.x && path[1].y < start.y) {
	startPart = 'L';
} else if (path[1].x < start.x && path.at(-2).y < start.y || path.at(-2).x < start.x && path[1].y < start.y) {
	startPart = 'J';
} else if (path[1].x < start.x && path.at(-2).y > start.y || path.at(-2).x < start.x && path[1].y > start.y) {
	startPart = '7';
} else {
	startPart = 'F';
}

let output = 0;

const strPath = path.map(v => `${v.y} ${v.x}`);
let inLoop = false;
let onLoopEntry = null;

for (let y = 0; y < input.length; y++) {
	for (let x = 0; x < input[y].length; x++) {
		if (strPath.includes(`${y} ${x}`)) {
			let part = input[y][x];
			if (part === 'S') part = startPart;
			
			switch (part) {
				case '|':
					inLoop = !inLoop;
					break;

				case 'L':
					onLoopEntry = 'L';
					break;

				case 'F':
					onLoopEntry = 'F';
					break;

				case '7':
					if (onLoopEntry === 'L') inLoop = !inLoop;
					onLoopEntry = null;
					break;

				case 'J':
					if (onLoopEntry === 'F') inLoop = !inLoop;
					onLoopEntry = null;
					break;

				default:
					break;
			}
			
			continue;
		}

		if (inLoop) output++;
	}
}

console.log(output);
