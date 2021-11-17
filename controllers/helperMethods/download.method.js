const request = require('request');
const fs = require('fs');
const s3 = require('../../config/s3.config');

const download = (uri) => {
	return new Promise(async (resolve, reject) => {
		const start = uri.lastIndexOf('/') + 1;
		const name = uri.substr(start);
		request.head(uri, function (err, res, body) {
			request({
				url: uri,
				agentOptions: {
					rejectUnauthorized: false
				}
			})
				.pipe(fs.createWriteStream(`temp/${name}`))
				.on('close', () => {
					let params = {
						Bucket: `ceimedia/productimages`,
						Key: Date.now() + '.jpg',
						Body: fs.createReadStream(`temp/${name}`),
						ACL: 'public-read'
					};
					s3.upload(params, function (err, data) {
						fs.unlink(`temp/${name}`, (err) => {});
						if (err) {
							resolve({ error: true, Message: err });
						} else {
							resolve({
								error: false,
								Message: 'File Uploaded SuceesFully',
								Data: data
							});
						}
					});
				});
		});
	});
};

module.exports = download;
