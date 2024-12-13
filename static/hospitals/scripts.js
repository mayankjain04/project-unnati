document.addEventListener("DOMContentLoaded", () => {
    const citySelect = document.getElementById("pgt-city-select");
    const searchButton = document.getElementById("pgt-search-button");
    const resultsHeading = document.getElementById("pgt-results-heading");
    const hospitalList = document.getElementById("pgt-hospital-list");
    const hospitalDetails = document.getElementById("hospital-details");

    // Hospital detail fields
    const hospitalImage = document.getElementById("hospital-image");
    const hospitalName = document.getElementById("hospital-name");
    const hospitalSpeciality = document.getElementById("hospital-speciality");
    const hospitalDoctors = document.getElementById("hospital-doctors");
    const hospitalContact = document.getElementById("hospital-contact");
    const hospitalAmbulance = document.getElementById("hospital-ambulance");
    const hospitalBeds = document.getElementById("hospital-beds");

    let hospitalData = {};

    // Load city data from JSON
    fetch(dataUrl)
        .then(response => response.json())
        .then(data => {
            hospitalData = data;
            populateCitySelect(data.cities);
        })
        .catch(error => console.error("Error loading data:", error));

    function populateCitySelect(cities) {
        cities.forEach(city => {
            const option = document.createElement("option");
            option.value = city.name;
            option.textContent = city.name;
            citySelect.appendChild(option);
        });
    }

    searchButton.addEventListener("click", () => {
        const selectedCity = citySelect.value;
        if (!selectedCity) {
            alert("Please select a city!");
            return;
        }

        const cityData = hospitalData.cities.find(city => city.name === selectedCity);
        if (cityData) {
            updateHospitalList(cityData.hospitals);
        } else {
            alert("No data available for the selected city.");
        }
    });

    function updateHospitalList(hospitals) {
        resultsHeading.textContent = `Hospitals in ${citySelect.value}`;
        hospitalList.innerHTML = ""; // Clear previous results

        hospitals.forEach((hospital, index) => {
            const listItem = document.createElement("li");
            listItem.className = "pgt-li";

            const link = document.createElement("a");
            link.className = "pgt-link";
            link.href = "#";
            link.textContent = hospital.name;
            link.addEventListener("click", () => {
                displayHospitalDetails(hospital);
            });

            listItem.appendChild(link);
            hospitalList.appendChild(listItem);
        });
    }

    function displayHospitalDetails(hospital) {
        hospitalDetails.style.display = "block";
        hospitalImage.src = hospital.image;
        hospitalName.textContent = hospital.name;
        hospitalSpeciality.textContent = `Speciality: ${hospital.speciality}`;
        hospitalDoctors.textContent = `Doctors: ${hospital.doctors.join(", ")}`;
        hospitalContact.textContent = `Contact: ${hospital.contact}`;
        hospitalAmbulance.textContent = `Ambulance Available: ${hospital.ambulanceAvailable ? "Yes" : "No"}`;
        hospitalBeds.textContent = `Beds Available: ${hospital.bedsAvailable ? "Yes" : "No"}`;
    }
});
