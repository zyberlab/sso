export function verifyJSON(json) {
	try {
		const parsed = JSON.parse(json);
		if (Object.keys(parsed).length > 0) {
			return true;
		} else {
			return false;
		}
	} catch (e) {
		return false;
	}
}

export function getDataURI(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function () {
			console.log(this)
			resolve(reader.result)
		};
		reader.onerror = function (error) {
			reject(error);
		};
	})
}

export function getImageProperties(url) {
	return new Promise((resolve) => {
		var image = new Image();
		
		image.onload = function () {
			var canvas = document.createElement('canvas');
			canvas.width = this.naturalWidth;
			canvas.height = this.naturalHeight;
			
			canvas.getContext('2d').drawImage(this, 0, 0);
			
			resolve({
				data: canvas.toDataURL('image/png'),
				width: canvas.width,
				height: canvas.height
			});
		};
		
		image.src = url;
	});
}

export function generateThumbnailReso(srcWidth, srcHeight, maxWidth=500, maxHeight=300) {
	const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
	return { width: srcWidth*ratio, height: srcHeight*ratio };
}

export function resizeImage (img, width=null, height=null) {
	return new Promise((resolve) => {
		// We create an image to receive the Data URI
		const fakeImg = document.createElement('img');
		fakeImg.onload = function () {
			// create an off-screen canvas
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			// set its dimension to target size
			if (width && height) {
				canvas.width = width;
				canvas.height = height;
				// draw source image into the off-screen canvas
				ctx.drawImage(this, 0, 0, width, height);
			} else {
				canvas.width = this.width;
				canvas.height = this.height;
				// draw source image into the off-screen canvas
				ctx.drawImage(this, 0, 0, this.width, this.height);
			}
			// encode image to data-uri with base64 version of compressed image
			resolve(canvas.toDataURL());
		}
		fakeImg.crossOrigin = 'anonymous';
		fakeImg.src = img;
	});
}