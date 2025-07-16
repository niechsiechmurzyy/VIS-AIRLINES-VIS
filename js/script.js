// js/script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Elementy DOM ---
    const flightSearchForm = document.getElementById('flightSearchForm');

    // Pola input na głównym formularzu
    const departureInput = document.getElementById('departure');
    const destinationInput = document.getElementById('destination');
    const departureDateInput = document.getElementById('departureDate');
    const returnDateInput = document.getElementById('returnDate');
    const passengersAndClassInput = document.getElementById('passengersAndClass');

    // Modale i overlay
    const airportSelectionModal = document.getElementById('airportSelectionModal');
    const datePickerModal = document.getElementById('datePickerModal');
    const passengersClassModal = document.getElementById('passengersClassModal');
    const modalOverlay = document.getElementById('modalOverlay');

    // Przyciski zamykające modale (wszystkie mają klasę .close-button)
    document.querySelectorAll('.modal .close-button').forEach(button => {
        button.addEventListener('click', closeModal);
    });

    // Obsługa kliknięcia na overlay (zamyka aktywny modal)
    modalOverlay.addEventListener('click', closeModal);

    // --- Dane o lotniskach ---
    const airportNames = {
        'WAW': 'Warszawa - Lotnisko Chopina', 'KRK': 'Kraków - Lotnisko Balice',
        'GDN': 'Gdańsk - Lotnisko im. Lecha Wałęsy', 'WRO': 'Wrocław - Lotnisko im. Mikołaja Kopernika',
        'POZ': 'Poznań - Lotnisko Ławica', 'KTW': 'Katowice - Lotnisko Pyrzowice',
        'LCJ': 'Łódź - Lotnisko im. Władysława Reymonta', 'SZZ': 'Szczecin - Lotnisko Goleniów',
        'RZE': 'Rzeszów - Lotnisko Jasionka', 'LUZ': 'Lublin - Lotnisko Lublin',
        'BZG': 'Bydgoszcz - Lotnisko im. Ignacego Jana Paderewskiego', 'OSZ': 'Olsztyn-Mazury - Lotnisko Szymany',
        'IEG': 'Zielona Góra - Lotnisko Babimost',
        'BER': 'Berlin - Lotnisko Brandenburg', 'FRA': 'Frankfurt - Lotnisko we Frankfurcie',
        'MUC': 'Monachium - Lotnisko im. Franza Josefa Straussa', 'DUS': 'Düsseldorf - Lotnisko w Düsseldorfie',
        'HAM': 'Hamburg - Lotnisko w Hamburgu', 'CGN': 'Kolonia/Bonn - Lotnisko Kolonia/Bonn',
        'STR': 'Stuttgart - Lotnisko w Stuttgarcie', 'LEJ': 'Lipsk/Halle - Lotnisko Lipsk/Halle',
        'BRE': 'Brema - Lotnisko w Bremie', 'DRS': 'Drezno - Lotnisko w Dreźnie',
        'CDG': 'Paryż - Lotnisko Charlesa de Gaulle\'a', 'ORY': 'Paryż - Lotnisko Orly',
        'NCE': 'Nicea - Lotnisko Nicea-Lazurowe Wybrzeże', 'MRS': 'Marsylia - Lotnisko Marsylia Prowansja',
        'LYS': 'Lyon - Lotnisko Lyon-Saint Exupéry', 'TLS': 'Tuluza - Lotnisko Tuluza-Blagnac',
        'BOD': 'Bordeaux - Lotnisko Bordeaux-Mérignac', 'NTE': 'Nantes - Lotnisko Nantes Atlantique',
        'LHR': 'Londyn - Lotnisko Heathrow', 'LGW': 'Londyn - Lotnisko Gatwick',
        'STN': 'Londyn - Lotnisko Stansted', 'MAN': 'Manchester - Lotnisko w Manchesterze',
        'EDI': 'Edynburg - Lotnisko w Edynburgu', 'BHX': 'Birmingham - Lotnisko w Birmingham',
        'JFK': 'Nowy Jork - Lotnisko JFK', 'LAX': 'Los Angeles - Lotnisko LAX',
        'ORD': 'Chicago - Lotnisko O\'Hare', 'ATL': 'Atlanta - Lotnisko Hartsfield-Jackson',
        'DFW': 'Dallas/Fort Worth - Lotnisko DFW', 'DEN': 'Denver - Lotnisko Denver',
        'SFO': 'San Francisco - Lotnisko San Francisco',
        'MAD': 'Madryt - Lotnisko Barajas', 'BCN': 'Barcelona - Lotnisko El Prat',
        'AGP': 'Malaga - Lotnisko Malaga-Costa del Sol', 'PMI': 'Palma de Mallorca - Lotnisko Palma de Mallorca',
        'FCO': 'Rzym - Lotnisko Fiumicino', 'MXP': 'Mediolan - Lotnisko Malpensa',
        'BGY': 'Bergamo - Lotnisko Orio al Serio', 'VCE': 'Wenecja - Lotnisko Marco Polo',
        'AMS': 'Amsterdam - Lotnisko Schiphol', 'CPH': 'Kopenhaga - Lotnisko Kastrup',
        'OSL': 'Oslo - Lotnisko Gardermoen', 'HEL': 'Helsinki - Lotnisko Helsinki-Vantaa',
        'PRG': 'Praga - Lotnisko im. Václava Havla', 'VIE': 'Wiedeń - Lotnisko Wiedeń-Schwechat',
        'ZRH': 'Zurych - Lotnisko Zurych', 'BRU': 'Bruksela - Lotnisko Bruksela',
        'LIS': 'Lizbona - Lotnisko Lizbona', 'ATH': 'Ateny - Lotnisko Eleftherios Venizelos',
        'IST': 'Stambuł - Lotnisko Stambuł', 'DXB': 'Dubaj - Lotnisko Dubaj',
        'BKK': 'Bangkok - Lotnisko Suvarnabhumi', 'SGN': 'Ho Chi Minh - Lotnisko Tan Son Nhat',
        'SIN': 'Singapur - Lotnisko Changi', 'NRT': 'Tokio - Lotnisko Narita',
        'SYD': 'Sydney - Lotnisko Kingsford Smith', 'ALC': 'Alicante - Lotnisko Alicante-Elche'
    };

    // --- Zmienne stanu dla modali ---
    let currentAirportSelectionField = null; // Przechowuje referencję do inputu, który otworzył modal lotnisk
    let selectedDepartureDate = null;
    let selectedReturnDate = null;
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let adults = 1;
    let children = 0;
    let infants = 0;
    let travelClass = 'economy';

    // --- Funkcje pomocnicze ---
    function openModal(modalElement) {
        modalElement.style.display = 'block';
        modalOverlay.style.display = 'flex';
        document.body.classList.add('no-scroll'); // Zapobieganie przewijaniu tła
    }

    function closeModal() {
        airportSelectionModal.style.display = 'none';
        datePickerModal.style.display = 'none';
        passengersClassModal.style.display = 'none';
        modalOverlay.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }

    function formatDateForInput(dateObj) {
        if (!dateObj) return '';
        const day = dateObj.getDate().toString().padStart(2, '0');
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const year = dateObj.getFullYear();
        return `${day}.${month}.${year}`;
    }

    function formatDateForDisplay(dateObj) {
        if (!dateObj) return 'Brak';
        const options = { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' };
        return dateObj.toLocaleDateString('pl-PL', options);
    }

    function updatePassengersAndClassInput() {
        let text = `${adults} Dorosły${adults !== 1 ? 'ch' : ''}`;
        if (children > 0) text += `, ${children} Dzieci`;
        if (infants > 0) text += `, ${infants} Niemowląt`;

        let classText = '';
        switch (travelClass) {
            case 'economy': classText = 'Ekonomiczna'; break;
            case 'premium_economy': classText = 'Ekonomiczna Plus'; break;
            case 'business': classText = 'Biznes'; break;
            case 'first': classText = 'Pierwsza'; break;
        }
        passengersAndClassInput.value = `${text}, ${classText}`;
    }


    // --- Obsługa Modalu Wyboru Lotniska ---
    const airportSearchInput = document.getElementById('airportSearchInput');
    const airportListsDiv = document.getElementById('airport-lists');

    function renderAirportList(filter = '') {
        airportListsDiv.innerHTML = '';
        const filteredAirports = Object.entries(airportNames).filter(([code, name]) =>
            code.toLowerCase().includes(filter.toLowerCase()) || name.toLowerCase().includes(filter.toLowerCase())
        );

        if (filteredAirports.length === 0) {
            airportListsDiv.innerHTML = '<p style="text-align: center; margin-top: 20px; color: #777;">Brak wyników.</p>';
            return;
        }

        const maxPerColumn = Math.ceil(filteredAirports.length / (window.innerWidth > 768 ? 2 : 1)); // 2 kolumny na dużych, 1 na małych
        let currentColumn = document.createElement('div');
        currentColumn.classList.add('airport-column');
        let ul = document.createElement('ul');
        currentColumn.appendChild(ul);
        airportListsDiv.appendChild(currentColumn);

        filteredAirports.forEach(([code, name], index) => {
            if (window.innerWidth > 768 && index > 0 && index % maxPerColumn === 0) {
                currentColumn = document.createElement('div');
                currentColumn.classList.add('airport-column');
                ul = document.createElement('ul');
                currentColumn.appendChild(ul);
                airportListsDiv.appendChild(currentColumn);
            }

            const li = document.createElement('li');
            li.dataset.code = code;
            li.textContent = `${name} (${code})`;
            li.addEventListener('click', () => {
                if (currentAirportSelectionField) {
                    currentAirportSelectionField.value = `${name} (${code})`;
                }
                closeModal();
            });
            ul.appendChild(li);
        });
    }

    // Otwieranie modalu wyboru lotniska
    departureInput.addEventListener('click', () => {
        currentAirportSelectionField = departureInput;
        renderAirportList();
        openModal(airportSelectionModal);
        airportSearchInput.value = ''; // Wyczyść pole wyszukiwania
        airportSearchInput.focus();
    });

    destinationInput.addEventListener('click', () => {
        currentAirportSelectionField = destinationInput;
        renderAirportList();
        openModal(airportSelectionModal);
        airportSearchInput.value = '';
        airportSearchInput.focus();
    });

    // Wyszukiwanie lotnisk w modalu
    airportSearchInput.addEventListener('input', (e) => {
        renderAirportList(e.target.value);
    });


    // --- Obsługa Modalu Wyboru Daty ---
    const monthYearDisplay = document.getElementById('monthYearDisplay');
    const datepickerDays = document.getElementById('datepickerDays');
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    const nextMonthBtn = document.getElementById('nextMonthBtn');
    const displayDepartureDate = document.getElementById('displayDepartureDate');
    const displayReturnDate = document.getElementById('displayReturnDate');
    const clearReturnDateBtn = document.getElementById('clearReturnDateBtn');
    const confirmDatesBtn = document.getElementById('confirmDatesBtn');

    // Funkcja do renderowania kalendarza
    function renderCalendar() {
        datepickerDays.innerHTML = ''; // Wyczyść poprzednie dni
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Resetuj czas dla porównań

        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        monthYearDisplay.textContent = `${firstDayOfMonth.toLocaleString('pl-PL', { month: 'long' })} ${currentYear}`;

        // Oblicz pusty początek tygodnia (poniedziałek = 0, wtorek = 1, ...)
        let startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Przesunięcie, aby poniedziałek był pierwszy

        // Dodaj puste dni przed pierwszym dniem miesiąca
        for (let i = 0; i < startDayOfWeek; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('empty');
            datepickerDays.appendChild(emptyDiv);
        }

        // Dodaj dni miesiąca
        for (let i = 1; i <= daysInMonth; i++) {
            const dayDiv = document.createElement('div');
            const date = new Date(currentYear, currentMonth, i);
            date.setHours(0, 0, 0, 0); // Resetuj czas dla porównań

            dayDiv.textContent = i;
            dayDiv.dataset.date = date.toISOString().split('T')[0]; // Format YYYY-MM-DD

            // Jeśli data jest w przeszłości, zablokuj
            if (date < today) {
                dayDiv.classList.add('disabled');
            } else {
                dayDiv.addEventListener('click', () => {
                    handleDateSelection(date);
                });
            }

            // Oznacz wybrane daty
            if (selectedDepartureDate && date.getTime() === selectedDepartureDate.getTime()) {
                dayDiv.classList.add('selected');
            }
            if (selectedReturnDate && date.getTime() === selectedReturnDate.getTime()) {
                dayDiv.classList.add('selected');
            }

            // Oznacz zakres dat
            if (selectedDepartureDate && selectedReturnDate) {
                if (date > selectedDepartureDate && date < selectedReturnDate) {
                    dayDiv.classList.add('selected-range');
                }
            }

            datepickerDays.appendChild(dayDiv);
        }
        updateDateDisplay();
    }

    // Obsługa wyboru daty
    function handleDateSelection(date) {
        if (!selectedDepartureDate || (selectedDepartureDate && selectedReturnDate)) {
            // Resetuj, jeśli już wybrano zakres lub jest to pierwszy wybór
            selectedDepartureDate = date;
            selectedReturnDate = null;
        } else if (date.getTime() < selectedDepartureDate.getTime()) {
            // Jeśli nowa data jest wcześniejsza niż data wylotu, ustaw ją jako wylot
            selectedDepartureDate = date;
            selectedReturnDate = null;
        } else {
            // Ustaw jako datę powrotu
            selectedReturnDate = date;
        }
        renderCalendar(); // Przeładuj kalendarz, aby zaktualizować zaznaczenia
        updateConfirmButtonState();
    }

    // Aktualizacja wyświetlanych dat w modalu
    function updateDateDisplay() {
        displayDepartureDate.textContent = formatDateForDisplay(selectedDepartureDate);
        displayReturnDate.textContent = formatDateForDisplay(selectedReturnDate);
        clearReturnDateBtn.style.display = selectedReturnDate ? 'inline-block' : 'none';
        updateConfirmButtonState();
    }

    // Aktywacja przycisku "Potwierdź daty"
    function updateConfirmButtonState() {
        confirmDatesBtn.disabled = !selectedDepartureDate; // Przycisk aktywny, jeśli wylot wybrany
        if (confirmDatesBtn.disabled) {
             confirmDatesBtn.classList.remove('confirm-btn'); // Możesz dodać klasę disabled
        } else {
            confirmDatesBtn.classList.add('confirm-btn');
        }
    }


    // Obsługa przycisków nawigacji miesiąca
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

    // Czyszczenie daty powrotu
    clearReturnDateBtn.addEventListener('click', () => {
        selectedReturnDate = null;
        renderCalendar();
    });

    // Potwierdzenie dat i zamknięcie modala
    confirmDatesBtn.addEventListener('click', () => {
        if (!selectedDepartureDate) {
            alert('Proszę wybrać datę wylotu.');
            return;
        }
        departureDateInput.value = formatDateForInput(selectedDepartureDate);
        returnDateInput.value = formatDateForInput(selectedReturnDate);
        closeModal();
    });

    // Otwieranie modala daty
    departureDateInput.addEventListener('click', () => {
        // Ustaw początkowy miesiąc na aktualny wybór lub bieżący
        if (selectedDepartureDate) {
            currentMonth = selectedDepartureDate.getMonth();
            currentYear = selectedDepartureDate.getFullYear();
        } else {
            const today = new Date();
            currentMonth = today.getMonth();
            currentYear = today.getFullYear();
        }
        renderCalendar();
        openModal(datePickerModal);
    });

    returnDateInput.addEventListener('click', () => {
        // Jeśli jest już data wylotu, ustaw kalendarz na ten miesiąc
        if (selectedDepartureDate) {
            currentMonth = selectedDepartureDate.getMonth();
            currentYear = selectedDepartureDate.getFullYear();
        } else {
            const today = new Date();
            currentMonth = today.getMonth();
            currentYear = today.getFullYear();
        }
        renderCalendar();
        openModal(datePickerModal);
    });


    // --- Obsługa Modalu Pasażerów i Klasy ---
    const adultsCountSpan = document.getElementById('adultsCount');
    const childrenCountSpan = document.getElementById('childrenCount');
    const infantsCountSpan = document.getElementById('infantsCount');
    const modalTravelClassSelect = document.getElementById('modalTravelClass');
    const confirmPassengersClassBtn = document.getElementById('confirmPassengersClassBtn');

    // Obsługa przycisków +/-
    document.querySelectorAll('.passenger-counter .counter-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const type = e.target.dataset.type;
            const action = e.target.textContent; // '-' or '+'

            switch (type) {
                case 'adults':
                    if (action === '+' && adults < 9) adults++;
                    else if (action === '-' && adults > 1) adults--;
                    // Niemowlęta nie mogą być więcej niż dorośli
                    if (infants > adults) infants = adults;
                    break;
                case 'children':
                    if (action === '+' && children < 9) children++;
                    else if (action === '-' && children > 0) children--;
                    break;
                case 'infants':
                    if (action === '+' && infants < adults) infants++; // Max niemowląt = dorośli
                    else if (action === '-' && infants > 0) infants--;
                    break;
            }
            updatePassengerCounters();
        });
    });

    // Aktualizacja liczników w modalu
    function updatePassengerCounters() {
        adultsCountSpan.textContent = adults;
        childrenCountSpan.textContent = children;
        infantsCountSpan.textContent = infants;
        // Zaktualizuj klasę podróży, gdy licznik się zmienia (aby odświeżyć wyświetlanie)
        travelClass = modalTravelClassSelect.value; 
    }

    // Otwieranie modalu pasażerów i klasy
    passengersAndClassInput.addEventListener('click', () => {
        updatePassengerCounters(); // Zaktualizuj modale na podstawie aktualnych wartości
        modalTravelClassSelect.value = travelClass; // Ustaw wybraną klasę
        openModal(passengersClassModal);
    });

    // Zmiana klasy podróży w modalu
    modalTravelClassSelect.addEventListener('change', (e) => {
        travelClass = e.target.value;
    });

    // Potwierdzenie pasażerów i klasy
    confirmPassengersClassBtn.addEventListener('click', () => {
        updatePassengersAndClassInput(); // Zaktualizuj pole input na głównym formularzu
        closeModal();
    });


    // --- Obsługa Submita Formularza Głównego ---
    if (flightSearchForm) {
        flightSearchForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Zatrzymaj domyślne zachowanie formularza

            const departureVal = departureInput.value;
            const destinationVal = destinationInput.value;
            const depDateVal = departureDateInput.value; // Format DD.MM.RRRR
            const retDateVal = returnDateInput.value; // Format DD.MM.RRRR (może być puste)

            // Prosta walidacja, czy pola są wypełnione
            if (!departureVal || !destinationVal || !depDateVal) {
                alert('Proszę wypełnić wszystkie wymagane pola: Skąd, Dokąd, Data wylotu.');
                return;
            }

            // Wydobycie kodu IATA z tekstu (np. "Warszawa (WAW)" -> "WAW")
            const getCode = (text) => {
                const match = text.match(/\(([A-Z]{3})\)/);
                return match ? match[1] : '';
            };

            const departureCode = getCode(departureVal);
            const destinationCode = getCode(destinationVal);

            if (!departureCode || !destinationCode) {
                 alert('Proszę wybrać lotniska z listy sugestii, aby uzyskać prawidłowy kod lotniska (np. WAW).');
                 return;
            }

            // Tworzenie obiektu URLSearchParams do przekazania parametrów
            const params = new URLSearchParams();
            params.append('departure', departureCode);
            params.append('destination', destinationCode);
            params.append('depDate', depDateVal);
            if (retDateVal) {
                params.append('retDate', retDateVal);
            }
            params.append('adults', adults);
            params.append('children', children);
            params.append('infants', infants);
            params.append('class', travelClass);

            // Przekierowanie do strony wyników z parametrami w URL
            window.location.href = `results.html?${params.toString()}`;
        });
    }

    // --- Inicjalizacja przy ładowaniu strony ---
    // Ustaw początkową wartość w polu pasażerów i klasy
    updatePassengersAndClassInput();
});
