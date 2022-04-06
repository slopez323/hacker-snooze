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
    let itemNum = `<td class="itemNum">${count}. </td>`
    let newItemTitle = `<td class="titleParent"><a class="itemTitle" href="${details.url}">${details.title}</a></td>`
    let newItemDesc = `<td class="itemDesc">${details.score} points by ${details.by} | ${details.descendants} comments</td>`
    $('table').append(`<tr>${itemNum}${newItemTitle}</tr><tr><td></td>${newItemDesc}</tr>`)
    count++;
};

function top100(){
    for (let i=0; i < 100; i++){
        getDetails(topIDs[i]);
    };
};