let currentRotation = 0;
let isSpinning = false;

// Define prizes corresponding to the 8 segments (45deg each)
// Order is Counter-Clockwise from 0deg because wheel spins Clockwise
const prizes = [
    { label: "$100",   value: "money_100" }, // 0-45
    { label: "Sandwich", value: "item_sandwich" }, // 45-90
    { label: "$1000",  value: "money_1000" }, // 90-135
    { label: "Nothing", value: "none" }, // 135-180
    { label: "$500",   value: "money_500" }, // 180-225
    { label: "Water",  value: "item_water" }, // 225-270
    { label: "$5000",  value: "money_5000" }, // 270-315
    { label: "Phone",  value: "item_phone" }, // 315-360
];

// Initialize functionality
$(document).ready(function(){
    // Attach click listener to the spin button
    $(document).on('click', '#spin-btn', function(e){
        e.preventDefault();
        if (!isSpinning) {
            startSpin();
        }
    });
});

function getRandom(){
    return Math.random()
}

function startSpin() {
    isSpinning = true;
    $("#spin-btn").prop("disabled", true);
    $("#spin-result-text").text("Spinning...");

    // Calculate a random angle:
    // Add 360 * 5 (5 full spins) + random number between 0 and 360
    const randomDeg = Math.floor(getRandom() * 360);
    const totalSpins = 360 * 8; // Spin 8 times fast
    const newRotation = currentRotation + totalSpins + randomDeg;

    // Apply CSS transform
    $("#wheel").css({
        "transform": "rotate(" + newRotation + "deg)",
        "transition": "transform 5s cubic-bezier(0.2, 0.8, 0.3, 1)" // Smooth deceleration
    });

    currentRotation = newRotation;

    // Wait for animation to finish (5 seconds)
    setTimeout(() => {
        finishSpin(newRotation);
    }, 5000);
}

function finishSpin(finalRotation) {
    isSpinning = false;
    $("#spin-btn").prop("disabled", false);

    // Calculate which segment is at the top (0deg)
    // We use modulo 360 to get the remaining angle
    // Since the arrow is at the top, we need to calculate the offset
    let actualDeg = finalRotation % 360;

    // Because pointer is at Top (0deg is usually right in CSS logic),
    // and we rotated clockwise, we check which segment is now at the "Top" position.
    // Simple approach: 360 - actualDeg gives us the segment from the start point.
    let winningAngle = (360 - actualDeg + 90) % 360;

    // Determine index (each segment is 45deg)
    let index = Math.floor(actualDeg / 45);

    // NOTE: Depending on your gradient alignment, you might need to flip this logic.
    // Since we defined gradient 0-45, 45-90 etc.
    // If we rotate 45 degrees, the 0-45 segment moves clockwise.
    // We take the inverse for calculation logic or just simplistic array index:
    // Let's fix the index to match the array defined above visually.
    // Actually, the easiest way is: 8 - index (because we rotate clockwise)
    let prizeIndex = (8 - Math.ceil(actualDeg / 45)) % 8;

    let wonPrize = prizes[prizeIndex];

    $("#spin-result-text").text("You won: " + wonPrize.label + "!");

    // Send result to Server (Lua)
    $.post('https://qb-phone/SpinWheelReward', JSON.stringify({
        reward: wonPrize.value,
        label: wonPrize.label
    }));
}
