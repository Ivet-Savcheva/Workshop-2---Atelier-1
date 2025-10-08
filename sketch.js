let backgroundColor;
let jello
let jelloY; // GIF shown only for Y-axis movement

// movement detection (using raw acceleration, tilt NOT removed)
// Made less sensitive: higher threshold + persistence + cooldown
let movementThreshold = 2.0; // higher = less sensitive (m/s²)
let consecutiveRequired = 3; // number of consecutive frames above threshold required
let consecutiveAbove = 0;
let lastTrigger = 0;
let minInterval = 1000; // ms minimum time between triggers (cooldown)
let lastMoved = 0;
let showDuration = 1000; // ms to keep gif visible after movement (1 second)

// Y-axis specific settings
let yMovementThreshold = 1.0; // threshold specifically for Y axis
let consecutiveY = 0;
let lastTriggerY = 0;
let minIntervalY = 1000;
let lastMovedY = 0;
let showDurationY = 3000; // 3 seconds for the Y-axis GIF

function preload(){
    jello = loadImage('Jello-up-down.gif');
    // place your Y-axis GIF file in the project folder and update the filename below
    jelloY = loadImage('Jello-y-only.gif');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    backgroundColor = color(50, 50, 50);
    textAlign(CENTER, CENTER);
    textSize(16);

    // Request permission for motion sensors on iOS
    enableGyroTap();
}

function draw(){
    background(backgroundColor);

    // checking if motion sensors are available
    if (window.sensorsEnabled) {

        // Read raw acceleration (may include gravity / tilt)
        let rawX = accelerationX || 0;
        let rawY = accelerationY || 0;
        let rawZ = accelerationZ || 0;

        // magnitude of raw acceleration
        let totalAcceleration = sqrt(rawX * rawX + rawY * rawY + rawZ * rawZ);

        // persistence + cooldown: require several consecutive frames above threshold
        if (totalAcceleration > movementThreshold) {
            consecutiveAbove++;
        } else {
            consecutiveAbove = 0;
        }

        // only trigger if sustained and cooldown passed (general GIF)
        if (consecutiveAbove >= consecutiveRequired && (millis() - lastTrigger) > minInterval) {
            lastMoved = millis();
            lastTrigger = lastMoved;
            consecutiveAbove = 0; // reset after triggering
        }

        // --- Y-axis only detection ---
        if (abs(rawY) > yMovementThreshold) {
            consecutiveY++;
        } else {
            consecutiveY = 0;
        }
        if (consecutiveY >= consecutiveRequired && (millis() - lastTriggerY) > minIntervalY) {
            lastMovedY = millis();
            lastTriggerY = lastMovedY;
            consecutiveY = 0;
        }
        
        // Current acceleration values
        fill(255);
        text("Device Acceleration (raw)", width/2, height/6);

        // Individual acceleration values
        text("X: " + nf(rawX, 1, 2) + " m/s²", width/2, height/6 + 40);
        text("Y: " + nf(rawY, 1, 2) + " m/s²", width/2, height/6 + 70);
        text("Z: " + nf(rawZ, 1, 2) + " m/s²", width/2, height/6 + 100);

        text("Total: " + nf(totalAcceleration, 1, 2) + " m/s²", width/2, height/6 + 140);

        // visuals (bars), replace with different shapes
        fill(255, 100, 100); // red for X
        rect(width/2 - 120, height/2, map(abs(rawX), 0, 20, 0, 100), 20);

        fill(100, 255, 100); // green for Y
        rect(width/2 - 120, height/2 + 30, map(abs(rawY), 0, 20, 0, 100), 20);

        fill(100, 100, 255); // blue for Z
        rect(width/2 - 120, height/2 + 60, map(abs(rawZ), 0, 20, 0, 100), 20);
        
        // labels for the bars
        fill(255);
        text("X", width/2 - 140, height/2 + 10);
        text("Y", width/2 - 140, height/2 + 40);
        text("Z", width/2 - 140, height/2 + 70);

        // instructions
        text("Move your device to make the GIF appear", width/2, height - 60);
        text("Shake, tilt, or move the device in different directions", width/2, height - 30);

        // show gif if recently moved (drawn last so it covers the screen)
        let showGif = (millis() - lastMoved) < showDuration;
        if (showGif && jello) {
            image(jello, 0, 0, width, height);
        }

        // Y-axis GIF takes priority (drawn last)
        let showYGif = (millis() - lastMovedY) < showDurationY;
        if (showYGif && jelloY) {
            image(jelloY, 0, 0, width, height);
        }

    } else {
        // motion sensors not available or permission not granted
        fill(255, 100, 100);
        text("Motion sensors not available", width/2, height/2);
        text("or permission not granted", width/2, height/2 + 30);
        text("Tap the screen to request permission", width/2, height - 30);
    }
}

function touchStarted(){
    return false;
}

function touchEnded(){
    return false;
}