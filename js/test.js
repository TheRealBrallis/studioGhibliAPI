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
let nav = document.querySelector('#links');
let peopleSection = document.querySelector('#people-section');
let peopleDetails = document.querySelector('#people-details');
let locationSection = document.querySelector('#location-section');
let locationDetail = document.querySelector('#location-details');


//All eventListners
startBtn.addEventListener('click', showContent);
document.getElementById('sgPeople').addEventListener('click', characters);
document.getElementById('sgLocations').addEventListener('click', locations);
sortBy.addEventListener('change', displayMovieSelect);

function showContent() {
    toggleHidden.classList.toggle('hidden');
    nav.classList.toggle('hidden');
    startDiv.className += 'hidden';
    fetchData();
}

let allData; //This is my Data variabel, made it global for easy use.


//Fetching all links from studio ghibli
let movieData = fetch('https://ghibliapi.herokuapp.com/films')
    .then(resp => resp.json());
let peopleData = fetch('https://ghibliapi.herokuapp.com/people')
    .then(resp => resp.json());
let locationData = fetch('https://ghibliapi.herokuapp.com/locations')
    .then(resp => resp.json());

//Fetching the data from all links
let fetchData = async function () {
    try {
        let data = await Promise.all([movieData, peopleData, locationData]);
        allData = data;
        displayMovieSelect();
        movieOptionsTag(allData[0]);
        movieSelect.onchange = () => {
            for (let i = 0; i < allData[0].length; i++) {
                if (allData[0][i].title === movieSelect.value) {
                    selectedMovieDetails(allData[0][i]);
                    return;
                }
            }
        }
        console.log(allData);
        
    }
    catch (message) {
        throw new Error(message);
    }
};



//Creating the sorting system by checking the value of select
function displayMovieSelect() {
    let selectValue = sortBy.value;
    let htmlContent = '';
    switch (selectValue) {
        case 'all':
            //Sorting the data by release year from old - New
            let sortByRelease = allData[0].sort((a, b) => a.release_date - b.release_date);
            for (let movies of sortByRelease) {
                htmlContent += `<section>`;

                htmlContent += '<div class="container">'
                
                htmlContent += `<img src="../img/${movies.id}.jpg" id="image">`;
                

                htmlContent += '<div class="card">';
                htmlContent += `<h1>${movies.title}</h3>`;
                htmlContent += `<p>${movies.description.substring(0, 200)}...</p>`;
                htmlContent += '</div>';
                htmlContent += '</div>';

                htmlContent += `</section>`;

                content.innerHTML = htmlContent;

            }
            selectConMovie.className = 'hidden';
            break;

        case 'release':
            //Sorting the data by release year from new - old
            let sort = allData[0].sort((a, b) => b.release_date - a.release_date);
            for (let movies of sort) {
                htmlContent += `<section>`;

                htmlContent += '<div class="container">'
                htmlContent += '<div class="img-container">';
                htmlContent += `<img src="../img/${movies.id}.jpg" id="image">`;
                htmlContent += '</div>';

                htmlContent += '<div class="card">';
                htmlContent += `<h1>${movies.title}</h3>`;
                htmlContent += `<p>${movies.description.substring(0, 200)}...</p>`;
                htmlContent += `<p><b>Released: </b><i>${movies.release_date}</i></p>`;
                htmlContent += '</div>';
                htmlContent += '</div>';

                htmlContent += `</section>`;

                content.innerHTML = htmlContent;
            }
            selectConMovie.className = 'hidden';
            break;

        case 'director':
            //Sorting by director and placing them in order
            let test = allData[0].sort((a, b) => a.director.localeCompare(b.director, 'or', { sensitivity: 'base' }));
            for (let movies of test) {
                htmlContent += `<section>`;

                htmlContent += '<div class="container">'
                htmlContent += '<div class="img-container">';
                htmlContent += `<img src="../img/${movies.id}.jpg" id="image">`;
                htmlContent += '</div>';

                htmlContent += '<div class="card">';
                htmlContent += `<h1>${movies.title}</h3>`;
                htmlContent += `<p>${movies.description.substring(0, 200)}...</p>`;
                htmlContent += `<p><b>Director: </b><i>${movies.director}</i></p>`;
                htmlContent += '</div>';
                htmlContent += '</div>';

                htmlContent += `</section>`;

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
};

//Displays this when a movie is selected
let selectedMovieDetails = (selectedMovie) => {
    content.innerHTML = '';

    let info = document.createElement('div');
    info.id = 'info';
    let card = document.createElement('div');
    card.className = 'card';
    let title = document.createElement('h1');
    let year = document.createElement('p');
    let desc = document.createElement('p');
    let director = document.createElement('p');
    let producer = document.createElement('p');
    let div = document.createElement('div');

    div.innerHTML = `<img src="../img/${selectedMovie.id}.jpg" id="selected-movie-image">`;
    title.innerText = selectedMovie.title;
    year.innerHTML = '<b>'+'Released: '+'</b>' + '<i>' + selectedMovie.release_date + '</i>';
    desc.innerHTML = '<b>' + 'Description' + '</b>' + '<br>' + '<br>' + selectedMovie.description;
    director.innerHTML = '<b>'+'Director: '+'</b>' + '<i>' + selectedMovie.director + '</i>';
    producer.innerHTML = '<b>'+'Producer: '+'</b>' + '<i>' + selectedMovie.producer + '</i>';

    content.appendChild(info);
    info.appendChild(div);
    info.appendChild(card);
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(year);
    card.appendChild(director);
    card.appendChild(producer);
};

function characters() {
    toggleHidden.innerHTML = '';
    locationSection.className = 'hidden';
    peopleSection.className = '';

    let peopleContainer = document.createElement('div');
    peopleContainer.setAttribute('class', 'people-container');
    peopleDetails.appendChild(peopleContainer);

    for(let character of allData[1]){
        console.log(character);
        let card = document.createElement('div');
        card.setAttribute('class', 'normal-card');
        
        let person = document.createElement('h1');
        person.innerText = character.name;

        let gender = document.createElement('p');
        gender.innerText = `Gender: ${character.gender}`;

        let age = document.createElement('p');
        age.innerText = `Age: ${character.age}`;

        let eyeColor = document.createElement('p');
        eyeColor.innerText = `Eye color: ${character.eye_color}`;

        let hairColor = document.createElement('p');
        hairColor.innerText = `Hair color: ${character.hair_color}`;

        peopleContainer.appendChild(card);
        card.appendChild(person);
        card.appendChild(gender);
        card.appendChild(age);
        card.appendChild(eyeColor);
        card.appendChild(hairColor);
    }
}

function locations() {
    toggleHidden.innerHTML = '';
    locationSection.className = '';
    peopleSection.className = 'hidden';

    let peopleContainer = document.createElement('div');
    peopleContainer.setAttribute('class', 'people-container');
    locationDetail.appendChild(peopleContainer);

    for(let location of allData[2]){
        let card = document.createElement('div');
        card.setAttribute('class', 'normal-card');
        
        let locations = document.createElement('h1');
        locations.innerText = location.name;

        let climate = document.createElement('p');
        climate.innerText = `Climate: ${location.climate}`;

        let terrain = document.createElement('p');
        terrain.innerText = `Terrain: ${location.terrain}`;

        let water = document.createElement('p');
        water.innerText = `Surface water: ${location.surface_water}`;


        peopleContainer.appendChild(card);
        card.appendChild(locations);
        card.appendChild(climate);
        card.appendChild(terrain);
        card.appendChild(water);
    }
}