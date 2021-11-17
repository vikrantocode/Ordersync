// Reading the file using default
// fs npm package
const fs = require('fs');
const _ = require('lodash-contrib');

const normalizeKrollProducts = async (fileLocation) => {
	csv = fs.readFileSync(fileLocation);
	fs.unlink(fileLocation, (err) => {
		if (err) return { err, data: [] };
	});
	var array = csv.toString().split('\n');
	let result = [];
	let headers = array[0].split('\t');
	for (let i = 1; i < array.length - 1; i++) {
		let obj = {};
		let str = array[i];
		let s = '';
		let flag = 0;
		for (let ch of str) {
			if (ch === '"' && flag === 0) {
				flag = 1;
			} else if (ch === '"' && flag == 1) flag = 0;
			if (ch === ', ' && flag === 0) ch = '|';
			if (ch !== '"') s += ch;
		}
		let properties = s.split('\t');
		for (let j in headers) {
			if (properties[j].includes('\t')) {
				obj[headers[j]] = properties[j].split('\t').map((item) => item.trim());
			} else obj[headers[j]] = properties[j];
		}
		result.push(obj);
	}
	return { data: result, err: false };
};

module.exports = {
	normalizeKrollProducts: normalizeKrollProducts
};
