import "regenerator-runtime/runtime"
import "core-js/stable"
import * as model from "./model";
import recipeView from "./views/recipeView";
import searchView from "./views/searchView";
import resultView from "./views/resultView";
import paginationView from "./views/paginationView";
import bookmarkView from "./views/bookmarkView";
import AddRecipeView from "./views/addRecipeView";
import addRecipeView from "./views/addRecipeView";

// if(module.hot){
//   module.hot.accept();
// }
const controlRecipe=async function(){
  try {
    const id=window.location.hash.slice(1);
    if(!id)return;
    recipeView.renderSpinner();
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
    resultView.update(model.getPages());
    bookmarkView.render(model.state.search.bookmarks);
  }
  catch (err){
    recipeView.renderErrorMessage();
    
  }
}


const controlServings = function(newServings){
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
}


const controlSearchResult = async function(){
  try{
    resultView.renderSpinner();
    const query=searchView.getQuery();
    if(!query)return;
    await model.loadSearchResult(query);
    resultView.render(model.getPages());
    paginationView.render(model.state.search);
  }
  catch (err){
    resultView.renderErrorMessage();
  }
}


const controlBookmarks=function(){
  !model.state.recipe.bookmarked?
      model.addBookmarks(model.state.recipe):model.deleteBookmarks(model.state.recipe.id);
  bookmarkView.render(model.state.search.bookmarks);
  recipeView.update(model.state.recipe);
}


const controlPaginationBtn=function(goToPage){
  resultView.render(model.getPages(goToPage));
  paginationView.render(model.state.search);
}

const controlAddRecipe=async function(newRecipe){
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    addRecipeView.render(model.state.recipe)
    addRecipeView.renderMessage();
    recipeView.update(model.state.recipe);
    bookmarkView.render(model.state.search.bookmarks);
    setTimeout(function(){
      addRecipeView.resetView();
    },2000);
    
  }
  catch (err){
    addRecipeView.renderErrorMessage();
    setTimeout(()=>addRecipeView.resetView(),2000);
  }
}

const init=function(){
  recipeView.addHandlerRender(controlRecipe);
  
  recipeView.addHandlerServings(controlServings);
  
  recipeView.addHandlerBookmarks(controlBookmarks);
  
  searchView.addHandlerSearch(controlSearchResult);
  
  paginationView.addHandlerClick(controlPaginationBtn);
  
  addRecipeView.addHandlerUpload(controlAddRecipe);
}

init();