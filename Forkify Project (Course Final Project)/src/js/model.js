import {API_URL,RES_PER_PAGE,MOCK_API} from './config.js';
import {getJSON,setJSON} from "./helper";

export const state={
    recipe:{},
    search:{
        query:'',
        page:1,
        results:[],
        resultsPerPage: RES_PER_PAGE,
        bookmarks:[]
    },
}


export async function loadRecipe(id){
    try {
        state.search.page=1;
        const data =await getJSON(`${API_URL}/${id}`);
        let {recipe} = data.data;
        state.recipe = {
            cookingTime: recipe.cooking_time,
            id: recipe.id,
            image: recipe.image_url,
            ingredients: recipe.ingredients,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            servings: recipe.servings,
            bookmarked: state.search.bookmarks.some(
                bookmark => bookmark.id === recipe.id
            )
        }
        state.recipe.userGenerated=recipe.userGenerated;
    }
    catch (err){
        try{
            const data=await getJSON(`${MOCK_API}?id=${id}`);
            let [recipe]=data;
            state.recipe = {
                cookingTime: recipe.cooking_time,
                id: recipe.id,
                image: recipe.image_url,
                ingredients: recipe.ingredients,
                title: recipe.title,
                publisher: recipe.publisher,
                sourceUrl: recipe.source_url,
                servings: recipe.servings,
                bookmarked: state.search.bookmarks.some(
                    bookmark => bookmark.id === recipe.id
                )
            }
            state.recipe.userGenerated=recipe.userGenerated;
        }
        catch (er){
            throw er;
        }
    }
}


export async function loadSearchResult(query){
    try{
        state.search.page = 1;
        state.search.query = query;
        const [apiData, mockData] = await Promise.allSettled([
            getJSON(`${API_URL}?search=${query}`),
            getJSON(`${MOCK_API}?title=${query}`)
        ]);
        let recipes = [];
        if(mockData.status === 'fulfilled'){
            recipes = [
                ...recipes,
                ...mockData.value.map(recipe => {
                    return {
                        id: recipe.id,
                        image: recipe.image_url,
                        title: recipe.title,
                        publisher: recipe.publisher,
                        userGenerated:recipe.userGenerated
                    };
                })
            ];
        }
        
        if(apiData.status === 'fulfilled'){
            recipes = [
                ...recipes,
                ...apiData.value.data.recipes.map(recipe => {
                    return {
                        id: recipe.id,
                        image: recipe.image_url,
                        title: recipe.title,
                        publisher: recipe.publisher,
                        userGenerated:recipe.userGenerated
                    };
                })
            ];
        }
        if(!recipes.length)throw new Error();
        state.search.results = recipes;
        
    }catch(err){
        throw err;
    }
}
export function getPages(page=state.search.page){
    state.search.page=page;
    return state.search.results.slice((page-1)*10,page*10);
}

export function addBookmarks(recipe){
    state.search.bookmarks.push(recipe);
    state.recipe.bookmarked=true;
    setLocalStorage();
}
export function deleteBookmarks(id){
    state.search.bookmarks=state.search.bookmarks.filter(rec=>rec.id!==id);
    state.recipe.bookmarked=false;
    setLocalStorage();
}

export function updateServings(servingsNum){
    state.recipe.ingredients.forEach(ing=>{
        ing.quantity=ing.quantity*servingsNum/state.recipe.servings;
    })
    state.recipe.servings=servingsNum;
}

export async function uploadRecipe(newRecipe){
    try {
        const ingredients = Object.values(newRecipe).filter(ing => ing[0].startsWith('ingredient') && ing[1] !== '').map(ing => {
            let [quantity, unit, description] = ing[1].split(',')
            if(ing[1].split(',').length!==3)throw new Error('Wrong format Please enter the correct format');
            quantity = +quantity;
            return {quantity, unit, description};
        })
        newRecipe=Object.fromEntries(newRecipe);
        const recipe={
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            publisher: newRecipe.publisher,
            image_url: newRecipe.image,
            cooking_time: newRecipe.cookingTime,
            servings: newRecipe.servings,
            ingredients,
            userGenerated: true
        }
        state.recipe=await setJSON(recipe);
        const id=window.location.hash;
        window.location.hash=id.slice(0,id.indexOf('#'))+'#'+state.recipe.id;
        state.search.bookmarks.push(state.recipe);
        state.recipe.bookmarked=true;
    }catch (err){
        throw err;
    }
}

function setLocalStorage(){
    localStorage.setItem('bookmarks',JSON.stringify(state.search.bookmarks));
}

function getLocalStorage(){
    const data=JSON.parse(localStorage.getItem('bookmarks'));
    if(!data)return;
    state.search.bookmarks=data;
}

getLocalStorage();