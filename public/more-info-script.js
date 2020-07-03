let movieTitle = document.getElementById('movie-title');
let moviePlot = document.getElementById('plot');
let movieRuntime = document.getElementById('runtime');
let movieGenre = document.getElementById('genre');
let movieCountry = document.getElementById('country');
let movieActors = document.getElementById('actors');
let movieDirector = document.getElementById('director');
let movieWriter = document.getElementById('writer');
let movieProduction = document.getElementById('production');
let movieRated = document.getElementById('rated');
let movieReleased = document.getElementById('released');
let articles = document.getElementById('articles');
let searchBar = document.getElementById('search-bar');
let searchBtn = document.getElementById('search-btn');

getIMDBMovie();

// enable enter key for search button
searchBar.addEventListener('keyup', (evt) => {
    if(evt.keyCode === 13) {
        evt.preventDefault();
        searchBtn.click();
    }
});

searchBtn.addEventListener('click', () => {
    // store that searched movie
    sessionStorage.setItem('movieSearched', searchBar.value);
    sessionStorage.setItem('searchBtnMoreInfoClicked', true);
    // return to index.html
    window.location = 'index.html';
});

// get all the movie info
function getIMDBMovie() {
    const ID = sessionStorage.getItem('movieId');
    //console.log(imdbID);
    fetch(`imdbMovie/${ID}`)
    .then(res => res.json())
    .then(data => {
        // fill up movie info data
        movieTitle.textContent = data.Title;
        moviePlot.textContent = data.Plot;
        movieRuntime.textContent = data.Runtime;
        movieGenre.textContent = data.Genre;
        movieCountry.textContent = data.Country;
        movieActors.textContent = data.Actors;
        movieDirector.textContent = data.Director;
        movieWriter.textContent = data.Writer;
        movieProduction.textContent = data.Production;
        movieRated.textContent = data.Rated;
        movieReleased.textContent = data.Released;

        // call functions
        getTrailer(data);
        getArticles(data);
        ratingGraph(data.Ratings);
    })
    .catch(e => console.log(e));
};

// get the movie trailer
function getTrailer(movieData) {
    const movie = movieData;
    fetch(`trailer/${movie.Title}/${movie.Year}`)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        document.querySelector('iframe').src = `https://www.youtube.com/embed/${data.items[0].id.videoId}?enablejsapi=1`
    });
};

//movie critic articles
function getArticles(movieData) {
    let articleString ="";
    fetch(`articles/${movieData.Title}`)
    .then(res => res.json())
    .then(data => {
        // loop through how ever many articles there are
        for(let i = 0; i < data.results.length; ++i) {
            // articles with an image
            if(data.results[i].multimedia != null) {
                articleString +=
                        `
                        <li class="article">
                            <img class="article-image" src="${data.results[i].multimedia.src}"
                             onerror="if (this.src != 'error.jpg') this.src = 'images/movie-review.png'" ;/>
                            <div class="article-text">
                                <h3 class="article-title">${data.results[i].headline}</h3>
                                <p class="article-summary">${data.results[i].summary_short}" </p>
                                <a  class="more-btn" href="${data.results[i].link.url}" target="_blank">Read More</a>
                            </div>
                        </li>
                        `
            // articles without an image (set default image) 
            } else {
                articleString +=
                `
                <li class="article">
                    <img class="article-image" src="movie-review.png" onerror="this.onerror=null"; width="80px" height="80px"/>
                    <div class="article-text">
                        <h3 class="article-title">${data.results[i].headline}</h3>
                        <p class="article-summary">${data.results[i].summary_short}" </p>
                        <a  class="more-btn" href="${data.results[i].link.url}" target="_blank">Read More</a>
                    </div>
                </li>
                ` 
            }
        }
        articles.innerHTML = articleString;
    });
};

// graph of movie ratings
function ratingGraph(ratings) {
    Chart.defaults.global.legend.display = false;
    Chart.defaults.global.defaultFontFamily = 'Comfortaa';
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['IMDB', 'Rotten Tomatoes', 'Metacritic'],
            datasets: [{
                backgroundColor: [
                    'rgba(252, 236, 3, 0.5)',
                    'rgba(230, 80, 80, 0.5)',
                    'rgba(0, 13, 255, 0.5)'
                ],
                borderColor: [
                    'rgba(0, 0, 0, 0.3)',
                    'rgba(0, 0, 0, 0.3)',
                    'rgba(0, 0, 0, 0.3)'
                ],
                hoverBackgroundColor: [
                    'rgba(252, 236, 3, 0.95)',
                    'rgba(245, 66, 66, 0.95)',
                    'rgba(0, 13, 255, 0.95)'
                ],
                hoverBorderWidth: [1.5, 1.5, 1.5],
                data: [],
                //data: [ratings[0].Value.substring(0,3) * 10, ratings[1].Value.substring(0,2), ratings[2].Value.substring(0,2)],
                borderWidth: 1
            }]
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            title: {
                display: true,
                text: 'Movie Rating',
                fontSize: 20
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        maxRotation: 0,
                        minRotation: 0
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        max: 100,
                        callback: (value, index, values) => {
                            return (index % 2) ? "" : value; // show every other y axis label
                        }
                    }
                }]
            }
        }
    });


    // display labels on graph 
    for(let i = 0; i < ratings.length; ++i) {
        if(ratings[i].Source == 'Internet Movie Database') {
            //ratings[i].Source = 'IMDB'; // short form
            myChart.data.datasets[0].data.push(ratings[i].Value.substring(0, 3) * 10);
        } else {
            myChart.data.datasets[0].data.push(ratings[i].Value.substring(0, 2));
        }
        //myChart.data.labels.push(ratings[i].Source); 
        myChart.update();  
    }
};