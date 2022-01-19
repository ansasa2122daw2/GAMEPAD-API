
/*window.addEventListener("gamepadconnected", function (e) {
  this.alert("GAMEPAD CONNECTED");
});*/
/* */

window.addEventListener('load',draw)//esto es igual a <body onload="draw();">
        
function draw() {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  
  let image = document.getElementById('player1');
  context.drawImage(image, 380, 304, 40, 60);

  
}
 /*
function updateLoop() {
 
    var gp = navigator.getGamepads()[0];
    var left = (gp.axes[0] + 1) / 2 * (window.innerWidth - image.offsetWidth);
    var right = (gp.axes[1] + 1) / 2 * (window.innerHeight - image.offsetHeight);
 
    image.style.left = left + "px";
    image.style.top =  right + "px";
 
    requestAnimationFrame(updateLoop);
 
}
function updateLoop() {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
 
    var gp = navigator.getGamepads()[0];
 
    if (gp.buttons[0].pressed) {
      context.body.style.backgroundColor = "red";
    } else {
      context.body.style.backgroundColor = "white";
    }
 
    requestAnimationFrame(updateLoop);
 
}
*/
var keys = {},
    speed = 4,
    player = document.getElementById('player1'),
    applyDeadzone = function(number, threshold){
        percentage = (Math.abs(number) - threshold) / (1 - threshold);
        if(percentage < 0){
            percentage = 0;
        }
        return percentage * (number > 0 ? 1 : -1);
    },
    gamepad = null,
    joystickX = 0, 
    horizontalMovement = 0,
    getHorizontalMovementFromKeys = function(){
      
      movement = 0;
      
      if(keys[37]){
        movement = -speed;
      }
      if(keys[39]){
        movement += speed;
      }
      
      return movement;
    },
    gameloop = function(){
      
      gamepad = navigator.getGamepads()[0];
      if(gamepad){
        joystickX = applyDeadzone(gamepad.axes[0], 0.25) * speed;
        if(Math.abs(joystickX) > 0){
          horizontalMovement = joystickX;
        }else{
          horizontalMovement = getHorizontalMovementFromKeys();
        }
      }else{
        horizontalMovement = getHorizontalMovementFromKeys();
      }
       
      if(Math.abs(horizontalMovement) > 0){
        playerLeft = parseFloat(window.getComputedStyle(player,null).getPropertyValue("left"));

        if(playerLeft){
          player.style.left = (playerLeft + horizontalMovement) + "px";
        }
      }

      window.requestAnimationFrame(gameloop);
    };

window.onkeydown = function(e){
  var e = e || window.event;
  keys[e.keyCode] = true;
}

window.onkeyup = function(e){
  var e = e || window.event;
  delete keys[e.keyCode];
}

gameloop();

/**
 * window.addEventListener('load',draw)//esto es igual a <body onload="draw();">
        

  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  
  let image = document.getElementById('player1');
  context.drawImage(image, 380, 304, 40, 60);

  

 
    var gp = navigator.getGamepads()[0];
    var left = (gp.axes[0] + 1) / 2 * (window.innerWidth - image.offsetWidth);
    var right = (gp.axes[1] + 1) / 2 * (window.innerHeight - image.offsetHeight);
 
    image.style.left = left + "px";
    image.style.top =  right + "px";
 
    requestAnimationFrame(updateLoop);
 */