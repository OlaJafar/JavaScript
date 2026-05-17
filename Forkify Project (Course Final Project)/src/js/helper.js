import {MOCK_API, TIMEOUT_SEC} from "./config.js";

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};

export async function getJSON(url){
    try{
        const res = await Promise.race([fetch(url),timeout(TIMEOUT_SEC)]);
        if(!res.ok)throw new Error();
        const data =await res.json();
        return data;
    }
    catch (err){
        throw err;
    }
}

export async function setJSON(recipe){
    try{
        // console.log(recipe);
        const res=await fetch(MOCK_API,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(recipe),
        });
        const data=await res.json();
        return data;
    }catch (err){
        throw err;
    }
}