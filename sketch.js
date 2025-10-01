let jello
function preload(){
    jello = loadImage('jello.gif');
}

function setup() 
{
	createCanvas(windowWidth, windowHeight);
}

function draw()
{
    background(255, 0, 0);
    image(jello, 0, 0);

}
