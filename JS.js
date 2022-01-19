var canvas  = document.getElementById('Canvas'),
ctx = canvas.getContext('2d');
    
function draw() {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  
let image = document.getElementById('player1');
context.drawImage(image, 0,0);
}