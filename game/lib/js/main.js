const MAP = document.getElementById("Map");
const PLATFORM_DIVS = [];
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
}

function createStage(stageName = "default") {
    let stage = STAGES[stageName];
    for (let i = 0; i < stage.length; i++) {
        createBlock(stage[i]);
    }
}

createStage();