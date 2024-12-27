document.addEventListener("DOMContentLoaded", () => {
    const playButton = document.getElementById("play");
    const workArea = document.getElementById("work");
    const startButton = document.getElementById("start");
    const stopButton = document.getElementById("stop");
    const reloadButton = document.getElementById("reload");
    const closeButton = document.getElementById("close");
    const animArea = document.getElementById("anim");
    const eventLog = document.getElementById("event-log");
    const logEntries = document.getElementById("log-entries");
    const messagesBox = document.getElementById("messages");

    let square = null, intervalId = null, dx = 0, dy = 0, eventCounter = 0;

function logEvent(message) {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `Event ${++eventCounter}: ${message} at ${timestamp}`;

    const messageElement = document.createElement("p");
    messageElement.textContent = logEntry;
    messagesBox.appendChild(messageElement);

    const localEvents = JSON.parse(localStorage.getItem("events") || "[]");
    localEvents.push(logEntry);
    localStorage.setItem("events", JSON.stringify(localEvents));

    fetch("save_logs.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: eventCounter, message, timestamp })
    })
    .catch(err => console.error("Server error:", err));
}


    function displayLog() {
        const localEvents = JSON.parse(localStorage.getItem("events") || "[]");

        const rows = localEvents.map(event => {
            return `<tr>
                        <td>${event}</td>
                        <td>(←_←)</td>
                    </tr>`;
        }).join("");

        logEntries.innerHTML = rows;
    }

    playButton.addEventListener("click", () => {
        workArea.style.display = "block";
        logEvent("Play button clicked");
    });

    startButton.addEventListener("click", () => {
        if (!square) {
            square = document.createElement("div");
            square.id = "square";
            square.style.top = "0px";
            square.style.left = `${Math.random() * (animArea.clientWidth - 10)}px`;
            animArea.appendChild(square);
            dx = Math.random() < 0.5 ? 2 : -2;
            dy = 2;
        }

        startButton.style.display = "none";
        stopButton.style.display = "block";

        intervalId = setInterval(() => {
            const rect = square.getBoundingClientRect();
            const animRect = animArea.getBoundingClientRect();

            if (rect.left <= animRect.left || rect.right >= animRect.right) {
                dx = -dx;
                logEvent("Square hit the wall horizontally");
            }

            square.style.left = `${square.offsetLeft + dx}px`;
            square.style.top = `${square.offsetTop + dy}px`;

            logEvent("Square moved");

            if (rect.bottom >= animRect.bottom) {
                clearInterval(intervalId);
                animArea.removeChild(square);
                square = null;

                stopButton.style.display = "none";
                reloadButton.style.display = "block";

                logEvent("Square exited anim area");
            }
        }, 15);

        logEvent("Start button clicked and animation started");
    });

    stopButton.addEventListener("click", () => {
        clearInterval(intervalId);
        stopButton.style.display = "none";
        startButton.style.display = "block";
        logEvent("Stop button clicked - animation paused");
    });

    reloadButton.addEventListener("click", () => {
        reloadButton.style.display = "none";
        startButton.style.display = "block";
        logEvent("Reload button clicked");
    });

    closeButton.addEventListener("click", () => {
        displayLog();
        eventLog.style.display = "block"; 
        workArea.style.display = "none";
        logEvent("Close button clicked and log displayed");
    });
});
