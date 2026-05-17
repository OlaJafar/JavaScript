import View from "./view";
import icons from "url:../../img/icons.svg";
import previewView from "./previewView";

class ResultView extends View{
    _parentEl=document.querySelector('.results');
    _errMessage='No recipes found for you search! Please try again.'
    _generateMarkup(){
        return this._data.map(result=>previewView.render(result,false)).join('');
        
    }
}

export default new ResultView();