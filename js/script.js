document.addEventListener('DOMContentLoaded', () => {
    const flightSelectionSection = document.getElementById('flight-selection');
    const paymentSimulationSection = document.getElementById('payment-simulation');
    const travelDetailsSection = document.getElementById('travel-details'); // Nowa sekcja
    const flightForm = document.getElementById('flight-form');
    const paymentButton = paymentSimulationSection.querySelector('button');

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
    const cityModalCloseButton = citySelectionModal.querySelector('.close-button');
    const cityListItems = citySelectionModal.querySelectorAll('.city-list li');
    let currentCityInput = null; // Przechowuje, które pole input jest aktywne (wylot czy przylot)

    // Elementy dla kalendarza
    const departureDateInput = document.getElementById('departureDate');
    const returnDateInput = document.getElementById('returnDate');
    const calendarModal = document.getElementById('calendarModal');
    const calendarModalCloseButton = calendarModal.querySelector('.close-button');
    const calendarContainer = document.getElementById('calendar-container');
    let currentCalendarInput = null; // Przechowuje, które pole daty jest aktywne (wylot czy powrót)
    let selectedDepartureDate = null; // Przechowuje wybraną datę wylotu
    let selectedReturnDate = null; // Przechowuje wybraną datę powrotu

    // Elementy dla sekcji pasażerów i klasy podróży
    const classButtons = document.querySelectorAll('.class-button');
    const passengerCounts = {
        adults: 1, teenagers: 0, children: 0, 'infants-seat': 0, 'infants-lap': 0
    };
    const quantityControls = document.querySelectorAll('.quantity-control button');
    const confirmPassengersBtn = document.querySelector('.confirm-passengers-btn');

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

    // --- Obsługa Sekcji Wyboru Klasy i Pasażerów ---

    classButtons.forEach(button => {
        button.addEventListener('click', () => {
            classButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        });
    });

    quantityControls.forEach(button => {
        button.addEventListener('click', () => {
            const type = button.dataset.type;
            if (button.classList.contains('minus-btn')) {
                if (passengerCounts[type] > (type === 'adults' ? 1 : 0)) { // Dorośli min. 1
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
            // Tutaj można by dodać walidację, np. czy wybrano klasę
            alert(`Wybrano klasę: ${document.querySelector('.class-button.selected')?.dataset.class || 'Brak'}\n` +
                  `Pasażerowie: Dorośli ${passengerCounts.adults}, Nastolatkowie ${passengerCounts.teenagers}, Dzieci ${passengerCounts.children}, Niemowlęta z miejscem ${passengerCounts['infants-seat']}, Niemowlęta ${passengerCounts['infants-lap']}`);

            // Przejście do sekcji wyszukiwania lotów
            travelDetailsSection.style.display = 'none';
            flightSelectionSection.style.display = 'block';
        });
    }


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

    cityModalCloseButton.addEventListener('click', () => {
        citySelectionModal.style.display = 'none';
    });

    citySelectionModal.addEventListener('click', (event) => {
        if (event.target === citySelectionModal) {
            citySelectionModal.style.display = 'none';
        }
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

    calendarModalCloseButton.addEventListener('click', () => {
        calendarModal.style.display = 'none';
    });

    calendarModal.addEventListener('click', (event) => {
        if (event.target === calendarModal) {
            calendarModal.style.display = 'none';
        }
    });

    // Logika renderowania kalendarza
    let currentCalendarDate = new Date(); // Aktualny miesiąc/rok wyświetlany w kalendarzu

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
                            const clickedDate = new Date(event.target.dataset.date);
                            clickedDate.setHours(0,0,0,0);

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
                        }
                        if (selectedReturnDate && cellDate.toDateString() === selectedReturnDate.toDateString()) {
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
            const returnDate = returnDateInput.value;

            if (!departureCity || !arrivalCity || !departureDate) {
                alert('Proszę wypełnić wszystkie wymagane pola lotu (miasto wylotu, przylotu, data wylotu).');
                return;
            }

            let flightDetails = `Znaleziono lot dla VIS Airlines:\n`;
            flightDetails += `Wylot z: ${departureCity}\n`;
            flightDetails += `Przylot do: ${arrivalCity}\n`;
            flightDetails += `Data wylotu: ${departureDate}\n`;
            if (returnDate) {
                flightDetails += `Data powrotu: ${returnDate}\n`;
            } else {
                 flightDetails += `Lot w jedną stronę\n`;
            }
            flightDetails += `Klasa podróży: ${document.querySelector('.class-button.selected')?.dataset.class || 'Nie wybrano'}\n`;
            flightDetails += `Liczba pasażerów: Dorośli ${passengerCounts.adults}, Nastolatkowie ${passengerCounts.teenagers}, Dzieci ${passengerCounts.children}, Niemowlęta z miejscem ${passengerCounts['infants-seat']}, Niemowlęta ${passengerCounts['infants-lap']}\n`;
            flightDetails += `\nPrzechodzimy do symulacji płatności.`;

            alert(flightDetails);

            flightSelectionSection.style.display = 'none';
            paymentSimulationSection.style.display = 'block';
        });
    }

    // --- Obsługa Przycisku Płatności ---

    if (paymentButton) {
        paymentButton.addEventListener('click', () => {
            alert('Symulacja płatności dla VIS Airlines zakończona pomyślnie! Bilet został "kupiony".');
        });
    }

    // --- Początkowe ukrywanie/pokazywanie sekcji ---
    // Startujemy od sekcji wyboru klasy/pasażerów
    travelDetailsSection.style.display = 'block';
    flightSelectionSection.style.display = 'none';
    paymentSimulationSection.style.display = 'none';
});
