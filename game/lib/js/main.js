const MAP = document.getElementById("Map");
const KEYS = {};
const PLAYERS = [];
const PLATFORM_DIVS = [];
const PLATFORM_COLLIDERS = [];
const PLAYER_SIZE = 5;
const GRAVITY = 0.1;
const STAGES = {
    "default": [
        { width: 102, height: 5, left: -1, top: 52 },
        { width: 102, height: 5, left: -1, top: -1 },
        { width: 5, height: 55, left: -1, top: -1 },
        { width: 5, height: 55, left: 96, top: -1 },

        { width: 58, height: 1.3, left: 20, top: 22 },
    ],
};

function createBlock(config) {
    // Variables
    var { width, height, left, top } = config;
    var type;

    // Set type
    if (!config.type) {
        type = "ground";
    }
    else {
        type = config.type;
    }

    // Create block
    const platformDiv = document.createElement("div");
    platformDiv.classList.add("platform", type);
    platformDiv.style.width = width + "vw";
    platformDiv.style.height = height + "vw";
    platformDiv.style.left = left + "vw";
    platformDiv.style.top = top + "vw";
    MAP.appendChild(platformDiv);
    PLATFORM_DIVS.push(platformDiv);
    PLATFORM_COLLIDERS.push({
        left,
        top,
        width,
        height,
    });
}
function createStage(stageName = "default") {
    let stage = STAGES[stageName];
    for (let i = 0; i < stage.length; i++) {
        createBlock(stage[i]);
    }
}
function createPlayer(x = 0, y = 0, color = "red") {

    const player = {
        x: x,
        y: y,
        velocityX: 0,
        velocityY: 0,
        onGround: false,
        obj: null,
    }
    const obj = document.createElement("div");
    obj.classList.add("player");
    obj.style.left = x + "vw";
    obj.style.top = y + "vw";
    obj.style.backgroundColor = color;
    player.obj = obj;
    MAP.appendChild(obj);
    PLAYERS.push(player);
}

function isOverlapping(player, platform) {
    return (
        player.x < platform.left + platform.width &&
        player.x + PLAYER_SIZE > platform.left &&
        player.y < platform.top + platform.height &&
        player.y + PLAYER_SIZE > platform.top
    );
}

function resolveHorizontalCollisions(player) {
    for (let platform of PLATFORM_COLLIDERS) {
        if (!isOverlapping(player, platform)) {
            continue;
        }

        if (player.velocityX > 0) {
            player.x = platform.left - PLAYER_SIZE;
        }
        else if (player.velocityX < 0) {
            player.x = platform.left + platform.width;
        }
        player.velocityX = 0;
    }
}

function resolveHorizontalPlayerCollisions(player) {
    for (let other of PLAYERS) {
        if (other === player) {
            continue;
        }

        const overlaps = (
            player.x < other.x + PLAYER_SIZE &&
            player.x + PLAYER_SIZE > other.x &&
            player.y < other.y + PLAYER_SIZE &&
            player.y + PLAYER_SIZE > other.y
        );

        if (!overlaps) {
            continue;
        }

        if (player.velocityX > 0) {
            player.x = other.x - PLAYER_SIZE;
        }
        else if (player.velocityX < 0) {
            player.x = other.x + PLAYER_SIZE;
        }
        player.velocityX = 0;
    }
}

function resolveVerticalCollisions(player) {
    player.onGround = false;

    for (let platform of PLATFORM_COLLIDERS) {
        if (!isOverlapping(player, platform)) {
            continue;
        }

        if (player.velocityY > 0) {
            player.y = platform.top - PLAYER_SIZE;
            player.onGround = true;
        }
        else if (player.velocityY < 0) {
            player.y = platform.top + platform.height;
        }
        player.velocityY = 0;
    }
}

function resolveVerticalPlayerCollisions(player) {
    for (let other of PLAYERS) {
        if (other === player) {
            continue;
        }

        const overlaps = (
            player.x < other.x + PLAYER_SIZE &&
            player.x + PLAYER_SIZE > other.x &&
            player.y < other.y + PLAYER_SIZE &&
            player.y + PLAYER_SIZE > other.y
        );

        if (!overlaps) {
            continue;
        }

        if (player.velocityY > 0) {
            player.y = other.y - PLAYER_SIZE;
            player.onGround = true;
        }
        else if (player.velocityY < 0) {
            player.y = other.y + PLAYER_SIZE;
        }
        player.velocityY = 0;
    }
}

function render() {
    requestAnimationFrame(render);

    for (let player of PLAYERS) {
        if (KEYS["ArrowLeft"] && !KEYS["ArrowRight"]) {
            player.velocityX = -0.5;
        }
        else if (KEYS["ArrowRight"] && !KEYS["ArrowLeft"]) {
            player.velocityX = 0.5;
        }
        else {
            player.velocityX = 0;
        }

        if (KEYS["ArrowUp"] && player.onGround) {
            player.velocityY = -5;
        }

        player.velocityY += GRAVITY;

        player.x += player.velocityX;
        resolveHorizontalCollisions(player);
        resolveHorizontalPlayerCollisions(player);

        player.y += player.velocityY;
        resolveVerticalCollisions(player);
        resolveVerticalPlayerCollisions(player);

        player.obj.style.left = player.x + "vw";
        player.obj.style.top = player.y + "vw";


    }
}

// Event Listeners
document.addEventListener("keydown", (event) => {
    KEYS[event.key] = true;
});
document.addEventListener("keyup", (event) => {
    KEYS[event.key] = false;
});

// Initiate Game
createStage();

// 8 Players
createPlayer(10, 40, "red");
createPlayer(20, 40, "green");
createPlayer(30, 40, "blue");
createPlayer(40, 40, "yellow");
createPlayer(50, 40, "purple");
createPlayer(60, 40, "cyan");
createPlayer(70, 40, "magenta");
createPlayer(80, 40, "orange");

// Start Render Loop
render();