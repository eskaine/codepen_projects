//Retrieve recipe list data from localstorage
function getRecipeList() {
  var recipeList = JSON.parse(localStorage.getItem("recipelist"));
  return recipeList;
}

//Update modal form default values according to add(new) or edit button
function modalUpdate(index, isedit) {
  var recipe = getRecipeList();
  localStorage.setItem("isEdit", isedit);
  recipe = recipe[index];
  var modal = $('#recipeform');

  //Edit default values
  if (isedit == true) {
    modal.find('.modal-header h4').html('Edit Recipe');
    modal.find('.modal-body input').val(recipe.name);
    modal.find('.modal-body textarea').val(recipe.ingredients);
    modal.find('.modal-footer #update').html('Update');

    //Add default values
  } else {
    modal.find('.modal-header h4').html('Add Recipe');
    modal.find('.modal-body input').val('');
    modal.find('.modal-body textarea').val('');
    modal.find('.modal-footer #update').html('Add');
  }
}

var RecipeForm = React.createClass({ displayName: "RecipeForm",

  propTypes: {
    onAddRecipe: React.PropTypes.func.isRequired,
    onEditRecipe: React.PropTypes.func.isRequired },


  //Reset form value to empty
  resetForm: function () {
    $('#addRecipeForm').on('hidden.bs.modal', function (e) {
      $('input').val('');
      $('textarea').val('');
    });
  },

  //Change onclick function on button in modal accordingly
  updateList: function () {
    var name = $('input').val();
    var ingredients = $('textarea').val();
    var value = $('#update').html();
    var recipe = getRecipeList();

    //Give empty Recipe name a default value
    if (name == '') {
      name = 'Untitled';
    }

    //Convert empty ingredients string to empty array
    if (ingredients == '') {
      ingredients = [' '];

      //Convert ingredients string to array
    } else {
      ingredients = ingredients.split(',');
    }

    //Callback to Edit Recipe
    if (value == "Update") {
      this.props.onEditRecipe({
        name: name,
        ingredients: ingredients });

      this.resetForm();

      //Callback to Add Recipe
    } else {
      this.props.onAddRecipe({
        name: name,
        ingredients: ingredients });

      this.resetForm();
    }
  },

  render: function () {
    return (
      React.createElement("div", { className: "modal fade", id: "recipeform", tabindex: "-1", role: "dialog", "aria-labelledby": "myModalLabel" },
      React.createElement("div", { className: "modal-dialog", role: "document" },
      React.createElement("div", { className: "modal-content" },
      React.createElement("div", { className: "modal-header" },
      React.createElement("button", { type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close" }, React.createElement("span", { "aria-hidden": "true" }, "\xD7")),
      React.createElement("h4", { className: "modal-title", id: "myModalLabel" })),

      React.createElement("div", { className: "modal-body" },
      React.createElement("form", null,
      React.createElement("div", { className: "form-group" },
      React.createElement("label", null, "Recipe"),
      React.createElement("input", { type: "text", className: "form-control", placeholder: "Recipe Name" })),

      React.createElement("div", { className: "form-group" },
      React.createElement("label", null, "Ingredients"),
      React.createElement("textarea", { id: "ingredients", className: "form-control", rows: "3", placeholder: "Enter Ingredients,Seperated,By Commas" })))),



      React.createElement("div", { className: "modal-footer" },
      React.createElement("a", { type: "button", id: "update", className: "btn btn-info", "data-dismiss": "modal", onClick: this.updateList }),
      React.createElement("a", { type: "button", className: "btn btn-default", "data-dismiss": "modal", onClick: this.resetState }, "Close"))))));





  } });


var IngredientsContainer = React.createClass({ displayName: "IngredientsContainer",

  propTypes: {
    ingredientslist: React.PropTypes.array.isRequired },


  render: function () {
    //List out each ingredient in a row
    var rows = [];
    this.props.ingredientslist.forEach(listitem => {
      if (listitem !== '') {
        rows.push(React.createElement("li", { className: "list-group-item" }, listitem));
      }
    });

    return React.createElement("div", null, rows);
  } });


var RecipeContainer = React.createClass({ displayName: "RecipeContainer",

  propTypes: {
    index: React.PropTypes.number.isRequired,
    recipe: React.PropTypes.array.isRequired,
    onEditIndex: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func.isRequired },


  handleDelete: function () {
    this.props.onDelete(this.props.index);
  },

  handleModal: function () {
    modalUpdate(this.props.index, true);

    //Callback to set index of current edited recipe
    this.props.onEditIndex(this.props.index);
  },

  render: function () {

    var recipeItem =
    React.createElement("div", { id: "recipe" + this.props.index, key: this.props.index, className: "panel panel-default" },
    React.createElement("div", { className: "panel-heading", role: "tab", id: "recipeheading_" + this.props.index },
    React.createElement("h4", { className: "panel-title" },
    React.createElement("a", { className: "collapsed", role: "button", "data-toggle": "collapse", "data-parent": "#accordion", href: "#recipe_" + this.props.index,
      "aria-expanded": "false", "aria-controls": "recipe_" + this.props.index },
    this.props.recipe.name))),



    React.createElement("div", { id: "recipe_" + this.props.index, className: "panel-collapse collapse", role: "tabpanel", "aria-labelledby": "recipeheading_" + this.props.index },
    React.createElement("div", { className: "panel-body" },
    React.createElement("h4", null, "Ingredients"),
    React.createElement("div", { className: "divider" }),
    React.createElement("ul", { className: "list-group" },
    React.createElement(IngredientsContainer, { ingredientslist: this.props.recipe.ingredients })),

    React.createElement("a", { type: "button", className: "btn btn-warning", "data-toggle": "modal", "data-target": "#recipeform",
      onClick: this.handleModal }, "Edit"),
    React.createElement("a", { type: "button", className: "btn btn-danger", onClick: this.handleDelete }, "Delete"))));





    return recipeItem;
  } });


var AddRecipe = React.createClass({ displayName: "AddRecipe",

  handleModal: function () {
    modalUpdate(null, false);
  },

  render: function () {
    return (
      React.createElement("div", { className: "addDiv" },
      React.createElement("a", { type: "button", className: "btn btn-info", "data-toggle": "modal", "data-target": "#recipeform", onClick: this.handleModal }, "Add")));


  } });


var RecipeListContainer = React.createClass({ displayName: "RecipeListContainer",

  propTypes: {
    recipeList: React.PropTypes.array.isRequired,
    onEditIndex: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func.isRequired },


  render: function () {
    var ondelete = this.props.onDelete;
    var oneditindex = this.props.onEditIndex;
    var rows = this.props.recipeList.map(function (listitem, i) {

      return React.createElement(RecipeContainer, {
        index: i,
        recipe: listitem,
        onEditIndex: oneditindex,
        onDelete: ondelete });

    });

    return React.createElement("div", null, rows);
  } });


var RecipeListApp = React.createClass({ displayName: "RecipeListApp",

  getInitialState: function () {
    return {
      initialList: [{
        name: "Chicken Pie",
        ingredients: ["Crushed Garlic", "Crusty Bread", "Butter"] },
      {
        name: "Beef Stew",
        ingredients: ["Cubed Beef", "Worcestershire Sauce", "Sliced Carrots"] }],

      currentList: [],
      currentIndex: 0 };

  },

  //To set default index for use by handleEditRecipe function
  handleIndex: function (index) {
    this.setState({
      currentIndex: index });

  },

  //To add new recipe to the current list, update localstorage
  handleAddRecipe: function (newRecipe) {
    var recipeList = getRecipeList();
    recipeList.push(newRecipe);
    localStorage.setItem("recipelist", JSON.stringify(recipeList));
    this.setState({
      currentList: recipeList });

  },

  //To edit current recipe, update localstorage
  handleEditRecipe: function (updatedRecipe) {
    var recipeList = getRecipeList();
    recipeList[this.state.currentIndex] = updatedRecipe;
    localStorage.setItem("recipelist", JSON.stringify(recipeList));
    this.setState({
      currentList: recipeList });

  },

  //To delete recipe from the list
  handleDeleteRecipe: function (index) {
    var recipeList = getRecipeList();
    recipeList.splice(index, 1);
    localStorage.setItem("recipelist", JSON.stringify(recipeList));
    this.setState({
      currentList: recipeList });

  },

  render: function () {
    var myList = [];
    if (getRecipeList() === null) {
      myList = this.state.initialList;
      localStorage.setItem("recipelist", JSON.stringify(myList));
    } else {
      myList = getRecipeList();
    }

    return (
      React.createElement("div", null,
      React.createElement("div", { className: "container recipebox" },
      React.createElement("div", { className: "row" },
      React.createElement("div", { className: "col-sm-12" },
      React.createElement("h1", null, "Recipe Box"), React.createElement(AddRecipe, null))),


      React.createElement("div", { className: "row" },
      React.createElement("div", { className: "col-sm-12" },
      React.createElement("div", { className: "panel-group", id: "accordion", role: "tablist", "aria-multiselectable": "true" },
      React.createElement(RecipeListContainer, { recipeList: myList, onEditIndex: this.handleIndex, onDelete: this.handleDeleteRecipe }))))),




      React.createElement(RecipeForm, { onAddRecipe: this.handleAddRecipe, onEditRecipe: this.handleEditRecipe })));


  } });



ReactDOM.render(
React.createElement(RecipeListApp, null),
document.getElementById('display'));