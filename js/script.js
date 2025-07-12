document.addEventListener('DOMContentLoaded', () => {
    const flightSelectionSection = document.getElementById('flight-selection');
    const paymentSimulationSection = document.getElementById('payment-simulation');
    const flightForm = document.getElementById('flight-form');
    const paymentButton = paymentSimulationSection.querySelector('button');

    // Obsługa formularza wyszukiwania lotów
    if (flightForm) {
        flightForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Zapobiega domyślnemu przeładowaniu strony

            const departureCity = document.getElementById('departureCity').value;
            const arrivalCity = document.getElementById('arrivalCity').value;
            const departureDate = document.getElementById('departureDate').value;
            const returnDate = document.getElementById('returnDate').value; // Może być puste

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
            }
            flightDetails += `\nPrzechodzimy do symulacji płatności.`;

            alert(flightDetails);

            // Ukryj sekcję wyboru lotu i pokaż sekcję płatności
            flightSelectionSection.style.display = 'none';
            paymentSimulationSection.style.display = 'block';
        });
    }

    // Obsługa przycisku płatności
    if (paymentButton) {
        paymentButton.addEventListener('click', () => {
            alert('Symulacja płatności dla VIS Airlines zakończona pomyślnie! Bilet został "kupiony".');
            // Tutaj w przyszłości możemy dodać więcej logiki po "zakupie"
            // Np. Przekierowanie do strony potwierdzenia lub powrót do formularza
            // Dla prostoty, na razie zostajemy na tej samej stronie.
        });
    }

    // Początkowe ukrywanie/pokazywanie sekcji
    if (flightSelectionSection) flightSelectionSection.style.display = 'block';
    if (paymentSimulationSection) paymentSimulationSection.style.display = 'none';
});
