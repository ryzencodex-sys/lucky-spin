const wheelCanvas = document.getElementById("wheelCanvas");
const ctx = wheelCanvas.getContext("2d");

const spinButton = document.getElementById("spinButton");

const nameInput = document.getElementById("nameInput");
const addNameButton = document.getElementById("addNameButton");

const bulkInput = document.getElementById("bulkInput");
const bulkAddButton = document.getElementById("bulkAddButton");

const nameList = document.getElementById("nameList");

const participantCount = document.getElementById("participantCount");
const listCount = document.getElementById("listCount");

const clearAllButton = document.getElementById("clearAllButton");

const removeWinner = document.getElementById("removeWinner");
const soundToggle = document.getElementById("soundToggle");

const statusText = document.getElementById("statusText");

const winnerModal = document.getElementById("winnerModal");
const winnerName = document.getElementById("winnerName");
const closeModalButton = document.getElementById("closeModalButton");

const winnerHistory = document.getElementById("winnerHistory");
const clearHistoryButton = document.getElementById("clearHistoryButton");

/* =========================
TITLE
========================= */

const wheelTitle = document.getElementById("wheelTitle");
const editTitleButton = document.getElementById("editTitleButton");

const titleModal = document.getElementById("titleModal");
const wheelTitleInput = document.getElementById("wheelTitleInput");

const saveTitleButton = document.getElementById("saveTitleButton");
const cancelTitleButton = document.getElementById("cancelTitleButton");

/* =========================
LOADING
========================= */

const loadingScreen = document.getElementById("loadingScreen");
const loadingProgress = document.getElementById("loadingProgress");
const loadingPercent = document.getElementById("loadingPercent");

/* =========================
DATA
========================= */

let participants =
JSON.parse(
localStorage.getItem("luckySpinParticipants")
) || [];

let winners =
JSON.parse(
localStorage.getItem("luckySpinWinners")
) || [];

let currentRotation = 0;
let isSpinning = false;

/* =========================
COLORS
========================= */

const colors = [
"#168cff",
"#0758b8",
"#36a3ff",
"#123a70",
"#0b5cad",
"#1d6fd8",
"#4aa8ff",
"#083b7a",
"#1e90ff",
"#06458f"
];

/* =========================
SAVE DATA
========================= */

function saveParticipants() {

localStorage.setItem(
    "luckySpinParticipants",
    JSON.stringify(participants)
);

}

function saveWinners() {

localStorage.setItem(
    "luckySpinWinners",
    JSON.stringify(winners)
);

}

/* =========================
DRAW WHEEL
========================= */

function drawWheel() {

const size = wheelCanvas.width;

const centerX = size / 2;
const centerY = size / 2;

const radius = size / 2 - 10;


ctx.clearRect(
    0,
    0,
    size,
    size
);


if (participants.length === 0) {

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#071426";
    ctx.fill();


    ctx.fillStyle = "#94a3b8";

    ctx.font =
        "bold 28px Kanit, sans-serif";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";


    ctx.fillText(
        "เพิ่มรายชื่อก่อนเริ่มสุ่ม",
        centerX,
        centerY
    );

    return;

}


const sliceAngle =
    (Math.PI * 2) /
    participants.length;


participants.forEach(
    (name, index) => {

        const startAngle =
            index * sliceAngle;

        const endAngle =
            startAngle + sliceAngle;


        ctx.beginPath();

        ctx.moveTo(
            centerX,
            centerY
        );

        ctx.arc(
            centerX,
            centerY,
            radius,
            startAngle,
            endAngle
        );

        ctx.closePath();


        ctx.fillStyle =
            colors[
                index %
                colors.length
            ];

        ctx.fill();


        ctx.strokeStyle =
            "rgba(255,255,255,0.6)";

        ctx.lineWidth = 3;

        ctx.stroke();


        /* TEXT */

        ctx.save();


        ctx.translate(
            centerX,
            centerY
        );


        ctx.rotate(
            startAngle +
            sliceAngle / 2
        );


        ctx.textAlign = "right";
        ctx.textBaseline = "middle";


        let fontSize = 26;


        if (participants.length > 10) {
            fontSize = 20;
        }

        if (participants.length > 20) {
            fontSize = 16;
        }

        if (participants.length > 35) {
            fontSize = 12;
        }


        ctx.fillStyle = "#ffffff";

        ctx.font =
            `bold ${fontSize}px Kanit, sans-serif`;


        let displayName = name;


        if (displayName.length > 14) {

            displayName =
                displayName.substring(
                    0,
                    14
                ) + "...";

        }


        ctx.fillText(
            displayName,
            radius - 35,
            0
        );


        ctx.restore();

    }
);

}

/* =========================
RENDER NAMES
========================= */

function renderNames() {

nameList.innerHTML = "";


participantCount.textContent =
    participants.length;


listCount.textContent =
    participants.length + " คน";


if (participants.length === 0) {

    nameList.innerHTML = `
        <div class="empty-list">
            <div class="empty-icon">🎯</div>
            <p>ยังไม่มีผู้เข้าร่วม</p>
            <span>เพิ่มรายชื่อเพื่อเริ่มหมุนวงล้อ</span>
        </div>
    `;

    return;

}


participants.forEach(
    (name, index) => {

        const item =
            document.createElement("div");

        item.className =
            "name-item";


        const left =
            document.createElement("div");

        left.className =
            "name-left";


        const number =
            document.createElement("span");

        number.className =
            "name-number";

        number.textContent =
            (index + 1) + ".";


        const nameText =
            document.createElement("span");

        nameText.textContent =
            name;


        left.appendChild(number);
        left.appendChild(nameText);


        const deleteButton =
            document.createElement("button");

        deleteButton.className =
            "delete-name";

        deleteButton.textContent =
            "✕";


        deleteButton.addEventListener(
            "click",
            function() {

                participants.splice(
                    index,
                    1
                );

                saveParticipants();

                renderNames();

                drawWheel();

            }
        );


        item.appendChild(left);

        item.appendChild(
            deleteButton
        );


        nameList.appendChild(
            item
        );

    }
);

}

/* =========================
ADD NAME
========================= */

function addName() {

const name =
    nameInput.value.trim();


if (!name) {

    nameInput.focus();

    return;

}


participants.push(name);

saveParticipants();

renderNames();

drawWheel();


nameInput.value = "";

nameInput.focus();

}

addNameButton.addEventListener(
"click",
addName
);

nameInput.addEventListener(
"keydown",
function(event) {

    if (event.key === "Enter") {
        addName();
    }

}

);

/* =========================
ADD MULTIPLE
========================= */

bulkAddButton.addEventListener(
"click",
function() {

    const text =
        bulkInput.value.trim();


    if (!text) {

        bulkInput.focus();

        return;

    }


    const names =
        text
            .split("\n")
            .map(
                name => name.trim()
            )
            .filter(
                name => name !== ""
            );


    participants.push(
        ...names
    );


    saveParticipants();

    renderNames();

    drawWheel();


    bulkInput.value = "";

}

);

/* =========================
CLEAR ALL
========================= */

clearAllButton.addEventListener(
"click",
function() {

    if (participants.length === 0) {
        return;
    }


    if (
        !confirm(
            "ต้องการลบรายชื่อทั้งหมดใช่หรือไม่?"
        )
    ) {
        return;
    }


    participants = [];


    saveParticipants();

    renderNames();

    drawWheel();

}

);

/* =========================
WINNER HISTORY
========================= */

function renderWinnerHistory() {

winnerHistory.innerHTML = "";


if (winners.length === 0) {

    winnerHistory.innerHTML = `
        <div class="empty-history">
            🏆 ยังไม่มีผู้โชคดี
        </div>
    `;

    return;

}


winners.forEach(
    (winner, index) => {

        const item =
            document.createElement("div");

        item.className =
            "winner-item";

        item.textContent =
            `🏆 ${index + 1}. ${winner}`;


        winnerHistory.appendChild(
            item
        );

    }
);

}

/* =========================
CLEAR HISTORY
========================= */

clearHistoryButton.addEventListener(
"click",
function() {

    if (winners.length === 0) {
        return;
    }


    if (
        !confirm(
            "ต้องการล้างประวัติผู้โชคดีใช่หรือไม่?"
        )
    ) {
        return;
    }


    winners = [];


    saveWinners();

    renderWinnerHistory();

}

);

/* =========================
SOUND
========================= */

let audioContext = null;

function playTickSound() {

if (!soundToggle.checked) {
    return;
}


try {

    const AudioContextClass =
        window.AudioContext ||
        window.webkitAudioContext;


    if (!audioContext) {

        audioContext =
            new AudioContextClass();

    }


    if (
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume();

    }


    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();


    oscillator.connect(gain);

    gain.connect(
        audioContext.destination
    );


    oscillator.frequency.value = 500;

    oscillator.type = "square";


    gain.gain.setValueAtTime(
        0.03,
        audioContext.currentTime
    );


    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime +
        0.05
    );


    oscillator.start();


    oscillator.stop(
        audioContext.currentTime +
        0.05
    );

}

catch (error) {

    console.log(
        "ไม่สามารถเล่นเสียงได้"
    );

}

}

/* =========================
SPIN WHEEL
========================= */

function spinWheel() {

if (isSpinning) {
    return;
}


if (participants.length < 2) {

    alert(
        "กรุณาเพิ่มผู้เข้าร่วมอย่างน้อย 2 คน"
    );

    return;

}


isSpinning = true;

spinButton.disabled = true;


statusText.textContent =
    "กำลังหมุนวงล้อ...";


const winnerIndex =
    Math.floor(
        Math.random() *
        participants.length
    );


const sliceAngle =
    360 /
    participants.length;


const winnerCenter =
    winnerIndex *
    sliceAngle +
    sliceAngle / 2;


const pointerAngle = 270;


const targetAngle =
    pointerAngle -
    winnerCenter;


const extraSpins =
    8 +
    Math.floor(
        Math.random() * 4
    );


const normalizedCurrent =
    currentRotation % 360;


const adjustment =
    (
        targetAngle -
        normalizedCurrent +
        360
    ) % 360;


const finalRotation =
    currentRotation +
    extraSpins * 360 +
    adjustment;


const duration = 6000;

const startRotation =
    currentRotation;

const startTime =
    performance.now();


let lastTick = -1;


function animate(time) {

    const elapsed =
        time - startTime;


    let progress =
        elapsed / duration;


    if (progress > 1) {
        progress = 1;
    }


    const easeOut =
        1 -
        Math.pow(
            1 - progress,
            4
        );


    const rotation =
        startRotation +
        (
            finalRotation -
            startRotation
        ) *
        easeOut;


    currentRotation =
        rotation;


    wheelCanvas.style.transform =
        `rotate(${rotation}deg)`;


    const tickIndex =
        Math.floor(
            (rotation % 360) /
            sliceAngle
        );


    if (tickIndex !== lastTick) {

        playTickSound();

        lastTick =
            tickIndex;

    }


    if (progress < 1) {

        requestAnimationFrame(
            animate
        );

    }

    else {

        finishSpin(
            winnerIndex
        );

    }

}


requestAnimationFrame(
    animate
);

}

spinButton.addEventListener(
"click",
spinWheel
);

/* =========================
FINISH SPIN
========================= */

function finishSpin(winnerIndex) {

const winner =
    participants[winnerIndex];


statusText.textContent =
    "สุ่มเสร็จเรียบร้อย!";


winners.push(winner);

saveWinners();

renderWinnerHistory();


setTimeout(
    function() {

        winnerName.textContent =
            winner;


        winnerModal.classList.add(
            "show"
        );

    },
    400
);


if (removeWinner.checked) {

    participants.splice(
        winnerIndex,
        1
    );


    saveParticipants();

    renderNames();

}


isSpinning = false;

spinButton.disabled = false;

}

/* =========================
CLOSE WINNER
========================= */

closeModalButton.addEventListener(
"click",
function() {

    winnerModal.classList.remove(
        "show"
    );


    wheelCanvas.style.transform =
        "rotate(0deg)";


    currentRotation = 0;


    drawWheel();


    statusText.textContent =
        "พร้อมสำหรับการสุ่ม";

}

);

/* =========================
CHANGE WHEEL TITLE
========================= */

const savedWheelTitle =
localStorage.getItem(
"luckySpinTitle"
);

if (savedWheelTitle) {

wheelTitle.textContent =
    savedWheelTitle;

}

/* OPEN MODAL */

editTitleButton.addEventListener(
"click",
function() {

    wheelTitleInput.value =
        wheelTitle.textContent;


    titleModal.classList.add(
        "show"
    );


    setTimeout(
        function() {

            wheelTitleInput.focus();

        },
        100
    );

}

);

/* SAVE TITLE */

function saveWheelTitle() {

const newTitle =
    wheelTitleInput.value.trim();


if (!newTitle) {

    alert(
        "กรุณาใส่ชื่อวงล้อ"
    );

    wheelTitleInput.focus();

    return;

}


wheelTitle.textContent =
    newTitle;


localStorage.setItem(
    "luckySpinTitle",
    newTitle
);


titleModal.classList.remove(
    "show"
);

}

saveTitleButton.addEventListener(
"click",
saveWheelTitle
);

/* CANCEL TITLE */

cancelTitleButton.addEventListener(
"click",
function() {

    titleModal.classList.remove(
        "show"
    );

}

);

/* ENTER TO SAVE */

wheelTitleInput.addEventListener(
"keydown",
function(event) {

    if (event.key === "Enter") {

        saveWheelTitle();

    }

}

);

/* =========================
LOADING SCREEN
========================= */

let loadingValue = 0;

const loadingInterval =
setInterval(
function() {

        loadingValue +=
            Math.floor(
                Math.random() * 8
            ) + 3;


        if (loadingValue >= 100) {

            loadingValue = 100;

        }


        loadingProgress.style.width =
            loadingValue + "%";


        loadingPercent.textContent =
            loadingValue + "%";


        if (loadingValue === 100) {

            clearInterval(
                loadingInterval
            );


            setTimeout(
                function() {

                    loadingScreen.classList.add(
                        "hide"
                    );

                },
                500
            );

        }

    },
    120
);

/* =========================
INITIAL LOAD
========================= */

renderNames();

renderWinnerHistory();

drawWheel();

console.log(
"🎡 Lucky Spin Ready!"
);