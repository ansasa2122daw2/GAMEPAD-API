//funcion que carga al cargar la página
window.onload = function () {
	let disparar = true;
	//declaramos canvas
	let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");

	let gameOver = false;

	//Array Vidas usando push para luego hacer pop en colision() y hacer una pila
	let arrayVidas = [];
	arrayVidas.push(1);
	arrayVidas.push(2);
	arrayVidas.push(3);
	arrayVidas.push(4);
	console.log(arrayVidas);

	//Timer
	var n = 0;
	var l = document.getElementById("number");
	window.setInterval(function () {
		l.innerHTML = n;
		n++;
	}, 1000);

	//Puntuación
	let arraypuntuacion = [];

	//sort()
	console.log(arraypuntuacion.sort());

	//reducer para la puntuación
	const reducer = (previousValue, currentValue) => previousValue + currentValue;

	//Un array de balas
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

	let imgvictory = new Image();
	imgvictory.src = "./images/win.jpg";

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
				//ctx.strokeRect(xAxis * 2.25, yAxis * 2.25, 60, 60);

				//DISPARO al pulsar la A haces push de la creación de la bala al array de balas
				if (gp.buttons[0].pressed && disparar == true) {
					arraybalas.push(crear_bala());
					disparar = false;
					setTimeout(() => {
						disparar = true;
					}, 500);
				}
			}
			idAnimacio = requestAnimationFrame(animate);
		} else {
			console.log("Conecta el mando");
		}
	}

	// Función colision para cuando el jugador choca con enemigos y para cuando la bala choca con enemigos
	function colision() {
		if (arrayenemigos) {
			arrayenemigos.forEach((enemigo) => {
				var gp = navigator.getGamepads()[0];
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

							mover_disparo();
							mover_enemigos();
							colision();

							//Haces pop de las vidas
							arrayVidas.pop();

							// Cada vez que pierdas una vida se verá en el html
							document.getElementById("vidas").innerText = arrayVidas[arrayVidas.length - 1];

							// Si pierdes todas las vidas se acaba el juego y se enseña la función puntuación
							if (arrayVidas.length == 0) {
								gameOver = true;
								if (gameOver) {
									ctx.drawImage(fondo, 0, 0, ctx.canvas.width, ctx.canvas.height);
									ctx.drawImage(imggameOver, 0, 0, 600, 530);
									cancelAnimationFrame(disparo);
									cancelAnimationFrame(idAnimacio);
									cancelAnimationFrame(move_enemigos);
									puntuacion();
									document.getElementById("vidas").style.display = "none";
								}
							}
						}
					}

					// Esto es la colision de balas con enemigo
					if (arraybalas) {
						arraybalas.forEach((bala) => {
							if (bala.x < enemigo.x + 60 && bala.x > enemigo.x - 60 && bala.y < enemigo.y + 60 && bala.y > enemigo.y - 60) {
								//haciendo el reduce que añade puntos
								arraypuntuacion.push(arraypuntuacion.reduce(reducer, 1));
								document.getElementById("puntuacionJ").innerText = arraypuntuacion[arraypuntuacion.length - 1];
								arrayenemigos.splice(arrayenemigos.indexOf(enemigo), 1);
								arraybalas.splice(arraybalas.indexOf(bala), 1);
							}
						});
					}
				}
			});

			// Cogiendo el array de balas y haciendo for each haces que cada bala que se vaya fuera de 20 se elimine con splice
			arraybalas.forEach((bala) => {
				if (bala.y < 20) {
					arraybalas.splice(arraybalas.indexOf(bala), 1);
				}
			});
		}

		requestAnimationFrame(colision);
	}

	//Clase Jugador
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
			//ctx.strokeRect(this.x, this.y, 60, 60);
		} else {
			this.y = 0;
			this.x = Math.round(Math.random() * 300);
		}
	};

	//crear varios enemigos en la clase y ponemos un setInterval con un tiempo de cada 3 segundos salgan 3 enemigos más
	function crear_enemigos() {
		let arrayenemigos = [];
		for (i = 0; i < 5; i++) {
			x = Math.random() * 700;
			y = 0;
			velocidad = 2;

			let enemigocreado = new Enemigo(velocidad, x, y);
			arrayenemigos.push(enemigocreado);
		}
		setInterval(() => {
			for (i = 0; i < 3; i++) {
				x = Math.random() * 700;
				y = 0;
				velocidad = 2;

				let enemigocreado = new Enemigo(velocidad, x, y);
				arrayenemigos.push(enemigocreado);
			}
		}, 3000);
		return arrayenemigos;
	}

	//funcion para mover los enemigos
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

	// Tenemos el método mover de bala
	Bala.prototype.disparomover = function () {
		if (this.y > 0) {
			this.y = this.y - this.velocidad;
		}
	};

	// Creamos las balas con esta función y cogiendo las Axis del jugador
	function crear_bala() {
		velocidad = 2.5;
		x = xAxis * 2.25;
		y = yAxis * 2.25;
		let balacreada = new Bala(velocidad, x, y);
		return balacreada;
	}

	// Movemos la bala con esta función disparo la cual cogemos el array y hacemos un foreach para pasar por el array con bala
	function mover_disparo() {
		if (arraybalas.length) {
			arraybalas.forEach((bala) => {
				bala.disparomover();
				ctx.drawImage(img_bala, bala.x, bala.y, 60, 60);
			});
		}
		disparo = requestAnimationFrame(mover_disparo);
	}

	/*******/

	// Esto hace que al conectar el gamepad hagan todas estás AnimationFrame
	window.addEventListener("gamepadconnected", function (e) {
		console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.", e.gamepad.index, e.gamepad.id, e.gamepad.buttons.length, e.gamepad.axes.length);
		console.log(e.gamepad.buttons);

		animate();
		arrayenemigos = crear_enemigos();

		mover_disparo();
		mover_enemigos();
		colision();
	});

	// Función puntuación que crea los elementos para que aparezcan y luego la llamamos al perder todas las vidas
	function puntuacion() {
		let main = document.getElementById("main");
		let nombrePuntuacion = document.createElement("input");
		let buttonEnviar = document.createElement("button");

		nombrePuntuacion.style.width = "20%";
		nombrePuntuacion.style.margin = "3rem";
		buttonEnviar.style.padding = "3px";

		nombrePuntuacion.setAttribute("id", "nombrePuntuacion");
		nombrePuntuacion.setAttribute("type", "text");
		buttonEnviar.setAttribute("id", "buttonEnviar");
		buttonEnviar.type = "button";
		buttonEnviar.innerHTML = "Envia";
		nombrePuntuacion.placeholder = "Escribe tu nombre";

		main.appendChild(nombrePuntuacion);
		main.appendChild(buttonEnviar);

		// Esto hace que al clickar el boton se envie a almacenar desar y luego la muestra
		document.getElementById("buttonEnviar").addEventListener("click", almacenar.desar, false);
		almacenar.mostrar();
	}

	// Esto sería para el web storage
	var almacenar = {
		taula: document.getElementById("taula"),
		desar: function () {
			localStorage.setItem(arraypuntuacion[arraypuntuacion.length - 1], document.getElementById("nombrePuntuacion").value);
			almacenar.esborrarTaula();
			almacenar.mostrar();
		},
		mostrar: function () {
			for (var i = 0; i < localStorage.length; i++) {
				var fila = taula.insertRow(0);
				fila.insertCell(0).innerHTML = localStorage.key(i);
				fila.insertCell(1).innerHTML = localStorage.getItem(localStorage.key(i));
			}
		},
		esborrarTaula: function () {
			while (taula.rows.length > 0) {
				taula.deleteRow(0);
			}
		},
	};
};
