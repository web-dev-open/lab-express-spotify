require('dotenv').config();

const SpotifyWebApi = require('spotify-web-api-node');


const express = require('express');
const hbs = require('hbs');
const { response } = require('express');

// require spotify-web-api-node package here:

// credentials are optional


const spotifyApi = new SpotifyWebApi({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET
});


// Retrieve an access token

spotifyApi.clientCredentialsGrant()
	.then(data => spotifyApi.setAccessToken(data.body['access_token']))
	.catch(error => console.log('Something went wrong when retrieving an access token', error));

// then invoke the spotify API here with CLIENT keys




const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:


// app.get('/', ( req, res) => {
//   app.render("index.hbs")
// })


app.get('/', (req, res, next) => {
  
  res.render('index.hbs')
})


app.get('/artist-search', (req, res, next) => {
  let {name} = req.query
spotifyApi
.searchArtists(name)
	.then(data => {
	// console.log('The received data from the API: ', data.body.artists.items);
	// for (let i = 0; i < data.body.artists.items.length; i++){
	// 	console.log(data.body.artists.items[i].images)
	// }
    res.render("artist-search-results.hbs", {data: data.body.artists.items})
	// ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
})

.catch(err => console.log('The error while searching artists occurred: ', err));
  //make API call here
})


// Passing a callback - get Elvis' albums in range [20...29]
app.get('/albums/:id', (req, res, next) => {
	let {id} = req.params
spotifyApi
  .getArtistAlbums(id, { limit: 10})
  .then(data => {
	// for (let i = 0; i < data.body.items.length; i++){
	// 	console.log(data.body.items[i].images)
	// }
	// console.log(data.body.items)
	// console.log('The received data from the API: ', data.body.artists.items);

    res.render("albums.hbs", {data: data.body.items})
	// ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
})

.catch(err => console.log('The error while searching artists occurred: ', err));
  //make API call here
});


app.get('/albums/:id/tracks', (req, res, next) => {
	let {id} = req.params
spotifyApi.getAlbumTracks(id, { limit : 5, offset : 1 })



  .then(data => {
	// for (let i = 0; i < data.body.items.length; i++){
	// 	console.log(data.body.items[i].preview_url)
	// }
	// console.log(data.body.items.preview_url)
	// console.log('The received data from the API: ', data.body.artists.items);

    res.render("tracks.hbs", {data: data.body.items})
	// ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
})

.catch(err => console.log('The error while searching artists occurred: ', err));
  //make API call here
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
