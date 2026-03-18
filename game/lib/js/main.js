const MAP = document.getElementById("Map");
const KEYS = {};
const PLAYERS = [];
const PLATFORM_DIVS = [];
const PLATFORM_COLLIDERS = [];
const PLAYER_WIDTH = 3.5;
const PLAYER_HEIGHT = 4.06;
const GRAVITY = 0.08;
const STAGES = {
    "default": [
        { width: 102, height: 5, left: -1, top: 52 },
        { width: 102, height: 5, left: -1, top: -1 },
        { width: 5, height: 55, left: -1, top: -1 },
        { width: 5, height: 55, left: 96, top: -1 },
        { width: 58, height: 1.3, left: 20, top: 22 },
    ],
};
const HATS = {
    "cat": {
        offset: {
            x: 1.5,
            y: 10
        }
    },
    "bear": {
        offset: {
            x: 24,
            y: 10
        }
    },
    "cap": {
        offset: {
            x: 47.5,
            y: 10
        }
    },
    "helmet": {
        offset: {
            x: 70.6,
            y: 6
        }
    }
}

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
function createPlayer(x = 0, y = 0, hue = 0, helmet = "cat") {
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
    obj.style.width = PLAYER_WIDTH + "vw";
    obj.style.height = PLAYER_HEIGHT + "vw";
    obj.style.left = x + "vw";
    obj.style.top = y + "vw";
    obj.style.filter = `hue-rotate(${hue}deg)`;

    const hat = document.createElement("div");
    hat.classList.add("hat");
    hat.style.backgroundPosition = `${HATS[helmet].offset.x}% ${HATS[helmet].offset.y}%`;
    obj.appendChild(hat);

    player.obj = obj;
    MAP.appendChild(obj);
    PLAYERS.push(player);
}

function isOverlapping(player, platform) {
    return (
        player.x < platform.left + platform.width &&
        player.x + PLAYER_WIDTH > platform.left &&
        player.y < platform.top + platform.height &&
        player.y + PLAYER_HEIGHT > platform.top
    );
}

function resolveHorizontalCollisions(player) {
    for (let platform of PLATFORM_COLLIDERS) {
        if (!isOverlapping(player, platform)) {
            continue;
        }

        if (player.velocityX > 0) {
            player.x = platform.left - PLAYER_WIDTH;
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
            player.x < other.x + PLAYER_WIDTH &&
            player.x + PLAYER_WIDTH > other.x &&
            player.y < other.y + PLAYER_HEIGHT &&
            player.y + PLAYER_HEIGHT > other.y
        );

        if (!overlaps) {
            continue;
        }

        if (player.velocityX > 0) {
            player.x = other.x - PLAYER_WIDTH;
        }
        else if (player.velocityX < 0) {
            player.x = other.x + PLAYER_WIDTH;
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
            player.y = platform.top - PLAYER_HEIGHT;
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
            player.x < other.x + PLAYER_WIDTH &&
            player.x + PLAYER_WIDTH > other.x &&
            player.y < other.y + PLAYER_HEIGHT &&
            player.y + PLAYER_HEIGHT > other.y
        );

        if (!overlaps) {
            continue;
        }

        if (player.velocityY > 0) {
            player.y = other.y - PLAYER_HEIGHT;
            player.onGround = true;
        }
        else if (player.velocityY < 0) {
            player.y = other.y + PLAYER_HEIGHT;
        }
        player.velocityY = 0;
    }
}

function render() {
    requestAnimationFrame(render);

    let me = PLAYERS[0];

    if (KEYS["ArrowLeft"] && !KEYS["ArrowRight"]) {
        me.velocityX = -0.5;
    }
    else if (KEYS["ArrowRight"] && !KEYS["ArrowLeft"]) {
        me.velocityX = 0.5;
    }
    else {
        me.velocityX = 0;
    }

    if (KEYS["ArrowUp"] && me.onGround) {
        me.velocityY = -1;
    }

    for (let player of PLAYERS) {
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
createPlayer(10, 40, 0, "cap"); // Red
createPlayer(20, 40, 120, "bear"); // Green
createPlayer(30, 40, 240, "cap"); // Blue
createPlayer(40, 40, 60, "helmet"); // Yellow
createPlayer(50, 40, 300, "cat"); // Purple
createPlayer(60, 40, 180, "bear"); // Cyan
createPlayer(70, 40, 330, "helmet"); // Pink
createPlayer(80, 40, 40, "cat"); // Orange

// Start Render Loop
render();