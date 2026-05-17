import View from "./view";

class SearchView extends View{
    _parentEL=document.querySelector('.search');
    getQuery(){
        return this._parentEL.querySelector('.search__field').value;
    }
    addHandlerSearch(handler){
        this._parentEL.addEventListener('submit',function (e){
            e.preventDefault();
            handler();
        });
    }
}

export default new SearchView();