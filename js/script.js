document.addEventListener('DOMContentLoaded', () => {
    const flightSelectionSection = document.getElementById('flight-selection');
    const paymentSimulationSection = document.getElementById('payment-simulation');
    const flightForm = document.getElementById('flight-form');

    // Elementy nawigacji
    const languageIcon = document.getElementById('language-icon');
    const languageDropdown = document.getElementById('language-dropdown');
    const currencyIcon = document.getElementById('currency-icon');
    const currencyDropdown = document.getElementById('currency-dropdown');
    const accountIcon = document.getElementById('account-icon');
    const accountDropdown = document.getElementById('account-dropdown');
    const registerLink = document.getElementById('register-link');
    const loginLink = document.getElementById('login-link');

    // Elementy dla wyboru miasta/lotniska
    const departureCityInput = document.getElementById('departureCity');
    const arrivalCityInput = document.getElementById('arrivalCity');
    const citySelectionModal = document.getElementById('citySelectionModal');
    const cityListItems = citySelectionModal.querySelectorAll('.city-list li');
    let currentCityInput = null; // Przechowuje, które pole input jest aktywne (wylot czy przylot)

    // Elementy dla kalendarza
    const departureDateInput = document.getElementById('departureDate');
    const returnDateInput = document.getElementById('returnDate');
    const calendarModal = document.getElementById('calendarModal');
    const calendarContainer = document.getElementById('calendar-container');
    let currentCalendarInput = null; // Przechowuje, które pole daty jest aktywne (wylot czy powrót)
    let selectedDepartureDate = null; // Przechowuje wybraną datę wylotu (obiekt Date)
    let selectedReturnDate = null; // Przechowuje wybraną datę powrotu (obiekt Date)

    // Elementy dla modala wyboru klasy i pasażerów
    const classPassengersInput = document.getElementById('classPassengers'); // Input, który otworzy modal
    const travelDetailsModal = document.getElementById('travelDetailsModal'); // Sam modal
    const classButtons = travelDetailsModal.querySelectorAll('.class-button');
    const passengerCounts = {
        adults: 1, teenagers: 0, children: 0, 'infants-seat': 0, 'infants-lap': 0
    };
    const quantityControls = travelDetailsModal.querySelectorAll('.quantity-control button');
    const confirmPassengersBtn = travelDetailsModal.querySelector('.confirm-passengers-btn');
    let selectedClass = "LOT Economy Class"; // Domyślna klasa

    // --- Funkcje Ogólne ---

    // Funkcja do przełączania widoczności rozwijanych menu
    function toggleDropdown(dropdownElement) {
        // Zamknij wszystkie inne otwarte rozwijane menu
        document.querySelectorAll('.dropdown-content').forEach(dropdown => {
            if (dropdown !== dropdownElement && dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        });
        dropdownElement.classList.toggle('show');
    }

    // Funkcja do zamykania wszystkich modali
    function closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    // --- Obsługa Nawigacji (Dropdowns) ---

    if (languageIcon) {
        languageIcon.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleDropdown(languageDropdown);
        });
    }

    if (currencyIcon) {
        currencyIcon.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleDropdown(currencyDropdown);
        });
    }

    if (accountIcon) {
        accountIcon.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleDropdown(accountDropdown);
        });
    }

    // Zamknij rozwijane menu, jeśli kliknięto poza nimi
    document.addEventListener('click', (event) => {
        if (languageDropdown && languageDropdown.classList.contains('show') && !languageDropdown.contains(event.target) && event.target !== languageIcon) {
            languageDropdown.classList.remove('show');
        }
        if (currencyDropdown && currencyDropdown.classList.contains('show') && !currencyDropdown.contains(event.target) && event.target !== currencyIcon) {
            currencyDropdown.classList.remove('show');
        }
        if (accountDropdown && accountDropdown.classList.contains('show') && !accountDropdown.contains(event.target) && event.target !== accountIcon) {
            accountDropdown.classList.remove('show');
        }

        // Zamknij modale, jeśli kliknięto poza ich zawartością, ale nie na triggerze
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    // Obsługa przycisków zamykania modali (X)
    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const modalId = event.target.dataset.modal;
            document.getElementById(modalId).style.display = 'none';
        });
    });

    if (registerLink) {
        registerLink.addEventListener('click', (event) => {
            console.log('Przejście do strony rejestracji.');
        });
    }

    if (loginLink) {
        loginLink.addEventListener('click', (event) => {
            event.preventDefault();
            alert('Funkcja logowania w przygotowaniu!');
        });
    }

    // --- Obsługa Modala Wyboru Klasy i Pasażerów ---

    // Otwórz modal po kliknięciu w input
    if (classPassengersInput) {
        classPassengersInput.addEventListener('click', () => {
            closeAllModals();
            travelDetailsModal.style.display = 'block';
            // Upewnij się, że domyślna klasa jest zaznaczona przy otwarciu, jeśli jeszcze nie była
            if (!document.querySelector('.class-button.selected') && classButtons.length > 0) {
                classButtons[0].classList.add('selected');
                selectedClass = classButtons[0].dataset.class;
            }
        });
    }

    classButtons.forEach(button => {
        button.addEventListener('click', () => {
            classButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            selectedClass = button.dataset.class; // Zapisz wybraną klasę
        });
    });

    quantityControls.forEach(button => {
        button.addEventListener('click', () => {
            const type = button.dataset.type;
            if (button.classList.contains('minus-btn')) {
                if (passengerCounts[type] > (type === 'adults' ? 1 : 0)) { // Dorośli min. 1, reszta min. 0
                    passengerCounts[type]--;
                }
            } else if (button.classList.contains('plus-btn')) {
                passengerCounts[type]++;
            }
            document.getElementById(`${type}-count`).textContent = passengerCounts[type];
        });
    });

    if (confirmPassengersBtn) {
        confirmPassengersBtn.addEventListener('click', () => {
            // Walidacja: upewnij się, że co najmniej 1 dorosły został wybrany
            if (passengerCounts.adults < 1) {
                alert("Musisz wybrać co najmniej jednego dorosłego pasażera.");
                return;
            }

            travelDetailsModal.style.display = 'none'; // Zamknij modal
            updateClassPassengersInput(); // Zaktualizuj input na stronie głównej
        });
    }

    function updateClassPassengersInput() {
        let totalPassengers = 0;
        for (const type in passengerCounts) {
            totalPassengers += passengerCounts[type];
        }
        let summaryText = '';
        if (selectedClass) {
            summaryText += `${selectedClass}`;
        }
        if (totalPassengers > 0) {
            if (summaryText) summaryText += ", ";
            summaryText += `${totalPassengers} pasażerów`;
        } else {
             // To raczej nie powinno się zdarzyć, bo dorośli >= 1, ale na wszelki wypadek
             if (summaryText) summaryText += ", ";
             summaryText += `0 pasażerów`;
        }

        classPassengersInput.value = summaryText || "Wybierz klasę i liczbę pasażerów";
    }

    // Ustawienie domyślnej klasy przy ładowaniu
    // Zaznacz pierwszy przycisk klasy jako domyślny i ustaw selectedClass
    if (classButtons.length > 0 && !document.querySelector('.class-button.selected')) {
        classButtons[0].classList.add('selected');
        selectedClass = classButtons[0].dataset.class;
    }
    // Ustawienie początkowej wartości inputa przy ładowaniu strony
    updateClassPassengersInput();


    // --- Obsługa Modala Wyboru Miasta/Lotniska ---

    departureCityInput.addEventListener('click', () => {
        closeAllModals();
        currentCityInput = departureCityInput;
        citySelectionModal.style.display = 'block';
    });

    arrivalCityInput.addEventListener('click', () => {
        closeAllModals();
        currentCityInput = arrivalCityInput;
        citySelectionModal.style.display = 'block';
    });

    cityListItems.forEach(item => {
        item.addEventListener('click', () => {
            if (currentCityInput) {
                currentCityInput.value = item.textContent;
                citySelectionModal.style.display = 'none';
            }
        });
    });

    // --- Obsługa Modala Kalendarza ---

    departureDateInput.addEventListener('click', () => {
        closeAllModals();
        currentCalendarInput = departureDateInput;
        renderCalendar();
        calendarModal.style.display = 'block';
    });

    returnDateInput.addEventListener('click', () => {
        closeAllModals();
        currentCalendarInput = returnDateInput;
        renderCalendar();
        calendarModal.style.display = 'block';
    });


    // Logika renderowania kalendarza
    let currentCalendarDate = new Date(); // Aktualny miesiąc/rok wyświetlany w kalendarzu
    currentCalendarDate.setDate(1); // Ustaw na pierwszy dzień miesiąca, żeby uniknąć problemów z przełączaniem miesięcy

    function renderCalendar() {
        calendarContainer.innerHTML = ''; // Wyczyść poprzedni kalendarz

        const monthNames = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
        const dayNames = ["Nie", "Pon", "Wt", "Śr", "Czw", "Pt", "Sob"];

        const year = currentCalendarDate.getFullYear();
        const month = currentCalendarDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // Dzień tygodnia pierwszego dnia miesiąca (0=niedziela)
        const daysInMonth = new Date(year, month + 1, 0).getDate(); // Liczba dni w miesiącu

        // Nawigacja kalendarza
        const navDiv = document.createElement('div');
        navDiv.classList.add('calendar-nav');
        const prevMonthBtn = document.createElement('button');
        prevMonthBtn.textContent = '<';
        prevMonthBtn.addEventListener('click', () => {
            currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
            renderCalendar();
        });
        const nextMonthBtn = document.createElement('button');
        nextMonthBtn.textContent = '>';
        nextMonthBtn.addEventListener('click', () => {
            currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
            renderCalendar();
        });
        const monthYearSpan = document.createElement('span');
        monthYearSpan.classList.add('current-month-year');
        monthYearSpan.textContent = `${monthNames[month]} ${year}`;
        navDiv.appendChild(prevMonthBtn);
        navDiv.appendChild(monthYearSpan);
        navDiv.appendChild(nextMonthBtn);
        calendarContainer.appendChild(navDiv);


        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // Dni tygodnia
        const headerRow = document.createElement('tr');
        dayNames.forEach(day => {
            const th = document.createElement('th');
            th.textContent = day;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Dni miesiąca
        let date = 1;
        for (let i = 0; i < 6; i++) { // Max 6 tygodni
            const row = document.createElement('tr');
            for (let j = 0; j < 7; j++) { // 7 dni tygodnia
                const cell = document.createElement('td');
                if (i === 0 && j < firstDayOfMonth) {
                    // Puste komórki przed pierwszym dniem miesiąca
                    cell.textContent = '';
                } else if (date > daysInMonth) {
                    // Puste komórki po ostatnim dniu miesiąca
                    cell.textContent = '';
                } else {
                    const cellDate = new Date(year, month, date);
                    cellDate.setHours(0,0,0,0); // Normalizuj czas

                    cell.textContent = date;

                    // Ograniczenie dat do roku do przodu od dzisiaj
                    const today = new Date();
                    today.setHours(0,0,0,0);
                    const maxDate = new Date();
                    maxDate.setFullYear(maxDate.getFullYear() + 1);
                    maxDate.setHours(23,59,59,999);


                    if (cellDate < today || cellDate > maxDate) {
                        cell.classList.add('disabled'); // Wyłącz daty poza zakresem
                        cell.style.pointerEvents = 'none'; // Wyłącz klikanie
                    } else {
                        cell.dataset.date = cellDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
                        cell.addEventListener('click', (event) => {
                            const clickedDateString = event.target.dataset.date;
                            const clickedDate = new Date(clickedDateString);
                            clickedDate.setHours(0,0,0,0); // Normalizuj czas

                            if (currentCalendarInput === departureDateInput) {
                                // Wybieranie daty wylotu
                                selectedDepartureDate = clickedDate;
                                departureDateInput.value = clickedDate.toLocaleDateString('pl-PL');
                                selectedReturnDate = null; // Reset daty powrotu
                                returnDateInput.value = '';
                            } else if (currentCalendarInput === returnDateInput) {
                                // Wybieranie daty powrotu
                                if (selectedDepartureDate && clickedDate < selectedDepartureDate) {
                                    alert('Data powrotu nie może być wcześniejsza niż data wylotu.');
                                    return;
                                }
                                selectedReturnDate = clickedDate;
                                returnDateInput.value = clickedDate.toLocaleDateString('pl-PL');
                            }
                            calendarModal.style.display = 'none'; // Zamknij modal po wyborze daty
                        });

                        // Podświetlanie wybranych dat
                        if (selectedDepartureDate && cellDate.toDateString() === selectedDepartureDate.toDateString()) {
                            cell.classList.add('selected');
                        } else if (selectedReturnDate && cellDate.toDateString() === selectedReturnDate.toDateString()) {
                            cell.classList.add('selected');
                        }
                    }
                    date++;
                }
                row.appendChild(cell);
            }
            tbody.appendChild(row);
            if (date > daysInMonth) break; // Przerwij pętlę, jeśli wszystkie dni zostały dodane
        }
        table.appendChild(tbody);
        calendarContainer.appendChild(table);
    }

    // --- Obsługa Formularza Wyszukiwania Lotów ---

    if (flightForm) {
        flightForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const departureCity = departureCityInput.value;
            const arrivalCity = arrivalCityInput.value;
            const departureDate = departureDateInput.value;
            const returnDate = returnDateInput.value; // Może być pusty string jeśli lot w jedną stronę

            // Walidacja podstawowa
            if (!departureCity || !arrivalCity || !departureDate || !classPassengersInput.value || classPassengersInput.value === "Wybierz klasę i liczbę pasażerów") {
                alert('Proszę wypełnić wszystkie wymagane pola lotu (Miasto wylotu, Miasto przylotu, Data wylotu, Klasa i pasażerowie).');
                return;
            }

            // Przekierowanie na nową stronę z wynikami
            const queryParams = new URLSearchParams();
            queryParams.append('departureCity', departureCity);
            queryParams.append('arrivalCity', arrivalCity);
            queryParams.append('departureDate', departureDate);
            if (returnDate) {
                queryParams.append('returnDate', returnDate);
            }
            queryParams.append('selectedClass', selectedClass); // Użyj zmiennej selectedClass
            queryParams.append('adults', passengerCounts.adults);
            queryParams.append('teenagers', passengerCounts.teenagers);
            queryParams.append('children', passengerCounts.children);
            queryParams.append('infants-seat', passengerCounts['infants-seat']);
            queryParams.append('infants-lap', passengerCounts['infants-lap']);


            // Przekierowujemy na flights.html, który jest w tym samym katalogu głównym
            window.location.href = `flights.html?${queryParams.toString()}`;
        });
    }

    // --- Początkowe ukrywanie/pokazywanie sekcji i modali ---
    // Upewnij się, że główna sekcja formularza jest widoczna
    flightSelectionSection.style.display = 'block';
    // Upewnij się, że sekcja płatności jest ukryta na start
    paymentSimulationSection.style.display = 'none';

    // Upewnij się, że wszystkie modale są ukryte na start
    closeAllModals(); // Ta funkcja już to robi dla wszystkich elementów z klasą 'modal'
});
