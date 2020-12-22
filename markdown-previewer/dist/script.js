var Markdown = React.createClass({ displayName: "Markdown",

  getInitialState: function () {
    return {
      markedstring: 'Heading\n=======\n\n' +
      'Sub-heading\n-----------\n\n' +
      '### Another deeper heading\n\n' +
      'Paragraphs are separated\nby a blank line.\n\n' +
      'Leave 2 spaces at the end of a line to do a  \nline break\n\n' +
      'Text attributes *italic*, **bold**, `monospace`, ~~strikethrough~~\n\n' +
      'Shopping List\n' +
      '* Apple\n' +
      '* Orange\n' +
      '* Grape\n\n' +
      'Numbered List\n' +
      '1. Apple\n' +
      '2. Orange\n' +
      '3. Grape\n\n' +
      '| Table | Col 1 | Col 2 |\n' +
      '|-----|-----|-----|\n' +
      '| Row 1 | Content | Content |\n' +
      '| Row 2 | Content | Content |\n' };

  },

  handleInput: function (event) {
    this.setState({
      markedstring: event.target.value });

  },

  markedText: function () {
    var mark = marked(this.state.markedstring);
    return { __html: mark };
  },

  render: function () {
    return (
      React.createElement("div", null,
      React.createElement("h1", { id: "title" }, "Markdown Previewer"),
      React.createElement("div", { className: "container" },
      React.createElement("div", { className: "row" },
      React.createElement("div", { className: "col-md-6" },
      React.createElement("textarea", { onChange: this.handleInput }, this.state.markedstring)),

      React.createElement("div", { className: "col-md-6" },
      React.createElement("div", { id: "displaytext", dangerouslySetInnerHTML: this.markedText() }))))));





  } });



ReactDOM.render(
React.createElement(Markdown, null),
document.getElementById('display'));