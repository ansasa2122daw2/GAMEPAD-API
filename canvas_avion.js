window.onload = function () {
	let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");
	let img = new Image();
	img.src = "./images/nave1.png";

	let fondo = new Image();
	fondo.src = "./images/dark-paths.png";

	let img_enemigos = new Image();
	img_enemigos.src = "./images/enemigo.png";

	let arrayenemigos = [];

	img.onload = function () {
		ctx.drawImage(fondo, 0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.drawImage(img, 0, 0, 130, 130);
		//ctx.drawImage(enemigo, 0, 30, 60, 60);
	};

	var xAxis = 0;
	var yAxis = 0;

	function animate() {
		var gp = navigator.getGamepads()[0];
		if (gp) {
			xAxis = Math.floor(gp.axes[0]) + xAxis;
			yAxis = Math.floor(gp.axes[1]) + yAxis;
			if (xAxis !== 0 || yAxis !== 0) {
				// console.log("xAxis", xAxis);
				// console.log("yAxis", yAxis);
				// ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(fondo, 0, 0, ctx.canvas.width, ctx.canvas.height);
				ctx.drawImage(img, xAxis * 2.25, yAxis * 2.25, 130, 130);
				if (xAxis < -30) {
					// ctx.clearRect(0, 0, canvas.width, canvas.height);
					ctx.drawImage(fondo, 0, 0, ctx.canvas.width, ctx.canvas.height);
					ctx.drawImage(img, (xAxis + 520) * 2.25, yAxis * 2.25, 130, 130);
				}
			}
			requestAnimationFrame(animate);
		} else {
			console.log("Conecta el mando");
		}
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

	// crear enemigo
	class enemigo {
		constructor(velocidad, x, y) {
			this.velocidad = velocidad;
			this.x = x;
			this.y = y;
		}
	}
	// método
	enemigo.prototype.mover = function () {
		if (this.y < 700) {
			this.y = this.y + this.velocidad;
		} else {
			this.y = 0;
			this.x = Math.round(Math.random() * 300);
		}
	};
	//crear varios enemigos en la clase

	function crear_enemigos() {
		let arrayenemigos = [];
		for (i = 0; i < 1; i++) {
			x = 0; //hacer math random para cuando haya más enemigos
			y = 5;
			velocidad = 0.7;
			let enemigocreado = new enemigo(velocidad, x, y);
			arrayenemigos.push(enemigocreado);
		}
		return arrayenemigos;
	}

	function mover_enemigos() {
		if (arrayenemigos.length) {
			arrayenemigos.forEach((enemigo) => {
				enemigo.mover();
				ctx.drawImage(img_enemigos, enemigo.x, enemigo.y, 60, 60);
			});
		}
		requestAnimationFrame(mover_enemigos);
	}

	window.addEventListener("gamepadconnected", function (e) {
		console.log("GAMEPAD CONNECTED");

		animate();
		arrayenemigos = crear_enemigos();
		mover_enemigos();
	});
};
