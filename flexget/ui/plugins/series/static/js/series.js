$(function() {

var ul = $('#search-results'),
    textInput,
    autocompleteTimer;

createHtml();
setBackground();

textInput.keyup(function(event) {
    console.log('Cleared timeout');
    clearTimeout(autocompleteTimer);
    autocompleteTimer = setTimeout(function() {console.log('searching...');searchSeries(textInput.val());}, 500);
});

function createHtml() {

    textInput = $('#query');
    textInput.width(window.innerWidth * .3);
    var container = $('#query-container');
console.log(container.find('i').width(), textInput.width());
    container.css({
        width: textInput.width() + container.find('i').width() + 20 + 20
    });
}

function setBackground() {
    var img = document.createElement('img'),
        W = 1280, H = 800;
    img.id = 'background';
    img.src = '/series/static/img/lost.jpg';
    if ((window.innerWidth/window.innerHeight) < (W/H)) {
        img.style.height = '100%';
        img.style.left = (window.innerWidth - W) / 2 + 'px';
    } else {
        img.style.width = '100%';
        img.style.top = (window.innerHeight - H) / 2 + 'px';
    }
    document.body.appendChild(img);
}

function searchSeries(query) {
    $.get('/series/search',
    {q: query},
    function(data) {
        ul.html('');
        data.sort(function(a,b) {
            return new Date(b.firstaired) - new Date(a.firstaired);
        });
        for (var i in data) {
            ul.append(createLi(data[i]));
        }
    },
    'json');
}

function createLi(series) {
    var html = '<li>';
    
    if (series.banner)
        html += '<img src="http://thetvdb.com/banners/'+series.banner+'"/>';
    html += '<p class="title">'+series.seriesname+'</p>'
    if (series.overview)
        html += '<p class="description">'+series.overview+'</p>'
    
    html += '</li>';

    return html;
}
});
