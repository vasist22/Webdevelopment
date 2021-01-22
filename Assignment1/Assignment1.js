/*By: Vikram Vasist
2397885
21 Nov. 2020*/
"use strict";
// Initialize WebGL renderer-----------------------------------------------------------------------------
const canvas = document.getElementById("mycanvas");
const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
renderer.setSize((window.innerWidth), (window.innerHeight));
renderer.setClearColor('#eeeeee');  // background color
//--------------------------------------------------------------------------------------------------------
// Create a new Three.js scene----------------------------------------------------------------------------
const scene = new THREE.Scene();
// show global coordinate system
//scene.add(new THREE.AxesHelper(1.5));
//---------------------------------------------------------------------------------------------------------- 
// Add a camera---------------------------------------------------------------------------------------------
const camera = new THREE.PerspectiveCamera( 75, canvas.width / canvas.height, 0.1, 500 );
camera.position.set(0,6,15);
//-------------------------------------------------------------------------------------------------------------
// Add a mouse controller to move the camera-------------------------------------------------------------------
camera.lookAt( scene.position );
const controls = new THREE.TrackballControls( camera, renderer.domElement);
//---------------------------------------------------------------------------------------------------------------
// Add light sources----------------------------------------------------------------------------------------
scene.add(new THREE.AmbientLight('#909090'));
const light = new THREE.PointLight();
light.position.set(5,0,5);
scene.add(light);
//---------------------------------------------------------------------------------------------------------------

//Play-Areas - Ground --------------------------------------------------------------------------------------
const groundMat = new THREE.MeshPhongMaterial({color: "green",
                                               side:THREE.DoubleSide});
groundMat.transparent = false;
groundMat.opacity = 0.5;
const groundWidth = 10;
const groundLength = 20; 
const groundGeo = new THREE.PlaneGeometry(groundWidth,groundLength);
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI/2;
ground.y=-5;
scene.add(ground);
//-----------------------------------------------------------------------------------------------------------

// Middle line generation ----------------------------------------------------------------------------------
const material = new THREE.LineBasicMaterial({
	color: "white"
});
const points = [];
points.push( new THREE.Vector3( - 5, 0, 0 ) );
points.push( new THREE.Vector3( 0, 0, 0 ) );
points.push( new THREE.Vector3( 5, 0, 0 ) );
const geometry = new THREE.BufferGeometry().setFromPoints( points );
const line = new THREE.Line( geometry, material );
scene.add( line );
//-----------------------------------------------------------------------------------------------------------

// User 1 Racket------------------------------------------------------------------------------------------------
const paddle1Width=3, paddle1Height=2;
const paddle1_Dist = groundLength/2;
const paddle1_Thickness = 0.2;
let paddle1Dirx=0, paddle1Diry=0, paddle1speed = 1;
const paddle1 = new THREE.Mesh(new THREE.BoxGeometry(paddle1Width,paddle1Height,paddle1_Thickness),
                            new THREE.MeshStandardMaterial({color:'red',
                                                            metalness:0.1,
                                                            roughness:0.9}));
paddle1.position.z = paddle1_Dist - 1/2*paddle1_Thickness;
paddle1.position.y = 0.75;
paddle1.rotation.y = -Math.PI;
scene.add(paddle1);
//-------------------------------------------------------------------------------------------------------------------
// User 2 Racket-----------------------------------------------------------------------------------------------------
const paddle2Width=3, paddle2Height=2;
const paddle2_Thickness = 0.2;
const paddle2_Dist = -groundLength/2 + 1/2*paddle2_Thickness;
let paddle2Dirx=0, paddle2Diry=0, paddle2speed = 1;
const paddle2 = new THREE.Mesh(new THREE.BoxGeometry(paddle2Width,paddle2Height,paddle2_Thickness),
                            new THREE.MeshStandardMaterial({color:'blue',
                                                            metalness:0.1,
                                                            roughness:0.9}));
paddle2.position.z = paddle2_Dist //- 1/2*paddle2_Thickness;
paddle2.position.y = 0.75;
paddle2.rotation.y = Math.PI;
//--------------------------------------------------------------------------------------------------------------

//Walls surrounding the playing area ------------------------------------------------------------------------
const wallDist1 = 5.1;
const wallThickness1 = 0.1;
const wall1 = new THREE.Mesh(new THREE.BoxGeometry(groundLength,1,wallThickness1),
                            new THREE.MeshStandardMaterial({color:'white',
                                                            metalness:0.1,
                                                            roughness:0.9}));
wall1.position.x = wallDist1 - 1/2*wallThickness1;
wall1.position.y=0.5;
wall1.rotation.y = -Math.PI/2;
scene.add(wall1);

const wallDist2 = -5;
const wallThickness2 = 0.1;
const wall2 = new THREE.Mesh(new THREE.BoxGeometry(groundLength,1,wallThickness2),
                            new THREE.MeshStandardMaterial({color:'gray',
                                                            metalness:0.1,
                                                            roughness:0.9}));
wall2.position.x = wallDist2 - 1/2*wallThickness1;
wall2.position.y=0.5;
wall2.rotation.y = Math.PI/2;
scene.add(wall2);
//-----------------------------------------------------------------------------------------------------------------------

// function for the wall infront----------------------------------------------------------------------------------------
function wall3(){
const wallDist3 = -(groundLength/2);
const wallThickness3 = 0.1;
const wall3 = new THREE.Mesh(new THREE.BoxGeometry(10,1,wallThickness3),
                            new THREE.MeshStandardMaterial({color:'gray',
                                                            metalness:0.1,
                                                            roughness:0.9}));
wall3.position.z = wallDist3 - 1/2*wallThickness3;
wall3.position.y=0.5;
wall3.rotation.y = Math.PI;
scene.add(wall3);
}
//---------------------------------------------------------------------------------------------------------------------------

// The moving ball--------------------------------------------------------------------------------------------------------
const ballRadius = 0.5, segment = 32, rings=16;
var ballDirz = 1, ballDirx = 1;
const mat = new THREE.MeshStandardMaterial({color:'#afeeee',
                                            metalness:0.5,
                                            roughness:0.1});

const ball = new THREE.Mesh(new THREE.SphereGeometry(ballRadius, segment,rings), mat);
scene.add(ball);

let ballspeed = 0.15;
ball.position.x = 0;
ball.position.y = ballRadius*2;
ball.position.z = 0;
//------------------------------------------------------------------------------------------------------------------------

/*function whenKeyNotPressed( event ) //checks if the key isn't pressed
{ 
	generatePaddle1Speed.x = 0;
	generatePaddle1Speed.y = 0;
	generatePaddle1Speed.z = 0;
}
*/

// Function for how the ball moves when in single player mode------------------------------------------------------------------------------------------------------------------------------------
function ballPhysics(){
  
    // if ball goes off the 'left' side (Player's side)
    
    if (ball.position.z >= (groundLength/2)+1){
      alert("Game Over!");
      resetBall(2);
      //ballDirz = -ballDirz;
    }
    if(ball.position.x <= -groundWidth/2 ){
      ballDirx = - ballDirx;
    }
    if(ball.position.x >= groundWidth/2){
      ballDirx = -ballDirx;
    }
    if(ball.position.z <= (-groundLength/2 + 1/2*paddle2_Thickness)){
      ballDirz = -ballDirz;
    }
  
    ball.position.z += ballDirz*ballspeed;
    ball.position.x += ballDirx*ballspeed;
  
    if (ballDirx > ballspeed * 2)
      {
          ballDirx = ballspeed * 2;
      }
      else if (ballDirx < -ballspeed * 2)
      {
          ballDirx = -ballspeed * 2;
      }
  }
//-----------------------------------------------------------------------------------------------------------------------------------
// Function for how the ball moves in  double player mode----------------------------------------------------------------------------------------
function ballPhysics2(){
  
  // if ball goes off the 'left' side (Player's side)
  
  if (ball.position.z >= (groundLength/2)+1){
    alert("Game Over!, Blue Wins !!");
    resetBall(2);
    //ballDirz = -ballDirz;
  }
  if(ball.position.x <= -groundWidth/2 ){
    ballDirx = - ballDirx;
  }
  if(ball.position.x >= groundWidth/2){
    ballDirx = -ballDirx;
  }
  if(ball.position.z <= (-groundLength/2 + 1/2*paddle2_Thickness)){
    //ballDirz = -ballDirz;
    alert("Game Over!, Red Wins !!");
    resetBall(1);
  }

  ball.position.z += ballDirz*ballspeed;
  ball.position.x += ballDirx*ballspeed;

  if (ballDirx > ballspeed * 2)
	{
		ballDirx = ballspeed * 2;
	}
	else if (ballDirx < -ballspeed * 2)
	{
		ballDirx = -ballspeed * 2;
	}
}
//------------------------------------------------------------------------------------------------------------------------------------

// Function for the User 1's paddle movement----------------------------------------------------------------------------------------
function playerPaddleMovement()
{
	// move left
	if (Key.isDown(Key.Arrow_right))		
	{
		// if paddle is not touching the side of table
		// we move
		if (paddle1.position.x < groundWidth * 0.45)
		{
			paddle1Dirx = paddle1speed * 0.5;
		}
		// else we don't move and stretch the paddle
		// to indicate we can't move
		else
		{
			paddle1Dirx = 0;
			paddle1.scale.y += (4 - paddle1.scale.y) * 0.2;
		}
	}	
	// move right
	else if (Key.isDown(Key.Arrow_left))
	{
		// if paddle is not touching the side of table
		// we move
		if (paddle1.position.x > -groundWidth * 0.45)
		{
			paddle1Dirx = -paddle1speed * 0.5;
		}
		// else we don't move and stretch the paddle
		// to indicate we can't move
		else
		{
			paddle1Dirx = 0;
      paddle1.scale.y += (4 - paddle1.scale.y) * 0.2;
		}
	}
	// else don't move paddle
	else
	{
		// stop the paddle
		paddle1Dirx = 0;
	}
	
	paddle1.scale.x += (1 - paddle1.scale.x) * 0.2;	
	paddle1.scale.y += (1 - paddle1.scale.y) * 0.2;	
	paddle1.position.x += paddle1Dirx;
}
//------------------------------------------------------------------------------------------------------------------------------------
// Function for User 2's paddle movement----------------------------------------------------------------------------------------
function playerPaddle2Movement()
{
	// move left
	if (Key.isDown(Key.D))		
	{
		// if paddle is not touching the side of table
		// we move
		if (paddle2.position.x > -groundWidth * 0.45)
		{
			paddle2Dirx = -paddle2speed * 0.5;
		}
		// else we don't move and stretch the paddle
		// to indicate we can't move
		else
		{
			paddle2Dirx = 0;
			paddle2.scale.y += (4 - paddle2.scale.y) * 0.2;
		}
	}	
	// move right
	else if (Key.isDown(Key.A))
	{
		// if paddle is not touching the side of table
		// we move
		if (paddle2.position.x <groundWidth * 0.45)
		{
			paddle2Dirx = paddle2speed * 0.5;
		}
		// else we don't move and stretch the paddle
		// to indicate we can't move
		else
		{
            paddle2Dirx = 0;
            paddle2.scale.y += (4 - paddle2.scale.y) * 0.2;
		}
	}
	// else don't move paddle
	else
	{
		// stop the paddle
		paddle2Dirx = 0;
	}
	
	paddle2.scale.x += (1 - paddle2.scale.x) * 0.2;	
	paddle2.scale.y += (1 - paddle2.scale.y) * 0.2;	
	paddle2.position.x += paddle2Dirx;
}
//------------------------------------------------------------------------------------------------------------------------------------
//Function for User 1's paddle physics----------------------------------------------------------------------------------------
function paddlePhysics()
{
	// PLAYER PADDLE LOGIC
	
	// if ball is aligned with paddle1 on x plane
	// remember the position is the CENTER of the object
	// we only check between the front and the middle of the paddle (one-way collision)
	if (ball.position.z <= paddle1.position.z+3
	&&  ball.position.z >= paddle1.position.z)
	{
		// and if ball is aligned with paddle1 on y plane
		if (ball.position.x <= paddle1.position.x + 2
		&&  ball.position.x >= paddle1.position.x - 2)
		{
			// and if ball is travelling towards player (-ve direction)
			if (ballDirz > 0)
			{
				// stretch the paddle to indicate a hit
				paddle1.scale.x = 6;
				// switch direction of ball travel to create bounce
				ballDirz = -ballDirz;
				// we impact ball angle when hitting it
				// this is not realistic physics, just spices up the gameplay
				// allows you to 'slice' the ball to beat the opponent
				ballDirx -= paddle1Dirx * 0.7;
			}
		}
  }
}
//------------------------------------------------------------------------------------------------------------------------------------
//Function for User 2's paddle physics-----------------------------------------------------------------------------------------------
function paddle2Physics()
{
	// PLAYER PADDLE LOGIC
	
	// if ball is aligned with paddle1 on x plane
	// remember the position is the CENTER of the object
	// we only check between the front and the middle of the paddle (one-way collision)
	if (ball.position.z <= paddle2.position.z + 3
	&&  ball.position.z >= paddle2.position.z)
	{
		// and if ball is aligned with paddle1 on y plane
		if (ball.position.x <= (paddle2.position.x+2) 
		&&  ball.position.x >= (paddle2.position.x -2))
		{
			// and if ball is travelling towards player (-ve direction)
			if (ballDirz < 0)
			{
				// stretch the paddle to indicate a hit
				paddle2.scale.x = 6;
				// switch direction of ball travel to create bounce
				ballDirz = -ballDirz;
				// we impact ball angle when hitting it
				// this is not realistic physics, just spices up the gameplay
				// allows you to 'slice' the ball to beat the opponent
                ballDirx -= paddle2Dirx * 0.7;
			}
		}
  }
}
//------------------------------------------------------------------------------------------------------------------------------------
//Function to Reset Ball afte it's out of the playing field----------------------------------------------------------------------------
function resetBall(loser)
{
	// position the ball in the center of the table
	ball.position.z = 0;
	ball.position.x = 0;
	
	// if player lost the last point, we send the ball to opponent
	if (loser == 1)
	{
		ballDirx = -1;
	}
	// else if opponent lost, we send ball to player
	else
	{
		ballDirx = 1;
	}
	
	// set the ball to move +ve in y plane (towards left from the camera)
	ballDirx = 1;
}

//------------------------------------------------------------------------------------------------------------------------------------
const clock = new THREE.Clock();
//Choice to chosse between Single player and Double player----------------------------------------------------------------------------------------
let s=prompt("Enter '1', for Single player or '2', for Double player" );
if(s==1){
//Reder Function for Single player Mode
function render() {
  renderer.render(scene,camera);
  requestAnimationFrame(render);
//s=prompt("Press '1' for Single player and '2' for Double player" );

    wall3();
    ballPhysics();
    playerPaddleMovement();
    paddlePhysics();
} render();
  controls.update();
}
else if (s==2){
    //Render for double player
    scene.add(paddle2);
    function render() {
        renderer.render(scene,camera);
        requestAnimationFrame(render);
      //s=prompt("Press '1' for Single player and '2' for Double player" );
          ballPhysics2();
          playerPaddleMovement();
          playerPaddle2Movement();
          paddlePhysics();
          paddle2Physics()
    }
    render();
    controls.update();
}
