// js/script.js - Logika modali lotnisk

document.addEventListener('DOMContentLoaded', () => {
    const flightSearchForm = document.getElementById('flightSearchForm');

    // --- Dane o lotniskach w Polsce ---
    const polishAirports = [
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
    ];

    // --- Obsługa modali lotnisk ---
    const airportSelectionModal = document.getElementById('airportSelectionModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeButton = airportSelectionModal.querySelector('.close-button');
    const departureInput = document.getElementById('departure');
    const destinationInput = document.getElementById('destination');
    const polishAirportList = document.getElementById('polishAirportList');

    let currentAirportInput = null; // Przechowuje referencję do aktualnie klikniętego inputu (departure/destination)

    // Funkcja do wypełniania listy lotnisk
    function populateAirportList() {
        polishAirportList.innerHTML = ''; // Wyczyść listę przed dodaniem
        polishAirports.forEach(airport => {
            const li = document.createElement('li');
            li.textContent = `${airport.city} (${airport.code}) - ${airport.name}`;
            li.dataset.airportCode = airport.code;
            li.dataset.airportName = airport.name;
            li.dataset.airportCity = airport.city;
            polishAirportList.appendChild(li);
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
            populateAirportList(); // Upewnij się, że lista jest świeża
            openModal(airportSelectionModal);
        });
    }
    if (destinationInput) {
        destinationInput.addEventListener('click', () => {
            currentAirportInput = destinationInput;
            populateAirportList(); // Upewnij się, że lista jest świeża
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

    // Dodaj event listener do wyboru lotniska z listy
    if (polishAirportList) {
        polishAirportList.addEventListener('click', (event) => {
            const selectedLi = event.target.closest('li');
            if (selectedLi && currentAirportInput) {
                const airportText = selectedLi.textContent; // Np. "Warszawa (WAW) - Warszawa Chopin"
                currentAirportInput.value = airportText; // Ustaw wartość inputu
                closeModal(airportSelectionModal); // Zamknij modal
                currentAirportInput = null; // Zresetuj referencję
            }
        });
    }

    // --- Istniejąca logika formularza wyszukiwania ---
    if (flightSearchForm) {
        flightSearchForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const departure = departureInput.value; // Pobierz wartość z inputu
            const destination = destinationInput.value; // Pobierz wartość z inputu
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
