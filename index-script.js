let movieList = document.getElementById('movie-list');
let searchBtn = document.getElementById('search-btn');
let nextBtn = document.getElementById('next-btn');
let prevBtn = document.getElementById('prev-btn');
let searchBar = document.getElementById('search-bar');

// enable enter key for searching
searchBar.addEventListener('keyup', (evt) => {
    if(evt.keyCode === 13) {
        evt.preventDefault();
        searchBtn.click();
    }
});

// search button pressed
searchBtn.addEventListener('click', () => {
    // reset page number
    sessionStorage.setItem('pageNum', 1);
    // save the move searched into session storage (for back button)
    sessionStorage.setItem('movieSearched', searchBar.value);
    searchBar.value = '';
    movieResults();
});

// next pagination
nextBtn.addEventListener('click', () => {
    // increase pageNum in session storage
    sessionStorage.setItem('pageNum', parseInt(sessionStorage.getItem('pageNum'), 10) + 1);
    movieResults();
});

// prev pagination
prevBtn.addEventListener('click', () => {
    // descrease pageNum in session storage
    sessionStorage.setItem('pageNum', parseInt(sessionStorage.getItem('pageNum'), 10) - 1);
    movieResults();
});

function movieResults() {
    let pageNum = sessionStorage.getItem('pageNum');
    let movieName = sessionStorage.getItem('movieSearched');    
    // disable the prevBtn if there is no previous
    if(pageNum == 1) {
        prevBtn.disabled = true;
    } else {
        prevBtn.disabled = false;
    }
    // call OMDB api
    fetch(`http://www.omdbapi.com/?s=${movieName}}&page=${pageNum}&apikey=53e9cf7d`)
    .then(res => res.json())
    .then(data => {
        // no more results a movie
        if(data.Search === undefined) {
            if(pageNum > 1) { //for the case when the total results is divisble by 10
                sessionStorage.setItem('pageNum', parseInt(sessionStorage.getItem('pageNum')) - 1); // undo the pageNum++
            }
            // clear screen
            document.getElementById('movie-cards').hidden = true;
            nextBtn.disabled = true;
            prevBtn.disabled = true;
            alert('No results found for ' + movieName);
        } else { // still more results
            document.getElementById('movie-cards').hidden = false; // show cards again
            if(data.Search.length === 10) {
                nextBtn.disabled = false;
            } else { // less than 10 movies show up, disable next btn
                nextBtn.disabled = true;
            }
            displayMovies(data.Search);
        }         
    })
    .catch(e => console.log(e));
};

function displayMovies(movies) {
    // make a card for each movie
    const movieString = movies.map(movie => 
        `
        <li class="movie-card">
            <img class="movie-poster" src="${movie.Poster}" onerror="this.onerror=null;this.src='images/default-poster.jpg';" />
            <p class="movie-title">${movie.Title}: ${movie.Year}</p>
            <div class="btn-container">
                <a onclick="movieSelected('${movie.imdbID}')" class="more-btn" href="#">More Info</a>
            </div>
        </li>
        ` 
    ).join('');
    movieList.innerHTML = movieString;
};

// more info button pressed
function movieSelected(imdbID) {
    // store the imdbID into session storage
    sessionStorage.setItem('movieId', imdbID);
    window.location = 'more-info.html';
    return false;
}

// check the session storage when ever entering the page
function checkStorage() {
    let movieName = sessionStorage.getItem('movieSearched');
    // movie name in storage(means search button was hit from the more-info page)
    if(movieName != null) {
        // new search occured to get back to index
        if(sessionStorage.getItem('searchBtnMoreInfoClicked') == 'true') {
            sessionStorage.setItem('pageNum', 1);
            sessionStorage.setItem('searchBtnMoreInfoClicked', false);
        }
        movieResults();
    }
}

checkStorage();


