let topIDs = [];
let count = 1;

async function getTopIDs() {
    let httpResponse = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty')
    topIDs = await httpResponse.json();
    top100();
};

getTopIDs();

async function getDetails(id){
    let details = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`)
    details = await details.json();
    console.log(details);
    createList(details);
};

function createList(details){
    let itemNum = `<span class="itemNum">${count}. </span>`
    let newItemTitle = `<span><a class="itemTitle" href="${details.url}">${details.title}</a></span>`
    let newItemDesc = `<p class="itemDesc">${details.score} points by ${details.by} | ${details.descendants} comments</p>`
    $('.storyList').append(`<div>${itemNum}${newItemTitle}${newItemDesc}</div>`)
    count++;
};

function top100(){
    for (let i=0; i < 100; i++){
        getDetails(topIDs[i]);
    };
};