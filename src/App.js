import React, { useState, useEffect } from 'react';
import './App.css';

const size = 15;
const exitPos = [size - 1, size - 1];

function generateObstacles(gameMap, playerPos, obstacleCount) {
    const newMap = [...gameMap];
    for (let i = 0; i < obstacleCount; i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * size);
            y = Math.floor(Math.random() * size);
        } while ((x === playerPos[0] && y === playerPos[1]) || newMap[x][y] !== '.');
        newMap[x][y] = 'obstacle';
    }
    return newMap.map(row => [...row]); // Shallow copy to ensure a new reference
}

function isValidMove(x, y, gameMap) {
    return x >= 0 && x < size && y >= 0 && y < size && gameMap[x][y] !== 'obstacle';
}
function Game() {
    const [gameMap, setGameMap] = useState([]);
    const [playerPos, setPlayerPos] = useState([0, 0]);

    useEffect(() => {
        initializeGame();
    }, []);

    useEffect(() => {
        function handleKeyDown(event) {
            let dx = 0, dy = 0;
            switch(event.key) {
                case 'ArrowUp':
                    dx = -1;
                    break;
                case 'ArrowDown':
                    dx = 1;
                    break;
                case 'ArrowLeft':
                    dy = -1;
                    break;
                case 'ArrowRight':
                    dy = 1;
                    break;
                default:
                    return;
            }
            movePlayer(dx, dy);
        }

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [gameMap, playerPos]);

    function initializeGame() {
        const newMap = [];
        for (let i = 0; i < size; i++) {
            const rowData = Array(size).fill('.');
            newMap.push(rowData);
        }
        setGameMap(newMap);
    }

    function resetGame() {
        const newMap = [];
        for (let i = 0; i < size; i++) {
            const rowData = Array(size).fill('.');
            newMap.push(rowData);
        }
        setGameMap(newMap);
        setPlayerPos([0, 0]);
    }
    
    function movePlayer(dx, dy) {
        const newPosX = playerPos[0] + dx;
        const newPosY = playerPos[1] + dy;

        if (isValidMove(newPosX, newPosY, gameMap)) {
            setPlayerPos([newPosX, newPosY]);
            if (newPosX === exitPos[0] && newPosY === exitPos[1]) {
                alert("Congratulations! You escaped from the Dungeon!");
                resetGame();
            } else {
                setGameMap(prevMap => generateObstacles(prevMap, [newPosX, newPosY], 1));
            }
        } else {
            alert("Game over.");
            resetGame();
        }
    }

    return (
        <div className="game-container">
            <h1>Escape Dungeon</h1>
            <table id="gameTable">
                <tbody>
                    {gameMap.map((rowData, rowIndex) => (
                        <tr key={rowIndex}>
                            {rowData.map((cellType, colIndex) => (
                                <td key={`${rowIndex}-${colIndex}`} className={`cell ${cellType} ${rowIndex === exitPos[0] && colIndex === exitPos[1] ? 'exit' : ''} ${playerPos[0] === rowIndex && playerPos[1] === colIndex ? 'player' : ''}`}>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Game;
