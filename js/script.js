// js/script.js - Kompletna wersja

document.addEventListener('DOMContentLoaded', () => {
    // Sprawdza, czy element formularza flightSearchForm istnieje na stronie
    const flightSearchForm = document.getElementById('flightSearchForm');

    if (flightSearchForm) {
        flightSearchForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Zapobiega domyślnej wysyłce formularza

            // Zbieranie danych z pól formularza
            const departure = document.getElementById('departure').value;
            const destination = document.getElementById('destination').value;
            const date = document.getElementById('date').value;
            const passengers = document.getElementById('passengers').value;
            const travelClass = document.getElementById('travelClass').value;

            // Tworzenie obiektu z zebranymi danymi wyszukiwania
            const searchParams = {
                departure: departure,
                destination: destination,
                date: date,
                passengers: passengers,
                travelClass: travelClass
            };

            // Zapisywanie obiektu searchParams w Local Storage
            localStorage.setItem('flightSearchParams', JSON.stringify(searchParams));

            // Przekierowanie użytkownika do strony z wynikami lotów
            window.location.href = 'results.html';
        });
    }

    // Dodatkowa funkcja: blokowanie wyboru przeszłych dat w polu 'Data wylotu'
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const minDate = `${year}-${month}-${day}`;
        dateInput.setAttribute('min', minDate);
    }
});
