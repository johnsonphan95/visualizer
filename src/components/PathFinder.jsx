import React, { useState, useEffect } from "react";
import Node from "./Node";
import NodeObject from "../utils/node";
import { dijkstra, dijkstraShortestPath } from "../utils/algorithms/dijkstra";
import { depthFirstSearch } from "../utils/algorithms/dfs";
import "./PathFinder.css";

const Visualizer = () => {
  const [grid, setGrid] = useState([]);
  const [mouseDown, setMouseDown] = useState(false);
  const [moveStart, setMoveStart] = useState(false);
  const [moveEnd, setMoveEnd] = useState(false);
  const [weighted, setWeighted] = useState(false);
  const [algorithm, setAlgorithm] = useState("dijkstra");
  const [coordinates, setCoordinates] = useState({
    START_NODE_COL: 10,
    START_NODE_ROW: 10,
    END_NODE_COL: 30,
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
        curr.push(new NodeObject(col, row, coordinates));
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
    const newGrid = grid.slice();
    const node = grid[col][row];
    const newNode = {
      ...node,
      start: moveStart ? true : false,
      end: moveEnd ? true : false
    };
    newGrid[col][row] = newNode;
    return newGrid;
  };

  const getWeightedGrid = (col, row) => {
    const newGrid = grid.slice();
    const node = grid[col][row];
    const newNode = {
      ...node,
      wall: false,
      weight: 5
    };
    newGrid[col][row] = newNode;
    return newGrid;
  };

  const toggleWeight = () => {
    if (algorithm === "dijkstra") {
      weighted ? setWeighted(false) : setWeighted(true);
    } else {
      setWeighted(false);
    }
  };

  const getPaths = (grid, startNode, endNode) => {
    let visitedNodesInOrder = [];
    let nodesInShortestPathOrder = [];
    if (algorithm === "dijkstra") {
      visitedNodesInOrder = dijkstra(grid, startNode, endNode);
      nodesInShortestPathOrder = dijkstraShortestPath(endNode);
    }
    if (algorithm === "dfs") {
      visitedNodesInOrder = depthFirstSearch(grid, startNode, endNode);
      nodesInShortestPathOrder = visitedNodesInOrder;
    }
    return [visitedNodesInOrder, nodesInShortestPathOrder];
  };

  const animateAlgorithm = paths => {
    const visitedNodesInOrder = paths[0];
    const nodesInShortestPathOrder = paths[1];
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

  const visualizeAlgorithm = () => {
    const {
      START_NODE_ROW,
      START_NODE_COL,
      END_NODE_ROW,
      END_NODE_COL
    } = coordinates;
    const startNode = grid[START_NODE_COL][START_NODE_ROW];
    const endNode = grid[END_NODE_COL][END_NODE_ROW];
    if (startNode.visited && endNode.visited) return;
    const paths = getPaths(grid, startNode, endNode);
    animateAlgorithm(paths);
  };

  const getAlgorithmName = () => {
    if (algorithm === "dijkstra") {
      return "Dijkstra's Algorithm";
    }
    if (algorithm === "dfs") {
      return "Depth First Search";
    }
  };

  const getWeightButton = () => {
    let style = {
      display: algorithm === "dijkstra" ? "initial" : "none",
      background: weighted ? "black" : "#74bdcb"
    };
    return (
      <button className="button" style={style} onClick={() => toggleWeight()}>
        Weighted Node
      </button>
    );
  };

  const handleMouseDown = (col, row) => {
    if (grid[col][row].start) {
      setMoveStart(true);
    } else if (grid[col][row].end) {
      setMoveEnd(true);
    } else if (weighted) {
      const newGrid = getWeightedGrid(col, row);
      setGrid(newGrid);
    } else {
      const newGrid = getWalledGrid(col, row);
      setGrid(newGrid);
    }
    setMouseDown(true);
  };

  const handleMouseEnter = (col, row) => {
    let newGrid;
    let newCoordinates = Object.assign({}, coordinates);
    if (!mouseDown) return;
    if (!moveStart && !moveEnd) {
      newGrid = getWalledGrid(col, row);
    }
    if (moveStart) {
      newGrid = getNewNodeGrid(col, row);
      newCoordinates.START_NODE_COL = col;
      newCoordinates.START_NODE_ROW = row;
      setCoordinates(newCoordinates);
    }
    if (moveEnd) {
      newGrid = getNewNodeGrid(col, row);
      newCoordinates.END_NODE_COL = col;
      newCoordinates.END_NODE_ROW = row;
      setCoordinates(newCoordinates);
    }
    if (weighted) {
      newGrid = getWeightedGrid(col, row);
    }
    setGrid(newGrid);
  };

  const handleMouseLeave = (col, row) => {
    if (!mouseDown) return;
    if (moveStart || moveEnd) {
      const newGrid = grid.slice();
      const node = grid[col][row];
      const newNode = {
        ...node,
        start: false,
        end: false
      };
      newGrid[col][row] = newNode;
      return newGrid;
    }
  };

  const handleMouseUp = () => {
    setMouseDown(false);
    setMoveStart(false);
    setMoveEnd(false);
  };

  const displayGrid = () => {
    return grid.map((col, colIdx) => (
      <div className="col" key={colIdx}>
        {col.map(node => {
          const { row, col, end, start, wall, weight } = node;
          return (
            <Node
              key={row}
              row={row}
              col={col}
              start={start}
              end={end}
              wall={wall}
              weight={weight}
              mouseDown={mouseDown}
              onMouseDown={(col, row) => handleMouseDown(col, row)}
              onMouseEnter={(col, row) => handleMouseEnter(col, row)}
              onMouseLeave={(col, row) => handleMouseLeave(col, row)}
              onMouseUp={() => handleMouseUp()}
            />
          );
        })}
      </div>
    ));
  };

  return (
    <div>
      <div className="navbar">
        <button className="dropdown">
          Algorithms
          <div className="dropdown-content">
            <div
              id="dijkstra"
              defaultValue
              onClick={e => setAlgorithm(e.target.id)}
            >
              Dijkstra's Algorithm
            </div>
            <div id="dfs" onClick={e => setAlgorithm(e.target.id)}>
              Depth First Search
            </div>
          </div>
        </button>
        <button className="button" onClick={() => visualizeAlgorithm()}>
          Visualize {getAlgorithmName()}
        </button>
        {getWeightButton()}
      </div>
      <div className="grid">{displayGrid()}</div>
    </div>
  );
};

export default Visualizer;
