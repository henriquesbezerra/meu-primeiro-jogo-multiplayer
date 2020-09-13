export default function createGame(){

    const state = {
        players:{ },
        fruits: { },
        screen: {
            width: 10,
            height: 10
        }
    };

    const observers = [];

    function  start(){
        const frequency = 5000;
        setInterval(addFruit, frequency);
    }

    function subscribe(observerFunction){
        observers.push(observerFunction);
    }

    function notifyAll(command){
        // console.log(`Notify ${observers.length} observers`);

        for( const observerFunction of observers){
            observerFunction(command);
        }
    }

    function setState(newState){
        Object.assign(state, newState);
    }

    function addPlayer(command) {
        const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width);
        const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height);

        state.players[command.playerId] = {
            x: playerX,
            y: playerY
        }

        notifyAll({
            type: 'add-player',
            playerId: command.playerId,
            playerX,
            playerY
        });
    }

    function removePlayer(command) {
        delete state.players[command.playerId];
        notifyAll({
            type: 'remove-player',
            playerId: command.playerId,           
        });
    }

    function addFruit(command) {
        const fruitId = command ? command.fruitId : Math.floor(Math.random() * 10000000); 
        const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.screen.width);
        const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.screen.height);

        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY
        }

        notifyAll({
            type: 'add-fruit',
            fruitId,
            fruitX,
            fruitY
        });
    }

    function removeFruit(command) {
        delete state.fruits[command.fruitId];

        notifyAll({
            type: 'remove-fruit',
            fruitId: command.fruitId
        });
    }


    function movePlayer(command){
        // console.log(`Moving ${command.playerId} with ${command.keyPressed}`);
        
        notifyAll(command);

        const acceptedMoves = {
            ArrowUp(player) {
                console.log("UP");
                if(player.y - 1 >= 0) {
                    player.y -=  1;
                }
            },
            ArrowRight(player) {
                console.log("Right");
                if(player.x + 1 < state.screen.width) {
                    player.x +=  1;
                }
            },
            ArrowDown(player){
                console.log("Down");
                if(player.y + 1 < state.screen.height) {
                    player.y +=  1;
                }
            },
            ArrowLeft(player) {
                console.log("left");
                if(player.x - 1 >= 0) {
                    player.x -=  1;
                }
            }
        }

        const keyPressed = command.keyPressed;
        const player = state.players[command.playerId];
        const moveFunction = acceptedMoves[keyPressed];

        if(player && moveFunction){
            moveFunction(player);
            checkForFruitCollision(command.playerId);
        } 

    }

    function checkForFruitCollision(playerId){                
        const player = state.players[playerId];
        for(const fruitId in state.fruits){
            const fruit = state.fruits[fruitId];
            // console.log(`Checking ${playerId} and ${fruitId}`);

            if(player.x === fruit.x && player.y === fruit.y){
                // console.log(`COLISSION BETWEEN ${playerId} and ${fruitId}`);
                removeFruit({ fruitId });
            }
        }                
    }

    return {
        start,
        state,
        setState,
        movePlayer,
        addPlayer,
        removePlayer,
        addFruit,
        removeFruit,
        subscribe
    }
}