// Funkcje do wyboru lotnisk (przykład)
document.getElementById('from-input').addEventListener('click', function() {
    const modal = document.getElementById('from-modal');
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Wybierz lotnisko</h3>
            <div class="country" onclick="showAirports('from', 'Polska')">
                Polska ▼
                <div class="city-list hidden" id="from-Polska">
                    <div class="city" onclick="selectAirport('from', 'GDN', 'Gdańsk (GDN)')">Gdańsk (GDN)</div>
                    <div class="city" onclick="selectAirport('from', 'WAW', 'Warszawa (WAW)')">Warszawa (WAW)</div>
                </div>
            </div>
        </div>
    `;
    modal.classList.toggle('active');
});

function selectAirport(prefix, code, name) {
    document.getElementById(`${prefix}-input`).value = name;
    document.getElementById(`${prefix}-modal`).classList.remove('active');
}
