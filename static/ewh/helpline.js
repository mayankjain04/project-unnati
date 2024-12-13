// Panic Button Modal Trigger
function triggerEmergencyModal() {
    const modal = document.getElementById('dm-panic-modal');
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('dm-panic-modal');
    modal.style.display = 'none';
}

// Send Panic Alert via SMS or API (Example shown)
async function sendAlert() {
    const location = await getLocation();
    const alertMsg = `Emergency! Help needed at location: Latitude = ${location.lat}, Longitude = ${location.lon}`;
    
    // Example API integration to send alert
    console.log(alertMsg);
    alert("Alert sent!");  // For now, just show an alert for demonstration.
    closeModal();
}

// Call Emergency Services
function callEmergency(number) {
    window.location.href = `tel:${number}`;
}

// Share Location via WhatsApp
async function shareLocation() {
    const location = await getLocation();
    const locationMsg = `Location shared: Latitude = ${location.lat}, Longitude = ${location.lon}`;
    // document.getElementById('dm-location-msg').innerText = locationMsg;

    // Open WhatsApp with the location message
    const whatsappUrl = `https://wa.me/?text=Emergency%20Help!%20I%20am%20at%20Latitude%3A%20${location.lat}%20Longitude%3A%20${location.lon}`;
    window.open(whatsappUrl, "_blank");
    alert(locationMsg);

}

// Get Current Location
async function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => resolve({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                }),
                () => reject({ lat: 0, lon: 0 })
            );
        } else {
            reject({ lat: 0, lon: 0 });
        }
    });
}

// Load Dynamic Safety Tips
function loadSafetyTips() {
    const tipsList = document.getElementById('dm-tips-list');
    tipsList.innerHTML = ''; // Clear existing tips
    const tips = [
        'Always carry a pepper spray or a stun gun.',
        'Keep your phone fully charged in case of emergencies.',
        'Be cautious while walking alone at night.',
        'Trust your instincts and avoid uncomfortable situations.',
        'Inform someone about your whereabouts when traveling.',
        'If you are in immediate danger, use your panic button or alert system.',
        'Try to stay in well-lit and populated areas.',
        'Don’t share too much personal information with strangers.'
    ];
    
    tips.forEach(tip => {
        const li = document.createElement('li');
        li.innerText = tip;
        tipsList.appendChild(li);
    });
}

// Find Nearby Safe Spaces on Map
function findSafeSpaces() {
    document.querySelector('#map').classList.remove('d-none')
    document.querySelector('#map').classList.add('d-flex')

    const latitude = 23.863733;
    const longitude = 78.808491;
    const dataRadius = 1000;

    // Initialize the map
    var map = L.map('map').setView([latitude, longitude], 13);

    // Set up the OpenStreetMap layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    // Add a circle to indicate the radius of the area
    var circle = L.circle([latitude, longitude], {
        color: 'blue',
        fillColor: '#blue',
        fillOpacity: 0.1,
        radius: dataRadius
    }).addTo(map);

    // Fit map view to the circle's bounding box
    map.fitBounds(circle.getBounds());

    // Add a marker for the user's location
    L.marker([latitude, longitude]).addTo(map)
        .bindPopup('You are here');

    // Simulate random safe and unsafe spaces
    generateRandomSpaces(map, latitude, longitude);
}


// Generate Random Safe and Unsafe Spaces
function generateRandomSpaces(map, centerLat, centerLon) {
    const colors = ['green', 'red']; // Safe and unsafe colors
    const tooltips = ['Safe Space', 'Unsafe Space'];
    const numSafeSpaces = Math.floor(Math.random() * 5) + 1; // Random between 1 and 5 safe spaces
    const numUnsafeSpaces = Math.floor(Math.random() * 5) + 1; // Random between 1 and 5 unsafe spaces

    // Generate safe spaces
    for (let i = 0; i < numSafeSpaces; i++) {
        let lat = centerLat + (Math.random() - 0.5) * 0.02; // Random nearby latitude
        let lon = centerLon + (Math.random() - 0.5) * 0.02; // Random nearby longitude
        
        L.rectangle([[lat - 0.0005, lon - 0.0005], [lat + 0.0005, lon + 0.0005]], {
            color: colors[0],
            weight: 1,
            opacity: 0.5,
            fillOpacity: 0.5,
            fillColor: colors[0],
        }).addTo(map).bindTooltip(tooltips[0]);
    }

    // Generate unsafe spaces
    for (let i = 0; i < numUnsafeSpaces; i++) {
        let lat = centerLat + (Math.random() - 0.5) * 0.02; // Random nearby latitude
        let lon = centerLon + (Math.random() - 0.5) * 0.02; // Random nearby longitude
        
        L.rectangle([[lat - 0.0005, lon - 0.0005], [lat + 0.0005, lon + 0.0005]], {
            color: colors[1],
            weight: 1,
            opacity: 0.5,
            fillOpacity: 0.5,
            fillColor: colors[1],
        }).addTo(map).bindTooltip(tooltips[1]);
    }
}
