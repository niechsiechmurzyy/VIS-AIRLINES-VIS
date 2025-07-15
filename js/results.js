// js/results.js

document.addEventListener('DOMContentLoaded', () => {
    const searchParamsDiv = document.getElementById('searchParams');
    const flightListDiv = document.getElementById('flightList');
    const noResultsMessage = document.querySelector('.no-results-message');

    // Funkcja do pobierania parametrów z URL
    function getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            departure: params.get('departure'),
            destination: params.get('destination'),
            depDate: params.get('depDate'),
            retDate: params.get('retDate'), // Może być null
            adults: parseInt(params.get('adults') || '1'),
            children: parseInt(params.get('children') || '0'),
            infants: parseInt(params.get('infants') || '0'),
            travelClass: params.get('class') || 'economy'
        };
    }

    // Funkcja do wyświetlania parametrów wyszukiwania
    function displaySearchParams(params) {
        let passengerText = `${params.adults} dorosł${params.adults === 1 ? 'y' : 'ych'}`;
        if (params.children > 0) passengerText += `, ${params.children} dziec${params.children === 1 ? 'ko' : 'i'}`;
        if (params.infants > 0) passengerText += `, ${params.infants} niemowl${params.infants === 1 ? 'ę' : 'ąt'}`;

        searchParamsDiv.innerHTML = `
            <p><strong>Z:</strong> <span>${params.departure || 'N/A'}</span></p>
            <p><strong>Do:</strong> <span>${params.destination || 'N/A'}</span></p>
            <p><strong>Wylot:</strong> <span>${params.depDate || 'N/A'}</span></p>
            ${params.retDate ? `<p><strong>Powrót:</strong> <span>${params.retDate}</span></p>` : ''}
            <p><strong>Pasażerowie:</strong> <span>${passengerText}</span></p>
            <p><strong>Klasa:</strong> <span>${params.travelClass || 'N/A'}</span></p>
        `;
    }

    // Funkcja do generowania przykładowych wyników lotów
    function generateDummyFlights(params) {
        const flights = [];
        const isRoundTrip = !!params.retDate;
        const departureAirportName = params.departure; // Simplified, in real app, map code to name
        const destinationAirportName = params.destination; // Simplified

        const basePrice = 150 * (params.adults + params.children * 0.7 + params.infants * 0.1) * (isRoundTrip ? 1.8 : 1);
        
        // Klasa wpływa na cenę
        let classMultiplier = 1;
        if (params.travelClass === 'premium_economy') classMultiplier = 1.5;
        else if (params.travelClass === 'business') classMultiplier = 3;
        else if (params.travelClass === 'first') classMultiplier = 5;

        // Przykładowe loty
        for (let i = 1; i <= 3; i++) { // Generujemy 3 przykładowe loty
            const price = Math.round((basePrice + (Math.random() * 50 - 25)) * classMultiplier / 10) * 10; // Ceny zaokrąglone do 10

            const flight = {
                id: `FL${i}${Math.floor(Math.random() * 1000)}`,
                departureTime: `0${6 + i}:00`,
                arrivalTime: `0${9 + i}:30`, // Przykładowo 3.5h lotu
                duration: '3h 30m',
                airline: `Linie lotnicze A${i}`,
                price: price,
                details: [] // Do przechowywania segmentów lotu (wylot, opcjonalnie powrót)
            };

            // Segment wylotowy
            flight.details.push({
                type: 'departure',
                from: departureAirportName,
                to: destinationAirportName,
                date: params.depDate,
                time: flight.departureTime
            });

            // Segment powrotny (jeśli lot w obie strony)
            if (isRoundTrip) {
                const returnTime = `1${1 + i}:00`;
                const returnArrivalTime = `1${4 + i}:30`;
                flight.details.push({
                    type: 'return',
                    from: destinationAirportName,
                    to: departureAirportName,
                    date: params.retDate,
                    time: returnTime
                });
            }
            flights.push(flight);
        }
        return flights;
    }

    // Funkcja do renderowania kart lotów
    function renderFlights(flights) {
        if (flights.length === 0) {
            noResultsMessage.style.display = 'block';
            return;
        }

        flightListDiv.innerHTML = ''; // Wyczyść istniejące wyniki
        noResultsMessage.style.display = 'none';

        flights.forEach(flight => {
            const flightCard = document.createElement('div');
            flightCard.classList.add('flight-card');
            if (flight.details.length > 1) { // Jeśli więcej niż 1 segment, to lot w obie strony
                flightCard.classList.add('round-trip');
            }

            let segmentsHtml = '';
            flight.details.forEach(segment => {
                segmentsHtml += `
                    <div class="flight-segment">
                        <div class="flight-details">
                            <div class="flight-info">
                                <i class="fas ${segment.type === 'departure' ? 'fa-plane-departure' : 'fa-plane-arrival'}"></i>
                                <span>${segment.from} do ${segment.to} (${segment.date})</span>
                            </div>
                            <div class="flight-time-duration">
                                <p><strong>Godzina:</strong> ${segment.time}</p>
                                <p><strong>Czas lotu:</strong> ${flight.duration}</p>
                            </div>
                        </div>
                        <p style="font-size:0.9em; color:#777; margin-top:5px;">Obsługiwany przez: ${flight.airline}</p>
                    </div>
                `;
            });

            flightCard.innerHTML = `
                ${segmentsHtml}
                <div class="flight-price">${flight.price} PLN</div>
                <button class="book-flight-btn">Wybierz ten lot</button>
            `;
            flightListDiv.appendChild(flightCard);
        });
    }

    // Główna logika po załadowaniu strony
    const searchParameters = getUrlParams();
    displaySearchParams(searchParameters);

    // Generuj i wyświetl przykładowe loty
    const dummyFlights = generateDummyFlights(searchParameters);
    renderFlights(dummyFlights);

    // Możesz również włączyć obsługę dropdownów w nagłówku na stronie wyników,
    // jeśli ponownie załadujesz plik script.js na tej stronie.
    // Dodałem <script src="js/script.js"></script> na końcu body results.html,
    // więc dropdowny powinny działać.
});
