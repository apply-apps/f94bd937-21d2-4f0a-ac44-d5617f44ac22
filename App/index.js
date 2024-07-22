// Filename: index.js
// Combined code from all files

import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, View, Button } from 'react-native';

const CELL_SIZE = 20;
const BOARD_SIZE = 300;
const SNAKE_INITIAL_LENGTH = 5;

const getRandomPosition = () => {
  const max = BOARD_SIZE / CELL_SIZE;
  return Math.floor(Math.random() * max) * CELL_SIZE;
};

const App = () => {
  const [snake, setSnake] = useState([]);
  const [direction, setDirection] = useState('RIGHT');
  const [food, setFood] = useState({ x: getRandomPosition(), y: getRandomPosition() });
  const [gameOver, setGameOver] = useState(false);
  const gameInterval = useRef(null);

  useEffect(() => {
    if (!gameOver) {
      setSnake(initialSnake(SNAKE_INITIAL_LENGTH));
      gameInterval.current = setInterval(moveSnake, 200);
    }
    return () => clearInterval(gameInterval.current);
  }, [gameOver]);

  const initialSnake = (length) => {
    return Array.from({ length }, (_, index) => ({
      x: index * CELL_SIZE,
      y: 0,
    }));
  };

  const moveSnake = () => {
    setSnake((prevSnake) => {
      let newSnake = prevSnake.slice();
      const head = newSnake[newSnake.length - 1];
      let newHead;

      switch (direction) {
        case 'RIGHT':
          newHead = { x: head.x + CELL_SIZE, y: head.y };
          break;
        case 'LEFT':
          newHead = { x: head.x - CELL_SIZE, y: head.y };
          break;
        case 'UP':
          newHead = { x: head.x, y: head.y - CELL_SIZE };
          break;
        case 'DOWN':
          newHead = { x: head.x, y: head.y + CELL_SIZE };
          break;
      }

      newSnake.push(newHead);
      if (newHead.x === food.x && newHead.y === food.y) {
        setFood({ x: getRandomPosition(), y: getRandomPosition() });
      } else {
        newSnake.shift();
      }

      if (isColliding(newHead, newSnake) || isOutOfBound(newHead)) {
        setGameOver(true);
        clearInterval(gameInterval.current);
        return prevSnake;
      }

      return newSnake;
    });
  };

  const isColliding = (head, snake) => {
    return snake.slice(0, -1).some(segment => segment.x === head.x && segment.y === head.y);
  };

  const isOutOfBound = (head) => {
    return head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE;
  };

  const changeDirection = (newDirection) => {
    const oppositeDirections = {
      'UP': 'DOWN',
      'DOWN': 'UP',
      'LEFT': 'RIGHT',
      'RIGHT': 'LEFT',
    };

    if (newDirection !== oppositeDirections[direction]) {
      setDirection(newDirection);
    }
  };

  const restartGame = () => {
    setGameOver(false);
    setFood({ x: getRandomPosition(), y: getRandomPosition() });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.board}>
        {snake.map((segment, index) => (
          <View key={index} style={[styles.snakeSegment, { left: segment.x, top: segment.y }]} />
        ))}
        <View style={[styles.food, { left: food.x, top: food.y }]} />
      </View>
      {gameOver && <Button title="Restart" onPress={restartGame} />}
      <View style={styles.controls}>
        <Button title="UP" onPress={() => changeDirection('UP')} />
        <View style={styles.horizontalControls}>
          <Button title="LEFT" onPress={() => changeDirection('LEFT')} />
          <Button title="RIGHT" onPress={() => changeDirection('RIGHT')} />
        </View>
        <Button title="DOWN" onPress={() => changeDirection('DOWN')} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  snakeSegment: {
    position: 'absolute',
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: 'green',
  },
  food: {
    position: 'absolute',
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: 'red',
  },
  controls: {
    marginTop: 20,
    alignItems: 'center',
  },
  horizontalControls: {
    flexDirection: 'row',
    width: 200,
    justifyContent: 'space-between',
    marginVertical: 10,
  },
});

export default App;