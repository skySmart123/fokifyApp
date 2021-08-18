
import * as model from './model.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarkView from './views/bookmarkView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import { ModuleKind } from 'typescript';
import {MODAL_CLOSE_SEC} from './config.js';




// https://forkify-api.herokuapp.com/v2

/////////////////////////////////////
// if(module.hot){
//   module.hot.accept();
// }
const controlRecipes = async function(){
  try{
   
    const id  = window.location.hash.slice(1);
     
    if(!id) return;
    recipeView.renderSpinner();
    resultsView.update(model.getSearchResultsPage());
    bookmarkView.update(model.state.bookmarks);

    await model.loadRecipe(id);

     // 2. rendering the recipe
     recipeView.render(model.state.recipe);
     
  }catch(err){
    
    recipeView.renderError();
  }
}

const controlSearchResults = async function(){
  try{
    resultsView.renderSpinner();
    
    // 1) Get search query
    const query = searchView.getQuery();
    if(!query) return;

    //)2 load search results
    await model.loadSearchResults(query);
    // 3) Render results
    
    resultsView.render(model.getSearchResultsPage());

    // render the initial pagination buttons
    paginationView.render(model.state.search);
    
  }catch(err){
    console.log(err);
  }
};
const controlPagination =  function(goToPage){
  // 3) Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));
  
  // render new pagination buttons
  paginationView.render(model.state.search);
}

const controlServings = function(newServings){
  model.updateServings(newServings);

  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}
const controlAddBookmark = function(){
  if(!model.state.recipe.bookmarked) 
  model.addBookmark(model.state.recipe);
  else if(model.state.recipe.bookmarked)
  model.deleteBookmark(model.state.recipe.id);
  
  console.log(model.state.recipe);
  recipeView.update(model.state.recipe);
  bookmarkView.render(model.state.bookmarks);
}
const controlBookmarks = function(){
  bookmarkView.render(model.state.bookmarks);
}
const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    // addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
  // addRecipeView.renderMessage();
  
    
    // Render bookmark view
    bookmarkView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    addRecipeView.toggleWindow();
     
   
    // Close form window
    // setTimeout(function () {
    //   addRecipeView.toggleWindow();
    // }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function(){
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);

};
init();

