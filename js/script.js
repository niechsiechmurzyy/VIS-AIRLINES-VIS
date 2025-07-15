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
        'poland': [
            { code: 'WAW', name: 'Warszawa - Lotnisko Chopina' },
            { code: 'KRK', name: 'Kraków - Lotnisko Balice' },
            { code: 'GDN', name: 'Gdańsk - Lotnisko im. Lecha Wałęsy' },
            { code: 'WRO', name: 'Wrocław - Lotnisko im. Mikołaja Kopernika' },
            { code: 'POZ', name: 'Poznań - Lotnisko Ławica' },
            { code: 'KTW', name: 'Katowice - Lotnisko Pyrzowice' },
            { code: 'LCJ', name: 'Łódź - Lotnisko im. Władysława Reymonta' },
            { code: 'SZZ', name: 'Szczecin - Lotnisko Goleniów' },
            { code: 'RZE', name: 'Rzeszów - Lotnisko Jasionka' },
            { code: 'LUZ', name: 'Lublin - Lotnisko Lublin' },
            { code: 'BZG', name: 'Bydgoszcz - Lotnisko im. Ignacego Jana Paderewskiego' },
            { code: 'OSZ', name: 'Olsztyn-Mazury - Lotnisko Szymany' },
            { code: 'IEG', name: 'Zielona Góra - Lotnisko Babimost' }
        ],
        'germany': [
            { code: 'BER', name: 'Berlin - Lotnisko Brandenburg' },
            { code: 'FRA', name: 'Frankfurt - Lotnisko we Frankfurcie' },
            { code: 'MUC', name: 'Monachium - Lotnisko im. Franza Josefa Straussa' },
            { code: 'DUS', name: 'Düsseldorf - Lotnisko w Düsseldorfie' },
            { code: 'HAM', name: 'Hamburg - Lotnisko w Hamburgu' },
            { code: 'CGN', name: 'Kolonia/Bonn - Lotnisko Kolonia/Bonn' },
            { code: 'STR', name: 'Stuttgart - Lotnisko w Stuttgarcie' },
            { code: 'LEJ', name: 'Lipsk/Halle - Lotnisko Lipsk/Halle' },
            { code: 'BRE', name: 'Brema - Lotnisko w Bremie' },
            { code: 'DRS', name: 'Drezno - Lotnisko w Dreźnie' }
        ],
        'france': [
            { code: 'CDG', name: 'Paryż - Lotnisko Charlesa de Gaulle\'a' },
            { code: 'ORY', name: 'Paryż - Lotnisko Orly' },
            { code: 'NCE', name: 'Nicea - Lotnisko Nicea-Lazurowe Wybrzeże' },
            { code: 'MRS', name: 'Marsylia - Lotnisko Marsylia Prowansja' },
            { code: 'LYS', name: 'Lyon - Lotnisko Lyon-Saint Exupéry' },
            { code: 'TLS', name: 'Tuluza - Lotnisko Tuluza-Blagnac' },
            { code: 'BOD', name: 'Bordeaux - Lotnisko Bordeaux-Mérignac' },
            { code: 'NTE', name: 'Nantes - Lotnisko Nantes Atlantique' }
        ],
        'united_kingdom': [
            { code: 'LHR', name: 'Londyn - Lotnisko Heathrow' },
            { code: 'LGW', name: 'Londyn - Lotnisko Gatwick' },
            { code: 'STN', name: 'Londyn - Lotnisko Stansted' },
            { code: 'MAN', name: 'Manchester - Lotnisko w Manchesterze' },
            { code: 'EDI', name: 'Edynburg - Lotnisko w Edynburgu' },
            { code: 'BHX', name: 'Birmingham - Lotnisko w Birmingham' }
        ],
        'usa': [
            { code: 'JFK', name: 'Nowy Jork - Lotnisko JFK' },
            { code: 'LAX', name: 'Los Angeles - Lotnisko LAX' },
            { code: 'ORD', name: 'Chicago - Lotnisko O\'Hare' },
            { code: 'ATL', name: 'Atlanta - Lotnisko Hartsfield-Jackson' },
            { code: 'DFW', name: 'Dallas/Fort Worth - Lotnisko DFW' },
            { code: 'DEN', name: 'Denver - Lotnisko Denver' },
            { code: 'SFO', name: 'San Francisco - Lotnisko San Francisco' }
        ],
        'spain': [
            { code: 'MAD', name: 'Madryt - Lotnisko Barajas' },
            { code: 'BCN', name: 'Barcelona - Lotnisko El Prat' },
            { code: 'AGP', name: 'Malaga - Lotnisko Malaga-Costa del Sol' },
            { code: 'PMI', name: 'Palma de Mallorca - Lotnisko Palma de Mallorca' }
        ],
        'italy': [
            { code: 'FCO', name: 'Rzym - Lotnisko Fiumicino' },
            { code: 'MXP', name: 'Mediolan - Lotnisko Malpensa' },
            { code: 'BGY', name: 'Bergamo - Lotnisko Orio al Serio' },
            { code: 'VCE', name: 'Wenecja - Lotnisko Marco Polo' }
        ],
        'netherlands': [
            { code: 'AMS', name: 'Amsterdam - Lotnisko Schiphol' }
        ],
        'denmark': [
            { code: 'CPH', name: 'Kopenhaga - Lotnisko Kastrup' }
        ],
        'norway': [
            { code: 'OSL', name: 'Oslo - Lotnisko Gardermoen' }
        ],
        'finland': [
            { code: 'HEL', name: 'Helsinki - Lotnisko Helsinki-Vantaa' }
        ],
        'czech_republic': [
            { code: 'PRG', name: 'Praga - Lotnisko im. Václava Havla' }
        ],
        'austria': [
            { code: 'VIE', name: 'Wiedeń - Lotnisko Wiedeń-Schwechat' }
        ],
        'switzerland': [
            { code: 'ZRH', name: 'Zurych - Lotnisko Zurych' }
        ],
        'belgium': [
            { code: 'BRU', name: 'Bruksela - Lotnisko Bruksela' }
        ],
        'portugal': [
            { code: 'LIS', name: 'Lizbona - Lotnisko Lizbona' }
        ],
        'greece': [
            { code: 'ATH', name: 'Ateny - Lotnisko Eleftherios Venizelos' }
        ],
        'turkey': [
            { code: 'IST', name: 'Stambuł - Lotnisko Stambuł' }
        ],
        'united_arab_emirates': [
            { code: 'DXB', name: 'Dubaj - Lotnisko Dubaj' }
        ],
        'thailand': [
            { code: 'BKK', name: 'Bangkok - Lotnisko Suvarnabhumi' }
        ],
        'singapore': [
            { code: 'SIN', name: 'Singapur - Lotnisko Changi' }
        ],
        'japan': [
            { code: 'NRT', name: 'Tokio - Lotnisko Narita' }
        ],
        'australia': [
            { code: 'SYD', name: 'Sydney - Lotnisko Kingsford Smith' }
        ]
    };

    function loadAirports() {
        const airportListsContainer = airportSelectionModal.querySelector('.airport-lists');
        airportListsContainer.innerHTML = ''; // Wyczyść istniejące listy

        const categoryNames = {
            'poland': 'Lotniska w Polsce',
            'germany': 'Lotniska w Niemczech',
            'france': 'Lotniska we Francji',
            'united_kingdom': 'Lotniska w Wielkiej Brytanii',
            'usa': 'Lotniska w USA',
            'spain': 'Lotniska w Hiszpanii',
            'italy': 'Lotniska we Włoszech',
            'netherlands': 'Lotniska w Holandii',
            'denmark': 'Lotniska w Danii',
            'norway': 'Lotniska w Norwegii',
            'finland': 'Lotniska w Finlandii',
            'czech_republic': 'Lotniska w Czechach',
            'austria': 'Lotniska w Austrii',
            'switzerland': 'Lotniska w Szwajcarii',
            'belgium': 'Lotniska w Belgii',
            'portugal': 'Lotniska w Portugalii',
            'greece': 'Lotniska w Grecji',
            'turkey': 'Lotniska w Turcji',
            'united_arab_emirates': 'Lotniska w Zjednoczonych Emiratach Arabskich',
            'thailand': 'Lotniska w Tajlandii',
            'singapore': 'Lotniska w Singapurze',
            'japan': 'Lotniska w Japonii',
            'australia': 'Lotniska w Australii'
        };

        for (const category in airports) {
            // Utwórz nagłówek dla państwa/kategorii
            const h4 = document.createElement('h4');
            h4.textContent = categoryNames[category] || category.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()); // Domyślne formatowanie na wypadek braku w categoryNames
            airportListsContainer.appendChild(h4);

            // Utwórz listę lotnisk dla danej kategorii
            const ul = document.createElement('ul');
            ul.classList.add('airport-list');
            ul.id = `${category}AirportList`; // Dodaj ID dla ułatwienia debugowania
            airportListsContainer.appendChild(ul);

            // Dodaj lotniska do listy
            airports[category].forEach(airport => {
                const li = document.createElement('li');
                li.textContent = `${airport.name} (${airport.code})`;
                li.dataset.code = airport.code;
                li.dataset.name = airport.name;
                li.addEventListener('click', () => selectAirport(airport));
                ul.appendChild(li);
            });
        }
    }

    function selectAirport(airport) {
        if (activeAirportInput) {
            activeAirportInput.value = `${airport.name} (${airport.code})`; 
            activeAirportInput.dataset.code = airport.code; 
            closeModal(airportSelectionModal);
            activeAirportInput = null; 
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
    let activeDateInput = null; 

    function renderCalendar() {
        datepickerDays.innerHTML = '';
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday

        monthYearDisplay.textContent = new Date(currentYear, currentMonth).toLocaleString('pl-PL', { month: 'long', year: 'numeric' });

        // Dodaj puste dni dla wyrównania kalendarza (jeśli miesiąc nie zaczyna się w niedzielę)
        const startDayIndex = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; 

        for (let i = 0; i < startDayIndex; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('empty-day');
            datepickerDays.appendChild(emptyDiv);
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); 

        for (let i = 1; i <= daysInMonth; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = i;
            dayDiv.classList.add('selectable-day');

            const dayDate = new Date(currentYear, currentMonth, i);
            dayDate.setHours(0, 0, 0, 0); 

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
        minDateAllowed.setDate(minDateAllowed.getDate() -1); 
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
            selectedReturnDate = null; 
        } else if (date > selectedDepartureDate) {
            selectedReturnDate = date;
        }
        updateDateDisplays();
        renderCalendar(); 
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
        departureDateInput.value = selectedDepartureDate ? selectedDepartureDate.toLocaleDateString('pl-PL') : '';
        departureDateInput.dataset.date = selectedDepartureDate ? selectedDepartureDate.toISOString().split('T')[0] : '';
        
        returnDateInput.value = selectedReturnDate ? selectedReturnDate.toLocaleDateString('pl-PL') : '';
        returnDateInput.dataset.date = selectedReturnDate ? selectedReturnDate.toISOString().split('T')[0] : '';
        
        closeModal(datePickerModal);
        activeDateInput = null; 
    });

    // Otwieranie modala kalendarza
    departureDateInput.addEventListener('click', () => {
        activeDateInput = departureDateInput;
        if (selectedDepartureDate) {
            currentMonth = selectedDepartureDate.getMonth();
            currentYear = selectedDepartureDate.getFullYear();
        } else { 
            currentMonth = new Date().getMonth();
            currentYear = new Date().getFullYear();
        }
        openModal(datePickerModal);
        renderCalendar();
        updateDateDisplays();
    });

    returnDateInput.addEventListener('click', () => {
        activeDateInput = returnDateInput;
        if (selectedReturnDate) {
            currentMonth = selectedReturnDate.getMonth();
            currentYear = selectedReturnDate.getFullYear();
        } else if (selectedDepartureDate) { 
            currentMonth = selectedDepartureDate.getMonth();
            currentYear = selectedDepartureDate.getFullYear();
        } else { 
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

        if (infants > adults) {
            infants = adults;
            infantsCountSpan.textContent = infants;
        }

        const totalPassengers = adults + children + infants;
        travelClass = modalTravelClassSelect.value;
        const travelClassText = modalTravelClassSelect.options[modalTravelClassSelect.selectedIndex].text;
        passengersAndClassInput.value = `${totalPassengers} pasażer${totalPassengers === 1 ? '' : totalPassengers > 4 ? 'ów' : 'erów'}, ${travelClassText}`;
    }

    // Obsługa przycisków plus/minus dla pasażerów
    document.querySelectorAll('.counter-controls button').forEach(button => {
        button.addEventListener('click', (event) => {
            const type = event.target.dataset.type;
            const action = event.target.textContent; 

            if (type === 'adults') {
                if (action === '+' && adults < 9) adults++;
                else if (action === '-' && adults > 1) adults--;
            } else if (type === 'children') {
                if (action === '+' && children < 9) children++;
                else if (action === '-' && children > 0) children--;
            } else if (type === 'infants') {
                if (action === '+' && infants < adults) infants++; 
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
        modalTravelClassSelect.value = travelClass;
        openModal(passengersClassModal);
        updatePassengerDisplay(); 
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
            event.stopPropagation(); 
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.querySelector('.dropdown-content').style.display = 'none';
                }
            });
            dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
        });
    });

    // Zamknij dropdowny, jeśli kliknięto poza nimi
    window.addEventListener('click', (event) => {
        dropdowns.forEach(dropdown => {
            const dropdownContent = dropdown.querySelector('.dropdown-content');
            const dropbtn = dropdown.querySelector('.dropbtn');
            if (!dropbtn.contains(event.target) && !dropdownContent.contains(event.target)) {
                dropdownContent.style.display = 'none';
            }
        });
    });


    // === Obsługa formularza wyszukiwania (przekierowanie do strony wyników) ===
    const flightSearchForm = document.getElementById('flightSearchForm');
    flightSearchForm.addEventListener('submit', (event) => {
        event.preventDefault(); 
        
        if (!departureInput.dataset.code || !destinationInput.dataset.code) {
            alert('Proszę wybrać lotnisko wylotu i przylotu.');
            return; 
        }
        if (!departureDateInput.dataset.date) {
            alert('Proszę wybrać datę wylotu.');
            return; 
        }


        const departureCode = departureInput.dataset.code; 
        const destinationCode = destinationInput.dataset.code; 
        const departureDate = departureDateInput.dataset.date; 
        const returnDate = returnDateInput.dataset.date; 

        const params = new URLSearchParams();
        params.append('departure', departureCode);
        params.append('destination', destinationCode);
        params.append('depDate', departureDate);
        if (returnDate) { 
            params.append('retDate', returnDate);
        }
        params.append('adults', adults);
        params.append('children', children);
        params.append('infants', infants);
        params.append('class', travelClass); 

        window.location.href = `results.html?${params.toString()}`;
    });

    // Inicjalizacje
    renderCalendar(); 

});
