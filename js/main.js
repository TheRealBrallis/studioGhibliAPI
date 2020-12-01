let startBtn = document.querySelector('#start');
let content = document.querySelector('#movie-details');
let startDiv = document.querySelector('#startDiv');
let toggleHidden = document.querySelector('#content-container');
let images = document.querySelector('.image');
let movieSelect = document.querySelector('#select-movie');
let peopleSelect = document.querySelector('#select-people');
let sortBy = document.querySelector('#sort');
let selectConMovie = document.querySelector('#movie');
let img = document.querySelector('#movie-details .image');

startBtn.addEventListener('click', showContent);

function showContent() {
    toggleHidden.classList.toggle('hidden');
    startDiv.className += 'hidden';
}

//This is the data variabel
//Its a global variabel because i want to
//use it in my functions
let allMovieData; 

let allPersonData;


//Just trying out the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', async () => {
    await fetchMovieData();
    await movieOptionsTag(allMovieData);
    movieSelect.onchange = () => {
        for (let i = 0; i < allMovieData.length; i++) {
            if (allMovieData[i].title === movieSelect.value) {
                selectedMovieDetails(allMovieData[i]);
                return;
            }
        }
    }
})


//Fetching the data from studio ghibli
let fetchMovieData = async () => {
    await fetch('https://ghibliapi.herokuapp.com/films')
        .then(response => response.json())
        .then(data => {
            allMovieData = data;
            console.log(allMovieData);
            let htmlContent = '';
            for (let movies of allMovieData) {
                htmlContent += `<a href="#"><section>`;

                htmlContent += '<div class="movie-con">'
                htmlContent += '<div class="img-container">';
                htmlContent += `<img src="../img/${movies.id}.jpg">`;
                htmlContent += '</div>';

                htmlContent += '<div class="desc-container">';
                htmlContent += `<h3>${movies.title}</h3>`;
                htmlContent += `<b>Movie description</b>`;
                htmlContent += `<p>${movies.description}</p>`;
                htmlContent += '</div>';
                htmlContent += '</div>';

                htmlContent += `</section></a>`;

                content.innerHTML = htmlContent;
            }
        });

}

let fetchPersonData = async () => {
    await fetch('https://ghibliapi.herokuapp.com/people')
    .then(response => response.json())
    .then(data => {
        allPersonData = data;
        console.log(allPersonData);
        let testContent = '';
        for(let testPeople of allPersonData){
            testContent += testPeople.name;

            content.innerHTML = testContent;
        }
    });
}

//Creating the sorting system by checking the value of select
let displayMovieSelect = () => {
    let selectValue = sortBy.value;
    let htmlContent = '';
    switch (selectValue) {
        case 'all':
            //Sorting the data by release year from old - New
            let sortByRelease = allMovieData.sort((a, b) => a.release_date - b.release_date);
            for (let movies of sortByRelease) {
                htmlContent += `<a href="#"><section>`;

                htmlContent += '<div class="movie-con">'
                htmlContent += '<div class="img-container">';
                htmlContent += `<img src="../img/${movies.id}.jpg">`;
                htmlContent += '</div>';

                htmlContent += '<div class="desc-container">';
                htmlContent += `<h3>${movies.title}</h3>`;
                htmlContent += `<b>Movie description</b>`;
                htmlContent += `<p>${movies.description}</p>`;
                htmlContent += '</div>';
                htmlContent += '</div>';

                htmlContent += `</section></a>`;

                content.innerHTML = htmlContent;
            }
            selectConMovie.className = 'hidden';
            break;

        case 'release':
            //Sorting the data by release year from new - old
            let sort = allMovieData.sort((a, b) => b.release_date - a.release_date);
            for (let movies of sort) {
                htmlContent += `<a href="#"><section>`;

                htmlContent += '<div class="movie-con">'
                htmlContent += '<div class="img-container">';
                htmlContent += `<img src="../img/${movies.id}.jpg">`;
                htmlContent += '</div>';

                htmlContent += '<div class="desc-container">';
                htmlContent += `<h3>${movies.title}</h3>`;
                htmlContent += `<i>Release Year : ${movies.release_date}</i>`;
                htmlContent += `<p>${movies.description}</p>`;
                htmlContent += '</div>';
                htmlContent += '</div>';

                htmlContent += `</section></a>`;

                content.innerHTML = htmlContent;
            }
            selectConMovie.className = 'hidden';
            break;

        case 'director':
            //Sorting by director and placing them in order
            let test = allMovieData.sort((a, b) => a.director.localeCompare(b.director, 'or', { sensitivity: 'base' }));
            for (let movies of test) {
                htmlContent += `<a href="#"><section>`;

                htmlContent += '<div class="movie-con">'
                htmlContent += '<div class="img-container">';
                htmlContent += `<img src="../img/${movies.id}.jpg">`;
                htmlContent += '</div>';

                htmlContent += '<div class="desc-container">';
                htmlContent += `<h3>${movies.title}</h3>`;
                htmlContent += `<i>Director : ${movies.director}</i>`;
                htmlContent += `<p>${movies.description}</p>`;
                htmlContent += '</div>';
                htmlContent += '</div>';

                htmlContent += `</section></a>`;

                content.innerHTML = htmlContent;
            }
            selectConMovie.className = 'hidden';
            break;

        case 'movie':
            content.innerHTML = '';
            selectConMovie.className = 'active';
            break;
    }
}

//Creates option for selection field for all movies
let movieOptionsTag = (movieObj) => {
    for (let i = 0; i < movieObj.length; i++) {
        let optionTag = document.createElement('option');
        optionTag.value = movieObj[i].title;
        optionTag.innerText = movieObj[i].title;
        movieSelect.appendChild(optionTag);
    }
}

//Displays this when a movie is selected
let selectedMovieDetails = (selectedMovie) => {
    fetchPersonData();
    content.innerHTML = '';

    let title = document.createElement('h3');
    let year = document.createElement('p');
    let desc = document.createElement('p');
    let characters = document.createElement('p');
    let div = document.createElement('div');

    div.innerHTML = `<img src="../img/${selectedMovie.id}.jpg">`;
    title.innerText = selectedMovie.title;
    year.innerText = 'Released:' + selectedMovie.release_date;
    desc.innerText = selectedMovie.description;
    console.log(selectedMovie.people);

    content.appendChild(div);
    content.appendChild(title);
    content.appendChild(year);
    content.appendChild(desc);
    content.appendChild(characters);
}
sortBy.addEventListener('change', displayMovieSelect);