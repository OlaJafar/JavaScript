import View from "./view";
import icons from "url:../../img/icons.svg";

class PaginationView extends View{
    _parentEl=document.querySelector('.pagination');
    addHandlerClick(handler){
        this._parentEl.addEventListener('click',function(e){
            const target=e.target.closest('.btn--inline');
            if(!target)return;
            handler(target.dataset.goto);
        })
    }
    _generateMarkup(){
        const curPage=+this._data.page;
        const pageNum=Math.ceil(this._data.results.length/this._data.resultsPerPage);
        const nxtBtn=`
             <button data-goto="${curPage+1}" class="btn--inline pagination__btn--next">
               <span>Page ${curPage+1}</span>
               <svg class="search__icon">
                 <use href="${icons}#icon-arrow-right"></use>
               </svg>
             </button>
        `
        const prevBtn=`
            <button data-goto="${curPage-1}" class="btn--inline pagination__btn--prev">
               <svg class="search__icon">
                 <use href="${icons}#icon-arrow-left"></use>
               </svg>
               <span>Page ${curPage-1}</span>
             </button>
        `
        
        if(pageNum===1)return '';
        if(curPage===1)return nxtBtn;
        if(curPage===pageNum)return prevBtn;
        return prevBtn+nxtBtn;
    }
    
}

export default new PaginationView();