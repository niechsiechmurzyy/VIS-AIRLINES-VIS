// ... (poprzedni kod) ...

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
            // Zapisz datę w formacie YYYY-MM-DD dla łatwiejszego przekazywania w URL
            departureDateInput.dataset.date = selectedDepartureDate ? selectedDepartureDate.toISOString().split('T')[0] : '';
            
            returnDateInput.value = selectedReturnDate ? selectedReturnDate.toLocaleDateString('pl-PL') : '';
            returnDateInput.dataset.date = selectedReturnDate ? selectedReturnDate.toISOString().split('T')[0] : '';
        } else if (activeDateInput === returnDateInput) {
            returnDateInput.value = selectedReturnDate ? selectedReturnDate.toLocaleDateString('pl-PL') : '';
            returnDateInput.dataset.date = selectedReturnDate ? selectedReturnDate.toISOString().split('T')[0] : '';
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
        // Aktualizuj również travelClass, aby zawsze odzwierciedlało wybraną wartość
        travelClass = modalTravelClassSelect.value;
        const travelClassText = modalTravelClassSelect.options[modalTravelClassSelect.selectedIndex].text;
        passengersAndClassInput.value = `${totalPassengers} pasażer${totalPassengers === 1 ? '' : totalPassengers > 4 ? 'ów' : 'erów'}, ${travelClassText}`;
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


    // === Obsługa formularza wyszukiwania (przekierowanie do strony wyników) ===
    const flightSearchForm = document.getElementById('flightSearchForm');
    flightSearchForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Zapobiegaj domyślnemu przesyłaniu formularza
        
        const departureCode = departureInput.dataset.code; // Użyj dataset.code
        const destinationCode = destinationInput.dataset.code; // Użyj dataset.code
        const departureDate = departureDateInput.dataset.date; // Użyj dataset.date
        const returnDate = returnDateInput.dataset.date; // Użyj dataset.date (może być puste)

        const params = new URLSearchParams();
        params.append('departure', departureCode || '');
        params.append('destination', destinationCode || '');
        params.append('depDate', departureDate || '');
        if (returnDate) { // Dodaj datę powrotu tylko jeśli jest wybrana
            params.append('retDate', returnDate);
        }
        params.append('adults', adults);
        params.append('children', children);
        params.append('infants', infants);
        params.append('class', travelClass); // travelClass jest już zaktualizowany przez updatePassengerDisplay

        window.location.href = `results.html?${params.toString()}`;
    });

    // Inicjalizacje
    renderCalendar(); // Renderuj kalendarz przy starcie

});
