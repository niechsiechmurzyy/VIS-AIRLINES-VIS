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
        const departureAirportCode = params.departure; 
        const destinationAirportCode = params.destination; 

        // Funkcja pomocnicza do mapowania kodu lotniska na nazwę (używana tylko do wyświetlania)
        // W prawdziwej aplikacji te dane pochodziłyby z API
        function getAirportNameByCode(code) {
            const airportsData = { // To musi być pełna lista lotnisk, jak w script.js
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
                'BKK': 'Bangkok - Lotnisko Suvarnabhumi', 'SIN': 'Singapur - Lotnisko Changi',
                'NRT': 'Tokio - Lotnisko Narita', 'SYD': 'Sydney - Lotnisko Kingsford Smith'
            };
            return airportsData[code] || code; // Zwróć nazwę lub sam kod, jeśli nie znaleziono
        }


        const departureAirportDisplay = getAirportNameByCode(departureAirportCode);
        const destinationAirportDisplay = getAirportNameByCode(destinationAirportCode);

        const basePrice = 150 * (params.adults + params.children * 0.7 + params.infants * 0.1) * (isRoundTrip ? 1.8 : 1);
        
        let classMultiplier = 1;
        if (params.travelClass === 'premium_economy') classMultiplier = 1.5;
        else if (params.travelClass === 'business') classMultiplier = 3;
        else if (params.travelClass === 'first') classMultiplier = 5;

        for (let i = 1; i <= 3; i++) { 
            const price = Math.round((basePrice + (Math.random() * 50 - 25)) * classMultiplier / 10) * 10; 

            const flight = {
                id: `FL${i}${Math.floor(Math.random() * 1000)}`,
                departureTime: `0${6 + i}:00`,
                arrivalTime: `0${9 + i}:30`, 
                duration: '3h 30m',
                airline: `Linie lotnicze A${i}`,
                price: price,
                details: [] 
            };

            flight.details.push({
                type: 'departure',
                from: departureAirportDisplay,
                to: destinationAirportDisplay,
                date: params.depDate,
                time: flight.departureTime
            });

            if (isRoundTrip) {
                const returnTime = `1${1 + i}:00`;
                const returnArrivalTime = `1${4 + i}:30`;
                flight.details.push({
                    type: 'return',
                    from: destinationAirportDisplay,
                    to: departureAirportDisplay,
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

        flightListDiv.innerHTML = ''; 
        noResultsMessage.style.display = 'none';

        flights.forEach(flight => {
            const flightCard = document.createElement('div');
            flightCard.classList.add('flight-card');
            if (flight.details.length > 1) { 
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

    const dummyFlights = generateDummyFlights(searchParameters);
    renderFlights(dummyFlights);

});
