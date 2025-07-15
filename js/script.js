// js/script.js - Kalendarz i wybór pasażerów/klasy

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
                closeModal(airportSelectionModal);
                closeModal(datePickerModal); // Zamyka również kalendarz
                closeModal(passengersClassModal); // Zamyka również modal pasażerów
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

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ustaw na początek dnia dla porównań
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    oneYearFromNow.setHours(0, 0, 0, 0);

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

            const date = new Date(currentYear, currentMonth, day);
            date.setHours(0, 0, 0, 0); // Ustaw na początek dnia dla porównań

            if (date < today || date > oneYearFromNow) {
                dayDiv.classList.add('disabled-day');
            } else {
                dayDiv.classList.add('selectable-day');
                dayDiv.dataset.date = date.toISOString().split('T')[0]; // Format YYYY-MM-DD
            }

            // Oznaczenie wybranych dat
            if (selectedDepartureDate && date.getTime() === selectedDepartureDate.getTime()) {
                dayDiv.classList.add('selected-departure');
            }
            if (selectedReturnDate && date.getTime() === selectedReturnDate.getTime()) {
                dayDiv.classList.add('selected-return');
            }

            // Oznaczenie dni w zakresie
            if (selectedDepartureDate && selectedReturnDate &&
                date > selectedDepartureDate && date < selectedReturnDate) {
                dayDiv.classList.add('in-range');
            }

            datepickerDays.appendChild(dayDiv);
        }

        // Zaktualizuj stan przycisków nawigacyjnych
        const firstAvailableDate = new Date(today);
        firstAvailableDate.setDate(1); // Ustaw na 1. dzień bieżącego miesiąca dla porównania z aktualnym miesiącem kalendarza

        // Poprawka: Dezaktywacja przycisku 'poprzedni miesiąc' jeśli aktualny miesiąc to bieżący miesiąc
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
        displayDepartureDate.textContent = selectedDepartureDate ? selectedDepartureDate.toLocaleDateString('pl-PL') : 'Brak';
        displayReturnDate.textContent = selectedReturnDate ? selectedReturnDate.toLocaleDateString('pl-PL') : 'Brak';
        clearReturnDateBtn.style.display = selectedReturnDate ? 'block' : 'none';
    }

    // Otwieranie kalendarza po kliknięciu inputów daty
    const dateInputTriggers = document.querySelectorAll('.date-input-trigger');
    dateInputTriggers.forEach(input => {
        input.addEventListener('click', () => {
            // Zresetuj kalendarz do bieżącego miesiąca przy otwarciu
            const now = new Date();
            currentMonth = now.getMonth();
            currentYear = now.getFullYear();

            // Ustaw wartości w polach daty w formularzu na te z JS
            if (selectedDepartureDate) {
                departureDateInput.value = selectedDepartureDate.toLocaleDateString('pl-PL');
            }
            if (selectedReturnDate) {
                returnDateInput.value = selectedReturnDate.toLocaleDateString('pl-PL');
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
            const clickedDay = event.target.closest('.selectable-day');
            if (clickedDay) {
                const dateString = clickedDay.dataset.date;
                const clickedDate = new Date(dateString);
                clickedDate.setHours(0, 0, 0, 0); // Upewnij się, że czas jest zresetowany

                if (!selectedDepartureDate || clickedDate.getTime() === selectedDepartureDate.getTime() || (selectedDepartureDate && clickedDate < selectedDepartureDate)) {
                    // Wybrano datę wylotu (pierwszy wybór, ponowny wybór tej samej daty, lub data wcześniejsza niż obecny wylot)
                    selectedDepartureDate = clickedDate;
                    selectedReturnDate = null; // Resetuj datę powrotu
                } else if (clickedDate > selectedDepartureDate) {
                    // Wybrano datę powrotu
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
                departureDateInput.value = selectedDepartureDate.toLocaleDateString('pl-PL');
                // Jeśli jest tylko data wylotu, pole powrotu jest puste
                if (selectedReturnDate) {
                    returnDateInput.value = selectedReturnDate.toLocaleDateString('pl-PL');
                } else {
                    returnDateInput.value = ''; // Upewnij się, że jest puste
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
    const modalTravelClassSelect = document.getElementById('modalTravelClass');
    const confirmPassengersClassBtn = document.getElementById('confirmPassengersClassBtn');

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
        if (adults > 0) passengerText += `${adults} dorosły${adults > 1 ? 'ch' : ''}`;
        if (children > 0) passengerText += `, ${children} dziecko${children > 1 ? 'ta' : ''}`;
        if (infants > 0) passengerText += `, ${infants} niemowlę${infants > 1 ? 'ta' : ''}`;

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
    if (confirmPassengersClassBtn) {
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
            const departureDate = departureDateInput.value; // Nowa wartość
            const returnDate = returnDateInput.value; // Nowa wartość (może być pusta)
            // Passengers i travelClass są już aktualizowane globalnie

            const searchParams = {
                departure: departure,
                destination: destination,
                departureDate: departureDate,
                returnDate: returnDate,
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
