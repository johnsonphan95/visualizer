import React, { useState, useEffect } from "react";
import Node from "./Node";
import NodeObject from "../utils/node";
import {
  dijkstra,
  getNodesInShortestPathOrder
} from "../utils/algorithms/dijkstra";

import "./PathFinder.css";

const Visualizer = () => {
  const [grid, setGrid] = useState([]);
  const [mouseDown, setMouseDown] = useState(false);
  const [moveNode, setMoveNode] = useState(false);
  const [coordinates, setCoordinates] = useState({
    START_NODE_COL: 5,
    START_NODE_ROW: 10,
    END_NODE_COL: 20,
    END_NODE_ROW: 10
  });

  useEffect(() => {
    const grid = getInitialGrid();
    setGrid(grid);
  }, []);

  const getInitialGrid = () => {
    const grid = [];
    for (let col = 0; col < 40; col++) {
      const curr = [];
      for (let row = 0; row < 20; row++) {
        curr.push(new NodeObject(col, row));
      }
      grid.push(curr);
    }
    return grid;
  };

  const getWalledGrid = (col, row) => {
    const newGrid = grid.slice();
    const node = grid[col][row];
    const newNode = {
      ...node,
      wall: node.start || node.end ? false : !node.wall
    };
    newGrid[col][row] = newNode;
    return newGrid;
  };

  const getNewNodeGrid = (col, row) => {
    if (!moveNode) return;
    if (moveNode) {
    }
  };

  const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
    }
  };

  const animateShortestPath = nodesInShortestPathOrder => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
    }
  };

  const visualizeDijkstra = () => {
    const {
      START_NODE_ROW,
      START_NODE_COL,
      END_NODE_ROW,
      END_NODE_COL
    } = coordinates;
    const startNode = grid[START_NODE_COL][START_NODE_ROW];
    const finishNode = grid[END_NODE_COL][END_NODE_ROW];
    if (startNode.visited && finishNode.visited) return;
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  const handleMouseDown = (col, row) => {
    let newGrid;
    if (grid[col][row].start) {
      newGrid = getNewNodeGrid(col, row);
    }
    newGrid = getWalledGrid(col, row);
    setGrid(newGrid);
    setMouseDown(true);
  };

  const handleMouseEnter = (col, row) => {
    if (!mouseDown) return;
    if (!moveNode) {
      const newGrid = getWalledGrid(col, row);
      setGrid(newGrid);
    }
  };

  const handleMouseUp = () => {
    setMouseDown(false);
  };

  const displayGrid = () => {
    return grid.map((col, colIdx) => (
      <div className="col" key={colIdx}>
        {col.map(node => {
          const { row, col, end, start, wall } = node;
          return (
            <Node
              key={row}
              row={row}
              col={col}
              start={start}
              end={end}
              wall={wall}
              mouseDown={mouseDown}
              onMouseDown={(col, row) => handleMouseDown(col, row)}
              onMouseEnter={(col, row) => handleMouseEnter(col, row)}
              onMouseUp={() => handleMouseUp()}
            />
          );
        })}
      </div>
    ));
  };

  return (
    <div>
      <button onClick={() => visualizeDijkstra()}>
        Visualize Dijkstra's Algorithm
      </button>
      <button>Start Node</button>
      <button>End Node</button>
      <div className="grid">{displayGrid()}</div>
    </div>
  );
};

export default Visualizer;