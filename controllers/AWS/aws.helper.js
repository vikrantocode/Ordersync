const fs = require('fs'),
	request = require('request');
const path = require('path');
const s3 = require('../../config/s3.config');

// Upload Image
const uploadImage = (item, folder, callback) => {
	console.log(item);
	console.log(path.extname(item.originalname));
	let params = {
		Bucket: `ceimedia/${folder}`,
		Key: Date.now() + path.extname(item.originalname),
		Body: fs.createReadStream(item.path),
		ACL: 'public-read'
	};
	s3.upload(params, function (err, data) {
		fs.unlink(item.path, (err) => {});
		if (err) {
			callback({ error: true, Message: err });
		} else {
			callback({
				error: false,
				Message: 'File Uploaded SuceesFully',
				Data: data
			});
		}
	});
};

// Upload Images
const uploadImages = async (data, folder, callback) => {
	if (Array.isArray(data)) {
		let ResponseData = [];
		for (let item of data) {
			let params = {
				Bucket: `ceimedia/${folder}`,
				Key: Date.now() + path.extname(item.originalname),
				Body: fs.createReadStream(item.path),
				ACL: 'public-read'
			};
			s3.upload(params, function (err, res) {
				fs.unlink(item.path, (err) => {});
				if (err) {
					callback({ error: true, Message: err });
				} else {
					ResponseData.push(res);
					if (ResponseData.length == data.length) {
						callback({
							error: false,
							Message: 'Files Uploaded SuceesFully',
							Data: ResponseData
						});
					}
				}
			});
		}
	} else {
		let ResponseData = {};
		const fields = Object.keys(data);
		fields.forEach((field, fieldId) => {
			ResponseData[field] = [];
			data[field].map((item, itemId) => {
				let params = {
					Bucket: 'ceimedia/productimages',
					Key: Date.now() + path.extname(item.originalname),
					Body: fs.createReadStream(item.path),
					ACL: 'public-read'
				};
				s3.upload(params, function (err, resData) {
					fs.unlink(item.path, (err) => {});
					if (err) {
						callback({ error: true, Message: err });
					} else {
						ResponseData[field].push(resData);
						if (
							fieldId === fields.length - 1 &&
							itemId === data[field].length - 1
						) {
							callback({
								error: false,
								Message: 'Files Uploaded SuceesFully',
								Data: ResponseData
							});
						}
					}
				});
			});
		});
	}
};

const uploadProductImages = (filesObj, folder, callback) => {
	let finalObj = {};
	for (let key of Object.keys(filesObj)) {
		let ResponseData = [];
		for (let item of filesObj[key]) {
			let params = {
				Bucket: `ceimedia/${folder}`,
				Key: Date.now() + path.extname(item.originalname),
				Body: fs.createReadStream(item.path),
				ACL: 'public-read'
			};
			s3.upload(params, function (err, res) {
				fs.unlink(item.path, (err) => {});
				if (err) {
					return callback({ error: true, Message: err, data: null });
				} else {
					ResponseData.push(res);
					if (ResponseData.length == filesObj[key].length) {
						finalObj = { [key]: ResponseData };
					}
				}
			});
		}
		if (Object.keys(finalObj).length === Object.keys(filesObj)) {
			return callback({
				error: false,
				Message: 'Files Uploaded SuceesFully',
				data: finalObj
			});
		}
	}
};

// Delete Images
const deleteImages = (images, folder, callback) => {
	let deleteImages = [];
	if (typeof images === 'string') deleteImages.push(images);
	else deleteImages = images;
	s3.deleteObjects(
		{
			Bucket: 'ceimedia',
			Delete: {
				Objects: deleteImages.map((image) => ({
					Key: folder ? `${folder}/` + image : image
				}))
			}
		},
		(error, data) => {
			if (error) {
				return callback({ error: true, data: error });
			}
			console.log(data);
			callback({ error: false, data: 'Successfully deleted photo.' });
		}
	);
};

module.exports = {
	uploadImage,
	uploadImages,
	deleteImages,
	uploadProductImages
};
