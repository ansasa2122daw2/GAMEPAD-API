var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
  
let image = document.getElementById('player1');
context.drawImage(image, 80, 180);

var imageData = context.getImageData( 80, 180, canvas.width, canvas.height);
var pixels = imageData.data

window.addEventListener("gamepadconnected", function() {

  player1 = document.getElementById("player1");
  updateLoop();

});

function updateLoop() {
  var gp = navigator.getGamepads()[0];
  var left = (gp.axes[0] + 1) / 2 * (window.innerWidth - pixels.offsetWidth);
  var right = (gp.axes[1] + 1) / 2 * (window.innerHeight - pixels.offsetHeight);

  pixels.style.left = left + "px";
  pixels.style.top =  right + "px";


  requestAnimationFrame(updateLoop);

}