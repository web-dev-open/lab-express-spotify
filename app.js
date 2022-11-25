require('dotenv').config();


const { response } = require('express');
const express = require('express');
const hbs = require('hbs');
const router = express.Router();

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

// then invoke the spotify API here with CLIENT keys
const spotifyApi = new SpotifyWebApi({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET
});

spotifyApi.clientCredentialsGrant()
	.then(data => spotifyApi.setAccessToken(data.body['access_token']))
	.catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:


// Our routes go here:

/* GET home page */
app.get("/", (req, res) => {
    res.render("index.hbs")
});

app.get("/artist-search",(req,res,next)=> {
    let {artist} = req.query
    console.log(artist)
    spotifyApi.searchArtists(artist)
        .then((data) => {
            let artists = data.body.artists.items
            res.render('results.hbs', {artists})
        }).catch((err) => {
            console.log('Failed',err)
        });
})

app.get('/albums/:id', (req, res, next) => {
	// .getArtistAlbums() code goes here
    const {id} = req.params
    spotifyApi.getArtistAlbums(id)
    .then((result) => {
        let albums = result.body.items
        res.render('albums.hbs', {albums})
    }).catch((err) => {
        console.log(err)
    });

});

app.get('/tracks/:id', (req, res, next) => {
    const id = req.params.id

    spotifyApi.getAlbumTracks(id)
    .then((result) => {
        let tracks = result.body.items
        res.render('tracks.hbs', {tracks})
    }).catch((err) => {
        console.log(err)
    });

});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
