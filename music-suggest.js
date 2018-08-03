// The Reddit API url used to get the JSON data
var redditMusicAPI = "https://www.reddit.com/r/music/top/.json?limit=15"

// The list of song titles and artists in Reddit's top /r/Music posts
var songList = [];

function getLastfmURL (artistName) {
    var url = "http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist="
    artist = artistName.split(" ").join("+").toLowerCase();
    var key = "&api_key=d7d9fa04daf1b6b667e4b0418af44ea0&format=json&limit=10"
    var LastfmURL = url + artist + key;
    return LastfmURL;
}

function addToDiv (similarArtists) {
    var string = "";
    for (let i of similarArtists) {
        string += i + "<br>";
    }
    return string;
}

function makeDiv(artist, songTitle, mediaURL, similarArtists) {
    if (similarArtists ==  "Sorry, no similar artists were found for this artist") {
        $('.complete').append('<div class="section">'+'<div class="artist">'+ artist +'</div>' + '<div class="title">'+songTitle+'</div>'
        +'<i class="fas fa-times-circle"></i> <i class="fas fa-expand"></i>' +
        ' <a href='+mediaURL+'><i class="fas fa-play"></i></a><div class="recommended"><br><strong> Suggested Artists: </strong><br>'+similarArtists+'</div></div>')
    }
    else {
        $('.complete').append('<div class="section">'+'<div class="artist">'+ artist +'</div>' + '<div class="title">'+songTitle+'</div>'
        +'<i class="fas fa-times-circle"></i> <i class="fas fa-expand"></i>' +
        ' <a target="_blank" href='+mediaURL+'><i class="fas fa-play"></i></a><div class="recommended"><br><strong> Suggested Artists: </strong><br>'+ 
        addToDiv(similarArtists)
        +'</div></div>')
    }
}


$.getJSON(redditMusicAPI, function (json) {
        json.data.children.forEach(element => {
            if (element.data.link_flair_text == "music streaming") {
                var title = element.data.title.split(" - ");
                var artist = title[0];
                var songTitle = title[1];
                var mediaURL = element.data.url;
                var similarArtists;
                                
                $.getJSON( getLastfmURL(artist), function (json) {
                    if(json.hasOwnProperty("error")) {
                        similarArtists = "Sorry, no similar artists were found for this artist";
                        makeDiv(artist, songTitle, mediaURL, similarArtists);
                    } else {
                        var similarArtists = [];
                        json.similarartists.artist.forEach(element => {
                            similarArtists.push(element.name);
                        })
                        makeDiv(artist, songTitle, mediaURL, similarArtists);
                    }

                    addjQueryEffects();

                });
            }
        });

    });


function addjQueryEffects() { 
    $('.fa-times-circle').click(function(){
        $(this).parent().slideUp(500);
     });
    $(".fa-expand").click(function() {
        if ($(this).siblings(".recommended").is(':visible')) {
        $(this).siblings(".recommended").slideUp(600);
        } else {
        $(this).siblings(".recommended").slideDown(600);
        }
        e.preventDefault();

    });
}