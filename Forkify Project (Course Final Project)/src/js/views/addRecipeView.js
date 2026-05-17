import View from "./view";

class AddRecipeView extends View {
    _parentEl = document.querySelector('.upload');
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');
    _message='Recipe has been uploaded successfully!'
    _errMessage='Wrong format! Please enter the correct format'
    #currentHTML=this._parentEl.innerHTML;
    #formData;
    constructor() {
        super();
        this._addHandlerShowOverlay();
        this._addHandlerHideOverlay();
    }
    
    _toggleWindow(){
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }
    _addHandlerShowOverlay() {
        this._btnOpen.addEventListener('click',this._toggleWindow.bind(this))
    }
    _addHandlerHideOverlay() {
        this._btnClose.addEventListener('click',this._toggleWindow.bind(this))
        this._overlay.addEventListener('click',this._toggleWindow.bind(this))
    }
    
    addHandlerUpload(handler){
        this._parentEl.addEventListener('submit',e=>{
            e.preventDefault();
            this.#formData=new FormData(this._parentEl);
            const inputs=[...this.#formData];
            handler(inputs);
        });
    }
    render(data) {
        this._data=data;
    }
    resetView(){
        this._parentEl.innerHTML=this.#currentHTML;
        [...this.#formData].forEach(([key, value]) => {
            document.querySelector(`[name="${key}"]`).value = value;
        });
    }
    
    
}

export default new AddRecipeView();