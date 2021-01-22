"use strict";
/*
	Student: Vikram Vasit
	2397885
	Date: 03.12.2020
*/

//Initializing webGL
const canvas = document.getElementById('mycanvas');
const renderer = new THREE.WebGLRenderer( {canvas:canvas, antialias:true} );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor('black');    

//Initialising scene. camera and light
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 100, canvas.width / canvas.height, 0.1, 1000 );
camera.position.set( 0, 15, 0.0001 );

camera.lookAt( scene.position );
const ambientLight = new THREE.AmbientLight('blue');
scene.add( ambientLight );

//Clock's body
const clockRadius = 9;
const clockHeight = 1;
const geometry1 = new THREE.CylinderGeometry( clockRadius, clockRadius, clockHeight, 6 );
const material1 = new THREE.MeshPhongMaterial( {color: 'black',
												polygonOffset: true,
												polygonOffsetFactor: 2,
												polygonOffsetUnits: 2,} );
const clock = new THREE.Mesh( geometry1, material1 );
scene.add( clock );

//Clock's Ring
const points = [
      new THREE.Vector3( clockRadius+0.2, 	 1,  10),//top left
      new THREE.Vector3( clockRadius,   	-1,  10),//top right
      new THREE.Vector3( clockRadius,   	 1, -10),//bottom right
      new THREE.Vector3( clockRadius+0.2, 	-1, -10),//bottom left
      new THREE.Vector3( clockRadius+0.2, 	 1,  10) //back to top left - close square path
    ];
const geometry2 = new THREE.LatheGeometry(points, 100); //with 100 we smooth the object making it round
const material2 = new THREE.MeshBasicMaterial( {color: 'turquoise',
												side: THREE.DoubleSide,//that's the trick with rendering two sides
												polygonOffset: true,
												polygonOffsetFactor: 1,
												polygonOffsetUnits: 1} );
const ring1 = new THREE.Mesh( geometry2, material2 );
clock.add( ring1 );

// Clock face 
const geometry3 = new THREE.CircleGeometry( clockRadius, 64 );
const material3 = new THREE.MeshBasicMaterial( {color: 'white',
												side: THREE.DoubleSide,
												polygonOffset: true,
												polygonOffsetFactor: 1,
												polygonOffsetUnits: 1} );
const clockFace = new THREE.Mesh( geometry3, material3 );
clockFace.position.y = clockHeight/2;// we put the face on one of clock's surfaces
clockFace.rotateX( Math.PI/2 ); 
clock.add( clockFace );

//Blob at the centre of clock
const geometry4 = new THREE.SphereGeometry( clockRadius/14, 32, 32 );
const material4 = new THREE.MeshBasicMaterial( {color: 'darkred'} );
const blob = new THREE.Mesh( geometry4, material4 );
clockFace.add( blob );

//Minute's hand 
const h_Length = clockRadius/5;
const geometry5 = new THREE.SphereGeometry( h_Length, 16, 16 );
const material5 = new THREE.MeshBasicMaterial( {color: 'black', side: THREE.DoubleSide} );
const minuteHand = new THREE.Mesh( geometry5, material5 );
minuteHand.scale.set( 0.1, 2, 0.1 );
minuteHand.position.set( 0, -minuteHand.scale.y*h_Length,-minuteHand.scale.z*h_Length/2);

//Hour's Hand
const hourHand = minuteHand.clone();
hourHand.scale.set( 0.1, 1.5, 0.1 );
hourHand.position.set( 	0, 
						-hourHand.scale.y*h_Length,
						-hourHand.scale.z*h_Length/2 );


//Usual Ticks
const normalTickHeight = 1.5;
const normalTickWidth = 0.4;
const geometry6 = new THREE.PlaneGeometry( normalTickWidth, normalTickHeight );
const material6 = new THREE.MeshBasicMaterial( {color: 'black', side: THREE.DoubleSide} );
const normalTick = new THREE.Mesh( geometry6, material6 );

//Tick at 12'o'clock
const geometry7 = new THREE.PlaneGeometry( normalTickWidth, normalTickHeight+0.5 );
const material7 = new THREE.MeshBasicMaterial( {color: 'blue', side: THREE.DoubleSide} );
const normalTickMarked = new THREE.Mesh( geometry7, material7 );

normalTick.position.y = normalTickHeight/2-clockRadius;
normalTickMarked.position.y = normalTick.position.y;
clockFace.add( normalTickMarked );
createTicks( normalTick, 12 );

//Second's hand
const geometry8 = new THREE.PlaneGeometry( normalTickWidth, normalTickHeight );
const material8 = new THREE.MeshBasicMaterial( {color: 'black', side: THREE.DoubleSide} );
const secHand = new THREE.Mesh( geometry8, material8 );
secHand.scale.set( 0.4, 5, 1 );
secHand.position.set(    0, 
					  ( -0.35 )*secHand.scale.y*normalTickMarked.geometry.parameters.height,
					  ( -0.3 )*h_Length ); //this way seconds "hand" would be over hours and minute "hands"


//Small Ticks 
const smallTick = normalTick.clone();
smallTick.scale.set( 0.5, 0.5, 0.1);
smallTick.position.y = normalTickHeight/4-clockRadius;
createTicks( smallTick, 60 );

//The other clock face
//cloning the pre-made elements
const clock_NDelhi = clockFace.clone();
clock_NDelhi.rotateY( Math.PI );
clock_NDelhi.position.y = -clockHeight/2;
clock.add( clock_NDelhi );

clockFace.add( secHand );
clockFace.add( minuteHand );
clockFace.add( hourHand );

//Hands for back clock face

const secHandHome = secHand.clone();
const minuteHandHome = minuteHand.clone();
const hourHandHome = hourHand.clone();

clock_NDelhi.add( secHandHome );
clock_NDelhi.add( minuteHandHome );
clock_NDelhi.add( hourHandHome );

//Generating functions
	 
function rotate( obj, angle ) //ratating the object
{
	const rotMatrix = new THREE.Matrix3().set( Math.cos(angle), -Math.sin(angle), 0,
											Math.sin(angle), Math.cos(angle), 0,
											0, 0, 1 );	//Rotating around Z-Axis
	obj.position.applyMatrix3( rotMatrix );
	obj.rotateZ( angle );
}

function createTicks( ticks, numOfTicks )// Rotating and Adding the "Ticks"
{
	const angle = 2*Math.PI/numOfTicks;
	for ( let j=1; j< numOfTicks; j++ )
	{
		const ticks1 = ticks.clone();
		rotate( ticks1, j*angle );
		clockFace.add( ticks1 );
	}
}

//Getting time
let now = new Date();
let seconds = now.getSeconds();
let minutes = now.getMinutes();

// UTC: Coordinated Universal Time
let hours = now.getUTCHours() + 1; 		//main face, Hamburg time
let hoursHome = now.getUTCHours() + 4.5;	//back face, New Delhi time

//Angles of rotation for each hand at every second
const angle_sec = (2*Math.PI)/60;
const angle_min = (2*Math.PI)/3600;
const angle_hour = angle_min/12;

//Starting positions of the hands at the current time

//the point is to get the current time and then start the rotating in the render function
//main face, Hamburg time =)
rotate( secHand, seconds*angle_sec );
rotate( minuteHand, minutes*angle_sec + seconds*angle_min );
rotate( hourHand, 5*( hours*angle_sec + minutes*angle_min + seconds*angle_hour ) );
//back face, Kiew time =)
rotate( secHandHome, seconds*angle_sec );
rotate( minuteHandHome, minutes*angle_sec + seconds*angle_min );
rotate( hourHandHome, 5*( hoursHome*angle_sec + minutes*angle_min + seconds*angle_hour ) );


//Trackball controls and  event listeners
const controls = new THREE.TrackballControls( camera, canvas );
controls.rotateSpeed = 5;

function myCallback(event)
{//using 'escape' button to reset the clock to the initial position
	if (event.keyCode == 27) {
			event.preventDefault(); // prevent default key behavior
			controls.reset();
		}		
}

document.addEventListener( "keydown", myCallback );

//Rendering
function render()
{	
	requestAnimationFrame( render );
	// Prof: line 180 gets called only once in the app. It should be called inside the render functiom
	// Student: OK, so we create new seconds time
	now = new Date(); 
	const newSeconds = now.getSeconds();
	
	if( newSeconds != seconds )
	{
		seconds = newSeconds; //Assigning newer seconds to older ones
		rotate( secHand, angle_sec );
		rotate( minuteHand, angle_min );
		rotate( hourHand, angle_hour);
		rotate( secHandHome, angle_sec);
		rotate( minuteHandHome, angle_min);
		rotate( hourHandHome, angle_hour);
	}

	controls.update();
	renderer.render( scene, camera );	
}
render();