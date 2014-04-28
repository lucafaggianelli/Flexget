$(function() {

var textInput = $('#query'),
    ul = $('#search-results'),
    autocompleteTimer;

textInput.keyup(function(event) {
    console.log('Cleared timeout');
    clearTimeout(autocompleteTimer);
    autocompleteTimer = setTimeout(function() {console.log('searching...');searchSeries(textInput.val());}, 500);
});

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
        html += '<img src="http://thetvdb.com/banners/'+series.banner+'" style="width:300px;height:55px;"/>';
    html += '<span class="title">'+series.seriesname+'</span></li>';

    return html;
}
});
