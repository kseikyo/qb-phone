let currentRotation = 0;
let isSpinning = false;

console.log("QB-Phone: spinthewheel.js (Server Auth Mode) loaded.");

$(document).ready(function () {
    // 1. Listen for the Spin Button Click
    $(document).on('click', '#spin-btn', function (e) {
        e.preventDefault();
        if (!isSpinning) {
            requestServerSpin();
        }
    });

    // 2. Listen for the Server's Reply
    window.addEventListener('message', function (event) {
        var item = event.data;

        // This event comes from client/main.lua
        if (item.action === "spin_wheel_execute") {
            console.log("QB-Phone: Server sent result:", item.targetDegree);
            executeSpinAnimation(item.targetDegree, item.finalLabel);
        }
    });
});

function requestServerSpin() {
    console.log("QB-Phone: Requesting Random Number from Node.js Backend...");
    isSpinning = true;
    $("#spin-btn").prop("disabled", true);
    $("#spin-btn").text("Contacting Pyth Oracle..."); // UI Feedback
    $("#spin-result-text").text("Waiting for blockchain...");

    // TRIGGER LUA (Client) -> which triggers SERVER -> which triggers NODE
    $.post('https://qb-phone/RequestSpin', JSON.stringify({}));
}

function executeSpinAnimation(targetDegree, finalLabel) {
    // Physics Calculation
    // We add 1800 degrees (5 full spins) + the target degree from the server
    const totalSpins = 360 * 5;
    const newRotation = currentRotation + totalSpins + targetDegree;

    // Animate CSS
    $("#wheel").css({
        "transform": "rotate(" + newRotation + "deg)",
        "transition": "transform 5s cubic-bezier(0.2, 0.8, 0.3, 1)"
    });

    currentRotation = newRotation;

    // Wait 5 seconds for animation to finish
    setTimeout(() => {
        finishSpin(finalLabel);
    }, 5000);
}

function finishSpin(label) {
    isSpinning = false;
    $("#spin-btn").prop("disabled", false);
    $("#spin-btn").text("SPIN AGAIN");
    $("#spin-result-text").text("Oracle Verified: " + label);
}
