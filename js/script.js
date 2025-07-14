// js/script.js

document.addEventListener('DOMContentLoaded', () => {
    // Sprawdza, czy element formularza flightSearchForm istnieje na stronie
    // (jest to ważne, bo ten skrypt będzie dołączany do każdej strony)
    const flightSearchForm = document.getElementById('flightSearchForm');

    if (flightSearchForm) {
        flightSearchForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Zapobiega domyślnej wysyłce formularza (przeładowaniu strony)

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
            // Local Storage pozwala przechowywać dane w przeglądarce użytkownika
            // i są one dostępne na innych stronach (w tej samej domenie).
            // Musimy przekształcić obiekt JavaScript na string JSON.
            localStorage.setItem('flightSearchParams', JSON.stringify(searchParams));

            // Przekierowanie użytkownika do strony z wynikami lotów
            window.location.href = 'results.html';
        });
    }

    // Dodatkowa funkcja: blokowanie wyboru przeszłych dat w polu 'Data wylotu'
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date();
        // Formatowanie daty do YYYY-MM-DD, aby pasowało do input type="date"
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Miesiące są od 0-11
        const day = String(today.getDate()).padStart(2, '0');
        const minDate = `${year}-${month}-${day}`;
        dateInput.setAttribute('min', minDate);
    }
});
