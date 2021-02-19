// Track the currently selected demo
var currentDemo = 'message';

// Change the currently selected demo
function changeTab(newTab) {
    if (newTab === 'message') {
        currentDemo = 'message';
        $('#messaging').addClass('current');
        $('#call').removeClass('current');
        $('form button').html('Send me a message');
    } else {
        currentDemo = 'call';
        $('#call').addClass('current');
        $('#messaging').removeClass('current');
        $('form button').html('Call my phone');
    }
}

function getJson() {
    fetch("http://localhost:3000/jsonp", { method: "GET" })
    .then(a=>a.text())
    .then(a => fromHtmlEntities(a))
    .then(console.log)

    // console.log({value})
    // console.log(JSON.parse(value))
}

function parseJsonP(fromJSONP) {
    console.log(fromJSONP)
    // console.log(string.fromHtmlEntities())
}

// Set up handlers for tabs
$('#messaging').on('click', function(e) { 
    e.preventDefault();
    changeTab('message');
});
$('#call').on('click', function(e) { 
    e.preventDefault();
    changeTab('call');
});

// Set up handler for "flash" message
$('#flash a').on('click', function(e) {
    e.preventDefault();
    $('#flash').hide();
});

function fromHtmlEntities(string) {
    return (string+"").replace(/&#\d+;/gm,function(s) {
        return String.fromCharCode(s.match(/\d+/gm)[0]);
    })
};