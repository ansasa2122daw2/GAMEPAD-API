/* clase nave, clase enemigo, clase jugador */

window.onload = function () {
	let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");
	let img = new Image();
	img.src = "./images/nave.png";
	let fondo = new Image();
	fondo.src = "./images/dark-paths.png";

	/* enemigo*/
	let enemigo = new Image();
	enemigo.src = "./images/enemigo.png";
	img.onload = function () {
		ctx.drawImage(fondo, 0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.drawImage(img, 0, 0, 130, 130);
		ctx.drawImage(enemigo, 0, 30, 60, 60);
	};
	var imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

	var xAxis = 0;
	var yAxis = 0;

	function animate() {
		var gp = navigator.getGamepads()[0];

		xAxis = Math.floor(gp.axes[0]) + xAxis;
		yAxis = Math.floor(gp.axes[1]) + yAxis;
		if (xAxis !== 0 || yAxis !== 0) {
			console.log("xAxis", xAxis);
			console.log("yAxis", yAxis);
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(fondo, 0, 0, ctx.canvas.width, ctx.canvas.height);
			ctx.drawImage(img, xAxis, yAxis, 130, 130);
			if (xAxis < -30) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(fondo, 0, 0, ctx.canvas.width, ctx.canvas.height);
				ctx.drawImage(img, xAxis + 520, yAxis, 130, 130);
			}
		}
		requestAnimationFrame(animate);
	}

	// (moveenemigo) => {
	// 	for (i = 0; i < 5; i++) {
	// 		ctx.drawImage(enemigo, 70, 0, 60, 60);
	// 	}
	// 	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// 	ctx.drawImage(enemigo, 0, 0, 60, 60);
	// 	let x = 0;
	// 	let y = 0;
	// 	if (y >= 30) {
	// 		ctx.clearRect(0, 0, canvas.width, canvas.height);
	// 		ctx.drawImage(fondo, 0, 0, ctx.canvas.width, ctx.canvas.height);
	// 		ctx.drawImage(img, x, y + 30, 130, 130);
	// 	}
	// 	requestAnimationFrame(moveenemigo);
	// };

	window.addEventListener("gamepadconnected", function (e) {
		console.log("GAMEPAD CONNECTED");

		animate();
	});
};
