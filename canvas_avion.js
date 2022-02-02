//funcion que carga al cargar la página
window.onload = function () {
	//declaramos canvas
	let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");

	let gameOver = false;
	let arrayVidas = [];
	arrayVidas.push(1);
	arrayVidas.push(2);
	console.log(arrayVidas);
	arraybalas = [];

	//creamos las imagenes (nave que sería el jugador, fondo, enemigos y el disparo)
	let img = new Image();
	img.src = "./images/nave1.png";

	let fondo = new Image();
	fondo.src = "./images/dark-paths.png";

	let img_enemigos = new Image();
	img_enemigos.src = "./images/enemigo.png";

	let imggameOver = new Image();
	imggameOver.src = "./images/gameOver.png";

	let img_bala = new Image();
	img_bala.src = "./images/disparo.png";

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
				//console.log("xAxis", xAxis);
				//console.log("yAxis", yAxis);
				// ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(fondo, 0, 0, ctx.canvas.width, ctx.canvas.height);
				ctx.drawImage(img, xAxis * 2.25, yAxis * 2.25, 60, 60);
				ctx.strokeRect(xAxis * 2.25, yAxis * 2.25, 60, 60);

				//DISPARO
				if (gp.buttons[0].pressed) {
					console.log("ppppp");
					arraybalas.push(crear_bala());
				}

				if (xAxis < -30) {
					// ctx.clearRect(0, 0, canvas.width, canvas.height);
					ctx.drawImage(fondo, 0, 0, ctx.canvas.width, ctx.canvas.height);
					ctx.drawImage(img, xAxis * 2.25 + 520, yAxis * 2.25, 60, 60);
					ctx.strokeRect(xAxis * 2.25 + 520, yAxis * 2.25, 60, 60);
				}
			}
			idAnimacio = requestAnimationFrame(animate);
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
							//Cancela animación
							cancelAnimationFrame(disparo);
							cancelAnimationFrame(idAnimacio);
							cancelAnimationFrame(move_enemigos);
							//Vuelve animación con axis en la posición inicial
							xAxis = 107;
							yAxis = 245;
							animate();
							arrayenemigos = crear_enemigos();

							mover_enemigos();
							colision();

							//Haces pop de las vidas
							arrayVidas.pop();
							console.log(arrayVidas);
						}
					}
					// Cuando un enemigo llega al final
					if (enemigo.y + 60 >= canvas.height) {
						arrayenemigos.splice(arrayenemigos.indexOf(enemigo), 1);
						gameOver = true;
						if (gameOver) {
							ctx.drawImage(fondo, 0, 0, ctx.canvas.width, ctx.canvas.height);
							ctx.drawImage(imggameOver, 0, 0, 600, 530);
							cancelAnimationFrame(disparo);
							cancelAnimationFrame(idAnimacio);
							cancelAnimationFrame(move_enemigos);
							puntuacion();
						}
					}
				}
			});
		}
		requestAnimationFrame(colision);
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
	class Enemigo {
		constructor(velocidad, x, y) {
			this.velocidad = velocidad;
			this.x = x;
			this.y = y;
		}
	}
	// método
	Enemigo.prototype.mover = function () {
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
			let enemigocreado = new Enemigo(velocidad, x, y);
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
		move_enemigos = requestAnimationFrame(mover_enemigos);
	}

	//clase Bala
	class Bala extends Enemigo {
		constructor(velocidad, x, y) {
			super(velocidad);
			this.x = x;
			this.y = y;
		}
	}

	Bala.prototype.disparomover = function () {
		if (this.y > 0) {
			this.y = this.y - this.velocidad;
		}
	};

	function crear_bala() {
		velocidad = 2.5;
		x = xAxis * 2.25;
		y = yAxis * 2.25;
		let balacreada = new Bala(velocidad, x, y);
		return balacreada;
	}

	function mover_disparo() {
		if (arraybalas.length) {
			arraybalas.forEach((bala) => {
				bala.disparomover();
				ctx.drawImage(img_bala, bala.x, bala.y, 60, 60);
			});
		}
		disparo = requestAnimationFrame(mover_disparo);
	}

	//****** */

	window.addEventListener("gamepadconnected", function (e) {
		console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.", e.gamepad.index, e.gamepad.id, e.gamepad.buttons.length, e.gamepad.axes.length);
		console.log(e.gamepad.buttons);

		animate();
		arrayenemigos = crear_enemigos();

		mover_disparo();
		mover_enemigos();
		colision();
	});
};

function puntuacion() {
	let main = document.getElementById("main");
	let nombrePuntuacion = document.createElement("input");
	let buttonEnviar = document.createElement("button");

	nombrePuntuacion.style.width = "20%";

	nombrePuntuacion.setAttribute("id", "nombrePuntuacion");
	buttonEnviar.setAttribute("id", "buttonEnviar");

	main.appendChild(nombrePuntuacion);
}
