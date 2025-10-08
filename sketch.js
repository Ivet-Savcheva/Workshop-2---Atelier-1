let backgroundColor;
let jelloY; // GIF shown only for Y-axis movement
let jelloZ; // GIF shows only for Z-axis movement
let jello;  // optional general GIF (not required)

// movement detection using change (delta) between frames
let movementThreshold = 1.5; // delta m/s² (less sensitive than per-frame raw)
let consecutiveRequired = 4; // require several frames
let consecutiveAbove = 0;
let lastTrigger = 0;
let minInterval = 1500; // ms cooldown
let lastMoved = 0;
let showDuration = 3000; // ms to keep gif visible after movement

// Y-axis specific settings (use delta on Y)
let yMovementThreshold = 1.2; // delta on Y
let consecutiveY = 0;
let lastTriggerY = 0;
let minIntervalY = 1500;
let lastMovedY = 0;
let showDurationY = 3000; // 3 seconds for the Y-axis GIF

// Z-axis specific settings (use delta on Z)
let zMovementThreshold = 1.8; // delta on Z (tune to be less sensitive)
let consecutiveZ = 0;
let lastTriggerZ = 0;
let minIntervalZ = 1500;
let lastMovedZ = 0;
let showDurationZ = 3000; // 3 seconds for the Z-axis GIF

// state for delta calculations
let prevTotal = 0;
let prevY = 0;
let prevZ = 0;

function preload(){
    jelloY = loadImage('Jello-up-down.gif');
    jelloZ = loadImage('jello-splat.gif');
    // optional: load a general gif if you want one
    // jello = loadImage('Jello-general.gif');
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

        // delta from previous frame (reduces gravity problem)
        let deltaTotal = abs(totalAcceleration - prevTotal);
        let deltaY = abs(rawY - prevY);
        let deltaZ = abs(rawZ - prevZ);

        // persistence + cooldown: require several consecutive frames above threshold (general)
        if (deltaTotal > movementThreshold) {
            consecutiveAbove++;
        } else {
            consecutiveAbove = 0;
        }

        // only trigger if sustained and cooldown passed (general GIF removed/optional)
        if (consecutiveAbove >= consecutiveRequired && (millis() - lastTrigger) > minInterval) {
            lastMoved = millis();
            lastTrigger = lastMoved;
            consecutiveAbove = 0; // reset after triggering
        }

        // --- Y-axis only detection ---
        if (deltaY > yMovementThreshold) {
            consecutiveY++;
        } else {
            consecutiveY = 0;
        }
        if (consecutiveY >= consecutiveRequired && (millis() - lastTriggerY) > minIntervalY) {
            lastMovedY = millis();
            lastTriggerY = lastMovedY;
            consecutiveY = 0;
        }

        // --- Z-axis only detection (new) ---
        if (deltaZ > zMovementThreshold) {
            consecutiveZ++;
        } else {
            consecutiveZ = 0;
        }
        if (consecutiveZ >= consecutiveRequired && (millis() - lastTriggerZ) > minIntervalZ) {
            lastMovedZ = millis();
            lastTriggerZ = lastMovedZ;
            consecutiveZ = 0;
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

        // Y-axis GIF (drawn before Z, Z will take priority if both triggered)
        let showYGif = (millis() - lastMovedY) < showDurationY;
        if (showYGif && jelloY) {
            image(jelloY, 0, 0, width, height);
        }

        // Z-axis GIF (drawn last so it covers the screen when Z movement detected)
        let showZGif = (millis() - lastMovedZ) < showDurationZ;
        if (showZGif && jelloZ) {
            image(jelloZ, 0, 0, width, height);
        }

        // update previous values for delta calculation
        prevTotal = totalAcceleration;
        prevY = rawY;
        prevZ = rawZ;

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