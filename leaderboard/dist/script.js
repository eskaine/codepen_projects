var Leaderboard = React.createClass({ displayName: "Leaderboard",

  getInitialState: function () {
    return {
      recentList: [],
      alltimeList: [],
      recentArrow: React.createElement("i", { className: "material-icons" }, "arrow_drop_down"),
      alltimeArrow: [],
      whichList: "recent" };

  },

  componentDidMount: function () {

    //Reference (http://stackoverflow.com/questions/33104747/fetching-multiple-api-requests-with-react-native)
    fetch('https://fcctop100.herokuapp.com/api/fccusers/top/recent').
    then(response => response.json()).
    then(json => {
      this.setState({
        recentList: json });

    }).then(() => {

      fetch('https://fcctop100.herokuapp.com/api/fccusers/top/alltime').
      then(response => response.json()).
      then(json => {
        this.setState({
          alltimeList: json });

      });
    });

  },

  recentBtn: function () {
    this.setState({
      whichList: 'recent',
      alltimeArrow: [],
      recentArrow: React.createElement("i", { className: "material-icons" }, "arrow_drop_down") });

  },

  alltimeBtn: function () {
    this.setState({
      whichList: 'alltime',
      recentArrow: [],
      alltimeArrow: React.createElement("i", { className: "material-icons" }, "arrow_drop_down") });

  },

  render: function () {

    var currentList;

    //Switch between recent and alltime list
    if (this.state.whichList == 'recent') {
      currentList = this.state.recentList;
    } else if (this.state.whichList == 'alltime') {
      currentList = this.state.alltimeList;
    }

    //Map function to iterate over list array
    var list = currentList.map(function (user, i) {
      var tablerow =
      React.createElement("tr", { key: 'user_' + i },
      React.createElement("td", { className: "indexCol" }, i + 1),
      React.createElement("td", { className: "green" }, React.createElement("img", { src: user.img }), user.username),
      React.createElement("td", { className: "recentCol" }, user.recent),
      React.createElement("td", { className: "alltimeCol" }, user.alltime));


      return tablerow;
    });

    return (
      React.createElement("div", { className: "container" },

      React.createElement("h2", null, "freeCodeCamp Leaderboard"),

      React.createElement("table", { className: "table table-striped" },
      React.createElement("thead", null,
      React.createElement("tr", null,
      React.createElement("th", { className: "indexCol" }, "#"),
      React.createElement("th", { className: "userCol" }, "Camper Name"),
      React.createElement("th", { className: "recentCol textDeco", onClick: this.recentBtn }, "Recent", this.state.recentArrow),
      React.createElement("th", { className: "alltimeCol textDeco", onClick: this.alltimeBtn }, "Alltime", this.state.alltimeArrow))),


      React.createElement("tbody", null,
      list))));





  } });



ReactDOM.render(
React.createElement(Leaderboard, null),
document.getElementById('display'));