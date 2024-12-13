const apiKey = '3TWVpmzl3O8Auvj5ZH3SbJ8OmetgN7BiT185Q-AzaT0';
const trafficInfo = document.getElementById('traffic-info');
const addressForm = document.getElementById('addressform');
const searchButton = document.getElementById('search-button');
const radiusInput = document.getElementById('radius');
const addressInput = document.getElementById('address');
const filterInput = document.getElementById('filterInput');  // New filter input

let platform = new H.service.Platform({ apikey: apiKey });
let defaultLayers = platform.createDefaultLayers();
let map, circle, marker;

// Check if location is stored in localStorage, otherwise set default to Berlin
function getLocationFromLocalStorage() {
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
        return JSON.parse(storedLocation);
    } else {
        return { lat: 23.863714, lng: 78.808649 }; // Makronia's coordinates as default
    }
}

// Save location to localStorage
function saveLocationToLocalStorage(lat, lng) {
    const location = { lat, lng };
    localStorage.setItem('userLocation', JSON.stringify(location));
}

// Initialize the map
function initializeMap(lat, lng, radius) {
    if (map) map.dispose();

    map = new H.Map(
        document.getElementById('map'),
        defaultLayers.vector.normal.map,
        { center: { lat, lng }, zoom: 14 }
    );

    new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    window.addEventListener('resize', () => map.getViewPort().resize());

    // Add marker and circle
    marker = new H.map.Marker({ lat, lng });
    circle = new H.map.Circle(
        { lat, lng },
        radius,
        { style: { strokeColor: 'rgba(0, 0, 255, 0.5)', fillColor: 'rgba(0, 85, 170, 0.17)', lineWidth: 2 } }
    );

    map.addObjects([marker, circle]);
    map.getViewModel().setLookAtData({ bounds: circle.getBoundingBox() });
}

// Fetch traffic data
function fetchTrafficData(lat, lng, radius) {
    trafficInfo.innerHTML = ''; // Clear previous traffic data

    fetch(`https://data.traffic.hereapi.com/v7/flow?in=circle:${lat},${lng};r=${radius}&locationReferencing=shape&apiKey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const results = data.results || [];
            results.forEach(result => {
                const jamFactor = result.currentFlow.jamFactor;
                const routeName = result.location.description;

                result.location.shape.links.forEach(link => {
                    let color = 'grey';
                    if (jamFactor < 3) color = 'green';
                    else if (jamFactor < 6) color = '#9ACD32';
                    else if (jamFactor < 8) color = 'yellow';
                    else if (jamFactor < 10) color = 'orange';
                    else if (jamFactor === 10) color = 'red';

                    const lineString = new H.geo.LineString();
                    link.points.forEach(point => lineString.pushPoint(point));

                    const polyline = new H.map.Polyline(lineString, { style: { strokeColor: color } });
                    map.addObject(polyline);
                });

                // Populate traffic information
                var info = document.createElement('div');
                const liveText = result.currentFlow.confidence > 0.7 ? "LIVE" : "";
                info.classList.add('traffic-info-entry');
                let feedReliability = result.currentFlow.confidence ? `
                    <p>Feed Reliability: <span class="text-success">${result.currentFlow.confidence * 100}% <span id="live">${liveText}</span></span></p>
                ` : '';
                info.innerHTML = `
                    <p class="text-dark">Route Name: ${routeName}</p>
                    <p>Status: <span class="text-success">${result.currentFlow.traversability}</span></p>
                    <p>Jam Status: <span class="text-success">${jamFactor * 10}%</span></p>
                    ${feedReliability}
                    <hr>
                `;
                trafficInfo.appendChild(info);
            });

            // Add filtering functionality
            filterInput.addEventListener('input', function() {
                const filterText = filterInput.value.toLowerCase();
                const entries = trafficInfo.getElementsByClassName('traffic-info-entry');
                Array.from(entries).forEach(entry => {
                    const routeName = entry.querySelector('.text-dark').textContent.toLowerCase();
                    entry.style.display = routeName.includes(filterText) ? '' : 'none';
                });
            });
        })
        .catch(error => console.error('Error fetching traffic data:', error));
}

// Fetch coordinates for a new location using HERE Geocoding API
function geocodeAddress(address, radius) {
    fetch(`https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}&apiKey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.items.length > 0) {
                const { lat, lng } = data.items[0].position;
                initializeMap(lat, lng, radius);
                fetchTrafficData(lat, lng, radius);
            } else {
                alert('Location not found. Please try again.');
            }
        })
        .catch(error => console.error('Error fetching geocoding data:', error));
}

// Handle search button click
searchButton.addEventListener('click', () => {
    const address = addressInput.value.trim();
    const radius = parseInt(radiusInput.value, 10);
    if (address && radius) {
        geocodeAddress(address, radius);
    } else {
        alert('Please enter a valid address and radius.');
    }
});

// Ask for location permission on page load
function askForLocationPermission() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                saveLocationToLocalStorage(latitude, longitude);
                initializeMap(latitude, longitude, 1000); // Use the user's location
                fetchTrafficData(latitude, longitude, 1000);
            },
            (error) => {
                console.error('Geolocation error:', error);
                alert('Unable to retrieve your location.');
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}

// Use the saved location or request location permission
const userLocation = getLocationFromLocalStorage();
initializeMap(userLocation.lat, userLocation.lng, 1000);
fetchTrafficData(userLocation.lat, userLocation.lng, 1000);
askForLocationPermission();
