// HTML Elements
const board = document.getElementById('board');
const scoreBoard = document.getElementById('scoreBoard');
const startButton = document.getElementById('start');
const gameOverSign = document.getElementById('gameOver');

// Game settings
const boardSize = 10;
const gameSpeed = 100;
const squareTypes = {
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2
};

const directions = {
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowRight: 1,
    ArrowLeft: -1
};

// Game variables
let snake;
let score;
let direction;
let boardSquares;
let emptySquares;
let moveInterval;

const drawSnake = () => {
    snake.forEach(square => drawSquare(square, 'snakeSquare'));
}

// Rellena cada cuadrado del tablero
// @params
// square: posicion del cuadrado
// type: tipo de cuadrado (emptySquare, snakeSquare, foodSquare)
const drawSquare = (square, type) => {
    const [row, column] = square.split('');
    boardSquares[row][column] = squareTypes[type];
    const squareElement = document.getElementById(square);
    squareElement.setAttribute('class', `square ${type}`);
    if(type === 'emptySquare') {
        emptySquares.push(square);
    } else {
        if(emptySquares.indexOf(square) !== -1) {
            emptySquares.splice(emptySquares.indexOf(square), 1);
        }
    }
}

const moveSnake = () => {
    const newSquare = String(
        Number(snake[snake.length - 1]) + directions[direction])
        .padStart(2, '0');
    const [row, column] = newSquare.split('');
    
    if(newSquare < 0 ||
        newSquare > boardSize * boardSize ||
        (direction === directions.ArrowRight && column == 0) ||
        (direction === directions.ArrowLeft && column == 9) ||
        boardSquares[row][column] === squareTypes.snakeSquare) {
            gameOver();
    } else {
        snake.push(newSquare);
        if(boardSquares[row][column] === squareTypes.foodSquare) {
            addFood();
        } else {
            const emptySquare = snake.shift();
            drawSquare(emptySquare, 'emptySquare');
        }
        drawSnake();
        /* updateScore(); */
    }
}    

const addFood = () => {
    score++;
    updateScore();
    createRandomFood();
}

const gameOver = () => {
    gameOverSign.style.display = 'block';
    clearInterval(moveInterval);
    startButton.disabled = false;

}

const setDirection = newDirection => {
    direction = newDirection;
}

const directionEvent = key => {
    switch(key.code) {
        case 'ArrowUp':
            direction != directions.ArrowDown && setDirection(key.code)
            break;
        case 'ArrowDown':
            direction != directions.ArrowUp && setDirection(key.code)
            break;
        case 'ArrowLeft':
            direction != directions.ArrowRight && setDirection(key.code)
            break;
        case 'ArrowRight':
            direction != directions.ArrowLeft && setDirection(key.code)
            break;
        }
    }        

// Nuevo código para manejar eventos táctiles
let touchStartX = 0;
let touchStartY = 0;

const handleTouchStart = (event) => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

const handleTouchMove = (event) => {
    if (!touchStartX || !touchStartY) {
        return;
    }

    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;

    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Deslizamiento horizontal
        if (diffX > 0) {
            directionEvent({ code: 'ArrowLeft' });
        } else {
            directionEvent({ code: 'ArrowRight' });
        }
    } else {
        // Deslizamiento vertical
        if (diffY > 0) {
            directionEvent({ code: 'ArrowUp' });
        } else {
            directionEvent({ code: 'ArrowDown' });
        }
    }

    touchStartX = 0;
    touchStartY = 0;
}

const createRandomFood = () => {
    const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    drawSquare(randomEmptySquare, 'foodSquare');

}

const updateScore = () => {
    scoreBoard.innerText = score;
}

const createBoard = () => {
    boardSquares.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
            const squareValue = `${rowIndex}${columnIndex}`;
            const squareElement = document.createElement('div');
            squareElement.setAttribute('class', 'square emptySquare');
            squareElement.setAttribute('id', squareValue);
            board.appendChild(squareElement);
            emptySquares.push(squareValue);
        });
    });
}

const setGame = () => {
    snake = ['00', '01','02', '03'];
    score = snake.length;
    direction = directions.ArrowRight;
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare));
    console.log(boardSquares);
    board.innerHTML = '';
    emptySquares = [];
    createBoard();
}

const startGame = () => {
    setGame();
    gameOverSign.style.display = 'none';
    startButton.disabled = true;
    drawSnake();
    updateScore();
    createRandomFood();
    /* document.addEventListener('keydown', control); */
    document.addEventListener('keydown', directionEvent);
    // Agregar eventos táctiles
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    
    moveInterval = setInterval( () => moveSnake(), gameSpeed);
}

startButton.addEventListener('click', startGame);