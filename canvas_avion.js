//funcion que carga al cargar la página
window.onload = function () {
	//declaramos canvas
	let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");

	gameOver = false;

	//creamos las imagenes (nave que sería el jugador, fondo, enemigos y el disparo)
	let img = new Image();
	img.src = "./images/nave1.png";

	let fondo = new Image();
	fondo.src = "./images/dark-paths.png";

	let img_enemigos = new Image();
	img_enemigos.src = "./images/enemigo.png";

	let img_disparo = new Image();
	img_disparo.src = "./images/zyro-image.png";

	//cuando cargue la imagen que se dibuje
	img.onload = function () {
		ctx.drawImage(fondo, 0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.drawImage(img, 0, 0, 60, 60);
	};

	//declaramos los axis a 0
	var xAxis = 0;
	var yAxis = 0;

	//creamos la función animar, que recoge los gamepads del navegador
	function animate() {
		var gp = navigator.getGamepads()[0];
		//si gp es true entra y da los valores a xAxis y con el Math.floor redondeamos el valor
		if (gp) {
			xAxis = Math.floor(gp.axes[0]) + xAxis;
			yAxis = Math.floor(gp.axes[1]) + yAxis;

			if (xAxis !== 0 || yAxis !== 0) {
				if (gp.buttons[0].pressed) {
					console.log("ppppp");
					mover_disparo();
				}
				//console.log("xAxis", xAxis);
				//console.log("yAxis", yAxis);
				// ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(fondo, 0, 0, ctx.canvas.width, ctx.canvas.height);
				ctx.drawImage(img, xAxis * 2.25, yAxis * 2.25, 60, 60);
				ctx.strokeRect(xAxis * 2.25, yAxis * 2.25, 60, 60);

				if (xAxis < -30) {
					// ctx.clearRect(0, 0, canvas.width, canvas.height);
					ctx.drawImage(fondo, 0, 0, ctx.canvas.width, ctx.canvas.height);
					ctx.drawImage(img, xAxis * 2.25 + 520, yAxis * 2.25, 60, 60);
					ctx.strokeRect(xAxis * 2.25 + 520, yAxis * 2.25, 60, 60);
				}
			}
			requestAnimationFrame(animate);
		} else {
			console.log("Conecta el mando");
		}
	}

	/*function colision() {
		if (arrayenemigos.length) {
			arrayenemigos.forEach((enemigo) => {
				var gp = navigator.getGamepads()[0];
				if ((yAxis = Math.floor(gp.axes[1]) + yAxis) == enemigo.y) {
					console.log("kabuum");
				}
			});
		}
		requestAnimationFrame(colision);
	}*/

	function colision() {
		if (arrayenemigos.length > 0) {
			arrayenemigos.forEach((enemigo) => {
				let gp = navigator.getGamepads()[0];
				if (gp) {
					if (xAxis > enemigo.x && xAxis < enemigo.x + enemigo.width && yAxis > enemigo.y && yAxis < enemigo.y + enemigo.height) {
						gameOver = true;
						alert("Game Over");
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						ctx.drawImage(fondo, 0, 0, ctx.canvas.width, ctx.canvas.height);
						ctx.drawImage(img, 0, 0, 60, 60);
					}
				}
			});
		}
		requestAnimationFrame(colision);
	}

	/* Función que mueve el disparo */

	function mover_disparo() {
		if (gameOver) {
			return;
		}

		for (let i = 0; i < disparos.length; i++) {
			if (disparos[i].y > 0) {
				disparos[i].y -= 10;
			} else {
				disparos.splice(i, 1);
			}
		}
	}

	//clase Bala
	class bala {
		constructor(initX, initY, dirX, dirY) {
			this.initX = initX;
			this.initY = initY;
			this.dirX = dirX;
			this.dirY = dirY;
		}
	}

	bala.prototype.disparomover = function () {
		if (this.y < 700) {
			this.y = this.y + this.velocidad;
		} else {
			this.y = 0;
			this.x = Math.round(Math.random() * 300);
		}
	};

	//crear array disparos
	function crear_disparo() {
		let arraydisparos = [];
		for (i = 0; i < 10; i++) {
			initX = 0;
			initY = 5;
			dirX = 0;
			dirY = 5;
			let disparocreado = new bala(initX, initY, dirX, dirY);
			arraydisparos.push(disparocreado);
		}
		return arraydisparos;
	}

	function mover_disparo() {
		if (arraydisparos.length) {
			arraydisparos.forEach((disparo) => {
				bala.disparomover();
				ctx.drawImage(img_disparo, disparo.initX, disparo.initY, dirX, dirY, 60, 60);
			});
		}
		requestAnimationFrame(mover_disparo);
	}

	//crear jugador
	class jugador {
		constructor(velocidad, xAxis, yAxis) {
			this.velocidad = velocidad;
			this.xAxis = xAxis;
			this.yAxis = yAxis;
		}
	}

	//método mover jugador y disparar
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
			ctx.strokeRect(this.x, this.y, 60, 60);
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
				//console.log(enemigo.x, enemigo.y);
			});
		}
		requestAnimationFrame(mover_enemigos);
	}
	//****** */

	window.addEventListener("gamepadconnected", function (e) {
		console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.", e.gamepad.index, e.gamepad.id, e.gamepad.buttons.length, e.gamepad.axes.length);
		console.log(e.gamepad.buttons);

		arraydisparos = crear_disparo();
		animate();
		arrayenemigos = crear_enemigos();
		mover_enemigos();
		colision();
	});
};
