// js/script.js - Logika modali lotnisk (rozszerzona o Niemcy i Francję)

document.addEventListener('DOMContentLoaded', () => {
    const flightSearchForm = document.getElementById('flightSearchForm');

    // --- Dane o lotniskach ---
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

    // --- Obsługa modali lotnisk ---
    const airportSelectionModal = document.getElementById('airportSelectionModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeButton = airportSelectionModal.querySelector('.close-button');
    const departureInput = document.getElementById('departure');
    const destinationInput = document.getElementById('destination');

    // Odwołania do list lotnisk dla poszczególnych krajów
    const polishAirportList = document.getElementById('polishAirportList');
    const germanAirportList = document.getElementById('germanAirportList');
    const frenchAirportList = document.getElementById('frenchAirportList');


    let currentAirportInput = null; // Przechowuje referencję do aktualnie klikniętego inputu (departure/destination)

    // Funkcja do wypełniania listy lotnisk
    function populateAirportList(countryCode) {
        let targetListElement;
        let airportsToDisplay;

        // Określenie, która lista ma być wypełniona i które lotniska
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

        targetListElement.innerHTML = ''; // Wyczyść listę przed dodaniem
        airportsToDisplay.forEach(airport => {
            const li = document.createElement('li');
            li.textContent = `${airport.city} (${airport.code}) - ${airport.name}`;
            li.dataset.airportCode = airport.code;
            li.dataset.airportName = airport.name;
            li.dataset.airportCity = airport.city;
            targetListElement.appendChild(li);
        });
    }

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

    // Dodaj event listenery do inputów otwierających modal
    if (departureInput) {
        departureInput.addEventListener('click', () => {
            currentAirportInput = departureInput;
            // Wypełnij wszystkie listy lotnisk przy otwarciu modala
            populateAirportList('poland');
            populateAirportList('germany');
            populateAirportList('france');
            openModal(airportSelectionModal);
        });
    }
    if (destinationInput) {
        destinationInput.addEventListener('click', () => {
            currentAirportInput = destinationInput;
            // Wypełnij wszystkie listy lotnisk przy otwarciu modala
            populateAirportList('poland');
            populateAirportList('germany');
            populateAirportList('france');
            openModal(airportSelectionModal);
        });
    }

    // Dodaj event listener do przycisku zamknięcia modala lotnisk
    if (closeButton) {
        closeButton.addEventListener('click', () => closeModal(airportSelectionModal));
    }

    // Dodaj event listener do kliknięcia na tło (overlay) modala
    if (modalOverlay) {
        modalOverlay.addEventListener('click', () => closeModal(airportSelectionModal));
    }

    // Dodaj event listener do wyboru lotniska z list (teraz delegujemy na cały kontener)
    if (airportSelectionModal) {
        airportSelectionModal.addEventListener('click', (event) => {
            const selectedLi = event.target.closest('li.airport-list > li'); // Upewnij się, że kliknięto element listy lotnisk
            if (selectedLi && currentAirportInput) {
                const airportText = selectedLi.textContent;
                currentAirportInput.value = airportText;
                closeModal(airportSelectionModal);
                currentAirportInput = null;
            }
        });
    }

    // --- Istniejąca logika formularza wyszukiwania ---
    if (flightSearchForm) {
        flightSearchForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const departure = departureInput.value;
            const destination = destinationInput.value;
            const date = document.getElementById('date').value;
            const passengers = document.getElementById('passengers').value;
            const travelClass = document.getElementById('travelClass').value;

            const searchParams = {
                departure: departure,
                destination: destination,
                date: date,
                passengers: passengers,
                travelClass: travelClass
            };

            localStorage.setItem('flightSearchParams', JSON.stringify(searchParams));
            window.location.href = 'results.html';
        });
    }

    // --- Blokowanie wyboru przeszłych dat w polu 'Data wylotu' (istniejąca funkcja) ---
    // Ta funkcja zostanie zastąpiona w kolejnym kroku przez niestandardowy kalendarz
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const minDate = `${year}-${month}-${day}`;
        dateInput.setAttribute('min', minDate);
    }
});
