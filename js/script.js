// js/script.js

document.addEventListener('DOMContentLoaded', () => {
    const flightSearchForm = document.getElementById('flightSearchForm');

    if (flightSearchForm) {
        flightSearchForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Zatrzymaj domyślne zachowanie formularza

            const departure = document.getElementById('departure').value.toUpperCase();
            const destination = document.getElementById('destination').value.toUpperCase();
            const depDate = document.getElementById('depDate').value; // Format rrrr-mm-dd
            const retDate = document.getElementById('retDate').value; // Format rrrr-mm-dd (może być puste)
            const adults = document.getElementById('adults').value;
            const children = document.getElementById('children').value;
            const infants = document.getElementById('infants').value;
            const travelClass = document.getElementById('travelClass').value;

            // Walidacja daty wylotu
            if (!depDate) {
                alert('Proszę wybrać datę wylotu.');
                return;
            }

            // Tworzenie obiektu URLSearchParams do przekazania parametrów
            const params = new URLSearchParams();
            params.append('departure', departure);
            params.append('destination', destination);
            // Konwersja dat na format DD.MM.RRRR
            params.append('depDate', convertDateToDDMMYYYY(depDate));
            if (retDate) {
                params.append('retDate', convertDateToDDMMYYYY(retDate));
            }
            params.append('adults', adults);
            params.append('children', children);
            params.append('infants', infants);
            params.append('class', travelClass);

            // Przekierowanie do strony wyników z parametrami w URL
            window.location.href = `results.html?${params.toString()}`;
        });
    }

    // Funkcja pomocnicza do konwersji daty z RRRR-MM-DD na DD.MM.RRRR
    function convertDateToDDMMYYYY(dateString) {
        if (!dateString) return '';
        const parts = dateString.split('-'); // ["RRRR", "MM", "DD"]
        return `${parts[2]}.${parts[1]}.${parts[0]}`; // "DD.MM.RRRR"
    }

    // Funkcja do inicjalizacji daty min/max dla inputów type="date"
    function setupDateInputs() {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Miesiąc jest 0-indexed
        const dd = String(today.getDate()).padStart(2, '0');
        const minDate = `${yyyy}-${mm}-${dd}`;

        const depDateInput = document.getElementById('depDate');
        const retDateInput = document.getElementById('retDate');

        if (depDateInput) {
            depDateInput.min = minDate;
        }
        if (retDateInput) {
            retDateInput.min = minDate;
        }

        // Dodaj listener, aby data powrotu była zawsze >= data wylotu
        if (depDateInput && retDateInput) {
            depDateInput.addEventListener('change', () => {
                retDateInput.min = depDateInput.value;
                if (retDateInput.value < depDateInput.value) {
                    retDateInput.value = depDateInput.value;
                }
            });
        }
    }

    setupDateInputs();
});
