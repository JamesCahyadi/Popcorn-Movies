const express = require('express');
const fetch = require('node-fetch');
const app = express();
require('dotenv').config();

// use the port number that comes with the hosting platform OR 3001 as a fallback
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server started at port: ${port}`));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' })); 

app.get('/search/:movieName/:pageNum', (req, res) => {
    const movieName = req.params.movieName;
    const pageNum = req.params.pageNum;
    const OMDB_API_KEY = process.env.OMDB_API_KEY;
    fetch(`http://www.omdbapi.com/?s=${movieName}}&page=${pageNum}&apikey=${OMDB_API_KEY}`)
    .then(fetch_res => fetch_res.json())
    .then(data => res.json(data))
    .catch(e => console.log(e));
});

app.get('/trailer/:movieTitle/:movieYear', (req, res) => {
    const movieTitle = req.params.movieTitle;
    const movieYear = req.params.movieYear;
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    const TRAILER_URL = 
    `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(movieTitle) + '%20' + encodeURIComponent(movieYear)}%20trailer&type=video&videoDuration=short&videoEmbeddable=true&key=${YOUTUBE_API_KEY}`;
    fetch(TRAILER_URL)
    .then(fetch_res => fetch_res.json())
    .then(data => res.json(data))
    .catch(e => console.log(e));
});

app.get('/imdbMovie/:movieID', (req, res) => {
    const movieID = req.params.movieID;
    const OMDB_API_KEY = process.env.OMDB_API_KEY;
    fetch(`http://www.omdbapi.com/?i=${movieID}&plot=full&apikey=${OMDB_API_KEY}`)
    .then(fetch_res => fetch_res.json())
    .then(data => res.json(data))
    .catch(e => console.log(e));
});

app.get('/articles/:movieTitle', (req, res) => {
    const movieTitle = req.params.movieTitle;
    const NYTIMES_API_KEY = process.env.NYTIMES_API_KEY;
    const REVIEWS_URL =
    `https://api.nytimes.com/svc/movies/v2/reviews/search.json?query=${encodeURIComponent(movieTitle)}&api-key=${NYTIMES_API_KEY}`;
    fetch(REVIEWS_URL)
    .then(fetch_res => fetch_res.json())
    .then(data => res.json(data))
    .catch(e => console.log(e));   
});
