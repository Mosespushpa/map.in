// List of Union Territories
const unionTerritories = [
  'Andaman_and_Nicobar_Islands',
  'Chandigarh',
  'Dadra_and_Nagar_Haveli_and_Daman_and_Diu',
  'Delhi',
  'Jammu_and_Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

// Small dataset for states. Expand or replace with API calls as needed.
const stateData = {
  
  Andhra_Pradesh: { name: 'Andhra Pradesh', capital: 'Amaravati', area: '162,975 km²', population: '54 Million' },
  Arunachal_Pradesh: { name: 'Arunachal Pradesh', capital: 'Itanagar', area: '83,743 km²', population: '1.5 Million' },
  Assam: { name: 'Assam', capital: 'Dispur', area: '78,438 km²', population: '36 Million' },
  Bihar: { name: 'Bihar', capital: 'Patna', area: '94,163 km²', population: '124 Million' },
  Chhattisgarh: { name: 'Chhattisgarh', capital: 'Raipur', area: '135,192 km²', population: '29 Million' },
  Goa: { name: 'Goa', capital: 'Panaji', area: '3,702 km²', population: '1.5 Million' },
  Haryana: { name: 'Haryana', capital: 'Chandigarh', area: '44,212 km²', population: '28 Million' },
  Himachal_Pradesh: { name: 'Himachal Pradesh', capital: 'Shimla', area: '55,673 km²', population: '7.5 Million' },
  Jharkhand: { name: 'Jharkhand', capital: 'Ranchi', area: '79,714 km²', population: '38 Million' },
  Karnataka: { name: 'Karnataka', capital: 'Bengaluru', area: '191,791 km²', population: '68 Million' },
  Kerala: { name: 'Kerala', capital: 'Thiruvananthapuram', area: '38,863 km²', population: '35 Million' },
  Madhya_Pradesh: { name: 'Madhya Pradesh', capital: 'Bhopal', area: '308,245 km²', population: '72 Million' },
  Maharashtra: { name: 'Maharashtra', capital: 'Mumbai', area: '307,713 km²', population: '112 Million' },
  Manipur: { name: 'Manipur', capital: 'Imphal', area: '22,327 km²', population: '3 Million' },
  Meghalaya: { name: 'Meghalaya', capital: 'Shillong', area: '22,429 km²', population: '3.3 Million' },
  Mizoram: { name: 'Mizoram', capital: 'Aizawl', area: '21,081 km²', population: '1.1 Million' },
  Nagaland: { name: 'Nagaland', capital: 'Kohima', area: '16,579 km²', population: '2.2 Million' },
  Odisha: { name: 'Odisha', capital: 'Bhubaneswar', area: '155,707 km²', population: '46 Million' },
  Punjab: { name: 'Punjab', capital: 'Chandigarh', area: '50,362 km²', population: '30 Million' },
  Rajasthan: { name: 'Rajasthan', capital: 'Jaipur', area: '342,239 km²', population: '68 Million' },
  Sikkim: { name: 'Sikkim', capital: 'Gangtok', area: '7,096 km²', population: '0.7 Million' },
  Tamil_Nadu: { name: 'Tamil Nadu', capital: 'Chennai', area: '130,060 km²', population: '72 Million' },
  Telangana: { name: 'Telangana', capital: 'Hyderabad', area: '112,077 km²', population: '35 Million' },
  Tripura: { name: 'Tripura', capital: 'Agartala', area: '10,491 km²', population: '4 Million' },
  Uttar_Pradesh: { name: 'Uttar Pradesh', capital: 'Lucknow', area: '240,928 km²', population: '200 Million' },
  Uttarakhand: { name: 'Uttarakhand', capital: 'Dehradun', area: '53,483 km²', population: '11 Million' },
  West_Bengal: { name: 'West Bengal', capital: 'Kolkata', area: '88,752 km²', population: '91 Million' },

  // Union Territories
  Andaman_and_Nicobar_Islands: { name: 'Andaman and Nicobar Islands', capital: 'Port Blair', area: '8,249 km²', population: '0.4 Million' },
  Chandigarh: { name: 'Chandigarh', capital: 'Chandigarh', area: '114 km²', population: '1.1 Million' },
  Dadra_and_Nagar_Haveli_and_Daman_and_Diu: { name: 'Dadra and Nagar Haveli and Daman and Diu', capital: 'Daman', area: '603 km²', population: '0.6 Million' },
  Delhi: { name: 'Delhi', capital: 'New Delhi', area: '1,484 km²', population: '20 Million' },
  Jammu_and_Kashmir: { name: 'Jammu and Kashmir', capital: 'Srinagar (Summer), Jammu (Winter)', area: '55,538 km²', population: '13 Million' },
  Ladakh: { name: 'Ladakh', capital: 'Leh', area: '59,146 km²', population: '0.3 Million' },
  Lakshadweep: { name: 'Lakshadweep', capital: 'Kavaratti', area: '32 km²', population: '0.07 Million' },
  Puducherry: { name: 'Puducherry', capital: 'Puducherry', area: '490 km²', population: '1.5 Million' }

};

const noDataBadge = () => document.getElementById('no-data-badge');

function showNoData(show) {
    const badge = noDataBadge();
    if (!badge) return;
    badge.classList.toggle('hidden', !show);
}

function resetDetails() {
    document.getElementById('display-name').innerText = 'Hover over a state';
    document.getElementById('cap').innerText = '-';
    document.getElementById('area').innerText = '-';
    document.getElementById('pop').innerText = '-';
    const preview = document.getElementById('preview-path');
    if (preview) preview.setAttribute('d', '');
    showNoData(false);
}

function setPreviewPathFrom(el) {
    const previewPath = document.getElementById('preview-path');
    const previewSVG = document.getElementById('preview-container');
    if (!previewPath || !previewSVG) return;

    const d = (el.getAttribute('d') || '').trim();
    if (!d) {
        previewPath.setAttribute('d', '');
        showNoData(true);
        return;
    }

    showNoData(false);
    previewPath.setAttribute('d', d);

    try {
        const bbox = el.getBBox();
        const pad = 20;
        const minX = bbox.x - pad;
        const minY = bbox.y - pad;
        const width = bbox.width + pad * 2;
        const height = bbox.height + pad * 2;
        previewSVG.setAttribute('viewBox', `${minX} ${minY} ${width} ${height}`);
    } catch (err) {
        previewSVG.setAttribute('viewBox', '0 0 432 488');
    }
}

function attachHandlers(rootEl) {
    const states = rootEl.querySelectorAll('.state');
    states.forEach(state => {
        if (!state.hasAttribute('tabindex')) state.setAttribute('tabindex', '0');
        state.setAttribute('role', 'button');
        state.setAttribute('aria-label', state.id ? state.id.replace(/_/g, ' ') : 'state');

        const enterHandler = () => {
            const id = state.id;
            const data = stateData[id];

            if (data) {
                document.getElementById('display-name').innerText = data.name;
                document.getElementById('cap').innerText = data.capital;
                document.getElementById('area').innerText = data.area;
                document.getElementById('pop').innerText = data.population;
                showNoData(false);
            } else {
                document.getElementById('display-name').innerText = (id || 'Unknown').replace(/_/g, ' ');
                document.getElementById('cap').innerText = '-';
                document.getElementById('area').innerText = '-';
                document.getElementById('pop').innerText = '-';
                showNoData(true);
            }

            setPreviewPathFrom(state);
        };

        state.addEventListener('mouseenter', enterHandler);
        state.addEventListener('focus', enterHandler);

        state.addEventListener('mouseleave', () => resetDetails());
        state.addEventListener('blur', () => resetDetails());

        state.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                enterHandler();
            }
        });
    });
}

// Apply darker shade to Union Territories
function applyUnionTerritoryStyles() {
    const mapSVG = document.getElementById('india-map');
    if (!mapSVG) return;

    unionTerritories.forEach(utId => {
        const element = mapSVG.querySelector(`#${utId}`);
        if (element) {
            element.style.fill = '#d4a574'; // Darker shade
            element.classList.add('union-territory');
        }
    });
}

// Attach handlers directly to inline SVG
document.addEventListener('DOMContentLoaded', () => {
    const mapSVG = document.getElementById('india-map');
    if (mapSVG) {
        attachHandlers(mapSVG);
        applyUnionTerritoryStyles();
    }
});
