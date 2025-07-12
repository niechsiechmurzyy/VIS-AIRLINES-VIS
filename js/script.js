document.addEventListener('DOMContentLoaded', () => {
    // Sekcje strony
    const sections = {
        flightSelection: document.getElementById('flight-selection'),
        flightResults: document.getElementById('flight-results'),
        extraServices: document.getElementById('extra-services'),
        seatSelection: document.getElementById('seat-selection'),
        summary: document.getElementById('summary'),
        paymentSimulation: document.getElementById('payment-simulation'),
        confirmation: document.getElementById('confirmation'),
        checkInSimulation: document.getElementById('check-in-simulation')
    };

    // Formularze i przyciski
    const flightForm = document.getElementById('flight-form');
    const flightList = document.getElementById('flight-list');
    const selectFlightBtn = document.getElementById('select-flight-btn');
    const selectServicesBtn = document.getElementById('select-services-btn');
    const confirmSeatBtn = document.getElementById('confirm-seat-btn');
    const buyButton = document.getElementById('buy-button');
    const paymentForm = document.getElementById('payment-form');
    const checkInButton = document.getElementById('check-in-button');
    const checkInForm = document.getElementById('check-in-form');

    // Dane rezerwacji
    let bookingDetails = {
        origin: '',
        destination: '',
        departureDate: '',
        returnDate: '',
        passengers: 1,
        travelClass: 'economy',
        selectedFlight: null,
        selectedServices: [],
        selectedSeat: null,
        totalPrice: 0,
        customerEmail: ''
    };

    const baseFlightPrice = 500; // Bazowa cena lotu

    // Funkcja do pokazywania/ukrywania sekcji
    function showSection(sectionToShow) {
        for (let key in sections) {
            sections[key].style.display = 'none';
        }
        sectionToShow.style.display = 'block';
        window.scrollTo(0, 0); // Przewiń na górę strony
    }

    // Krok 1: Wyszukiwanie lotów
    flightForm.addEventListener('submit', (e) => {
        e.preventDefault();
        bookingDetails.origin = document.getElementById('origin').value;
        bookingDetails.destination = document.getElementById('destination').value;
        bookingDetails.departureDate = document.getElementById('departure-date').value;
        bookingDetails.returnDate = document.getElementById('return-date').value;
        bookingDetails.passengers = parseInt(document.getElementById('passengers').value);
        bookingDetails.travelClass = document.getElementById('travel-class').value;

        // Generowanie przykładowych lotów
        flightList.innerHTML = '';
        const mockFlights = [
            { id: 1, from: bookingDetails.origin, to: bookingDetails.destination, date: bookingDetails.departureDate, time: '10:00', price: baseFlightPrice * bookingDetails.passengers },
            { id: 2, from: bookingDetails.origin, to: bookingDetails.destination, date: bookingDetails.departureDate, time: '14:00', price: (baseFlightPrice + 50) * bookingDetails.passengers },
            { id: 3, from: bookingDetails.origin, to: bookingDetails.destination, date: bookingDetails.departureDate, time: '18:00', price: (baseFlightPrice + 100) * bookingDetails.passengers }
        ];

        mockFlights.forEach(flight => {
            const flightDiv = document.createElement('div');
            flightDiv.classList.add('flight-option');
            flightDiv.innerHTML = `
                <p><strong>${flight.from}</strong> do <strong>${flight.to}</strong></p>
                <p>Data: ${flight.date}, Godzina: ${flight.time}</p>
                <p>Cena: ${flight.price} PLN</p>
            `;
            flightDiv.dataset.flightId = flight.id;
            flightDiv.addEventListener('click', () => {
                // Usuń zaznaczenie z innych lotów
                document.querySelectorAll('.flight-option').forEach(div => div.classList.remove('selected'));
                // Zaznacz wybrany lot
                flightDiv.classList.add('selected');
                bookingDetails.selectedFlight = flight;
                selectFlightBtn.style.display = 'block';
            });
            flightList.appendChild(flightDiv);
        });

        showSection(sections.flightResults);
        selectFlightBtn.style.display = 'none'; // Ukryj przycisk, dopóki lot nie zostanie wybrany
    });

    // Krok 2: Wybór lotu -> Przejście do usług dodatkowych
    selectFlightBtn.addEventListener('click', () => {
        if (bookingDetails.selectedFlight) {
            showSection(sections.extraServices);
            bookingDetails.totalPrice = bookingDetails.selectedFlight.price;
            // Resetuj wybrane usługi, jeśli użytkownik wraca
            document.querySelectorAll('#extra-services input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
        } else {
            alert('Proszę wybrać lot.');
        }
    });

    // Krok 3: Wybór usług dodatkowych -> Przejście do wyboru miejsca
    selectServicesBtn.addEventListener('click', () => {
        bookingDetails.selectedServices = [];
        const serviceCheckboxes = document.querySelectorAll('#extra-services input[type="checkbox"]:checked');
        serviceCheckboxes.forEach(checkbox => {
            let servicePrice = 0;
            if (checkbox.id === 'baggage') servicePrice = 100;
            if (checkbox.id === 'meal') servicePrice = 50;
            if (checkbox.id === 'insurance') servicePrice = 80;
            bookingDetails.selectedServices.push({ name: checkbox.labels[0].innerText, price: servicePrice });
            bookingDetails.totalPrice += servicePrice;
        });

        generateSeatMap();
        showSection(sections.seatSelection);
    });

    // Krok 4: Generowanie i wybór miejsca
    function generateSeatMap() {
        const seatMapDiv = document.getElementById('seat-map');
        seatMapDiv.innerHTML = ''; // Wyczyść poprzednią mapę

        const totalRows = 10;
        const seatsPerRow = 6;
        const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

        // Symulacja zajętych miejsc
        const occupiedSeats = new Set();
        // Generuj losowe zajęte miejsca dla symulacji
        for (let i = 0; i < Math.floor(Math.random() * (totalRows * seatsPerRow * 0.3)); i++) {
            const row = Math.floor(Math.random() * totalRows) + 1;
            const seatLetter = seatLetters[Math.floor(Math.random() * seatsPerRow)];
            occupiedSeats.add(`${row}${seatLetter}`);
        }
        
        for (let row = 1; row <= totalRows; row++) {
            for (let i = 0; i < seatsPerRow; i++) {
                const seatLetter = seatLetters[i];
                const seatId = `${row}${seatLetter}`;
                const seatDiv = document.createElement('div');
                seatDiv.classList.add('seat');
                seatDiv.textContent = seatId;

                if (occupiedSeats.has(seatId)) {
                    seatDiv.classList.add('unavailable');
                } else {
                    seatDiv.classList.add('available');
                    seatDiv.addEventListener('click', () => {
                        // Usuń zaznaczenie z poprzedniego miejsca
                        document.querySelectorAll('.seat.selected-seat').forEach(s => s.classList.remove('selected-seat'));
                        // Zaznacz nowe miejsce
                        seatDiv.classList.add('selected-seat');
                        bookingDetails.selectedSeat = seatId;
                    });
                }
                seatMapDiv.appendChild(seatDiv);
            }
        }
    }

    confirmSeatBtn.addEventListener('click', () => {
        if (bookingDetails.selectedSeat) {
            updateSummary();
            showSection(sections.summary);
        } else {
            alert('Proszę wybrać miejsce.');
        }
    });

    // Krok 5: Podsumowanie -> Przejście do symulacji płatności
    function updateSummary() {
        document.getElementById('summary-origin').textContent = bookingDetails.origin;
        document.getElementById('summary-destination').textContent = bookingDetails.destination;
        document.getElementById('summary-departure-date').textContent = bookingDetails.departureDate;
        document.getElementById('summary-return-date').textContent = bookingDetails.returnDate || 'Brak';
        document.getElementById('summary-passengers').textContent = bookingDetails.passengers;
        document.getElementById('summary-class').textContent = document.getElementById('travel-class').options[document.getElementById('travel-class').selectedIndex].text;

        const summaryServicesList = document.getElementById('summary-services');
        summaryServicesList.innerHTML = '';
        if (bookingDetails.selectedServices.length > 0) {
            bookingDetails.selectedServices.forEach(service => {
                const li = document.createElement('li');
                li.textContent = `${service.name} (${service.price} PLN)`;
                summaryServicesList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'Brak dodatkowych usług';
            summaryServicesList.appendChild(li);
        }

        document.getElementById('summary-seat').textContent = bookingDetails.selectedSeat || 'Nie wybrano';
        document.getElementById('total-price').textContent = `${bookingDetails.totalPrice} PLN`;
    }

    buyButton.addEventListener('click', () => {
        showSection(sections.paymentSimulation);
    });

    // Krok 6: Symulacja płatności
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        bookingDetails.customerEmail = document.getElementById('email-confirm').value;

        // Symulacja "płatności"
        alert('Płatność została zasymulowana pomyślnie!');

        // Symulacja wysłania maila
        document.getElementById('confirmation-email').textContent = bookingDetails.customerEmail;
        showSection(sections.confirmation);
        console.log(`Symulacja wysłania potwierdzenia na email: ${bookingDetails.customerEmail}`);
        console.log('Dane rezerwacji:', bookingDetails);
    });

    // Krok 7: Symulacja odprawy online
    checkInButton.addEventListener('click', () => {
        showSection(sections.checkInSimulation);
        document.getElementById('boarding-pass').style.display = 'none'; // Ukryj kartę pokładową na początku
    });

    checkInForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const passengerName = document.getElementById('check-in-name').value;
        const bookingRef = document.getElementById('check-in-booking-ref').value;

        // Tutaj mogłaby być logika walidacji, czy dane są poprawne
        if (passengerName && bookingRef) {
            document.getElementById('bp-name').textContent = passengerName;
            document.getElementById('bp-flight').textContent = `${bookingDetails.origin} - ${bookingDetails.destination} (${bookingDetails.selectedFlight.time})`;
            document.getElementById('bp-seat').textContent = bookingDetails.selectedSeat;
            document.getElementById('boarding-pass').style.display = 'block';
            alert(`Odprawa dla ${passengerName} zakończona sukcesem! (Symulacja)`);
        } else {
            alert('Proszę uzupełnić wszystkie pola do odprawy.');
        }
    });

    // Uruchomienie początkowe
    showSection(sections.flightSelection);
});
