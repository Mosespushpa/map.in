const stateData = {
    "Mizoram": {
        name: "Mizoram",
        capital: "Aizawl",
        area: "21,081 km²",
        population: "1.1 Million"
    },
    "Telangana": {
        name: "Telangana",
        capital: "Hyderabad",
        area: "112,077 km²",
        population: "35 Million"
    }
};

document.querySelectorAll('.state').forEach(state => {
    state.addEventListener('mouseenter', function() {
        const id = this.id;
        const data = stateData[id];

        if (data) {
            // 1. Update Text
            document.getElementById('display-name').innerText = data.name;
            document.getElementById('cap').innerText = data.capital;
            document.getElementById('area').innerText = data.area;
            document.getElementById('pop').innerText = data.population;
            
            // 2. Update Preview Map
            const preview = document.getElementById('preview-path');
            preview.setAttribute('d', this.getAttribute('d'));
            
            // 3. Bring to Front for 3D effect
            this.parentNode.appendChild(this);
        }
    });
});