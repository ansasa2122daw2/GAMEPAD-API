window.onload = function () {
	let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");
	let img = new Image();
	img.src = "./images/nave.png";
	img.onload = function () {
		ctx.drawImage(img, 0, 0, 200, 200);
	};
	var imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

	var xAxis = 0;
	var yAxis = 0;

	function animate() {
		var gp = navigator.getGamepads()[0];

		xAxis = Math.floor(gp.axes[0]) + xAxis;
		yAxis = Math.floor(gp.axes[1]) + yAxis;
		if (xAxis !== 0 || yAxis !== 0) {
			// var imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
			// var xAxis = ((gp.axes[0] + 1) / 2) * (canvas.width - pixels.offsetWidth);
			// var yAxis = ((gp.axes[1] + 1) / 2) * (canvas.width - pixels.offsetHeight);

			// pixels["style"].left = left + "px";
			// pixels["style"].top = right + "px";
			console.log("xAxis", xAxis);
			console.log("yAxis", yAxis);
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(img, xAxis, yAxis, 200, 200);
		}
		requestAnimationFrame(animate);
	}

	window.addEventListener("gamepadconnected", function (e) {
		console.log("GAMEPAD CONNECTED");

		animate();
	});
};
