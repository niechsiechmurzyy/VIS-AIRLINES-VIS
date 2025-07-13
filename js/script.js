document.addEventListener('DOMContentLoaded', function() {
    // --- Elementy DOM dla formularza głównego ---
    const flightSearchForm = document.getElementById('flightSearchForm');
    const departureCitySelect = document.getElementById('departureCity');
    const arrivalCitySelect = document.getElementById('arrivalCity');
    const departureDateInput = document.getElementById('departureDate');
    const returnDateInput = document.getElementById('returnDate');

    const classPassengersBtn = document.getElementById('classPassengersBtn');
    const selectedClassSpan = document.getElementById('selectedClass');
    const selectedPassengersSpan = document.getElementById('selectedPassengers');

    // --- Elementy DOM dla modala klasy/pasażerów ---
    const classPassengersModal = document.getElementById('classPassengersModal');
    const closeModalBtn = classPassengersModal.querySelector('.close-button');
    const classOptions = classPassengersModal.querySelectorAll('.class-option');
    const confirmPassengersBtn = document.getElementById('confirmPassengersBtn');

    const adultsInput = document.getElementById('adults');
    const teenagersInput = document.getElementById('teenagers');
    const childrenInput = document.getElementById('children');
    const infantsSeatInput = document.getElementById('infantsSeat');
    const infantsLapInput = document.getElementById('infantsLap');

    // --- Zmienne globalne do przechowywania stanu ---
    let currentSelectedClass = "Economy";
    let currentAdults = 1;
    let currentTeenagers = 0;
    let currentChildren = 0;
    let currentInfantsSeat = 0;
    let currentInfantsLap = 0;

    // --- Funkcje pomocnicze ---

    // Funkcja do aktualizacji wyświetlanej liczby pasażerów i klasy
    function updatePassengersAndClassDisplay() {
        const totalPassengers = currentAdults + currentTeenagers + currentChildren + currentInfantsSeat + currentInfantsLap;
        selectedClassSpan.textContent = `LOT ${currentSelectedClass} Class`;

        let passengersText = `${totalPassengers} pasażer`;
        if (totalPassengers > 1 && totalPassengers < 5) {
            passengersText = `${totalPassengers} pasażerów`;
        } else if (totalPassengers >= 5 || totalPassengers === 0) { // Dla 0 i od 5 w górę, użyj "pasażerów"
             passengersText = `${totalPassengers} pasażerów`;
        }
        selectedPassengersSpan.textContent = passengersText;
    }

    // Funkcja do otwierania modala
    function openModal(modalElement) {
        modalElement.style.display = 'flex'; // Używamy flexbox do centrowania
    }

    // Funkcja do zamykania modala
    function closeModal(modalElement) {
        modalElement.style.display = 'none';
    }

    // Funkcja do ustawiania minimalnej daty w polu input type="date"
    function setMinDate(inputElement) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Miesiące są od 0-11
        const day = String(today.getDate()).padStart(2, '0');
        inputElement.min = `${year}-${month}-${day}`;
    }

    // Funkcja do formatowania daty na DD.MM.RRRR
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString); // dateString w formacie YYYY-MM-DD
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

    // --- Inicjalizacja ---

    // Ustawienie minimalnej daty dla pól daty
    setMinDate(departureDateInput);
    setMinDate(returnDateInput);

    // Initial display update
    updatePassengersAndClassDisplay();

    // --- Event Listenery ---

    // Otwieranie modala klasy/pasażerów
    classPassengersBtn.addEventListener('click', () => {
        // Ustawiamy wartości inputów w modal na aktualny stan
        adultsInput.value = currentAdults;
        teenagersInput.value = currentTeenagers;
        childrenInput.value = currentChildren;
        infantsSeatInput.value = currentInfantsSeat;
        infantsLapInput.value = currentInfantsLap;

        // Ustawiamy zaznaczoną klasę
        classOptions.forEach(btn => {
            if (btn.dataset.class === currentSelectedClass) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });

        openModal(classPassengersModal);
    });

    // Zamykanie modala klasy/pasażerów
    closeModalBtn.addEventListener('click', () => {
        closeModal(classPassengersModal);
    });

    // Wybór klasy podróży w modal
    classOptions.forEach(button => {
        button.addEventListener('click', () => {
            classOptions.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            currentSelectedClass = button.dataset.class;
        });
    });

    // Zmiana liczby pasażerów w modal
    classPassengersModal.querySelectorAll('.quantity-control button').forEach(button => {
        button.addEventListener('click', (event) => {
            const input = event.target.closest('.quantity-control').querySelector('input');
            let value = parseInt(input.value);
            const type = input.dataset.type;

            if (event.target.classList.contains('minus-btn')) {
                value = Math.max(input.min, value - 1);
            } else {
                value = value + 1;
            }
            input.value = value;

            // Aktualizacja zmiennych globalnych
            switch (type) {
                case 'adults': currentAdults = value; break;
                case 'teenagers': currentTeenagers = value; break;
                case 'children': currentChildren = value; break;
                case 'infantsSeat': currentInfantsSeat = value; break;
                case 'infantsLap': currentInfantsLap = value; break;
            }

            // Logika ograniczenia niemowląt na kolanach do liczby dorosłych
            if (type === 'adults' || type === 'infantsLap') {
                if (currentInfantsLap > currentAdults) {
                    currentInfantsLap = currentAdults;
                    infantsLapInput.value = currentInfantsLap;
                }
            }
        });
    });

    // Potwierdzenie wyboru pasażerów i klasy
    confirmPassengersBtn.addEventListener('click', () => {
        updatePassengersAndClassDisplay();
        closeModal(classPassengersModal);
    });

    // Zamykanie modala po kliknięciu poza nim
    window.addEventListener('click', (event) => {
        if (event.target === classPassengersModal) {
            closeModal(classPassengersModal);
        }
    });

    // Walidacja dat: data powrotu nie może być wcześniejsza niż data wylotu
    departureDateInput.addEventListener('change', () => {
        returnDateInput.min = departureDateInput.value;
        if (returnDateInput.value && returnDateInput.value < departureDateInput.value) {
            returnDateInput.value = departureDateInput.value;
        }
    });

    // Obsługa formularza wyszukiwania lotów
    flightSearchForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Zapobiega domyślnej wysyłce formularza

        const fromCity = departureCitySelect.value;
        const toCity = arrivalCitySelect.value;
        const dateFrom = departureDateInput.value;
        const dateTo = returnDateInput.value; // Może być puste

        // Formatowanie dat na DD.MM.RRRR
        const formattedDateFrom = formatDate(dateFrom);
        const formattedDateTo = dateTo ? formatDate(dateTo) : '';

        // Sprawdź, czy miasto wylotu i przylotu nie są takie same
        if (fromCity === toCity) {
            alert('Miasto wylotu i miasto przylotu nie mogą być takie same!');
            return; // Zakończ funkcję, nie przekierowuj
        }

        // Tworzenie URL z parametrami
        const queryParams = new URLSearchParams();
        queryParams.append('from', fromCity);
        queryParams.append('to', toCity);
        queryParams.append('date_from', formattedDateFrom);
        if (formattedDateTo) {
            queryParams.append('date_to', formattedDateTo);
        }
        queryParams.append('class', currentSelectedClass);
        queryParams.append('adults', currentAdults);
        queryParams.append('teenagers', currentTeenagers);
        queryParams.append('children', currentChildren);
        queryParams.append('infantsSeat', currentInfantsSeat);
        queryParams.append('infantsLap', currentInfantsLap);

        // Przekierowanie do flights.html z parametrami
        window.location.href = `flights.html?${queryParams.toString()}`;
    });
});
