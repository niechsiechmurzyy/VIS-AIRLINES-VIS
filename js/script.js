// script.js

document.addEventListener('DOMContentLoaded', () => {
    const flightSearchForm = document.getElementById('flightSearchForm');

    if (flightSearchForm) {
        flightSearchForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Zapobiega domyślnej wysyłce formularza

            // Zbieranie danych z formularza
            const departure = document.getElementById('departure').value;
            const destination = document.getElementById('destination').value;
            const date = document.getElementById('date').value;
            const passengers = document.getElementById('passengers').value;
            const travelClass = document.getElementById('travelClass').value;

            // Tworzenie obiektu z danymi wyszukiwania
            const searchParams = {
                departure: departure,
                destination: destination,
                date: date,
                passengers: passengers,
                travelClass: travelClass
            };

            // Zapisywanie danych wyszukiwania w Local Storage, aby były dostępne na następnej stronie
            localStorage.setItem('flightSearchParams', JSON.stringify(searchParams));

            // Przekierowanie do strony z wynikami lotów
            window.location.href = 'results.html';
        });
    }
});
