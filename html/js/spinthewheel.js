let currentRotation = 0;
let isSpinning = false;

// Define prizes
const prizes = [
    { label: "$100", value: "money_100" },
    { label: "Sandwich", value: "item_sandwich" },
    { label: "$1000", value: "money_1000" },
    { label: "Nothing", value: "none" },
    { label: "$500", value: "money_500" },
    { label: "Water", value: "item_water" },
    { label: "$5000", value: "money_5000" },
    { label: "Phone", value: "item_phone" },
];

// Run when JS loads
console.log("QB-Phone: spinwheel.js has loaded successfully.");

$(document).ready(function () {
    console.log("QB-Phone: spinwheel.js document is ready.");

    // Attach click listener
    $(document).on('click', '#spin-btn', function (e) {
        console.log("QB-Phone: Spin Button Clicked!");
        e.preventDefault();

        if (isSpinning) {
            console.log("QB-Phone: Wheel is already spinning, ignoring click.");
            return;
        }

        startSpin();
    });
});

function startSpin() {
    console.log("QB-Phone: Starting Spin...");
    isSpinning = true;
    $("#spin-btn").prop("disabled", true);
    $("#spin-btn").text("Spinning..."); // Visual feedback on button text
    $("#spin-result-text").text("Spinning...");

    // Calculate random angle
    const randomDeg = Math.floor(Math.random() * 360);
    const totalSpins = 360 * 8;
    const newRotation = currentRotation + totalSpins + randomDeg;

    console.log("QB-Phone: Rotating to " + newRotation + " degrees");

    // Apply CSS transform
    $("#wheel").css({
        "transform": "rotate(" + newRotation + "deg)",
        "transition": "transform 5s cubic-bezier(0.2, 0.8, 0.3, 1)"
    });

    currentRotation = newRotation;

    setTimeout(() => {
        finishSpin(newRotation);
    }, 5000);
}

function finishSpin(finalRotation) {
    console.log("QB-Phone: Spin Finished.");
    isSpinning = false;
    $("#spin-btn").prop("disabled", false);
    $("#spin-btn").text("SPIN ($0)");

    let actualDeg = finalRotation % 360;

    // Calculate winning index (8 segments, clockwise rotation)
    // Logic: (8 - (segment index)) % 8
    let prizeIndex = (8 - Math.ceil(actualDeg / 45)) % 8;

    // Safety check for index
    if (prizeIndex < 0) prizeIndex = 0;

    let wonPrize = prizes[prizeIndex];
    console.log("QB-Phone: Won Prize Index: " + prizeIndex + " (" + wonPrize.label + ")");

    $("#spin-result-text").text("You won: " + wonPrize.label + "!");

    // Send to Lua
    $.post('https://qb-phone/SpinWheelReward', JSON.stringify({
        reward: wonPrize.value,
        label: wonPrize.label
    }));
}
