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
	};

	var xAxis = 0;
	var yAxis = 0;

	function animate() {
		var gp = navigator.getGamepads()[0];
		if (gp) {
			xAxis = Math.floor(gp.axes[0]) + xAxis;
			yAxis = Math.floor(gp.axes[1]) + yAxis;
			if (xAxis !== 0 || yAxis !== 0) {
				//console.log("yAxis", yAxis);
				// ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(fondo, 0, 0, ctx.canvas.width, ctx.canvas.height);
				ctx.drawImage(img, xAxis * 2.25, yAxis * 2.25, 130, 130);
				if (xAxis < -30) {
					// ctx.clearRect(0, 0, canvas.width, canvas.height);
					ctx.drawImage(fondo, 0, 0, ctx.canvas.width, ctx.canvas.height);
					ctx.drawImage(img, xAxis * 2.25 + 520, yAxis * 2.25, 130, 130); // falta poner velocidad * 2.25
				}
			}
			requestAnimationFrame(animate);
		} else {
			console.log("Conecta el mando");
		}
	}

	//clase Bala
	class Bullet {
		constructor(initX, initY, dirX, dirY) {
			this.initX = initX;
			this.initY = initY;
			this.dirX = dirX;
			this.dirY = dirY;
		}
		move() {
			if (this.initX > canvas.width - 10 || this.initX < 10 || this.initY > canvas.height - 11 || this.initY < 10) {
				this.initX += this.dirX;
				this.initY += this.dirY;
				ctx.drawImage(img, 64 * 0, 64 * 0, 64, 64, this.initX - 25, this.initY - 12, img.width / 10, img.height / 10);
				return 1;
			} else if (this.dirX != 0 || this.dirY != 0) {
				this.initX += this.dirX;
				this.initY += this.dirY;
				ctx.beginPath();
				ctx.rect(this.initX, this.initY, 2, 2);
				ctx.fillStyle = "red";
				ctx.fill();
				ctx.closePath();
			}
		}
	}

	//crear jugador
	class jugador {
		constructor(velocidad, xAxis, yAxis) {
			this.velocidad = velocidad;
			this.xAxis = xAxis;
			this.yAxis = yAxis;
		}
	}
	//método disparo
	jugador.prototype.disparo = function () {};

	//método mover jugador
	jugador.prototype.mover = function () {
		animate();
	};

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
			velocidad = 0.5;
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
	//****** */
	var gamepads = navigator.getGamepads();
	console.log(gamepads);

	window.addEventListener("gamepadconnected", function (e) {
		console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.", e.gamepad.index, e.gamepad.id, e.gamepad.buttons.length, e.gamepad.axes.length);

		animate();
		arrayenemigos = crear_enemigos();
		mover_enemigos();
		colision();
	});
};
