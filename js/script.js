document.addEventListener('DOMContentLoaded', () => {
    const flightSelectionSection = document.getElementById('flight-selection');
    const paymentSimulationSection = document.getElementById('payment-simulation');
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

    // Obsługa kliknięć ikon nawigacji
    if (languageIcon) {
        languageIcon.addEventListener('click', (event) => {
            event.stopPropagation(); // Zapobiega zamknięciu menu przez kliknięcie na body
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

    // Zamknij rozwijane menu, jeśli kliknięto poza nimi
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

    // Obsługa linku "Zarejestruj się"
    if (registerLink) {
        registerLink.addEventListener('click', (event) => {
            // event.preventDefault(); // Usunięto preventDefault, aby link normalnie przekierował
            console.log('Przejście do strony rejestracji.');
        });
    }

    // Obsługa linku "Zaloguj się" (na razie tylko alert, bo nie ma strony logowania)
    if (loginLink) {
        loginLink.addEventListener('click', (event) => {
            event.preventDefault();
            alert('Funkcja logowania w przygotowaniu!');
        });
    }


    // Obsługa formularza wyszukiwania lotów (istniejący kod)
    if (flightForm) {
        flightForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const departureCity = document.getElementById('departureCity').value;
            const arrivalCity = document.getElementById('arrivalCity').value;
            const departureDate = document.getElementById('departureDate').value;
            const returnDate = document.getElementById('returnDate').value;

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

            flightSelectionSection.style.display = 'none';
            paymentSimulationSection.style.display = 'block';
        });
    }

    // Obsługa przycisku płatności (istniejący kod)
    if (paymentButton) {
        paymentButton.addEventListener('click', () => {
            alert('Symulacja płatności dla VIS Airlines zakończona pomyślnie! Bilet został "kupiony".');
        });
    }

    // Początkowe ukrywanie/pokazywanie sekcji (istniejący kod)
    if (flightSelectionSection) flightSelectionSection.style.display = 'block';
    if (paymentSimulationSection) paymentSimulationSection.style.display = 'none';
});
