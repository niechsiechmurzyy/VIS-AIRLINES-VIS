body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
    color: #333;
    line-height: 1.6;
    /* Upewnienie się, że body ma wystarczającą wysokość dla position: sticky */
    min-height: 100vh;
}

/* Style dla paska nawigacyjnego */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #87CEEB; /* JASNONIEBIESKIE TŁO NAWIGACJI (SkyBlue) */
    padding: 10px 20px;
    color: white;
    box-shadow: 0 4px 10px rgba(0,0,0,0.3); /* Mocniejszy cień dla efektu uniesienia */
    position: sticky; /* Przykleja nawigację do góry podczas przewijania */
    top: 0;
    width: 100%; /* Upewnia się, że zajmuje całą szerokość */
    z-index: 1000; /* Upewnia się, że nawigacja jest zawsze na wierzchu */
    border-bottom-left-radius: 8px; /* Delikatne zaokrąglenie dolnych rogów */
    border-bottom-right-radius: 8px;
    box-sizing: border-box; /* Upewnia się, że padding nie zwiększa szerokości */
}

.nav-left, .nav-right {
    display: flex;
    align-items: center;
}

.nav-left .nav-link {
    color: white;
    text-decoration: none;
    margin-right: 20px;
    font-weight: bold;
    padding: 5px 10px; /* Dodane padding dla lepszego obszaru kliknięcia */
    border-radius: 5px; /* Zaokrąglenie tła przy najechaniu */
    transition: background-color 0.3s ease, color 0.3s ease; /* Płynne przejście */
}

.nav-left .nav-link:hover {
    background-color: rgba(255, 255, 255, 0.2); /* Przezroczyste białe tło przy najechaniu */
    color: white; /* Utrzymaj biały kolor tekstu */
}

.nav-center {
    display: flex; /* Dodane flexbox dla logo i tytułu */
    align-items: center;
}

/* STYLE DLA NOWO DODANEGO LOGO W NAWIGACJI */
.nav-center .nav-logo {
    height: 40px; /* Rozmiar logo w nawigacji */
    margin-right: 10px; /* Odstęp między logo a napisem VIS */
    vertical-align: middle; /* Wyrównanie pionowe */
}

.nav-center .nav-title {
    font-size: 2em;
    font-weight: bold;
    color: #004085; /* Ciemniejszy niebieski dla napisu "VIS" */
    text-shadow: 1px 1px 2px rgba(0,0,0,0.2); /* Lekki cień na tekście */
}

.nav-icon {
    width: 28px; /* Nieco większe ikony dla lepszej widoczności */
    height: 28px;
    cursor: pointer;
    margin-left: 15px;
    vertical-align: middle;
    border-radius: 50%; /* Zaokrąglenie ikony, jeśli jest kwadratowa */
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.nav-icon:hover {
    transform: scale(1.1); /* Lekkie powiększenie przy najechaniu */
    box-shadow: 0 0 8px rgba(255,255,255,0.7); /* Biała poświata */
}

/* Style dla rozwijanych menu (dropdown) */
.nav-item.dropdown {
    position: relative;
    display: inline-block;
}

.dropdown-content {
    display: none; /* Domyślnie ukryte */
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    right: 0; /* Wyrównanie do prawej ikony */
    border-radius: 5px;
    overflow: hidden; /* Zapobiega wychodzeniu za rogi */
}

.dropdown-content a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    transition: background-color 0.3s ease;
}

.dropdown-content a:hover {
    background-color: #ddd;
}

/* Widoczność dropdown po kliknięciu JS */
.dropdown-content.show {
    display: block;
}

/* Style dla nagłówka strony */
header {
    background-color: #007bff;
    color: white;
    padding: 1rem 0;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 120px;
    margin-top: 0; /* Usuń margines, bo nawigacja jest sticky */
}

/* Zmniejszone logo w headerze, jeśli jest też w nawigacji */
header .header-logo {
    height: 90px; /* Dostosuj rozmiar logo w nagłówku */
    margin-bottom: 10px;
}

main {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    border-radius: 8px;
}

section {
    margin-bottom: 30px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #fdfdfd;
    text-align: center;
}

h2 {
    color: #0056b3;
}

button {
    background-color: #28a745;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    margin-top: 15px;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #218838;
}

footer {
    text-align: center;
    padding: 20px;
    margin-top: 40px;
    background-color: #333;
    color: white;
    font-size: 0.9em;
}

/* Style dla formularza wyboru lotów */
.form-group {
    margin-bottom: 15px;
    text-align: left;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
}

.form-group input[type="date"],
.form-group select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 1em;
}
