"use strict";

//Initial board state
function InitialLifeState(arrLength) {
  var gridArray = [];
  var num = 0;
  for (var i = 0; i < arrLength; i++) {
    num = Math.floor(Math.random() * 10) % 2;
    gridArray.push(num);
  }
  return gridArray;
}

function GetLiveNeighbours(i, array, gridsize) {

  /*Neighbours Positioning
                                                Top     1   2   3
                                                Mid     4   i   5
                                                Bottom  6   7   8       */

  var liveNeighbour;
  var n1 = array[i - 1 - gridsize.x];
  var n2 = array[i - gridsize.x];
  var n3 = array[i + 1 - gridsize.x];
  var n4 = array[i - 1];
  var n5 = array[i + 1];
  var n6 = array[i - 1 + gridsize.x];
  var n7 = array[i + gridsize.x];
  var n8 = array[i + 1 + gridsize.x];
  var nTopRow = n1 + n2 + n3;
  var nMidRow = n4 + n5;
  var nBottomRow = n6 + n7 + n8;

  //Arrays of grid corners
  var gTopLeft = array[0];
  var gTopRight = array[gridsize.x - 1];
  var gBottomLeft = array[array.length - gridsize.x];
  var gBottomRight = array[array.length - 1];

  //Get number of live neighbours according to where i is located on the Gridboard
  //Top Left Corner
  if (i === 0) {
    liveNeighbour = gBottomRight + gBottomLeft + array[array.length - gridsize.x + 1] +
    gTopRight + n5 + array[gridsize.x * 2 - 1] + n7 + n8;

    //Top Right Corner
  } else if (i === gridsize.x - 1) {
    liveNeighbour = array[i - 1 + (array.length - gridsize.x)] + gBottomRight + gBottomLeft +
    n4 + gTopLeft + n6 + n7 + array[i + 1];

    //Bottom Left Corner
  } else if (i === array.length - gridsize.x) {
    liveNeighbour = array[i - 1] + n2 + n3 + gBottomRight + n5 + gTopRight + gTopLeft + array[1];

    //Bottom Right Corner
  } else if (i === array.length - 1) {
    liveNeighbour = n1 + n2 + array[array.length - gridsize.x * 2] + n4 + gBottomLeft + array[gridsize.x - 2] + gTopRight + gTopLeft;

    //Top side
  } else if (i < gridsize.x - 1) {
    liveNeighbour = array[i - 1 + (array.length - gridsize.x)] + array[i + (array.length - gridsize.x)] +
    array[i + 1 + (array.length - gridsize.x)] + nMidRow + nBottomRow;

    //Left side
  } else if (i % gridsize.x === 0) {
    liveNeighbour = array[i - 1] + n2 + n3 + array[i + (gridsize.x - 1)] + n5 + array[i + gridsize.x * 2 - 1] + n7 + n8;

    //Right side
  } else if (i % gridsize.x - (gridsize.x - 1) === 0) {
    liveNeighbour = n1 + n2 + array[i + 1 - gridsize.x * 2] + n4 + array[i + 1 - gridsize.x] + n6 + n7 + array[i + 1];

    //Bottom side
  } else if (i > array.length - gridsize.x) {
    liveNeighbour = nTopRow + nMidRow + array[i % gridsize.x - 1] + array[i % gridsize.x] + array[i % gridsize.x + 1];

    //Center
  } else {
    liveNeighbour = nTopRow + nMidRow + nBottomRow;
  }

  return liveNeighbour;
}

//Function to generate next generation
function NextGenGenerator(array, gridsize) {

  var gridArray = new Array(array.length);
  var numOfLive = 0;

  for (var i = 0; i < array.length; i++) {
    numOfLive += array[i];
    let liveNeighbour = GetLiveNeighbours(i, array, gridsize);

    //Rule 1 - Death: Live cell with less than 2 live neighbour (Underpopulation)
    if (array[i] === 1 && liveNeighbour < 2) {
      gridArray[i] = 0; //0 to indicate death

      //Rule 2 - Death: Live cell with more than 3 live neighbour (Overpopulation)
    } else if (array[i] === 1 && liveNeighbour > 3) {
      gridArray[i] = 0; //0 to indicate death

      //Rule 3 - Birth: Dead cell with 3 live neighbour
    } else if (array[i] !== 1 && liveNeighbour === 3) {
      gridArray[i] = 1; //1 to indicate live

    } else {
      gridArray[i] = array[i];
    }
  }

  if (numOfLive === 0) {
    return false;
  }
  return gridArray;
}

/*Individual cell in the game of life board
  Setting up id so as to easily set the state of each cell*/
var Cell = React.createClass({ displayName: "Cell",

  propTypes: {
    index: React.PropTypes.number.isRequired,
    cellSize: React.PropTypes.string.isRequired,
    cellState: React.PropTypes.string.isRequired,
    addCell: React.PropTypes.func.isRequired },


  handleCell: function () {
    this.props.addCell(this.props.index);
    console.log("cell added");
  },

  render: function () {
    return React.createElement("td", { id: "cell_" + this.props.index, className: "grid-" + this.props.cellSize + " " + this.props.cellState, onClick: this.handleCell });
  } });



var GameBoard = React.createClass({ displayName: "GameBoard",

  propTypes: {
    gridSize: React.PropTypes.array.isRequired,
    gridArray: React.PropTypes.array.isRequired,
    lastGridArray: React.PropTypes.array.isRequired,
    addCell: React.PropTypes.func.isRequired },


  render: function () {

    //Generate a grid according to sizes
    var grid = [];
    for (var i = 0; i < this.props.gridSize.y; i++) {
      let row = [];
      for (var j = 0; j < this.props.gridSize.x; j++) {
        let num = i * this.props.gridSize.x + j;
        let classString = '';
        if (this.props.gridArray[num] === this.props.lastGridArray[num] && this.props.gridArray[num] === 1) {
          classString = 'old';
        } else if (this.props.gridArray[num] === 1) {
          classString = 'new';
        } else {
          classString = 'dead';
        }
        row.push(React.createElement(Cell, { index: num, cellSize: this.props.gridSize.cellsize, cellState: classString, addCell: this.props.addCell }));
      }
      grid.push(React.createElement("tr", null, row));
    }

    return (
      React.createElement("div", null,
      React.createElement("table", null,
      grid)));



  } });


var BoardSizeControls = React.createClass({ displayName: "BoardSizeControls",

  propTypes: {
    setGrid: React.PropTypes.func.isRequired,
    setSpeed: React.PropTypes.func.isRequired,
    clear: React.PropTypes.func.isRequired },


  setGrid: function (x, y, cellsize) {
    this.props.setGrid(x, y, cellsize);
  },

  setActiveButton: function (e, string) {
    $('#' + string + ' button').removeClass('active');
    $(e.target).addClass('active');
  },



  handleSBoard: function (e) {
    this.setActiveButton(e, 'boardsize');
    this.props.clear();
    this.setGrid(50, 30, 'small');
  },

  handleMBoard: function (e) {
    this.setActiveButton(e, 'boardsize');
    this.props.clear();
    this.setGrid(70, 50, 'medium');
  },

  handleBBoard: function (e) {
    this.setActiveButton(e, 'boardsize');
    this.props.clear();
    this.setGrid(100, 80, 'big');
  },

  handleFast: function (e) {
    this.setActiveButton(e, 'speed');
    this.props.setSpeed(100);
  },

  handleMedium: function (e) {
    this.setActiveButton(e, 'speed');
    this.props.setSpeed(200);
  },

  handleSlow: function (e) {
    this.setActiveButton(e, 'speed');
    this.props.setSpeed(300);
  },

  render: function () {
    return (
      React.createElement("div", { className: "bottom-panel" },
      React.createElement("div", { id: "boardsize" },
      React.createElement("div", { className: "boardsize-text" }, "Board Size:"),
      React.createElement("button", { className: "button button-w130", onClick: this.handleSBoard }, "50 x 30"),
      React.createElement("button", { className: "button button-w130 active", onClick: this.handleMBoard }, "70 x 50"),
      React.createElement("button", { className: "button button-w130", onClick: this.handleBBoard }, "100 x 80")),

      React.createElement("div", { id: "speed" },
      React.createElement("div", { className: "speed-text" }, "Speed:"),
      React.createElement("button", { className: "button button-w130", onClick: this.handleSlow }, "Slow"),
      React.createElement("button", { className: "button button-w130", onClick: this.handleMedium }, "Medium"),
      React.createElement("button", { className: "button button-w130 active", onClick: this.handleFast }, "Fast"))));



  } });



var GameOfLife = React.createClass({ displayName: "GameOfLife",

  getInitialState: function () {
    return {
      interval: null,
      isGameRunning: false,
      isGridArrayEmpty: false,
      gridSize: { x: 70, y: 50, cellsize: 'medium' }, //to split into seperate state
      lastGridArray: [],
      gridArray: InitialLifeState(70 * 50),
      intervalSpeed: 100,
      generation: 0 };


  },

  //Add live cell to game board
  addCell: function (index) {
    var currentGridArray = this.state.gridArray;
    currentGridArray[index] = 1;

    //Check for indication of a new board array, fill the array if the board is new
    if (this.state.isGridArrayEmpty === true) {
      for (var i = 0; i < currentGridArray.length; i++) {
        if (currentGridArray[i] === undefined) {
          currentGridArray[i] = 0;
        }
      }
    }

    this.setState({
      isGridArrayEmpty: false,
      gridArray: currentGridArray });

  },

  //Set the number of grid columns and rows, height and width of individual cells
  setGridSize: function (x, y, cellsize) {
    var size = { x: x, y: y, cellsize: cellsize };
    var newGridArray = new Array(x * y);
    this.setState({
      gridSize: size,
      gridArray: newGridArray });

  },

  //Pause game
  handlePause: function () {
    let interval = this.state.interval;
    clearInterval(interval);
    this.setState({
      isGameRunning: false });

  },

  //Clear game board
  handleClear: function () {
    this.handlePause();
    let emptyBoard = new Array(this.state.gridSize.x * this.state.gridSize.y);
    this.setState({
      isGridArrayEmpty: true,
      gridArray: emptyBoard,
      generation: 0 });

  },

  getGenerator: function () {
    let self = this;
    let currentGen = this.state.generation;
    let thisGenArray = self.state.gridArray;
    let nextGenArray = NextGenGenerator(thisGenArray, self.state.gridSize);

    //Check if there's any live cell, if none game clears/reset
    if (nextGenArray !== false) {
      currentGen++;
      self.setState({
        isGameRunning: true,
        lastGridArray: thisGenArray,
        gridArray: nextGenArray,
        generation: currentGen });

    } else {
      self.handleClear();
    }
  },

  //Set new interval speed
  setIntervalSpeed: function (speed) {
    //Check if array is valid before setting new speed
    if (this.state.isGridArrayEmpty === false) {
      var value = speed;
      this.setState({
        intervalSpeed: value });


      //Clear current interval speed before running new interval with new speed
      let interval = this.state.interval;
      clearInterval(interval);

      interval = setInterval(this.getGenerator, value);
      this.setState({
        interval: interval });

    }
  },

  //Run or continue game
  handleRun: function () {
    //Check to see if game is already running or if array is invalid
    if (this.state.isGameRunning === false && this.state.isGridArrayEmpty === false) {
      let interval = this.state.interval;
      interval = setInterval(this.getGenerator, this.state.intervalSpeed);
      this.setState({
        interval: interval });

    }
  },

  componentDidMount: function () {
    this.handleRun();
  },

  render: function () {
    return (
      React.createElement("div", null,
      React.createElement("h1", null, "Game of Life"),
      React.createElement("div", { className: "top-panel" },
      React.createElement("button", { className: "button button-w100", onClick: this.handleRun }, "Run"),
      React.createElement("button", { className: "button button-w100", onClick: this.handlePause }, "Pause"),
      React.createElement("button", { className: "button button-w100", onClick: this.handleClear }, "Clear"),
      React.createElement("div", { className: "gen-text" }, "Generation: ", this.state.generation)),

      React.createElement(GameBoard, { gridSize: this.state.gridSize, gridArray: this.state.gridArray, lastGridArray: this.state.lastGridArray, addCell: this.addCell }),
      React.createElement(BoardSizeControls, { setGrid: this.setGridSize, setSpeed: this.setIntervalSpeed, clear: this.handleClear })));


  } });



ReactDOM.render(
React.createElement(GameOfLife, null),
document.getElementById('application'));