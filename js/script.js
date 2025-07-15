// js/script.js

document.addEventListener('DOMContentLoaded', () => {
    // === Elementy DOM Modali ===
    const airportSelectionModal = document.getElementById('airportSelectionModal');
    const datePickerModal = document.getElementById('datePickerModal');
    const passengersClassModal = document.getElementById('passengersClassModal');
    const modalOverlay = document.getElementById('modalOverlay');

    const closeButtons = document.querySelectorAll('.modal .close-button');

    // === Elementy formularza ===
    const departureInput = document.getElementById('departure');
    const destinationInput = document.getElementById('destination');
    const departureDateInput = document.getElementById('departureDate');
    const returnDateInput = document.getElementById('returnDate');
    const passengersAndClassInput = document.getElementById('passengersAndClass');

    let activeAirportInput = null; // Zmienna do śledzenia, które pole lotniska jest aktywne

    // === Obsługa modali ===
    function openModal(modal) {
        modal.classList.add('show');
        modalOverlay.classList.add('show');
    }

    function closeModal(modal) {
        modal.classList.remove('show');
        modalOverlay.classList.remove('show');
    }

    // Zamykanie wszystkich modali
    function closeAllModals() {
        airportSelectionModal.classList.remove('show');
        datePickerModal.classList.remove('show');
        passengersClassModal.classList.remove('show');
        modalOverlay.classList.remove('show');
    }

    // Obsługa kliknięć przycisków zamykających (X)
    closeButtons.forEach(button => {
        button.addEventListener('click', closeAllModals);
    });

    // Obsługa kliknięcia na overlay (zamknięcie wszystkich modali)
    modalOverlay.addEventListener('click', closeAllModals);

    // === Obsługa wyboru lotniska ===
    const airports = {
        'polish': [
            { code: 'WAW', name: 'Warszawa - Lotnisko Chopina' },
            { code: 'KRK', name: 'Kraków - Lotnisko Balice' },
            { code: 'GDN', name: 'Gdańsk - Lotnisko im. Lecha Wałęsy' },
            { code: 'WRO', name: 'Wrocław - Lotnisko im. Mikołaja Kopernika' },
            { code: 'POZ', name: 'Poznań - Lotnisko Ławica' },
            { code: 'KTW', name: 'Katowice - Lotnisko Pyrzowice' }
        ],
        'german': [
            { code: 'BER', name: 'Berlin - Lotnisko Brandenburg' },
            { code: 'FRA', name: 'Frankfurt - Lotnisko we Frankfurcie' },
            { code: 'MUC', name: 'Monachium - Lotnisko im. Franza Josefa Straussa' },
            { code: 'DUS', name: 'Düsseldorf - Lotnisko w Düsseldorfie' }
        ],
        'french': [
            { code: 'CDG', name: 'Paryż - Lotnisko Charlesa de Gaulle\'a' },
            { code: 'ORY', name: 'Paryż - Lotnisko Orly' },
            { code: 'NCE', name: 'Nicea - Lotnisko Nicea-Lazurowe Wybrzeże' },
            { code: 'MRS', name: 'Marsylia - Lotnisko Marsylia Prowansja' }
        ]
    };

    function loadAirports() {
        const polishList = document.getElementById('polishAirportList');
        const germanList = document.getElementById('germanAirportList');
        const frenchList = document.getElementById('frenchAirportList');

        polishList.innerHTML = '';
        germanList.innerHTML = '';
        frenchList.innerHTML = '';

        airports.polish.forEach(airport => {
            const li = document.createElement('li');
            li.textContent = `${airport.name} (${airport.code})`;
            li.dataset.code = airport.code;
            li.dataset.name = airport.name;
            li.addEventListener('click', () => selectAirport(airport));
            polishList.appendChild(li);
        });

        airports.german.forEach(airport => {
            const li = document.createElement('li');
            li.textContent = `${airport.name} (${airport.code})`;
            li.dataset.code = airport.code;
            li.dataset.name = airport.name;
            li.addEventListener('click', () => selectAirport(airport));
            germanList.appendChild(li);
        });

        airports.french.forEach(airport => {
            const li = document.createElement('li');
            li.textContent = `${airport.name} (${airport.code})`;
            li.dataset.code = airport.code;
            li.dataset.name = airport.name;
            li.addEventListener('click', () => selectAirport(airport));
            frenchList.appendChild(li);
        });
    }

    function selectAirport(airport) {
        if (activeAirportInput) {
            activeAirportInput.value = `${airport.name} (${airport.code})`;
            closeModal(airportSelectionModal);
            activeAirportInput = null; // Resetujemy aktywne pole
        }
    }

    // Otwieranie modala wyboru lotniska po kliknięciu na input
    departureInput.addEventListener('click', () => {
        activeAirportInput = departureInput;
        openModal(airportSelectionModal);
        loadAirports();
    });

    destinationInput.addEventListener('click', () => {
        activeAirportInput = destinationInput;
        openModal(airportSelectionModal);
        loadAirports();
    });


    // === Obsługa kalendarza ===
    const monthYearDisplay = document.getElementById('monthYearDisplay');
    const datepickerDays = document.getElementById('datepickerDays');
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    const nextMonthBtn = document.getElementById('nextMonthBtn');
    const confirmDatesBtn = document.getElementById('confirmDatesBtn');
    const displayDepartureDate = document.getElementById('displayDepartureDate');
    const displayReturnDate = document.getElementById('displayReturnDate');
    const clearReturnDateBtn = document.getElementById('clearReturnDateBtn');

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let selectedDepartureDate = null;
    let selectedReturnDate = null;
    let activeDateInput = null; // Zmienna do śledzenia, które pole daty jest aktywne

    function renderCalendar() {
        datepickerDays.innerHTML = '';
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday

        monthYearDisplay.textContent = new Date(currentYear, currentMonth).toLocaleString('pl-PL', { month: 'long', year: 'numeric' });

        // Dodaj puste dni dla wyrównania kalendarza (jeśli miesiąc nie zaczyna się w niedzielę)
        // Dzień tygodnia 0 (niedziela) w JS, ale w kalendarzu chcemy aby poniedziałek był pierwszy
        // Jeśli pierwszy dzień tygodnia to niedziela (0), traktujemy to jako 6 pustych dni (po sobocie)
        // Jeśli pierwszy dzień tygodnia to poniedziałek (1), to 0 pustych dni
        const startDayIndex = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Przesunięcie dla poniedziałku jako pierwszego dnia

        for (let i = 0; i < startDayIndex; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('empty-day');
            datepickerDays.appendChild(emptyDiv);
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Ustaw na początek dnia dla porównań

        for (let i = 1; i <= daysInMonth; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = i;
            dayDiv.classList.add('selectable-day');

            const dayDate = new Date(currentYear, currentMonth, i);
            dayDate.setHours(0, 0, 0, 0); // Ustaw na początek dnia

            if (dayDate < today) {
                dayDiv.classList.remove('selectable-day');
                dayDiv.classList.add('past-day');
            } else {
                dayDiv.addEventListener('click', () => selectDate(dayDate));
            }

            // Oznaczenie wybranych dat
            if (selectedDepartureDate && dayDate.getTime() === selectedDepartureDate.getTime()) {
                dayDiv.classList.add('selected-departure');
            }
            if (selectedReturnDate && dayDate.getTime() === selectedReturnDate.getTime()) {
                dayDiv.classList.add('selected-return');
            }

            // Oznaczenie zakresu (jeśli data powrotu jest wybrana)
            if (selectedDepartureDate && selectedReturnDate && dayDate > selectedDepartureDate && dayDate < selectedReturnDate) {
                dayDiv.classList.add('in-range');
            }

            datepickerDays.appendChild(dayDiv);
        }

        // Aktywacja/dezaktywacja przycisków nawigacji
        const minDateAllowed = new Date();
        minDateAllowed.setDate(minDateAllowed.getDate() -1); // Dzień wcześniej, aby pozwolić wybrać dzisiejszy dzień
        minDateAllowed.setHours(0,0,0,0);

        const currentCalendarDate = new Date(currentYear, currentMonth, 1);

        if (currentCalendarDate <= minDateAllowed) {
             prevMonthBtn.disabled = true;
        } else {
            prevMonthBtn.disabled = false;
        }

        // Dezaktywuj przycisk Dalej, jeśli nie ma wybranej daty wylotu i minęła data powrotu
        if (selectedDepartureDate && selectedReturnDate && new Date(currentYear, currentMonth, 1) > selectedReturnDate) {
            nextMonthBtn.disabled = true;
        } else {
            nextMonthBtn.disabled = false;
        }
    }

    function selectDate(date) {
        if (!selectedDepartureDate || (selectedDepartureDate && selectedReturnDate) || date < selectedDepartureDate) {
            selectedDepartureDate = date;
            selectedReturnDate = null; // Resetuj datę powrotu przy nowym wyborze wylotu
        } else if (date > selectedDepartureDate) {
            selectedReturnDate = date;
        }
        updateDateDisplays();
        renderCalendar(); // Przeładuj kalendarz, aby zaznaczyć nowe daty/zakres
    }

    function updateDateDisplays() {
        displayDepartureDate.textContent = selectedDepartureDate ? selectedDepartureDate.toLocaleDateString('pl-PL') : 'Brak';
        displayReturnDate.textContent = selectedReturnDate ? selectedReturnDate.toLocaleDateString('pl-PL') : 'Brak';
        clearReturnDateBtn.style.display = selectedReturnDate ? 'inline-block' : 'none';
    }

    clearReturnDateBtn.addEventListener('click', () => {
        selectedReturnDate = null;
        updateDateDisplays();
        renderCalendar();
    });

    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    confirmDatesBtn.addEventListener('click', () => {
        if (activeDateInput === departureDateInput) {
            departureDateInput.value = selectedDepartureDate ? selectedDepartureDate.toLocaleDateString('pl-PL') : '';
            returnDateInput.value = selectedReturnDate ? selectedReturnDate.toLocaleDateString('pl-PL') : '';
        } else if (activeDateInput === returnDateInput) {
            returnDateInput.value = selectedReturnDate ? selectedReturnDate.toLocaleDateString('pl-PL') : '';
        }
        closeModal(datePickerModal);
        activeDateInput = null; // Resetujemy aktywne pole
    });

    // Otwieranie modala kalendarza
    departureDateInput.addEventListener('click', () => {
        activeDateInput = departureDateInput;
        // Ustaw początkowy miesiąc kalendarza na miesiąc wybranej daty wylotu, jeśli istnieje
        if (selectedDepartureDate) {
            currentMonth = selectedDepartureDate.getMonth();
            currentYear = selectedDepartureDate.getFullYear();
        } else { // W przeciwnym razie na bieżący miesiąc
            currentMonth = new Date().getMonth();
            currentYear = new Date().getFullYear();
        }
        openModal(datePickerModal);
        renderCalendar();
        updateDateDisplays();
    });

    returnDateInput.addEventListener('click', () => {
        activeDateInput = returnDateInput;
        // Ustaw początkowy miesiąc kalendarza na miesiąc wybranej daty powrotu, jeśli istnieje
        if (selectedReturnDate) {
            currentMonth = selectedReturnDate.getMonth();
            currentYear = selectedReturnDate.getFullYear();
        } else if (selectedDepartureDate) { // Jeśli jest wylot, ustaw kalendarz na miesiąc wylotu
            currentMonth = selectedDepartureDate.getMonth();
            currentYear = selectedDepartureDate.getFullYear();
        } else { // W przeciwnym razie na bieżący miesiąc
            currentMonth = new Date().getMonth();
            currentYear = new Date().getFullYear();
        }
        openModal(datePickerModal);
        renderCalendar();
        updateDateDisplays();
    });


    // === Obsługa pasażerów i klasy ===
    const adultsCountSpan = document.getElementById('adultsCount');
    const childrenCountSpan = document.getElementById('childrenCount');
    const infantsCountSpan = document.getElementById('infantsCount');
    const modalTravelClassSelect = document.getElementById('modalTravelClass');
    const confirmPassengersClassBtn = document.getElementById('confirmPassengersClassBtn');

    let adults = 1;
    let children = 0;
    let infants = 0;
    let travelClass = 'economy';

    function updatePassengerDisplay() {
        adultsCountSpan.textContent = adults;
        childrenCountSpan.textContent = children;
        infantsCountSpan.textContent = infants;

        // Synchronizuj licznik niemowląt z dorosłymi - niemowląt nie może być więcej niż dorosłych
        if (infants > adults) {
            infants = adults;
            infantsCountSpan.textContent = infants;
        }

        // Aktualizuj pole input w formularzu głównym
        const totalPassengers = adults + children + infants;
        passengersAndClassInput.value = `${totalPassengers} pasażer${totalPassengers === 1 ? '' : totalPassengers > 4 ? 'ów' : 'erów'}, ${modalTravelClassSelect.options[modalTravelClassSelect.selectedIndex].text}`;
    }

    // Obsługa przycisków plus/minus dla pasażerów
    document.querySelectorAll('.counter-controls button').forEach(button => {
        button.addEventListener('click', (event) => {
            const type = event.target.dataset.type;
            const action = event.target.textContent; // '+' or '-'

            if (type === 'adults') {
                if (action === '+' && adults < 9) adults++;
                else if (action === '-' && adults > 1) adults--;
            } else if (type === 'children') {
                if (action === '+' && children < 9) children++;
                else if (action === '-' && children > 0) children--;
            } else if (type === 'infants') {
                if (action === '+' && infants < adults) infants++; // Niemowląt nie może być więcej niż dorosłych
                else if (action === '-' && infants > 0) infants--;
            }
            updatePassengerDisplay();
        });
    });

    // Obsługa zmiany klasy podróży
    modalTravelClassSelect.addEventListener('change', (event) => {
        travelClass = event.target.value;
        updatePassengerDisplay();
    });

    // Otwieranie modala pasażerów i klasy po kliknięciu na input
    passengersAndClassInput.addEventListener('click', () => {
        // Upewnij się, że modalTravelClassSelect ma poprawną wartość po otwarciu
        modalTravelClassSelect.value = travelClass;
        openModal(passengersClassModal);
        updatePassengerDisplay(); // Upewnij się, że początkowe wartości są wyświetlane
    });

    confirmPassengersClassBtn.addEventListener('click', () => {
        closeModal(passengersClassModal);
    });

    // Inicjalizacja wyświetlania pasażerów przy ładowaniu strony
    updatePassengerDisplay();

    // === Obsługa dropdownów w nagłówku ===
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        const dropdownContent = dropdown.querySelector('.dropdown-content');

        dropbtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Zapobiegaj zamykaniu po kliknięciu w button
            // Zamknij inne otwarte dropdowny
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.querySelector('.dropdown-content').style.display = 'none';
                }
            });
            // Przełącz widoczność aktualnego dropdownu
            dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
        });
    });

    // Zamknij dropdowny, jeśli kliknięto poza nimi
    window.addEventListener('click', (event) => {
        dropdowns.forEach(dropdown => {
            const dropdownContent = dropdown.querySelector('.dropdown-content');
            const dropbtn = dropdown.querySelector('.dropbtn');
            // Jeśli kliknięto poza dropdownem i nie na jego przycisku
            if (!dropbtn.contains(event.target) && !dropdownContent.contains(event.target)) {
                dropdownContent.style.display = 'none';
            }
        });
    });


    // === Obsługa formularza wyszukiwania (przykładowa) ===
    const flightSearchForm = document.getElementById('flightSearchForm');
    flightSearchForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Zapobiegaj domyślnemu przesyłaniu formularza
        
        const departure = departureInput.value;
        const destination = destinationInput.value;
        const departureDate = departureDateInput.value;
        const returnDate = returnDateInput.value;
        const passengersClass = passengersAndClassInput.value;

        console.log('Wyszukiwanie lotów:', {
            departure,
            destination,
            departureDate,
            returnDate,
            passengers: adults,
            children,
            infants,
            travelClass
        });
        alert('Szukaj lotów! (Dane w konsoli deweloperskiej)');
        // Tutaj można dodać logikę do wysyłania danych na serwer lub wyświetlania wyników
    });

    // Inicjalizacje
    renderCalendar(); // Renderuj kalendarz przy starcie

});
