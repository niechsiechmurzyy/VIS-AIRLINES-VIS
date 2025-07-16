// js/results.js

document.addEventListener('DOMContentLoaded', () => {
    const searchParamsDiv = document.getElementById('searchParams');
    const flightListDiv = document.getElementById('flightList');
    const noResultsMessage = document.querySelector('.no-results-message');
    const dateStrip = document.getElementById('dateStrip');
    const prevDatesBtn = document.getElementById('prevDates');
    const nextDatesBtn = document.getElementById('nextDates');

    let allFoundFlights = []; // Będziemy przechowywać tu wszystkie znalezione loty dla danej trasy

    // === Baza danych dostępnych połączeń (na podstawie Twoich danych) ===
    // WAŻNE: To są loty JEDNOODCINKOWE. Logika będzie je łączyć w trasy.
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
    ];

    // Mapa kodów IATA do pełnych nazw (dla wyświetlania)
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

    function getAirportFullName(code) {
        return airportNames[code] || code;
    }

    // Funkcja do pobierania parametrów z URL
    function getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            departureCode: params.get('departure'),
            destinationCode: params.get('destination'),
            depDate: params.get('depDate'), // Format DD.MM.RRRR
            retDate: params.get('retDate'), // Format DD.MM.RRRR (może być null)
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
        if (!timeStr) return 0;
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    // Obliczanie bazowej ceny pasażerów dla danego segmentu
    const getPassengerBasePrice = (basePricePerConnection, params) => {
        return basePricePerConnection * (params.adults + params.children * 0.7 + params.infants * 0.1);
    };

    // Funkcja pomocnicza do tworzenia obiektu segmentu lotu
    function createFlightSegment(conn, type, date, params) {
        return {
            type: type,
            fromCode: conn.fromCode,
            toCode: conn.toCode,
            fromName: getAirportFullName(conn.fromCode),
            toName: getAirportFullName(conn.toCode),
            date: date, // Ta data będzie zmieniana dynamicznie przez renderowanie
            departureTime: conn.departureTime,
            arrivalTime: conn.arrivalTime,
            duration: formatDuration(conn.durationMinutes),
            airline: conn.flightNumber ? conn.flightNumber.substring(0, 2) : 'N/A',
            flightNumber: conn.flightNumber
        };
    }

    // === Zaktualizowana logika wyszukiwania lotów (teraz znajduje WSZYSTKIE loty dla trasy, niezależnie od konkretnej daty) ===
    function findFlights(params) {
        const results = [];
        const isRoundTrip = !!params.retDate;
        const currentClassMultiplier = { 'economy': 1, 'premium_economy': 1.5, 'business': 3, 'first': 5 }[params.travelClass] || 1;
        const MIN_LAYOVER_MINUTES = 60; // Minimalny czas przesiadki (np. 1 godzina)
        const MAX_LAYOVER_MINUTES = 360; // Maksymalny czas przesiadki (np. 6 godzin)

        // console.log('Rozpoczynam wyszukiwanie lotów dla:', params.departureCode, 'do', params.destinationCode);

        // 1. Szukanie lotów bezpośrednich
        availableConnections.forEach(conn => {
            if (conn.fromCode === params.departureCode && conn.toCode === params.destinationCode) {
                const finalPrice = Math.round(getPassengerBasePrice(conn.priceBase, params) * currentClassMultiplier / 5) * 5;
                
                // Tworzymy lot "tam"
                const flightThere = {
                    id: `F${Math.random().toString(36).substr(2, 9)}`,
                    price: finalPrice,
                    totalDurationMinutes: conn.durationMinutes,
                    departureTimeValue: timeToMinutes(conn.departureTime),
                    stops: 0,
                    // Ważne: initialDepDate zostanie użyta do przypisania daty z URL
                    details: [createFlightSegment(conn, 'departure', params.depDate, params)] 
                };

                if (isRoundTrip) {
                    // Szukamy pasującego lotu powrotnego (bezpośredniego)
                    const returnConn = availableConnections.find(
                        c => c.fromCode === params.destinationCode && c.toCode === params.departureCode &&
                             timeToMinutes(c.departureTime) > timeToMinutes(conn.arrivalTime) + MIN_LAYOVER_MINUTES
                    );
                    
                    if (returnConn) {
                        const roundTripFlight = { ...flightThere }; // Klonujemy lot tam
                        roundTripFlight.details.push(createFlightSegment(returnConn, 'return', params.retDate, params));
                        roundTripFlight.price = Math.round((finalPrice + getPassengerBasePrice(returnConn.priceBase, params)) * currentClassMultiplier * 1.8 / 5) * 5; // Mnożnik za RT
                        roundTripFlight.totalDurationMinutes += returnConn.durationMinutes;
                        results.push(roundTripFlight);
                        // console.log('Znaleziono lot bezprzewrotny RT:', roundTripFlight);
                    } else {
                        // console.log('Brak pasującego lotu powrotnego bezpośredniego dla:', conn);
                    }
                } else { // Lot w jedną stronę
                    results.push(flightThere);
                    // console.log('Znaleziono lot bezprzewrotny OW:', flightThere);
                }
            }
        });

        // 2. Szukanie lotów z jedną przesiadką
        availableConnections.forEach(firstLeg => {
            if (firstLeg.fromCode === params.departureCode) {
                availableConnections.forEach(secondLeg => {
                    if (firstLeg.toCode === secondLeg.fromCode &&
                        secondLeg.toCode === params.destinationCode &&
                        firstLeg !== secondLeg)
                    {
                        const layoverStartMinutes = timeToMinutes(firstLeg.arrivalTime);
                        const layoverEndMinutes = timeToMinutes(secondLeg.departureTime);
                        let layoverDuration = layoverEndMinutes - layoverStartMinutes;
                        if (layoverDuration < 0) { // Przesiadka przez północ
                            layoverDuration += 24 * 60;
                        }

                        if (layoverDuration >= MIN_LAYOVER_MINUTES && layoverDuration <= MAX_LAYOVER_MINUTES) {
                            const totalDuration = firstLeg.durationMinutes + secondLeg.durationMinutes + layoverDuration;
                            const basePriceFirstLeg = getPassengerBasePrice(firstLeg.priceBase, params);
                            const basePriceSecondLeg = getPassengerBasePrice(secondLeg.priceBase, params);
                            const finalPrice = Math.round((basePriceFirstLeg + basePriceSecondLeg) * currentClassMultiplier / 5) * 5;

                            const flightThere = {
                                id: `C${Math.random().toString(36).substr(2, 9)}`,
                                price: finalPrice,
                                totalDurationMinutes: totalDuration,
                                departureTimeValue: timeToMinutes(firstLeg.departureTime),
                                stops: 1,
                                details: [
                                    createFlightSegment(firstLeg, 'departure', params.depDate, params),
                                    {
                                        type: 'layover',
                                        locationCode: firstLeg.toCode,
                                        locationName: getAirportFullName(firstLeg.toCode),
                                        duration: formatDuration(layoverDuration)
                                    },
                                    createFlightSegment(secondLeg, 'connecting', params.depDate, params)
                                ]
                            };

                            if (isRoundTrip) {
                                // Szukamy analogicznej trasy powrotnej (z przesiadką)
                                const returnFirstLegCandidates = availableConnections.filter(
                                    c => c.fromCode === params.destinationCode && c.toCode === secondLeg.fromCode // Przesiadka w tym samym miejscu
                                );

                                for (const returnFirstLeg of returnFirstLegCandidates) {
                                    const returnSecondLeg = availableConnections.find(
                                        c => c.fromCode === returnFirstLeg.toCode && c.toCode === params.departureCode &&
                                             timeToMinutes(c.departureTime) > timeToMinutes(returnFirstLeg.arrivalTime) + MIN_LAYOVER_MINUTES
                                    );

                                    if (returnSecondLeg) {
                                        const returnLayoverDuration = timeToMinutes(returnSecondLeg.departureTime) - timeToMinutes(returnFirstLeg.arrivalTime);
                                        if (returnLayoverDuration < 0) returnLayoverDuration += 24 * 60;

                                        if (returnLayoverDuration >= MIN_LAYOVER_MINUTES && returnLayoverDuration <= MAX_LAYOVER_MINUTES) {
                                            const combinedFlight = { ...flightThere }; // Kopiuj obiekt lotu tam
                                            combinedFlight.details.push({
                                                type: 'return',
                                                fromCode: params.destinationCode,
                                                toCode: params.departureCode,
                                                fromName: getAirportFullName(params.destinationCode),
                                                toName: getAirportFullName(params.departureCode),
                                                date: params.retDate,
                                                segments: [
                                                    createFlightSegment(returnFirstLeg, 'return-segment-1', params.retDate, params),
                                                    {
                                                        type: 'layover',
                                                        locationCode: returnFirstLeg.toCode,
                                                        locationName: getAirportFullName(returnFirstLeg.toCode),
                                                        duration: formatDuration(returnLayoverDuration)
                                                    },
                                                    createFlightSegment(returnSecondLeg, 'return-segment-2', params.retDate, params)
                                                ],
                                                totalDuration: formatDuration(returnFirstLeg.durationMinutes + returnSecondLeg.durationMinutes + returnLayoverDuration)
                                            });
                                            combinedFlight.price += Math.round((getPassengerBasePrice(returnFirstLeg.priceBase, params) + getPassengerBasePrice(returnSecondLeg.priceBase, params)) * currentClassMultiplier * 1.8 / 5) * 5;
                                            combinedFlight.totalDurationMinutes += (returnFirstLeg.durationMinutes + returnSecondLeg.durationMinutes + returnLayoverDuration);
                                            results.push(combinedFlight);
                                            // console.log('Znaleziono lot z przesiadką RT:', combinedFlight);
                                            break; // Znaleziono pasujący lot powrotny, przejdź do kolejnego lotu w jedną stronę
                                        }
                                    }
                                }
                            } else { // Lot w jedną stronę z przesiadką
                                results.push(flightThere);
                                // console.log('Znaleziono lot z przesiadką OW:', flightThere);
                            }
                        }
                    }
                });
            }
        });
        
        // console.log('Wszystkie znalezione loty (surowe):', results);
        return results;
    }


    // Funkcja do renderowania kart lotów dla DANEJ DATY
    function renderFlightsForDate(flightsToRender, selectedDate) {
        flightListDiv.innerHTML = '';
        noResultsMessage.style.display = 'none';

        // Filtruj loty, które mają w pierwszym segmencie datę wylotu równą selectedDate
        const filteredFlights = flightsToRender.filter(flight => {
            return flight.details[0] && flight.details[0].date === selectedDate;
        });

        if (filteredFlights.length === 0) {
            noResultsMessage.style.display = 'block';
            return;
        }

        filteredFlights.forEach(flight => {
            const flightCard = document.createElement('div');
            flightCard.classList.add('flight-card');
            if (flight.stops > 0) { 
                flightCard.classList.add('multi-segment');
            }
            // Sprawdzamy, czy flight.details zawiera obiekt 'return'
            if (flight.details.some(d => d.type === 'return')) {
                flightCard.classList.add('round-trip');
            }

            let segmentsHtml = '';
            flight.details.forEach(segment => {
                // Renderowanie lotu tam (departure/connecting)
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
                } else if (segment.type === 'return') { // Obsługa lotu powrotnego (bezpośredniego lub z przesiadkami)
                    segmentsHtml += `
                        <div class="flight-segment return-trip-section">
                            <h4>Lot powrotny: ${segment.fromName} (${segment.fromCode}) do ${segment.toName} (${segment.toCode})</h4>
                    `;
                    if (segment.segments) { // Jeśli lot powrotny ma segmenty (przesiadki)
                         segment.segments.forEach(subSegment => {
                            if (subSegment.type === 'layover') {
                                segmentsHtml += `<div class="layover-info return-layover">
                                                    <i class="fas fa-arrows-alt-h"></i> Przesiadka w ${subSegment.locationName} (${subSegment.locationCode}) - ${subSegment.duration}
                                                </div>`;
                            } else {
                                segmentsHtml += `
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
                            }
                         });
                         segmentsHtml += `<p style="font-size:0.95em; color:#555; margin-top:10px; text-align:right;">Całkowity czas lotu powrotnego: <strong>${segment.totalDuration}</strong></p>`;
                    } else { // Jeśli lot powrotny jest bezpośredni
                        segmentsHtml += `
                            <div class="flight-details">
                                <div class="flight-info">
                                    <i class="fas fa-plane-arrival"></i>
                                    <span>${segment.fromName} (${segment.fromCode}) do ${segment.toName} (${segment.toCode})</span>
                                </div>
                                <div class="flight-time-duration">
                                    <p><strong>Godzina:</strong> ${segment.departureTime} - ${segment.arrivalTime}</p>
                                    <p><strong>Czas lotu:</strong> ${segment.duration}</p>
                                    <p><strong>Linia:</strong> ${segment.airline || 'N/A'} (${segment.flightNumber || 'N/A'})</p>
                                </div>
                            </div>
                            <p style="font-size:0.9em; color:#777; margin-top:5px;">Data: ${segment.date}</p>
                        `;
                    }
                    segmentsHtml += `</div>`; // Zamykamy return-trip-section
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

    // Funkcje do generowania i obsługi paska dat
    const days = ['niedz.', 'pon.', 'wt.', 'śr.', 'czw.', 'pt.', 'sob.'];
    const months = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];

    function formatDateForDisplay(date) {
        const d = new Date(date);
        return `${days[d.getDay()]} ${d.getDate()}, ${months[d.getMonth()]}`;
    }

    // Konwersja daty z obiektu Date na format DD.MM.RRRR (dla datasetu i porównań)
    function formatDateToDDMMYYYY(dateObj) {
        const year = dateObj.getFullYear();
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const day = dateObj.getDate().toString().padStart(2, '0');
        return `${day}.${month}.${year}`;
    }

    let currentDateRangeStart = null; // Przechowuje aktualnie wyświetlaną pierwszą datę w pasku

    function generateDateStrip(startDateStr, numDays = 7) {
        dateStrip.innerHTML = '';
        // Konwertuj "DD.MM.RRRR" na obiekt Date
        const parts = startDateStr.split('.');
        // Ważne: miesiące w JS Date są 0-indeksowane (0=styczeń, 11=grudzień)
        const startDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])); 
        
        currentDateRangeStart = new Date(startDate); // Ustaw początek zakresu

        for (let i = 0; i < numDays; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            const dateBtn = document.createElement('button');
            dateBtn.classList.add('date-button');
            dateBtn.innerHTML = `
                <span>${days[date.getDay()]}</span>
                <span>${date.getDate()}</span>
                <span>${months[date.getMonth()]}</span>
            `;
            dateBtn.dataset.date = formatDateToDDMMYYYY(date); // Format DD.MM.RRRR

            dateBtn.addEventListener('click', () => {
                // Usuń klasę 'active' ze wszystkich przycisków
                document.querySelectorAll('.date-button').forEach(btn => btn.classList.remove('active'));
                // Dodaj klasę 'active' do klikniętego przycisku
                dateBtn.classList.add('active');
                // Wyświetl loty dla wybranej daty
                renderFlightsForDate(allFoundFlights, dateBtn.dataset.date);
            });
            dateStrip.appendChild(dateBtn);
        }

        // Aktywuj początkową datę z parametrów wyszukiwania
        const initialActiveButton = dateStrip.querySelector(`[data-date="${searchParameters.depDate}"]`);
        if (initialActiveButton) {
            initialActiveButton.classList.add('active');
        } else if (dateStrip.firstElementChild) {
            // Jeśli początkowa data nie jest w zakresie, aktywuj pierwszą dostępną
            dateStrip.firstElementChild.classList.add('active');
            renderFlightsForDate(allFoundFlights, dateStrip.firstElementChild.dataset.date);
        }
    }

    prevDatesBtn.addEventListener('click', () => {
        if (currentDateRangeStart) {
            currentDateRangeStart.setDate(currentDateRangeStart.getDate() - 7); // Cofnij o 7 dni
            generateDateStrip(formatDateToDDMMYYYY(currentDateRangeStart));
        }
    });

    nextDatesBtn.addEventListener('click', () => {
        if (currentDateRangeStart) {
            currentDateRangeStart.setDate(currentDateRangeStart.getDate() + 7); // Przesuń o 7 dni
            generateDateStrip(formatDateToDDMMYYYY(currentDateRangeStart));
        }
    });


    // Główna logika po załadowaniu strony
    const searchParameters = getUrlParams();
    displaySearchParams(searchParameters);

    // Znajdź wszystkie możliwe loty dla trasy, niezależnie od daty
    // Data z params.depDate jest "początkową" datą dla paska.
    allFoundFlights = findFlights(searchParameters); 

    if (allFoundFlights.length === 0) {
        noResultsMessage.style.display = 'block';
        flightListDiv.innerHTML = '';
        // Ukryj pasek dat, jeśli nie ma wyników
        document.querySelector('.date-navigation-wrapper').style.display = 'none'; 
    } else {
        document.querySelector('.date-navigation-wrapper').style.display = 'flex'; // Upewnij się, że pasek jest widoczny
        generateDateStrip(searchParameters.depDate || formatDateToDDMMYYYY(new Date())); // Użyj daty z URL lub dzisiejszej
        // Renderuj loty dla początkowej daty z parametrów
        renderFlightsForDate(allFoundFlights, searchParameters.depDate);
    }
});
