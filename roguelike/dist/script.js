"use strict";

//Calculation
var Cal = function () {

  //Random numbers
  function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  //Generate array index according to coordinates
  function index(x, y) {
    return x + Map.mapSize().length * y;
  }

  var api = {
    random: random,
    index: index };


  return api;
}();

//Player stats
var Player = function () {
  const BASE_EXP = 50;
  const BASE_HP = 100;
  const BASE_AP = 15;
  const BASE_AP_OFFSET = 10;
  const EXP_MULTIPLIER = 3;
  const HP_MULTIPLIER = 0.5;
  const AP_MULTIPLIER = 5;
  const POTION_HEAL_AMOUNT = 30; //Potion percentage of healing

  var x, y;
  var level = 1;
  var maxEXP, maxHP;
  var currentEXP, currentHP, currentAP, totalAP, offsetAP; //exp: experience, hp: hit points, ap: attack power
  var weaponAP = 0;

  //Set player coordinates
  function setPlayerPOS(newX, newY) {
    x = newX;
    y = newY;
  }

  //Return player coordinates
  function getPlayerPOS() {
    return {
      x: x,
      y: y };

  }

  //Return index based on player coordinates
  function getPlayerIndex() {
    return Cal.index(x, y);
  }

  //Return random player attack power based on minimum and maximum values
  function getPlayerAP() {
    return Cal.random(totalAP - offsetAP, totalAP);
  }

  //Generate new stats when level up
  function genNewStats() {
    //Generate amount of experience points required to level
    let monsterModifier = Props.getPropList();
    monsterModifier = monsterModifier[1][1];
    maxEXP = BASE_EXP * level * monsterModifier + BASE_EXP * level * EXP_MULTIPLIER;

    //Max Level 10
    if (level >= 10) {
      maxEXP = 0;
    }
    currentEXP = maxEXP;

    //Generate max hp, restore health to full
    maxHP = BASE_HP * (HP_MULTIPLIER + HP_MULTIPLIER * level);
    currentHP = maxHP;

    //Generate base attack power
    currentAP = BASE_AP + level * AP_MULTIPLIER;
    totalAP = currentAP + weaponAP;

    //Generate offset attack power
    offsetAP = BASE_AP_OFFSET + level;
  }

  //Reset player stats to level 1
  function reset() {
    level = 1;
    genNewStats();
  }

  //Player level up and gain new stats
  function levelup() {
    level++;
    genNewStats();
  }

  //Get new player stats with maximum values
  function getNewStats() {
    return {
      level: level,
      exp: maxEXP,
      hp: maxHP,
      ap: {
        min: totalAP - offsetAP,
        max: totalAP } };


  }

  //Get current player stats
  function getCurrentStats() {
    return {
      exp: currentEXP,
      hp: currentHP,
      ap: {
        min: totalAP - offsetAP,
        max: totalAP },

      dmg: getPlayerAP };

  }

  //Set player exp gain
  function gainEXP(gain) {
    let newEXP = currentEXP - gain;
    if (level >= 10 && newEXP < 0) {
      currentEXP = 0;
    } else {
      currentEXP = newEXP;
    }
  }

  //Reduce player HP from enemy damage
  function takeDamage(enemyattack) {
    let newHP = currentHP - enemyattack;
    if (newHP < 0) {
      currentHP = 0;
    } else {
      currentHP = newHP;
    }
  }

  //Set weapon ap and add to total ap
  function setWeaponAP(value) {
    weaponAP = value;
    totalAP = currentAP + weaponAP;
  }

  //Restore 30% of player's hp
  function usePotion() {
    let potion = maxHP / 100 * POTION_HEAL_AMOUNT;
    let newHP = currentHP + potion;
    if (newHP > maxHP) {
      newHP = maxHP;
    }
    currentHP = newHP;
  }

  var api = {
    setPlayerPOS: setPlayerPOS,
    getPlayerPOS: getPlayerPOS,
    getPlayerIndex: getPlayerIndex,
    genNewStats: genNewStats,
    reset: reset,
    levelup: levelup,
    getNewStats: getNewStats,
    getCurrentStats: getCurrentStats,
    gainEXP: gainEXP,
    takeDamage: takeDamage,
    setWeaponAP: setWeaponAP,
    usePotion,
    usePotion };


  return api;
}();

//Enemy stats
var Enemy = function () {
  const BASE_BOSS_EXP = 150;
  const BASE_BOSS_HP = 20;
  const BASE_BOSS_AP = 10;
  const BASE_MON_EXP = 50;
  const BASE_MON_HP = 15;
  const BASE_MON_AP = 5;
  const BASE_AP_RANGE = 5;

  var bossEXP, bossHP, bossAP, monEXP, monHP, monAP, offsetAP;

  //Set boss/monster experience
  function setEnemiesValue(level) {
    bossEXP = BASE_BOSS_EXP * level;
    bossHP = BASE_BOSS_HP * (level + 1);
    bossAP = BASE_BOSS_AP * (level + 1);
    monEXP = BASE_MON_EXP * level;
    monHP = BASE_MON_HP * (level + 1);
    monAP = BASE_MON_AP * (level + 1);
    offsetAP = BASE_AP_RANGE + level;
  }

  //Random boss ap
  function getBossAP() {
    return Cal.random(bossAP - offsetAP, bossAP);
  }

  //Return boss values: exp, hp, ap
  function getBossValue() {
    return {
      exp: bossEXP,
      hp: bossHP,
      ap: getBossAP };

  }

  //Random monster ap
  function getMonAP() {
    return Cal.random(monAP - offsetAP, monAP);
  }

  //Return monster values: exp, hp, ap
  function getMonValue() {
    return {
      exp: monEXP,
      hp: monHP,
      ap: getMonAP };

  }

  var api = {
    setEnemiesValue: setEnemiesValue,
    getBossValue: getBossValue,
    getMonValue: getMonValue };


  return api;
}();

//Props and weapons values
var Props = function () {

  //Props and amount to be generated
  const PROPLIST = [
  ['potion', 5],
  ['monster', 5],
  ['boss', 1]];


  //List of player weapons with damage values
  const WEAPONLIST = [
  //Subarray, 0 for weapon name, 1 for weapon damage modifier
  ['Stick', 0],
  ['Pointy Stick', 10],
  ['Blunt Sword', 20],
  ['Short Sword', 30],
  ['Broad Sword', 40],
  ['Long Sword', 50],
  ['War Sword', 60],
  ['Ancient Sword', 70],
  ['Rune Sword', 80],
  ['Mythical Sword', 90],
  ['Divine Sword', 100]];


  function getPropList() {
    return PROPLIST;
  }

  //Get weapon based on current dungeon level
  function getWeapon(dungeonLevel) {
    return WEAPONLIST[dungeonLevel];
  }

  var api = {
    getPropList: getPropList,
    getWeapon: getWeapon };


  return api;
}();

//Map Values
var Map = function () {
  const MAP_LENGTH = 120;
  const MAP_WIDTH = 120;
  const MIN_NUM_OF_ROOMS = 16;
  const MAX_NUM_OF_ROOMS = 25;
  const MIN_ROOM_SIZE = 7;
  const MAX_ROOM_SIZE = 25;

  //Return map length and width
  function mapSize() {
    return {
      length: MAP_LENGTH,
      width: MAP_WIDTH };

  }

  //Return a random number between minimum and maximum number of rooms allowed
  function randomRooms() {
    return Cal.random(MIN_NUM_OF_ROOMS, MAX_NUM_OF_ROOMS);
  }

  //Return minimum and maximum length of a side of a room
  function roomSize() {
    return {
      min: MIN_ROOM_SIZE,
      max: MAX_ROOM_SIZE };

  }

  //Return a random number between minimum and maximum length of a side of a room
  function randomRoomSize() {
    return Cal.random(MIN_ROOM_SIZE, MAX_ROOM_SIZE);
  }

  //Return color based on value
  function getColor(value) {
    let color;
    let val = value;

    //Check for non number
    if (typeof val !== "number") {
      val = value.type;

    }

    switch (val) {
      //Room
      case 0:
        color = '#BABABA';
        break;
      //Wall/Rock
      case 1:
        color = '#646464';
        break;
      //Player
      case 2:
        color = 'blue';
        break;
      //Weapon
      case 3:
        color = 'yellow';
        break;
      //Potion
      case 4:
        color = 'green';
        break;
      //Monster
      case "monster":
        color = 'red';
        break;
      //Boss
      case "boss":
        color = 'purple';
        break;
      default:
        color = '#BABABA';
        break;}


    return color;
  }

  var api = {
    mapSize: mapSize,
    randomRooms: randomRooms,
    roomSize: roomSize,
    randomRoomSize: randomRoomSize,
    getColor: getColor };


  return api;
}();

//Viewport values and functions
var Viewport = function () {
  const UNIT = 12; //Pixels per unit
  const VIEWPORT_WIDTH = 120; //Measured in units
  const VIEWPORT_HEIGHT = 60; //Measured in units
  const VIEW_RADIUS = 13; //Player view radius in the dark
  const RADIUS_OFFSET = 6; //Player view radius offset
  const DARK = 1; //Representation of darkness in array

  var viewX, viewY;

  //Generate and return an array of darkness
  function getDarkBlanket(arrLength) {
    let array = [];
    for (var i = 0; i < arrLength; i++) {
      array.push(DARK);
    }
    return array;
  }

  //Return Unit
  function pixelPerUnit() {
    return UNIT;
  }

  //Return Viewport width in unit
  function viewWidthUnit() {
    return VIEWPORT_WIDTH;
  }

  //Return viewport width/height in pixels
  function getViewSize() {
    return {
      width: VIEWPORT_WIDTH * UNIT,
      height: VIEWPORT_HEIGHT * UNIT };

  }

  /*Set coordinates of viewport according to coordinates of player, to be set at the top right corner or
    first of viewport array*/
  function setViewCoo(playerX, playerY) {
    let newViewX = playerX - VIEWPORT_WIDTH / 2;
    let newViewY = playerY - VIEWPORT_HEIGHT / 2;

    //Check X coordinates, prevent view area from going out of bounds left and right
    if (newViewX < 0) {
      newViewX = 0;
    } else if (newViewX + VIEWPORT_WIDTH >= Map.mapSize().length) {
      newViewX = Map.mapSize().length - VIEWPORT_WIDTH;
    }

    //Check Y coordinates, prevent view area from going out of bounds top and bottom
    if (newViewY < 0) {
      newViewY = 0;
    } else if (newViewY + VIEWPORT_HEIGHT >= Map.mapSize().width) {
      newViewY = Map.mapSize().width - VIEWPORT_HEIGHT;
    }

    viewX = newViewX;
    viewY = newViewY;
  }

  //Return visible part of dungeon to player as an array
  function getViewArray(mapArray) {
    let array = [];

    for (var i = 0; i < VIEWPORT_HEIGHT; i++) {
      for (var j = 0; j < VIEWPORT_WIDTH; j++) {
        let x = viewX + j;
        let y = viewY + i;
        let index = Cal.index(x, y);
        array.push(mapArray[index]);
      }
    }
    return array;
  }

  //Set player's visible area under darkness in array
  function getDarkRadius(array) {
    let playerIndex;

    //Find player in array
    for (var i = 0; i < array.length; i++) {
      if (array[i] === 2) {
        playerIndex = i;
        break;
      }
    }

    //Calculate the point to start setting player's view area under darkness
    let viewAnchorX = playerIndex % VIEWPORT_WIDTH - RADIUS_OFFSET;
    let viewAnchorY = Math.floor(playerIndex / VIEWPORT_WIDTH) - RADIUS_OFFSET;
    let viewIndex = Cal.index(viewAnchorX, viewAnchorY);
    let viewRadiusArray = getDarkBlanket(array.length);

    //Offset for player's view area
    for (var i = 0; i < VIEW_RADIUS; i++) {
      let length = 13;
      let offset = 0;
      switch (i) {
        case 0:
        case 12:
          length = 7;
          offset = 3;
          break;
        case 1:
        case 11:
          length = 9;
          offset = 2;
          break;
        case 2:
        case 10:
          length = 11;
          offset = 1;
          break;}


      //Set player's view area in array
      for (var j = 0; j < length; j++) {
        let x = viewAnchorX + j + offset;
        let y = viewAnchorY + i;
        let index = Cal.index(x, y);
        viewRadiusArray[index] = 0;
      }
    }

    return viewRadiusArray;
  }

  var api = {
    pixelPerUnit: pixelPerUnit,
    viewWidthUnit: viewWidthUnit,
    getViewSize: getViewSize,
    setViewCoo: setViewCoo,
    getViewArray: getViewArray,
    getDarkRadius: getDarkRadius };


  return api;
}();

//Map generation functions
var MapGen = function () {
  const ROCK = 1; //Representation of rock in array
  const EMPTYROOM = 0; //Representation of room/corridor in array
  const PLAYER = 2; //Representation of player in array
  const WEAPON = 3; //Representation of weapon in array
  const POTION = 4; //Representation of potion in array

  var map;
  var posArr;

  //Generate initial map of rocks
  var genInitialMap = function () {
    let array = [];
    for (var i = 0; i < Map.mapSize().length * Map.mapSize().width; i++) {
      array.push(ROCK);
    }
    map = array;

    //Reset array
    posArr = [];
  };

  //Get map
  function getMap() {
    return map;
  }

  //Create room on map based on given parameters
  function createRoom(roomIndex, length, width) {
    for (var i = 0; i < width; i++) {
      for (var j = 0; j < length; j++) {
        map[roomIndex + i * Map.mapSize().length + j] = EMPTYROOM;
      }
    }
  }

  //Generate a list of randomized door location based on available walls
  function genDoorList(x, y, length, width, excludedirection) {
    let doorways = [];
    let newX;
    let newY;
    var directions = ['north', 'east', 'south', 'west'];
    for (var i = 0; i < directions.length; i++) {

      //Skip creation of door if a wall already has a door
      if (directions[i] !== excludedirection) {

        //Calculate door coordinates based on room coordinates and the direction a wall is facing
        switch (directions[i]) {
          case 'north':
            newX = x + Math.floor(Math.random() * length);
            newY = y - 1;
            break;
          case 'east':
            newX = x + length;
            newY = y + Math.floor(Math.random() * width);
            break;
          case 'south':
            newX = x + Math.floor(Math.random() * length);
            newY = y + width;
            break;
          case 'west':
            newX = x - 1;
            newY = y + Math.floor(Math.random() * width);
            break;}


        //Check for coordinates close to map boundary, if it's not close, save in doorways array list
        if (newX - Map.roomSize().max > 0 && newX + Map.roomSize().max < Map.mapSize().length &&
        newY - Map.roomSize().max > 0 && newY + Map.roomSize().max < Map.mapSize().width) {
          doorways.push({
            x: newX,
            y: newY,
            direction: directions[i] });

        }
      }
    }

    return doorways;
  }

  //Get the coordinates of the next room based on the coordinates of the door
  function nextRoomPoint(x, y, length, width, direction) {
    let newX;
    let newY;
    let directionToExclude;

    //Exclude the side of the wall where the room is generated from, to be used by doorways
    switch (direction) {
      case 'north':
        newX = x - Math.floor(Math.random() * length);
        newY = y - width;
        directionToExclude = 'south';
        break;
      case 'east':
        newX = x + 1;
        newY = y - Math.floor(Math.random() * width);
        directionToExclude = 'west';
        break;
      case 'south':
        newX = x - Math.floor(Math.random() * length);
        newY = y + 1;
        directionToExclude = 'north';
        break;
      case 'west':
        newX = x - length;
        newY = y - Math.floor(Math.random() * width);
        directionToExclude = 'east';
        break;}


    return {
      x: newX,
      y: newY,
      exclude: directionToExclude };

  }

  //Check perimeter of a given area, return false if area is not available else return true
  function checkArea(roomIndex, length, width) {
    //Create perimeter array index based on room index;
    let perimeterIndex = roomIndex - (Map.mapSize().length + 1);

    //+2 to length and width to reflect perimeter
    for (var i = 0; i < width + 2; i++) {
      for (var j = 0; j < length + 2; j++) {
        if (map[perimeterIndex + i * Map.mapSize().length + j] === EMPTYROOM) {
          return false;
        }
      }
    }
    return true;
  }

  //Create a unit of corridor based on given paramters
  function createCorridor(x, y, direction) {
    let index = Cal.index(x, y);

    //Default create corridor
    if (direction === undefined) {
      map[index] = EMPTYROOM;

      //Check if coordinates is close to any room based on direction. If close, create corridor
    } else {
      if (direction === 'north' && (map[index - Map.mapSize().length] === EMPTYROOM || map[index - Map.mapSize().length * 2] === EMPTYROOM)) {
        map[index] = EMPTYROOM;
        map[index - Map.mapSize().length] = EMPTYROOM;
        map[index - Map.mapSize().length * 2] = EMPTYROOM;
      } else if (direction === 'east' && (map[index + 1] === EMPTYROOM || map[index + 2] === EMPTYROOM)) {
        map[index] = EMPTYROOM;
        map[index + 1] = EMPTYROOM;
        map[index + 2] = EMPTYROOM;
      } else if (direction === 'south' && (map[index + Map.mapSize().length] === EMPTYROOM || map[index + Map.mapSize().length * 2] === EMPTYROOM)) {
        map[index] = EMPTYROOM;
        map[index + Map.mapSize().length] = EMPTYROOM;
        map[index + Map.mapSize().length * 2] = EMPTYROOM;
      } else if (direction === 'west' && (map[index - 1] === EMPTYROOM || map[index - 2] === EMPTYROOM)) {
        map[index] = EMPTYROOM;
        map[index - 1] = EMPTYROOM;
        map[index - 2] = EMPTYROOM;
      }
    }
  }

  //Generate a list of all possible spawn index, skipping door ways
  function genSpawnList() {
    for (var i = 0; i < map.length; i++) {
      //Check and skip doorways
      if (map[i] === EMPTYROOM && map[i - 1] === EMPTYROOM && map[i + 1] === EMPTYROOM &&
      map[i - Map.mapSize().length] === EMPTYROOM && map[i + Map.mapSize().length] === EMPTYROOM) {
        posArr.push(i);
      }
    }
  }

  //Return random spawn index from list
  function getSpawnIndex() {
    let randomNum = Math.floor(Math.random() * posArr.length);
    let pos = posArr.splice(randomNum, 1);

    return pos[0];
  }

  //Set enemies and potions
  function setProps(array) {
    for (var i = 0; i < array[1]; i++) {
      let pos = MapGen.getSpawnIndex();
      switch (array[0]) {
        case 'potion':
          map[pos] = POTION;
          break;
        case 'monster':
          map[pos] = {
            type: array[0],
            hp: Enemy.getMonValue().hp };

          break;
        case 'boss':
          map[pos] = {
            type: array[0],
            hp: Enemy.getBossValue().hp };

          break;}

    }
  }

  //Generate all props including player
  function genProps() {
    var props = Props.getPropList();

    MapGen.genSpawnList();

    //Create Player and save coordinates
    let playerPOS = MapGen.getSpawnIndex();
    map[playerPOS] = PLAYER;
    let x = playerPOS % Map.mapSize().length;
    let y = (playerPOS - x) / Map.mapSize().length;
    Player.setPlayerPOS(x, y);

    //Create weapon
    let weaponPOS = MapGen.getSpawnIndex();
    map[weaponPOS] = WEAPON;

    //Create potions, monsters and boss randomly on map
    for (var i = 0; i < props.length; i++) {
      setProps(props[i]);
    }
  };

  var api = {
    genInitialMap: genInitialMap,
    getMap: getMap,
    createRoom: createRoom,
    genDoorList,
    genDoorList,
    nextRoomPoint: nextRoomPoint,
    checkArea: checkArea,
    createCorridor: createCorridor,
    genSpawnList,
    genSpawnList,
    getSpawnIndex: getSpawnIndex,
    genProps: genProps };


  return api;
}();

//Main map generation function
var Layout = function () {

  //Generate Map
  var createMap = function () {

    //Random number of rooms
    var numOfRooms = Map.randomRooms();

    //To store a list of usable doorways for corridor connection
    var doorways = [];

    //Generate the initial array of map filled with rocks
    MapGen.genInitialMap();

    //Carve out rooms
    for (var i = 0; i < numOfRooms; i++) {

      //Generate random dimensions for upcoming room
      let roomLength = Map.randomRoomSize();
      let roomWidth = Map.randomRoomSize();

      //First Room
      if (i === 0) {

        roomLength = Map.randomRoomSize();
        roomWidth = Map.randomRoomSize();
        let x = Map.mapSize().length / 2;
        let y = Map.mapSize().width / 2;
        let roomAnchor = Cal.index(x, y);
        MapGen.createRoom(roomAnchor, roomLength, roomWidth);
        doorways = doorways.concat(MapGen.genDoorList(x, y, roomLength, roomWidth));

        //Subsequent Rooms
      } else {
        for (var j = 0; j < doorways.length; j++) {
          let genPoint = doorways[j];

          //Get the coordinates of the next room based on the coordinates of the door picked
          let nextValues = MapGen.nextRoomPoint(genPoint.x, genPoint.y, roomLength, roomWidth, genPoint.direction);
          let nextRoomIndex = Cal.index(nextValues.x, nextValues.y);

          //Check area for availability to create the next room
          let isAreaAvailable = MapGen.checkArea(nextRoomIndex, roomLength, roomWidth);

          //Area is available
          if (isAreaAvailable) {

            MapGen.createCorridor(genPoint.x, genPoint.y);
            MapGen.createRoom(nextRoomIndex, roomLength, roomWidth);

            //Add new doorways to the current list of doorways based on the newly created room
            doorways = doorways.concat(MapGen.genDoorList(nextValues.x, nextValues.y, roomLength, roomWidth, nextValues.exclude));

            //Remove used doorways
            doorways.splice(j, 1);
            break;
          }
        }
      }
    }

    //Additional corridors to connect rooms closed to each other
    for (var i = 0; i < doorways.length; i++) {
      let genPoint = doorways[i];
      MapGen.createCorridor(genPoint.x, genPoint.y, genPoint.direction);
    }

    //Generate player, enemies, items
    MapGen.genProps();
  };

  //Generate and return map array
  function getArray() {
    createMap();
    return MapGen.getMap();
  }

  var api = {
    getArray: getArray };


  return api;
}();

//Game over modal
class GameOverContainer extends React.Component {
  render() {
    return (
      React.createElement("div", { id: "gameover", className: "modal fade", tabindex: "-1", role: "dialog" },
      React.createElement("div", { className: "modal-dialog modal-sm", role: "document" },
      React.createElement("div", { className: "modal-content" }, "GameOver"))));





  }}


class Dungeon extends React.Component {

  //Draw darl
  drawDark(array) {
    var unit = Viewport.pixelPerUnit();
    var darkCanvas = ReactDOM.findDOMNode(this.refs.darkness);
    darkCanvas.width = Viewport.getViewSize().width;
    darkCanvas.height = Viewport.getViewSize().height;
    var darkContext = darkCanvas.getContext('2d');

    if (this.props.isDarknessOn) {
      for (var i = 0; i < array.length; i++) {
        let x = i % Viewport.viewWidthUnit();
        let y = Math.floor(i / Viewport.viewWidthUnit());

        if (array[i] === 1) {
          darkContext.fillStyle = 'black';
          darkContext.fillRect(x * unit, y * unit, unit, unit);
        } else {
          darkContext.clearRect(x * unit, y * unit, unit, unit);
        }
      }
    } else {
      darkContext.clearRect(0, 0, Viewport.getViewSize().width, Viewport.getViewSize().height);
    }
  }

  drawMap(array) {
    var unit = Viewport.pixelPerUnit();
    var mapCanvas = ReactDOM.findDOMNode(this.refs.map);
    mapCanvas.width = Viewport.getViewSize().width;
    mapCanvas.height = Viewport.getViewSize().height;
    var mapContext = mapCanvas.getContext('2d');

    for (var i = 0; i < array.length; i++) {
      let x = i % Viewport.viewWidthUnit();
      let y = Math.floor(i / Viewport.viewWidthUnit());
      let fill = Map.getColor(array[i]);

      mapContext.fillStyle = fill;
      mapContext.fillRect(x * unit, y * unit, unit, unit);
    }
  }

  componentWillReceiveProps(nextProps) {
    var array = Viewport.getViewArray(this.props.layout);
    this.drawMap(array);
  }

  componentDidUpdate(prevProps, prevState) {
    var array = Viewport.getViewArray(this.props.layout);
    var darknessArray = Viewport.getDarkRadius(array);
    this.drawDark(darknessArray);
  }

  componentDidMount() {
    var array = Viewport.getViewArray(this.props.layout);
    var darknessArray = Viewport.getDarkRadius(array);
    this.drawMap(array);
    this.drawDark(darknessArray);
  }

  render() {
    return (
      React.createElement("div", { id: "view" },
      React.createElement("canvas", { id: "darkness", ref: "darkness" }),
      React.createElement("canvas", { id: "map", ref: "map" })));


  }}


Dungeon.propTypes = {
  isDarknessOn: React.PropTypes.bool.isRequired,
  layout: React.PropTypes.array.isRequired };


//Display panel for player stats with player control functions
class Panel extends React.Component {

  constructor(props) {
    super(props);
    this.handleControls = this.handleControls.bind(this);
    this.state = {
      lockControl: false,
      level: 1,
      exp: 0,
      hp: 0,
      minAP: 0,
      maxAP: 0,
      weapon: 'Stick' };

  }

  //Set player's ability to control
  lockPlayerControl(bool) {
    this.setState({
      lockControl: bool });

  }

  //Change modal text according to player's win or lose condition
  handleModal(string) {
    if (string === 'win') {
      $('.modal-content').html('You defeated the final boss!<br />Congratulation!');
      $('.modal-content').removeClass('lose');
      $('.modal-content').addClass('win');
      $('#gameover').modal('show');
    } else {
      $('.modal-content').html('Game Over!<br />Better luck next time!');
      $('.modal-content').removeClass('win');
      $('.modal-content').addClass('lose');
      $('#gameover').modal('show');
    }
  }

  //Update position of player, saved coordinates and display position
  updatePlayerPOS(x, y) {
    let array = this.props.layout;
    let oldPos = Player.getPlayerIndex();
    let newPos = Cal.index(x, y);
    array[oldPos] = 0;
    array[newPos] = 2;
    //Save coordinates of player
    Player.setPlayerPOS(x, y);
    Viewport.setViewCoo(x, y);
    //Update display of player
    this.props.updateLayout(array);
  }

  //Set new player's stats when player level up
  setNewStatsState() {
    this.setState({
      level: Player.getNewStats().level,
      exp: Player.getNewStats().exp,
      hp: Player.getNewStats().hp,
      minAP: Player.getNewStats().ap.min,
      maxAP: Player.getNewStats().ap.max });

  }

  //Set player exp to current exp value
  setEXPState() {
    this.setState({
      exp: Player.getCurrentStats().exp });

  }

  //Set player hp to current hp value
  setHPState() {
    this.setState({
      hp: Player.getCurrentStats().hp });

  }

  //Set player ap to current ap values
  setAPState() {
    this.setState({
      minAP: Player.getCurrentStats().ap.min,
      maxAP: Player.getCurrentStats().ap.max });

  }

  //set weapon and update player ap
  setWeapon(value) {
    let weapon = Props.getWeapon(this.props.dungeonLevel);

    if (value === 0) {
      weapon = Props.getWeapon(value);
    }

    //Update player attack power
    Player.setWeaponAP(weapon[1]);
    this.setAPState();
    this.setState({
      weapon: weapon[0] });

  }

  //Update exp when player gain exp, player level up when exp at 0
  setPlayerEXP(value) {
    Player.gainEXP(value);
    this.setEXPState();
    if (Player.getCurrentStats().exp <= 0 && Player.getNewStats().level < 10) {
      Player.levelup();
      this.setNewStatsState();
    }
  }

  //Restart game
  restartGame() {
    //Reset player stats
    Player.reset();
    this.setWeapon(0);
    this.setNewStatsState();

    //Reset dungeon level
    this.props.reset();

    //Start new game
    $('#gameover').modal('hide');
    this.lockPlayerControl(false);
    this.props.genDungeon();
    this.updatePlayerPOS(Player.getPlayerPOS().x, Player.getPlayerPOS().y);
  }

  //Player & Enemy combat
  handleEnemies(i, x, y, obj, damage) {

    //Reduce enemy health
    obj.hp = obj.hp - Player.getCurrentStats().dmg();

    //Player take damage if enemy is not dead
    if (obj.hp > 0) {
      //Reduce player health
      Player.takeDamage(damage);
      this.setHPState();
    }

    //Lose condition, check for player death, end current game and restart
    if (Player.getCurrentStats().hp <= 0) {
      this.lockPlayerControl(true);
      this.handleModal('lose');
      setTimeout(() => this.restartGame(), 3000);

      //Win condition, check for death of dungeon floor 10 boss, end current game and restart
    } else if (obj.type === 'boss' && obj.hp <= 0 && this.props.dungeonLevel === 10) {
      this.lockPlayerControl(true);
      this.updatePlayerPOS(x, y);
      this.handleModal('win');
      setTimeout(() => this.restartGame(), 3000);

      //Check for death of other bosses, continue to next dungeon floor
    } else if (obj.type === 'boss' && obj.hp <= 0) {
      this.setPlayerEXP(Enemy.getBossValue().exp);
      this.props.genDungeon();
      this.updatePlayerPOS(Player.getPlayerPOS().x, Player.getPlayerPOS().y);

      //Check for death of non-bosses
    } else if (obj.hp <= 0) {
      this.setPlayerEXP(Enemy.getMonValue().exp);
      this.updatePlayerPOS(x, y);
    }
  }

  //Process player's next position
  processInput(x, y) {
    var array = this.props.layout;
    let index = Cal.index(x, y);
    let value = array[index];

    //Check for non number
    if (typeof value !== "number") {
      value = value.type;
    }

    //Check player's next position for map props
    switch (value) {
      case 1:
        break;
      //Weapon
      case 3:
        this.setWeapon();
        this.updatePlayerPOS(x, y);
        break;
      //Potion
      case 4:
        Player.usePotion();
        this.setHPState();
        this.updatePlayerPOS(x, y);
        break;
      //Boss
      case "boss":
        this.handleEnemies(index, x, y, array[index], Enemy.getBossValue().ap());
        break;
      ///Monster
      case "monster":
        this.handleEnemies(index, x, y, array[index], Enemy.getMonValue().ap());
        break;
      default:
        this.updatePlayerPOS(x, y);
        break;}

  }

  //Get player keyboard input and set player's next position for processing
  handleControls(e) {
    let x = Player.getPlayerPOS().x;
    let y = Player.getPlayerPOS().y;

    if (!this.state.lockControl) {
      switch (e.keyCode || e.which) {
        //Up
        case 38:
        case 87:
          y = y - 1;
          break;
        //Right
        case 39:
        case 68:
          x = x + 1;
          break;
        //Down
        case 40:
        case 83:
          y = y + 1;
          break;
        //Left
        case 37:
        case 65:
          x = x - 1;
          break;}

    }

    this.processInput(x, y);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleControls);
  }

  componentWillMount() {
    Player.genNewStats();
    this.setNewStatsState();
    window.removeEventListener('keydown', this.handleControls);
  }

  render() {
    return (
      React.createElement("div", { id: "panel" },

      React.createElement("div", { className: "row" },
      React.createElement("div", { className: "col-md-3" }, "Level:", this.state.level),
      React.createElement("div", { className: "col-md-3" }, "HP:", this.state.hp),
      React.createElement("div", { className: "col-md-4" }, "Dungeon Floor ", this.props.dungeonLevel)),

      React.createElement("div", { className: "row" },
      React.createElement("div", { className: "col-md-3" }, "Level up:", this.state.exp + 'xp'),
      React.createElement("div", { className: "col-md-3" }, "Attack:", this.state.minAP + "-" + this.state.maxAP),
      React.createElement("div", { className: "col-md-5" }, "Weapon:", this.state.weapon),
      React.createElement("div", { className: "col-md-1" }, React.createElement("button", { className: "on", onClick: this.props.setDarkness }, "Dark")))));




  }}



Panel.propTypes = {
  reset: React.PropTypes.func.isRequired,
  genDungeon: React.PropTypes.func.isRequired,
  dungeonLevel: React.PropTypes.number.isRequired,
  layout: React.PropTypes.array.isRequired,
  updateLayout: React.PropTypes.func.isRequired,
  setDarkness: React.PropTypes.func.isRequired };


class Roguelike extends React.Component {

  constructor(props) {
    super(props);
    this.updateLayout = this.updateLayout.bind(this);
    this.genDungeon = this.genDungeon.bind(this);
    this.reset = this.reset.bind(this);
    this.setDarkness = this.setDarkness.bind(this);
    this.state = {
      dungeonLayout: [],
      dungeonLevel: 0,
      isDarknessOn: true };

  }

  //Generate dungeon
  genDungeon() {
    //Dungeon level increment
    let level = this.state.dungeonLevel;
    level++;

    //Generate monsters/boss values based on dungeon level
    Enemy.setEnemiesValue(level);

    //Set Dungeon layout and floor level
    this.setState({
      dungeonLayout: Layout.getArray(),
      dungeonLevel: level });


  }

  //Reset dungeon level and darkness
  reset() {
    this.setState({
      dungeonLevel: 0 });

    if (!this.state.isDarknessOn) {
      this.setDarkness();
    }

  }

  //Update dungeon map array
  updateLayout(array) {
    this.setState({
      dungeonLayout: array });

  }

  //Set fog of war
  setDarkness() {
    if (this.state.isDarknessOn) {
      $('button').removeClass('on');
      this.setState({
        isDarknessOn: false });

    } else {
      $('button').addClass('on');
      this.setState({
        isDarknessOn: true });

    }
  }

  componentWillMount() {
    this.genDungeon();
    Viewport.setViewCoo(Player.getPlayerPOS().x, Player.getPlayerPOS().y);
  }

  render() {
    return (
      React.createElement("div", null,
      React.createElement("h1", null, "Roguelike"),
      React.createElement(GameOverContainer, null),
      React.createElement(Panel, { reset: this.reset, genDungeon: this.genDungeon, dungeonLevel: this.state.dungeonLevel, layout: this.state.dungeonLayout,
        updateLayout: this.updateLayout, setDarkness: this.setDarkness }),
      React.createElement(Dungeon, { isDarknessOn: this.state.isDarknessOn, layout: this.state.dungeonLayout })));


  }}



ReactDOM.render(
React.createElement(Roguelike, null),
document.getElementById('application'));