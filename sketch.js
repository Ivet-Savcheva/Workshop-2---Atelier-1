let jello
function preload(){
    jello = loadImage('jello.jpg');
}

function setup() 
{
	createCanvas(400, 400);
}

function draw()
{
    background(255, 0, 0);
    image(jello, 0, 0);

}
