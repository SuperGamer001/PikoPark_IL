// The array of players play type.
var players = [
    {
        controller: null,
        type: null,
        gamepad: null
    },
    {
        controller: null,
        type: null,
        gamepad: null
    },
    {
        controller: null,
        type: null,
        gamepad: null
    },
    {
        controller: null,
        type: null,
        gamepad: null
    },
    {
        controller: null,
        type: null,
        gamepad: null
    },
    {
        controller: null,
        type: null,
        gamepad: null
    },
    {
        controller: null,
        type: null,
        gamepad: null
    },
    {
        controller: null,
        type: null,
        gamepad: null
    }
]

// Determines if a gamepad connection is currently processing
var connectionProcess = false
// If a gamepad is currently being paired, it will be stored here
var pairingController = null

// The function that is called when a button is pressed or knob is moved.
function controllerAction(controller, action, index) {
    for(let i = 0; i < players.length; i++) {
        if(players[i].controller == null && !connectionProcess) {
            askForControllerType(i, controller);
            break;
        }
    }
}

// Asks the user what type of controller they are using.
function askForControllerType(index, controller) {
    connectionProcess = true;
    players[index].controller = "gamepad";
    document.getElementById("prompt").style.display = "block";
    document.getElementById("promptTitle").innerHTML = "Connecting a Controller for Player " + (index + 1);
}

function answerGamepadPrompt(index) {
    players[index].type = buttonMapping[index];
    document.getElementById("promptType").innerHTML = "Selected Controller Type: " + buttonMapping[index].name;
    // players[index].gamepad = navigator.getGamepads()[index];
}

// The function that is called when the user answers the prompt.
function closeGamepadPrompt() {
    document.getElementById("prompt").style.display = "none";
    connectionProcess = false;
}

function animate(){
    //Updates the gamepad info
    const gamepads = navigator.getGamepads();
    for(let i = 0; i < gamepads.length; i++) {
        var gamepad = gamepads[i];
        if (gamepad) {
            const buttons = gamepad.buttons;
            for (let b = 0; b < buttons.length; b++) {
                const button = buttons[b];
                if (button.pressed == true) {
                    controllerAction(b,"button",i)
                }
            }
        }
    }

    requestAnimationFrame(animate);
}

animate();