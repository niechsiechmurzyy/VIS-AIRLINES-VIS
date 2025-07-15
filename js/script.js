// js/script.js - Kalendarz i wybór pasażerów/klasy (POPRAWIONY KALENDARZ i OTWORY MODALI)

document.addEventListener('DOMContentLoaded', () => {
    const flightSearchForm = document.getElementById('flightSearchForm');

    // --- Dane o lotniskach (z poprzedniego etapu) ---
    const airports = {
        poland: [
            { code: 'WAW', name: 'Warszawa Chopin', city: 'Warszawa' },
            { code: 'KRK', name: 'Kraków Balice', city: 'Kraków' },
            { code: 'GDN', name: 'Gdańsk Rębiechowo', city: 'Gdańsk' },
            { code: 'KTW', name: 'Katowice Pyrzowice', city: 'Katowice' },
            { code: 'WRO', name: 'Wrocław Strachowice', city: 'Wrocław' },
            { code: 'POZ', name: 'Poznań Ławica', city: 'Poznań' },
            { code: 'RZE', name: 'Rzeszów Jasionka', city: 'Rzeszów' },
            { code: 'SZZ', name: 'Szczecin Goleniów', city: 'Szczecin' },
            { code: 'LUZ', name: 'Lublin Świdnik', city: 'Lublin' },
            { code: 'BZG', name: 'Bydgoszcz Szwederowo', city: 'Bydgoszcz' },
            { code: 'LCJ', name: 'Łódź im. Władysława Reymonta', city: 'Łódź' },
            { code: 'SZY', name: 'Olsztyn-Mazury', city: 'Szymany (Olsztyn)' },
            { code: 'IEG', name: 'Zielona Góra Babimost', city: 'Zielona Góra' }
        ],
        germany: [
            { code: 'BER', name: 'Berlin Brandenburg', city: 'Berlin' },
            { code: 'FRA', name: 'Frankfurt nad Menem', city: 'Frankfurt' },
            { code: 'MUC', name: 'Monachium', city: 'Monachium' },
            { code: 'DUS', name: 'Düsseldorf', city: 'Düsseldorf' },
            { code: 'HAM', name: 'Hamburg', city: 'Hamburg' },
            { code: 'STR', name: 'Stuttgart', city: 'Stuttgart' },
            { code: 'CGN', name: 'Kolonia/Bonn', city: 'Kolonia' }
        ],
        france: [
            { code: 'CDG', name: 'Paryż-Charles de Gaulle', city: 'Paryż' },
            { code: 'ORY', name: 'Paryż-Orly', city: 'Paryż' },
            { code: 'NCE', name: 'Nicea Lazurowe Wybrzeże', city: 'Nicea' },
            { code: 'LYS', name: 'Lyon-Saint Exupéry', city: 'Lyon' },
            { code: 'MRS', name: 'Marsylia Prowansja', city: 'Marsylia' },
            { code: 'TLS', name: 'Tuluza Blagnac', city: 'Tuluza' },
            { code: 'BOD', name: 'Bordeaux–Mérignac', city: 'Bordeaux' }
        ]
    };

    // --- Elementy modali ogólne ---
    const modalOverlay = document.getElementById('modalOverlay');

    // Funkcja otwierająca modal
    function openModal(modalElement) {
        modalElement.classList.add('show');
        modalOverlay.classList.add('show');
        document.body.style.overflow = 'hidden'; // Zablokuj scrollowanie tła
    }

    // Funkcja zamykająca modal
    function closeModal(modalElement) {
        modalElement.classList.remove('show');
        modalOverlay.classList.remove('show');
        document.body.style.overflow = ''; // Przywróć scrollowanie tła
    }

    // --- Obsługa modala wyboru lotnisk (bez zmian, tylko przeniesiono do funkcji) ---
    const airportSelectionModal = document.getElementById('airportSelectionModal');
    const closeAirportModalButton = airportSelectionModal.querySelector('.close-button');
    const departureInput = document.getElementById('departure');
    const destinationInput = document.getElementById('destination');
    const polishAirportList = document.getElementById('polishAirportList');
    const germanAirportList = document.getElementById('germanAirportList');
    const frenchAirportList = document.getElementById('frenchAirportList');

    let currentAirportInput = null;

    function populateAirportList(countryCode) {
        let targetListElement;
        let airportsToDisplay;

        if (countryCode === 'poland') {
            targetListElement = polishAirportList;
            airportsToDisplay = airports.poland;
        } else if (countryCode === 'germany') {
            targetListElement = germanAirportList;
            airportsToDisplay = airports.germany;
        } else if (countryCode === 'france') {
            targetListElement = frenchAirportList;
            airportsToDisplay = airports.france;
        } else {
            console.error("Nieznany kod kraju dla lotnisk: ", countryCode);
            return;
        }

        targetListElement.innerHTML = '';
        airportsToDisplay.forEach(airport => {
            const li = document.createElement('li');
            li.textContent = `${airport.city} (${airport.code}) - ${airport.name}`;
            li.dataset.airportCode = airport.code;
            li.dataset.airportName = airport.name;
            li.dataset.airportCity = airport.city;
            targetListElement.appendChild(li);
        });
    }

    if (departureInput) {
        departureInput.addEventListener('click', () => {
            currentAirportInput = departureInput;
            populateAirportList('poland');
            populateAirportList('germany');
            populateAirportList('france');
            openModal(airportSelectionModal);
        });
    }
    if (destinationInput) {
        destinationInput.addEventListener('click', () => {
            currentAirportInput = destinationInput;
            populateAirportList('poland');
            populateAirportList('germany');
            populateAirportList('france');
            openModal(airportSelectionModal);
        });
    }

    if (closeAirportModalButton) {
        closeAirportModalButton.addEventListener('click', () => closeModal(airportSelectionModal));
    }
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (event) => {
            // Zamykaj tylko jeśli kliknięto na overlay, a nie na zawartość modala
            if (event.target === modalOverlay) {
                // Sprawdź, który modal jest otwarty i zamknij go
                if (airportSelectionModal.classList.contains('show')) {
                    closeModal(airportSelectionModal);
                }
                if (datePickerModal.classList.contains('show')) {
                    closeModal(datePickerModal);
                }
                if (passengersClassModal.classList.contains('show')) {
                    closeModal(passengersClassModal);
                }
            }
        });
    }

    if (airportSelectionModal) {
        airportSelectionModal.addEventListener('click', (event) => {
            const selectedLi = event.target.closest('li.airport-list > li');
            if (selectedLi && currentAirportInput) {
                const airportText = selectedLi.textContent;
                currentAirportInput.value = airportText;
                closeModal(airportSelectionModal);
                currentAirportInput = null;
            }
        });
    }


    // --- Obsługa niestandardowego kalendarza ---
    const datePickerModal = document.getElementById('datePickerModal');
    const closeDatePickerBtn = datePickerModal.querySelector('.close-button');
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    const nextMonthBtn = document.getElementById('nextMonthBtn');
    const monthYearDisplay = document.getElementById('monthYearDisplay');
    const datepickerDays = document.getElementById('datepickerDays');
    const departureDateInput = document.getElementById('departureDate');
    const returnDateInput = document.getElementById('returnDate');
    const displayDepartureDate = document.getElementById('displayDepartureDate');
    const displayReturnDate = document.getElementById('displayReturnDate');
    const clearReturnDateBtn = document.getElementById('clearReturnDateBtn');
    const confirmDatesBtn = document.getElementById('confirmDatesBtn');

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let selectedDepartureDate = null;
    let selectedReturnDate = null;

    // Pomocnicza funkcja do tworzenia daty bez problemów ze strefą czasową
    function createDateKey(year, month, day) {
        // Tworzy datę w formacie 'YYYY-MM-DD'
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    // Pomocnicza funkcja do konwersji 'YYYY-MM-DD' na obiekt Date (północ UTC)
    function parseDateKeyToDate(dateKey) {
        if (!dateKey) return null;
        const [year, month, day] = dateKey.split('-').map(Number);
        return new Date(Date.UTC(year, month - 1, day));
    }

    // Referencje do daty dzisiejszej i rok do przodu (w UTC, aby uniknąć problemów)
    const today = new Date(); // Używamy lokalnego obiektu Date do pobrania bieżącej daty
    const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
    const oneYearFromNow = new Date(); // Używamy lokalnego obiektu Date do obliczenia roku do przodu
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    const oneYearFromNowUTC = new Date(Date.UTC(oneYearFromNow.getFullYear(), oneYearFromNow.getMonth(), oneYearFromNow.getDate()));

    const monthNames = [
        "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
        "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
    ];

    function renderCalendar() {
        datepickerDays.innerHTML = ''; // Wyczyść poprzednie dni
        monthYearDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;

        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Niedziela, 1 = Poniedziałek

        // Dodaj puste dni dla wyrównania do początku tygodnia
        for (let i = 0; i < startDayOfWeek; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('empty-day');
            datepickerDays.appendChild(emptyDiv);
        }

        // Dodaj dni miesiąca
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = day;
            dayDiv.classList.add('calendar-day');

            // Tworzymy datę w UTC dla porównań
            const dateForComparison = new Date(Date.UTC(currentYear, currentMonth, day));
            const dateKey = createDateKey(currentYear, currentMonth, day);
            dayDiv.dataset.dateKey = dateKey; // Przechowujemy datę jako klucz YYYY-MM-DD

            // Sprawdzenie, czy dzień jest przeszły lub poza zakresem rok do przodu
            if (dateForComparison < todayUTC || dateForComparison > oneYearFromNowUTC) {
                dayDiv.classList.add('disabled-day');
            } else {
                dayDiv.classList.add('selectable-day');
            }

            // Oznaczenie wybranych dat
            if (selectedDepartureDate && dateForComparison.getTime() === selectedDepartureDate.getTime()) {
                dayDiv.classList.add('selected-departure');
            }
            if (selectedReturnDate && dateForComparison.getTime() === selectedReturnDate.getTime()) {
                dayDiv.classList.add('selected-return');
            }

            // Oznaczenie dni w zakresie
            if (selectedDepartureDate && selectedReturnDate &&
                dateForComparison > selectedDepartureDate && dateForComparison < selectedReturnDate) {
                dayDiv.classList.add('in-range');
            }

            datepickerDays.appendChild(dayDiv);
        }

        // Zaktualizuj stan przycisków nawigacyjnych
        // Dezaktywacja przycisku 'poprzedni miesiąc' jeśli aktualny miesiąc kalendarza to bieżący miesiąc
        if (currentYear === today.getFullYear() && currentMonth === today.getMonth()) {
            prevMonthBtn.disabled = true;
        } else {
            prevMonthBtn.disabled = false;
        }

        // Dezaktywacja przycisku 'następny miesiąc' jeśli to już miesiąc rok do przodu
        const maxMonth = oneYearFromNow.getMonth();
        const maxYear = oneYearFromNow.getFullYear();
        if ((currentYear === maxYear && currentMonth >= maxMonth) || (currentYear > maxYear)) {
             nextMonthBtn.disabled = true;
        } else {
             nextMonthBtn.disabled = false;
        }
        
        updateDisplayDates(); // Zaktualizuj wyświetlanie wybranych dat
    }

    function updateDisplayDates() {
        // Formatowanie daty do wyświetlenia w lokalnej strefie czasowej
        const formatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        displayDepartureDate.textContent = selectedDepartureDate ? selectedDepartureDate.toLocaleDateString('pl-PL', formatOptions) : 'Brak';
        displayReturnDate.textContent = selectedReturnDate ? selectedReturnDate.toLocaleDateString('pl-PL', formatOptions) : 'Brak';
        clearReturnDateBtn.style.display = selectedReturnDate ? 'block' : 'none';
    }

    // Otwieranie kalendarza po kliknięciu inputów daty
    const dateInputTriggers = document.querySelectorAll('.date-input-trigger');
    dateInputTriggers.forEach(input => {
        input.addEventListener('click', () => {
            // Ustaw kalendarz na miesiąc daty wylotu, jeśli jest już wybrana
            if (selectedDepartureDate) {
                currentMonth = selectedDepartureDate.getUTCMonth();
                currentYear = selectedDepartureDate.getUTCFullYear();
            } else {
                // W przeciwnym razie zresetuj do bieżącego miesiąca
                const now = new Date();
                currentMonth = now.getMonth();
                currentYear = now.getFullYear();
            }

            renderCalendar();
            openModal(datePickerModal);
        });
    });

    // Nawigacja kalendarza
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        });
    }

    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar();
        });
    }

    // Wybór daty
    if (datepickerDays) {
        datepickerDays.addEventListener('click', (event) => {
            const clickedDayDiv = event.target.closest('.selectable-day');
            if (clickedDayDiv) {
                const dateKey = clickedDayDiv.dataset.dateKey;
                const clickedDate = parseDateKeyToDate(dateKey); // Konwertuj klucz na datę UTC

                if (!selectedDepartureDate || clickedDate.getTime() === selectedDepartureDate.getTime()) {
                    // Jeśli nie ma daty wylotu lub kliknięto na już wybraną datę wylotu
                    // Ustaw tę datę jako datę wylotu i zresetuj powrót
                    selectedDepartureDate = clickedDate;
                    selectedReturnDate = null;
                } else if (clickedDate < selectedDepartureDate) {
                    // Jeśli kliknięto datę wcześniejszą niż obecny wylot
                    // Ustaw tę datę jako nowy wylot i zresetuj powrót
                    selectedDepartureDate = clickedDate;
                    selectedReturnDate = null;
                } else if (clickedDate > selectedDepartureDate) {
                    // Jeśli kliknięto datę późniejszą niż wylot
                    // Ustaw ją jako datę powrotu
                    selectedReturnDate = clickedDate;
                }
                renderCalendar(); // Ponownie wyrenderuj, aby odświeżyć zaznaczenia
            }
        });
    }

    // Czyszczenie daty powrotu
    if (clearReturnDateBtn) {
        clearReturnDateBtn.addEventListener('click', () => {
            selectedReturnDate = null;
            renderCalendar();
        });
    }

    // Potwierdzenie dat
    if (confirmDatesBtn) {
        confirmDatesBtn.addEventListener('click', () => {
            if (selectedDepartureDate) {
                // Formatujemy daty do wyświetlenia w inputach formularza
                departureDateInput.value = selectedDepartureDate.toLocaleDateString('pl-PL');
                if (selectedReturnDate) {
                    returnDateInput.value = selectedReturnDate.toLocaleDateString('pl-PL');
                } else {
                    returnDateInput.value = '';
                }
                closeModal(datePickerModal);
            } else {
                alert('Proszę wybrać datę wylotu!');
            }
        });
    }


    // --- Obsługa modala Pasażerów i Klasy Podróży ---
    const passengersClassModal = document.getElementById('passengersClassModal');
    const closePassengersClassBtn = passengersClassModal.querySelector('.close-button');
    const passengersAndClassInput = document.getElementById('passengersAndClass');

    const adultsCountSpan = document.getElementById('adultsCount');
    const childrenCountSpan = document.getElementById('childrenCount');
    const infantsCountSpan = document.getElementById('infantsCount');
    // POPRAWKA LITERÓWKI TUTAJ:
    const modalTravelClassSelect = document.getElementById('modalTravelClass');
    const confirmPassengersClassBtn = document.getElementById('confirmPassengersClassBtn'); // Było 'document ='

    let adults = 1;
    let children = 0;
    let infants = 0;
    let travelClass = 'economy';

    function updatePassengerCounts() {
        adultsCountSpan.textContent = adults;
        childrenCountSpan.textContent = children;
        infantsCountSpan.textContent = infants;

        // Dezaktywuj minus, jeśli liczba pasażerów spadnie do minimum
        passengersClassModal.querySelector('.minus-btn[data-type="adults"]').disabled = adults <= 1;
        passengersClassModal.querySelector('.minus-btn[data-type="children"]').disabled = children <= 0;
        passengersClassModal.querySelector('.minus-btn[data-type="infants"]').disabled = infants <= 0;

        // Niemowlęta nie mogą być więcej niż dorośli
        passengersClassModal.querySelector('.plus-btn[data-type="infants"]').disabled = infants >= adults;

        updatePassengersAndClassInput();
    }

    function updatePassengersAndClassInput() {
        let passengerText = '';
        let totalPassengers = adults + children + infants;
        
        // Zmieniona logika wyświetlania, aby była bardziej zwięzła
        if (totalPassengers === 1 && adults === 1 && children === 0 && infants === 0) {
            passengerText = '1 dorosły';
        } else {
            passengerText = `${totalPassengers} pasażerów`;
            // Tylko dodaj nawiasy, jeśli są jakieś podtypy pasażerów inne niż tylko dorośli
            if (children > 0 || infants > 0) {
                passengerText += ` (${adults} doro${adults > 1 ? 'słych' : 'sły'}`;
                if (children > 0) passengerText += `, ${children} dzieck${children > 1 ? 'a' : 'o'}`;
                if (infants > 0) passengerText += `, ${infants} niemowl${infants > 1 ? 'ąt' : 'ę'}`;
                passengerText += ')';
            }
        }


        const classText = modalTravelClassSelect.options[modalTravelClassSelect.selectedIndex].text;
        passengersAndClassInput.value = `${passengerText}, ${classText}`;
    }

    // Otwieranie modala pasażerów/klasy
    if (passengersAndClassInput) {
        passengersAndClassInput.addEventListener('click', () => {
            // Ustaw początkowe wartości w modal, jeśli już jakieś były
            updatePassengerCounts(); // Odśwież widok liczników i przycisków
            modalTravelClassSelect.value = travelClass; // Ustaw aktualną klasę
            openModal(passengersClassModal);
        });
    }

    // Obsługa przycisków plus/minus
    passengersClassModal.querySelectorAll('.counter-controls button').forEach(button => {
        button.addEventListener('click', () => {
            const type = button.dataset.type;
            const isPlus = button.classList.contains('plus-btn');

            if (type === 'adults') {
                adults = isPlus ? adults + 1 : adults - 1;
                adults = Math.max(1, adults); // Minimum 1 dorosły
            } else if (type === 'children') {
                children = isPlus ? children + 1 : children - 1;
                children = Math.max(0, children);
            } else if (type === 'infants') {
                infants = isPlus ? infants + 1 : infants - 1;
                infants = Math.max(0, infants);
            }

            // Walidacja: niemowlęta nie mogą być więcej niż dorośli
            if (infants > adults) {
                infants = adults;
            }

            updatePassengerCounts();
        });
    });

    // Obsługa zmiany klasy podróży w modal
    if (modalTravelClassSelect) {
        modalTravelClassSelect.addEventListener('change', (event) => {
            travelClass = event.target.value;
            updatePassengersAndClassInput();
        });
    }

    // Potwierdzenie wyboru pasażerów i klasy
    if (confirmPassengersClassBtn) { // TEN IF JEST TERAZ WAŻNY, BO POPRAWIONO INICJALIZACJĘ
        confirmPassengersClassBtn.addEventListener('click', () => {
            updatePassengersAndClassInput(); // Finalna aktualizacja
            closeModal(passengersClassModal);
        });
    }

    if (closePassengersClassBtn) {
        closePassengersClassBtn.addEventListener('click', () => closeModal(passengersClassModal));
    }


    // --- Logika formularza wyszukiwania (zaktualizowana) ---
    if (flightSearchForm) {
        flightSearchForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const departure = departureInput.value;
            const destination = destinationInput.value;
            // Daty wylotu i powrotu bierzemy z obiektów Date
            const departureDateString = selectedDepartureDate ? selectedDepartureDate.toISOString().split('T')[0] : ''; // Format YYYY-MM-DD
            const returnDateString = selectedReturnDate ? selectedReturnDate.toISOString().split('T')[0] : ''; // Format YYYY-MM-DD

            const searchParams = {
                departure: departure,
                destination: destination,
                departureDate: departureDateString,
                returnDate: returnDateString,
                adults: adults,
                children: children,
                infants: infants,
                travelClass: travelClass
            };

            localStorage.setItem('flightSearchParams', JSON.stringify(searchParams));
            window.location.href = 'results.html';
        });
    }

    // Inicjalizacja początkowego tekstu w polu pasażerów/klasy
    updatePassengerCounts();
    updatePassengersAndClassInput();
});
