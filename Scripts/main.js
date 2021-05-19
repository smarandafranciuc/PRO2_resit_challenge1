// Declare our variables
var distanceTravelled = 0; // m
var speed = 0; // m/s
var acceleration = 0; // m/s2
var throttlePercentage = 0; // 0 to 1
var maxAcceleration = 8;
var fuel = 100;
var fuelLossFullThrottle = 0.2;
var totalDistance = 54.6; // km

var deltaTime = 0;
var oldTimeStamp = 0;

// Get the html boys
var textDistanceTravelled = document.getElementById('text-distance');
var textSpeed = document.getElementById('text-speed');
var textThrottle = document.getElementById('text-throttle');
var sliderThrottle = document.getElementById('slider-throttle');
var textFuel = document.getElementById('text-fuel');
var textProgress = document.getElementById('text-distance-subtext');

// Update function that runs on an interval
Update(0);
function Update(timeStamp) {
    CalculateDeltaTime(timeStamp);

    // Stop throttling if no fuel left
    if (fuel <= 0) {
        fuel = 0;
        sliderThrottle.value = 0;
    }

    // Calculate acceleration, speed, distanceTravelled
    throttlePercentage = sliderThrottle.value / 10;
    acceleration = maxAcceleration * throttlePercentage;
    speed += acceleration * deltaTime;
    if (speed < 0) {
        speed = 0;
        acceleration = 0;
        sliderThrottle.value = 0;
    }
    distanceTravelled += speed * deltaTime;

    // Manage fuel
    fuel -= fuelLossFullThrottle * Math.abs(throttlePercentage) * deltaTime;

    // Update html
    textDistanceTravelled.innerText = ConvertMetersToNiceKilometersString(distanceTravelled) + "km / " + totalDistance + "M km";
    textSpeed.innerText = Math.round(speed * 3.6);
    textThrottle.innerText = Math.round(acceleration * 3.6) + " km/h /s";
    textFuel.innerText = Math.round(fuel) + "%";
    textProgress.innerText = Math.round(distanceTravelled / totalDistance / 10) + "%";

    // Call update again
    requestAnimationFrame(Update);
}

function CalculateDeltaTime(timeStamp) {
    deltaTime = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
}

function ConvertMetersToNiceKilometersString(meters) {
    var onlyMeters = Math.floor(meters) % 1000;
    var metersWithZeros = ('000' + onlyMeters).substr(-3);
    return Math.floor(meters / 1000) + "," + metersWithZeros;
}