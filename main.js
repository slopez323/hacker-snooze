let topIDs = [];
let storyCount = 1;
let askCount = 1;
let dataComments = [];

async function getTopIDs(type) {
    if (type == 'story') {
        let httpResponse = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty')
        topIDs = await httpResponse.json();
        top100('story');
    } else {
        let httpResponse = await fetch('https://hacker-news.firebaseio.com/v0/askstories.json?print=pretty')
        topIDs = await httpResponse.json();
        top100('ask');
    };
};

getTopIDs('story');

function top100(type) {
    for (let i = 0; i < 100; i++) {
        getDetails(type, topIDs[i]);
    };
};

$('.tab-content').on('click', '.showComment', (e) => {
    viewMore(e);
});

$('.tab-content').on('click', '.askTitle', (e) => {
    viewMore(e);
});

function viewMore(e){
    const parentdiv = $(e.target).parent().parent();
    const storyID = $(e.target).attr("data-story-id");

    if ($(e.target).parent().siblings('.commentList').length == 0) {
        showComments(parentdiv, storyID);
    } else {
        $(e.target).parent().siblings('.commentList').toggle();
    };
};

async function getDetails(type, id) {
    let details = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`)
    details = await details.json();
    dataComments.push({ id, comments: details.kids });
    createList(type, details);
};

function createList(type, details) {
    let itemNum;
    if (type == 'story') {
        itemNum = `<span class="itemNum">${storyCount}. </span>`
    } else {
        itemNum = `<span class="itemNum">${askCount}. </span>`
    };
    let newItemTitle;
    if (details.url) {
        newItemTitle = `<span class="titleParent"><a class="itemTitle" href="${details.url}">${details.title}</a></span>`;
    } else {
        newItemTitle = `<span class="titleParent"><a class="itemTitle askTitle" data-story-id="${details.id}">${details.title}</a></span>`;
    };
    let newItemDesc = `<p class="itemDesc">${details.score} points by ${details.by} <span class="showComment" data-story-id="${details.id}">${details.descendants} comments</span></p>`
    if (type == 'story') {
        $('.storyList').append(`<div class="storyItem">${itemNum}${newItemTitle}${newItemDesc}</div>`)
        storyCount++;
    } else {
        $('.askList').append(`<div class="storyItem">${itemNum}${newItemTitle}${newItemDesc}</div>`)
        askCount++;
    };
};


async function showComments(parentdiv, storyID) {
    const commentID = dataComments.find(x => x.id == storyID).comments
    $(parentdiv).append(`<div class="commentList"></div>`);
    if ($(parentdiv).children('.titleParent').children('.askTitle').length !== 0) {
        let details = await fetch(`https://hacker-news.firebaseio.com/v0/item/${storyID}.json?print=pretty`)
        details = await details.json();
        $(parentdiv).find('.commentList').append(`<div class="askTextDiv"><p class="askText">${details.text}</p></div>`)
    };
    if (commentID.length > 0) {
        for (let i = 0; i < commentID.length; i++) {
            let comments = await fetch(`https://hacker-news.firebaseio.com/v0/item/${commentID[i]}.json?print=pretty`);
            comments = await comments.json();
            $(parentdiv).find('.commentList').append(`<p class="commentBy">${comments.by}</p><div class="commentText">${comments.text}</div>`);
        };
    };
};

$('#ask-tab').on('click', function () {
    if (askCount == 1) getTopIDs('ask');
});
