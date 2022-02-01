//funcion que carga al cargar la página
window.onload = function () {
	//declaramos canvas
	let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");

	gameOver = false; //PREGUNTAR SERGI

	//creamos las imagenes (nave que sería el jugador, fondo, enemigos y el disparo)
	let img = new Image();
	img.src = "./images/nave1.png";

	let fondo = new Image();
	fondo.src = "./images/dark-paths.png";

	let img_enemigos = new Image();
	img_enemigos.src = "./images/enemigo.png";

	let imggameOver = new Image();
	imggameOver.src = "./images/gameOver.png";

	//cuando cargue la imagen que se dibuje
	img.onload = function () {
		ctx.drawImage(fondo, 0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.drawImage(img, 107, 245, 60, 60);
	};

	//declaramos los axis con su posicion
	var xAxis = 107;
	var yAxis = 245;

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

	function colision() {
		if (arrayenemigos) {
			arrayenemigos.forEach((enemigo) => {
				var gp = navigator.getGamepads()[0];
				// Detectar en un area pequeña
				if (gp) {
					//si yAxis por 2.25 (que es la velocidad) + 60 (que sería el alto) es mayor o igual al enemigo y
					// y yAxis sin el alto menor o igual al enemigo y + el alto 60. Si lo cumple entra en el otro if que calcula
					// lo mismo pero para las x y en vez de alto seria el ancho
					if (yAxis * 2.25 + 60 >= enemigo.y && yAxis * 2.25 <= enemigo.y + 60) {
						if (xAxis * 2.25 + 60 >= enemigo.x && xAxis * 2.25 <= enemigo.x + 60) {
							console.log("colision");
							gameOver = true;
							if (gameOver) {
								// ctx.drawImage(fondo, 0, 0, ctx.canvas.width, ctx.canvas.height);
								// ctx.drawImage(imggameOver, 0, 0, 900, 600);
								// cancelAnimationFrame(animate);
								// cancelAnimationFrame(mover_enemigos);
								// cancelAnimationFrame(colision);
							}
						}
					}
					// Cuando un enemigo llega al final
					if (enemigo.y + 60 >= canvas.height) {
						console.log("final");
						arrayenemigos.splice(arrayenemigos.indexOf(enemigo), 1);
						gameOver = true;
						if (gameOver) {
							ctx.drawImage(fondo, 0, 0, ctx.canvas.width, ctx.canvas.height);
							ctx.drawImage(imggameOver, 0, 0, 900, 600);
							cancelAnimationFrame(colision);
						}
					}
				}
			});
		}
		requestAnimationFrame(colision);
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
	/*function crear_disparo() {
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
	}*/

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

		if (!window.gameOver) {
			animate();
			arrayenemigos = crear_enemigos();
			mover_enemigos();
			colision();
		} else {
			console.log("no");
			ctx.drawImage(imggameOver, 50, 50, 150, 150);
		}
	});
};
