import View from "./view.js";
import icons from "url:../../img/icons.svg";

class PreviewView extends View{
    _generateMarkup(){
        const id=window.location.hash.slice(1);
        const data=this._data;
        return `
        <li class="preview">
            <a class="preview__link ${data.id===id?'preview__link--active':''}" href="#${data.id}">
              <figure class="preview__fig">
                <img src="${data.image}" alt="${data.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${data.title}</h4>
                <p class="preview__publisher">${data.publisher}</p>
                <div class="preview__user-generated ${this._data.userGenerated?'':'hidden'}">
                  <svg>
                    <use href="${icons}#icon-user"></use>
                  </svg>
               </div>
              </div>
            </a>
          </li>
        `;
    }
}

export default new PreviewView();