document.addEventListener("DOMContentLoaded", function () {
    const filmDetailsContainer = document.getElementById('film-details');
    const filmsMenu = document.getElementById('films');

    // Fetch all films
    fetch('http://localhost:3000/films')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch films');
            }
            return response.json();
        })
        .then(films => {
            // Populate films menu
            populateFilmsMenu(films);
        })
        .catch(error => console.error('Error fetching films:', error));

    // Function to populate films menu
    function populateFilmsMenu(films) {
        films.forEach(film => {
            const li = document.createElement('li');
            li.classList.add('film', 'item');
            li.textContent = film.title;
            li.dataset.filmId = film.id; // Set data attribute for film ID

            // Add event listener to film name
            li.addEventListener('click', function () {
                fetchFilmDetails(film.id); // Fetch film details by ID
            });

            // Add delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function (event) {
                event.stopPropagation(); // Prevent the click event from propagating to the film li
                deleteFilm(film.id, li);
            });

            li.appendChild(deleteButton);
            filmsMenu.appendChild(li);
        });
    }

    // Function to delete a film
    function deleteFilm(filmId, listItem) {
        fetch(`http://localhost:3000/films/${filmId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete film');
                }
                listItem.remove();
                clearFilmDetails(); // Clear film details after deletion
            })
            .catch(error => console.error('Error deleting film:', error));
    }

    // Function to fetch film details by ID
    function fetchFilmDetails(filmId) {
        fetch(`http://localhost:3000/films/${filmId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch film details');
                }
                return response.json();
            })
            .then(film => {
                // Populate film details
                populateFilmDetails(film);
            })
            .catch(error => console.error('Error fetching film details:', error));
    }

    // Function to populate film details
    function populateFilmDetails(film) {
        const posterElement = document.getElementById('poster');
        const titleElement = document.getElementById('title');
        const runtimeElement = document.getElementById('runtime');
        const showtimeElement = document.getElementById('showtime');
        const availableTicketsElement = document.getElementById('available-tickets');
        const descriptionElement = document.getElementById('description');
        const buyTicketButton = document.getElementById('buy-ticket');

        posterElement.src = film.poster;
        titleElement.textContent = film.title;
        runtimeElement.textContent = `${film.runtime} mins`;
        showtimeElement.textContent = film.showtime;

        // Check if description is available
        if (film.description) {
            descriptionElement.textContent = film.description;
        } else {
            descriptionElement.textContent = 'No description available.';
        }

        // Update available tickets
        availableTicketsElement.textContent = film.available_tickets; // Assuming the response has this field

        // Update buy ticket button text and disable if sold out
        if (film.available_tickets === 0) {
            buyTicketButton.textContent = 'Sold Out';
            buyTicketButton.disabled = true;
        } else {
            buyTicketButton.textContent = 'Buy Ticket';
            buyTicketButton.disabled = false;
        }

        // Remove existing event listeners from buy ticket button
        buyTicketButton.removeEventListener('click', buyTicket);

        // Add event listener to buy ticket button
        buyTicketButton.addEventListener('click', function () {
            buyTicket(film.id);
        });
    }

    // Function to clear film details
    function clearFilmDetails() {
        const posterElement = document.getElementById('poster');
        const titleElement = document.getElementById('title');
        const runtimeElement = document.getElementById('runtime');
        const showtimeElement = document.getElementById('showtime');
        const availableTicketsElement = document.getElementById('available-tickets');
        const descriptionElement = document.getElementById('description');
        const buyTicketButton = document.getElementById('buy-ticket');

        posterElement.src = '';
        titleElement.textContent = '';
        runtimeElement.textContent = '';
        showtimeElement.textContent = '';
        availableTicketsElement.textContent = '';
        descriptionElement.textContent = '';
        buyTicketButton.textContent = 'Sold Out';
        buyTicketButton.disabled = true;
    }

    // Function to buy a ticket
    function buyTicket(filmId) {
        fetch(`http://localhost:3000/films/${filmId}/buy-ticket`, {
            method: 'POST'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to buy ticket');
                }
                return response.json();
            })
            .then(updatedFilm => {
                // Update film details after buying ticket
                populateFilmDetails(updatedFilm);
            })
            .catch(error => console.error('Error buying ticket:', error));
    }
});