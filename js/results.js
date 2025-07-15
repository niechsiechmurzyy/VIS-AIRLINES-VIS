// js/results.js

document.addEventListener('DOMContentLoaded', () => {
    const searchParamsDiv = document.getElementById('searchParams');
    const flightListDiv = document.getElementById('flightList');
    const noResultsMessage = document.querySelector('.no-results-message');

    // === Baza danych dostępnych połączeń (na podstawie Twoich danych) ===
    // W prawdziwej aplikacji te dane pochodziłyby z backendu/API
    const availableConnections = [
        // A220-300
        { type: 'A220-300', fromCode: 'GDN', toCode: 'WAW', departureTime: '05:00', arrivalTime: '05:55', durationMinutes: 55, priceBase: 120, flightNumber: 'LO123' },
        { type: 'A220-300', fromCode: 'WAW', toCode: 'PRG', departureTime: '06:40', arrivalTime: '07:50', durationMinutes: 70, priceBase: 150, flightNumber: 'LO234' },
        { type: 'A220-300', fromCode: 'PRG', toCode: 'WAW', departureTime: '08:35', arrivalTime: '09:45', durationMinutes: 70, priceBase: 150, flightNumber: 'LO235' },
        { type: 'A220-300', fromCode: 'WAW', toCode: 'OSL', departureTime: '10:30', arrivalTime: '12:20', durationMinutes: 110, priceBase: 200, flightNumber: 'LO345' },
        { type: 'A220-300', fromCode: 'OSL', toCode: 'WAW', departureTime: '13:05', arrivalTime: '14:50', durationMinutes: 105, priceBase: 200, flightNumber: 'LO346' },
        { type: 'A220-300', fromCode: 'WAW', toCode: 'MAN', departureTime: '15:35', arrivalTime: '18:05', durationMinutes: 150, priceBase: 250, flightNumber: 'LO456' },
        { type: 'A220-300', fromCode: 'MAN', toCode: 'WAW', departureTime: '18:50', arrivalTime: '21:20', durationMinutes: 150, priceBase: 250, flightNumber: 'LO457' },
        { type: 'A220-300', fromCode: 'WAW', toCode: 'GDN', departureTime: '21:50', arrivalTime: '22:45', durationMinutes: 55, priceBase: 120, flightNumber: 'LO124' },
        // A320 NEO
        { type: 'A320 NEO', fromCode: 'WAW', toCode: 'LHR', departureTime: '05:00', arrivalTime: '07:30', durationMinutes: 150, priceBase: 220, flightNumber: 'LH567' },
        { type: 'A320 NEO', fromCode: 'LHR', toCode: 'WAW', departureTime: '08:15', arrivalTime: '10:45', durationMinutes: 150, priceBase: 220, flightNumber: 'LH568' },
        { type: 'A320 NEO', fromCode: 'WAW', toCode: 'ALC', departureTime: '11:30', arrivalTime: '16:15', durationMinutes: 285, priceBase: 300, flightNumber: 'FR678' }, // Alicante
        { type: 'A320 NEO', fromCode: 'ALC', toCode: 'WAW', departureTime: '17:00', arrivalTime: '20:25', durationMinutes: 265, priceBase: 300, flightNumber: 'FR679' }, // Alicante
        { type: 'A320 NEO', fromCode: 'WAW', toCode: 'KRK', departureTime: '21:10', arrivalTime: '22:05', durationMinutes: 55, priceBase: 100, flightNumber: 'LO789' },
        { type: 'A320 NEO', fromCode: 'KRK', toCode: 'WAW', departureTime: '23:00', arrivalTime: '23:55', durationMinutes: 55, priceBase: 100, flightNumber: 'LO790' }
        // Dodaj więcej połączeń, jeśli chcesz
    ];

    // Mapa kodów IATA do pełnych nazw (dla wyświetlania) - jak w script.js
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
        'LHR': 'Londyn - Lotnisko Heathrow', 'LGW': 'Londyn - Lotnisko Gatwick', // LHR to Heathrow
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
        'NRT': 'Tokio - Lotnisko Narita', 'SYD': 'Sydney - Lotnisko Kingsford Smith',
        'ALC': 'Alicante - Lotnisko Alicante-Elche'
    };

    function getAirportFullName(code) {
        return airportNames[code] || code;
    }

    // Funkcja do pobierania parametrów z URL
    function getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            departureCode: params.get('departure'),
            destinationCode: params.get('destination'),
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
            <p><strong>Z:</strong> <span>${getAirportFullName(params.departureCode)}</span></p>
            <p><strong>Do:</strong> <span>${getAirportFullName(params.destinationCode)}</span></p>
            <p><strong>Wylot:</strong> <span>${params.depDate || 'N/A'}</span></p>
            ${params.retDate ? `<p><strong>Powrót:</strong> <span>${params.retDate}</span></p>` : ''}
            <p><strong>Pasażerowie:</strong> <span>${passengerText}</span></p>
            <p><strong>Klasa:</strong> <span>${params.travelClass || 'N/A'}</span></p>
        `;
    }

    // Funkcja do konwersji minut na format "Xh Ym"
    function formatDuration(minutes) {
        if (typeof minutes !== 'number' || isNaN(minutes)) {
            return 'N/A';
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    }

    // Funkcja do obliczania całkowitej liczby minut od północy dla godziny w formacie HH:MM
    function timeToMinutes(timeStr) {
        if (!timeStr) return 0; // Handle undefined/null time strings
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    // === GŁÓWNA LOGIKA WYSZUKIWANIA LOTÓW ===
    function findFlights(params) {
        const results = [];
        const isRoundTrip = !!params.retDate;

        const classMultipliers = {
            'economy': 1,
            'premium_economy': 1.5,
            'business': 3,
            'first': 5
        };
        const currentClassMultiplier = classMultipliers[params.travelClass] || 1;

        // Obliczanie bazowej ceny pasażerów
        const getPassengerBasePrice = (basePricePerConnection) => {
            return basePricePerConnection * (params.adults + params.children * 0.7 + params.infants * 0.1);
        };

        // 1. Szukanie lotów bezpośrednich (jeśli istnieją)
        availableConnections.forEach(conn => {
            if (conn.fromCode === params.departureCode && conn.toCode === params.destinationCode) {
                const finalPrice = Math.round(getPassengerBasePrice(conn.priceBase) * currentClassMultiplier / 5) * 5;
                
                const flight = {
                    id: `F${Math.random().toString(36).substr(2, 9)}`,
                    price: finalPrice,
                    totalDurationMinutes: conn.durationMinutes,
                    departureTimeValue: timeToMinutes(conn.departureTime),
                    stops: 0,
                    details: [{
                        type: 'departure',
                        fromCode: conn.fromCode,
                        toCode: conn.toCode,
                        fromName: getAirportFullName(conn.fromCode),
                        toName: getAirportFullName(conn.toCode),
                        date: params.depDate,
                        departureTime: conn.departureTime,
                        arrivalTime: conn.arrivalTime,
                        duration: formatDuration(conn.durationMinutes),
                        airline: conn.flightNumber ? conn.flightNumber.substring(0, 2) : 'N/A',
                        flightNumber: conn.flightNumber
                    }]
                };

                if (isRoundTrip) {
                    const returnOptions = availableConnections.filter(
                        c => c.fromCode === params.destinationCode && c.toCode === params.departureCode &&
                             timeToMinutes(c.departureTime) > timeToMinutes(conn.arrivalTime) + 60 // Min. 1h na przesiadkę
                    );
                    if (returnOptions.length > 0) {
                        // Wybieramy pierwszy dostępny lot powrotny (można by dodać logikę wyboru np. najtańszego)
                        const returnConn = returnOptions[0];
                        flight.details.push({
                            type: 'return',
                            fromCode: returnConn.fromCode,
                            toCode: returnConn.toCode,
                            fromName: getAirportFullName(returnConn.fromCode),
                            toName: getAirportFullName(returnConn.toCode),
                            date: params.retDate,
                            departureTime: returnConn.departureTime,
                            arrivalTime: returnConn.arrivalTime,
                            duration: formatDuration(returnConn.durationMinutes),
                            airline: returnConn.flightNumber ? returnConn.flightNumber.substring(0, 2) : 'N/A',
                            flightNumber: returnConn.flightNumber
                        });
                        flight.price = Math.round((finalPrice + getPassengerBasePrice(returnConn.priceBase)) * currentClassMultiplier * 1.8 / 5) * 5; // Łączna cena za obie strony
                        flight.totalDurationMinutes += returnConn.durationMinutes;
                        results.push(flight);
                    }
                } else {
                    results.push(flight);
                }
            }
        });

        // 2. Szukanie lotów z jedną przesiadką
        // Tylko jeśli nie znaleziono bezpośrednich LUB chcemy zaoferować alternatywy
        // Dla uproszczenia szukamy tylko jednej przesiadki
        if (results.length === 0 || params.departureCode === 'GDN' && params.destinationCode === 'OSL') { // Przykładowy warunek dla GDN-OSL
            findConnectingFlights(params, currentClassMultiplier).forEach(flight => {
                results.push(flight);
            });
        }
        
        return results;
    }


    // Nowa funkcja do znajdowania lotów z jedną przesiadką
    function findConnectingFlights(params, currentClassMultiplier) {
        const connectingFlights = [];
        const isRoundTrip = !!params.retDate;
        const MIN_LAYOVER_MINUTES = 60; // Minimalny czas przesiadki (np. 1 godzina)
        const MAX_LAYOVER_MINUTES = 360; // Maksymalny czas przesiadki (np. 6 godzin)

        // Loty tam
        availableConnections.forEach(firstLeg => {
            // Czy pierwszy odcinek zaczyna się w mieście wylotu
            if (firstLeg.fromCode === params.departureCode) {
                availableConnections.forEach(secondLeg => {
                    // Czy drugi odcinek zaczyna się tam, gdzie kończy się pierwszy (przesiadka)
                    // I czy kończy się w mieście docelowym
                    // I czy to nie jest ten sam odcinek
                    if (firstLeg.toCode === secondLeg.fromCode &&
                        secondLeg.toCode === params.destinationCode &&
                        firstLeg !== secondLeg)
                    {
                        const layoverStartMinutes = timeToMinutes(firstLeg.arrivalTime);
                        const layoverEndMinutes = timeToMinutes(secondLeg.departureTime);
                        let layoverDuration = layoverEndMinutes - layoverStartMinutes;

                        // Obsługa przesiadki przez północ
                        if (layoverDuration < 0) {
                            layoverDuration += 24 * 60; // Dodaj 24 godziny
                        }

                        if (layoverDuration >= MIN_LAYOVER_MINUTES && layoverDuration <= MAX_LAYOVER_MINUTES) {
                            const totalDuration = firstLeg.durationMinutes + secondLeg.durationMinutes + layoverDuration;
                            const basePriceFirstLeg = firstLeg.priceBase * (params.adults + params.children * 0.7 + params.infants * 0.1);
                            const basePriceSecondLeg = secondLeg.priceBase * (params.adults + params.children * 0.7 + params.infants * 0.1);
                            const finalPrice = Math.round((basePriceFirstLeg + basePriceSecondLeg) * currentClassMultiplier / 5) * 5;

                            const flight = {
                                id: `C${Math.random().toString(36).substr(2, 9)}`,
                                price: finalPrice,
                                totalDurationMinutes: totalDuration,
                                departureTimeValue: timeToMinutes(firstLeg.departureTime),
                                stops: 1,
                                details: [
                                    {
                                        type: 'departure',
                                        fromCode: firstLeg.fromCode,
                                        toCode: firstLeg.toCode,
                                        fromName: getAirportFullName(firstLeg.fromCode),
                                        toName: getAirportFullName(firstLeg.toCode),
                                        date: params.depDate,
                                        departureTime: firstLeg.departureTime,
                                        arrivalTime: firstLeg.arrivalTime,
                                        duration: formatDuration(firstLeg.durationMinutes),
                                        airline: firstLeg.flightNumber ? firstLeg.flightNumber.substring(0, 2) : 'N/A',
                                        flightNumber: firstLeg.flightNumber
                                    },
                                    {
                                        type: 'layover',
                                        locationCode: firstLeg.toCode,
                                        locationName: getAirportFullName(firstLeg.toCode),
                                        duration: formatDuration(layoverDuration)
                                    },
                                    {
                                        type: 'connecting',
                                        fromCode: secondLeg.fromCode,
                                        toCode: secondLeg.toCode,
                                        fromName: getAirportFullName(secondLeg.fromCode),
                                        toName: getAirportFullName(secondLeg.toCode),
                                        date: params.depDate, // Zakładamy ten sam dzień dla przesiadki
                                        departureTime: secondLeg.departureTime,
                                        arrivalTime: secondLeg.arrivalTime,
                                        duration: formatDuration(secondLeg.durationMinutes),
                                        airline: secondLeg.flightNumber ? secondLeg.flightNumber.substring(0, 2) : 'N/A',
                                        flightNumber: secondLeg.flightNumber
                                    }
                                ]
                            };

                            if (isRoundTrip) {
                                // Logika dla lotu powrotnego z przesiadką (teraz jest prościej, bo to tylko dodatek)
                                // Zakładamy, że lot powrotny ma tę samą trasę z przesiadką, tylko w drugą stronę
                                const returnFirstLeg = availableConnections.find(
                                    c => c.fromCode === secondLeg.toCode && c.toCode === firstLeg.toCode &&
                                         timeToMinutes(c.departureTime) > timeToMinutes(secondLeg.arrivalTime) + MIN_LAYOVER_MINUTES // Przesiadka
                                );
                                const returnSecondLeg = availableConnections.find(
                                    c => c.fromCode === firstLeg.toCode && c.toCode === firstLeg.fromCode &&
                                         returnFirstLeg && timeToMinutes(c.departureTime) > timeToMinutes(returnFirstLeg.arrivalTime) + MIN_LAYOVER_MINUTES
                                );

                                if (returnFirstLeg && returnSecondLeg) {
                                    const returnLayoverDuration = timeToMinutes(returnSecondLeg.departureTime) - timeToMinutes(returnFirstLeg.arrivalTime);
                                    if (returnLayoverDuration >= MIN_LAYOVER_MINUTES && returnLayoverDuration <= MAX_LAYOVER_MINUTES) {
                                        flight.details.push({
                                            type: 'return',
                                            fromCode: secondLeg.toCode, // Cel podróży
                                            toCode: firstLeg.fromCode, // Start podróży
                                            fromName: getAirportFullName(secondLeg.toCode),
                                            toName: getAirportFullName(firstLeg.fromCode),
                                            date: params.retDate,
                                            segments: [ // Opisujemy segmenty powrotne
                                                {
                                                    fromCode: returnFirstLeg.fromCode,
                                                    toCode: returnFirstLeg.toCode,
                                                    fromName: getAirportFullName(returnFirstLeg.fromCode),
                                                    toName: getAirportFullName(returnFirstLeg.toCode),
                                                    departureTime: returnFirstLeg.departureTime,
                                                    arrivalTime: returnFirstLeg.arrivalTime,
                                                    duration: formatDuration(returnFirstLeg.durationMinutes),
                                                    airline: returnFirstLeg.flightNumber ? returnFirstLeg.flightNumber.substring(0, 2) : 'N/A',
                                                    flightNumber: returnFirstLeg.flightNumber
                                                },
                                                {
                                                    type: 'layover',
                                                    locationCode: returnFirstLeg.toCode,
                                                    locationName: getAirportFullName(returnFirstLeg.toCode),
                                                    duration: formatDuration(returnLayoverDuration)
                                                },
                                                {
                                                    fromCode: returnSecondLeg.fromCode,
                                                    toCode: returnSecondLeg.toCode,
                                                    fromName: getAirportFullName(returnSecondLeg.fromCode),
                                                    toName: getAirportFullName(returnSecondLeg.toCode),
                                                    departureTime: returnSecondLeg.departureTime,
                                                    arrivalTime: returnSecondLeg.arrivalTime,
                                                    duration: formatDuration(returnSecondLeg.durationMinutes),
                                                    airline: returnSecondLeg.flightNumber ? returnSecondLeg.flightNumber.substring(0, 2) : 'N/A',
                                                    flightNumber: returnSecondLeg.flightNumber
                                                }
                                            ],
                                            totalDuration: formatDuration(returnFirstLeg.durationMinutes + returnSecondLeg.durationMinutes + returnLayoverDuration)
                                        });
                                        flight.price += Math.round((getPassengerBasePrice(returnFirstLeg.priceBase) + getPassengerBasePrice(returnSecondLeg.priceBase)) * currentClassMultiplier / 5) * 5;
                                        flight.totalDurationMinutes += (returnFirstLeg.durationMinutes + returnSecondLeg.durationMinutes + returnLayoverDuration);
                                        connectingFlights.push(flight);
                                    }
                                }
                            } else {
                                connectingFlights.push(flight);
                            }
                        }
                    }
                });
            }
        });

        return connectingFlights;
    }


    // Funkcja do renderowania kart lotów
    function renderFlights(flights) {
        if (flights.length === 0) {
            noResultsMessage.style.display = 'block';
            flightListDiv.innerHTML = '';
            return;
        }

        flightListDiv.innerHTML = ''; 
        noResultsMessage.style.display = 'none';

        flights.forEach(flight => {
            const flightCard = document.createElement('div');
            flightCard.classList.add('flight-card');
            if (flight.details.some(d => d.type === 'layover' || d.type === 'connecting' || (d.type === 'return' && d.segments))) { 
                flightCard.classList.add('multi-segment'); // Nowa klasa dla lotów z przesiadkami
            }
            if (flight.details.filter(d => d.type === 'return').length > 0) {
                flightCard.classList.add('round-trip');
            }


            let segmentsHtml = '';
            flight.details.forEach(segment => {
                if (segment.type === 'departure' || segment.type === 'connecting') {
                    segmentsHtml += `
                        <div class="flight-segment">
                            <div class="flight-details">
                                <div class="flight-info">
                                    <i class="fas ${segment.type === 'departure' ? 'fa-plane-departure' : 'fa-plane-arrival'}"></i>
                                    <span>${segment.fromName} (${segment.fromCode}) do ${segment.toName} (${segment.toCode})</span>
                                </div>
                                <div class="flight-time-duration">
                                    <p><strong>Godzina:</strong> ${segment.departureTime} - ${segment.arrivalTime}</p>
                                    <p><strong>Czas lotu:</strong> ${segment.duration}</p>
                                    <p><strong>Linia:</strong> ${segment.airline || 'N/A'} (${segment.flightNumber || 'N/A'})</p>
                                </div>
                            </div>
                            <p style="font-size:0.9em; color:#777; margin-top:5px;">Data: ${segment.date}</p>
                        </div>
                    `;
                } else if (segment.type === 'layover') {
                    segmentsHtml += `
                        <div class="layover-info">
                            <i class="fas fa-arrows-alt-h"></i> Przesiadka w ${segment.locationName} (${segment.locationCode}) - ${segment.duration}
                        </div>
                    `;
                } else if (segment.type === 'return' && segment.segments) { // Obsługa lotu powrotnego z przesiadkami
                    segmentsHtml += `
                        <div class="flight-segment return-trip-segment">
                            <h4>Lot powrotny</h4>
                            ${segment.segments.map(subSegment => {
                                if (subSegment.type === 'layover') {
                                    return `<div class="layover-info return-layover">
                                                <i class="fas fa-arrows-alt-h"></i> Przesiadka w ${subSegment.locationName} (${subSegment.locationCode}) - ${subSegment.duration}
                                            </div>`;
                                }
                                return `
                                    <div class="flight-details">
                                        <div class="flight-info">
                                            <i class="fas fa-plane-arrival"></i>
                                            <span>${subSegment.fromName} (${subSegment.fromCode}) do ${subSegment.toName} (${subSegment.toCode})</span>
                                        </div>
                                        <div class="flight-time-duration">
                                            <p><strong>Godzina:</strong> ${subSegment.departureTime} - ${subSegment.arrivalTime}</p>
                                            <p><strong>Czas lotu:</strong> ${subSegment.duration}</p>
                                            <p><strong>Linia:</strong> ${subSegment.airline || 'N/A'} (${subSegment.flightNumber || 'N/A'})</p>
                                        </div>
                                    </div>
                                    <p style="font-size:0.9em; color:#777; margin-top:5px;">Data: ${segment.date}</p>
                                `;
                            }).join('')}
                            <p style="font-size:0.95em; color:#555; margin-top:10px; text-align:right;">Całkowity czas lotu powrotnego: <strong>${segment.totalDuration}</strong></p>
                        </div>
                    `;
                }
            });

            flightCard.innerHTML = `
                ${segmentsHtml}
                <div class="total-duration">Całkowity czas podróży: ${formatDuration(flight.totalDurationMinutes)}</div>
                <div class="flight-price">${flight.price.toFixed(2)} PLN</div>
                <button class="book-flight-btn">Wybierz ten lot</button>
            `;
            flightListDiv.appendChild(flightCard);
        });
    }

    // Główna logika po załadowaniu strony
    const searchParameters = getUrlParams();
    displaySearchParams(searchParameters);

    const foundFlights = findFlights(searchParameters);
    renderFlights(foundFlights);

    // TODO: Tutaj dodamy logikę sortowania w kolejnym kroku
});
