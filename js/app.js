const createTripBtn = document.getElementById("createTripBtn");
const addTripBtn = document.getElementById("addTripBtn");

const tripFormContainer = document.getElementById("tripFormContainer");
const tripForm = document.getElementById("tripForm");
const cancelTripBtn = document.getElementById("cancelTripBtn");

const tripsContainer = document.getElementById("tripsContainer");


/* Show trips */
function showTripForm() {
    tripFormContainer.style.display = "block";

    tripForm.scrollIntoView({
        behavior: "smooth"
    });
}


/* Hide trips */
function hideTripForm() {
    tripFormContainer.style.display = "none";
    tripForm.reset();
}


/* Display trips */
function displayTrips() {

    const trips = getTrips();
    tripsContainer.innerHTML = "";

    if (trips.length === 0) {

        tripsContainer.innerHTML = `
            <div class="empty-state">
                <h3>No trips yet</h3>
                <p>
                    Create your first trip and start planning your journey.
                </p>
            </div>
        `;

        return;
    }

    trips.forEach(trip => {

        const tripCard = document.createElement("div");

        tripCard.classList.add("trip-card");

        tripCard.innerHTML = `
            <h3>${trip.name}</h3>

            <p>
                <strong>Destination:</strong>
                ${trip.destination}
            </p>

            <p>
                <strong>Dates:</strong>
                ${trip.startDate} to ${trip.endDate}
            </p>

            <p>
                <strong>Members:</strong>
                ${trip.members}
            </p>

            <div class="trip-card-actions">

                <button
                    class="delete-trip-btn"
                    onclick="removeTrip('${trip.id}')"
                >
                    Delete
                </button>

            </div>
        `;

        tripsContainer.appendChild(tripCard);
    });
}


/* Create trips */
tripForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const tripName = document.getElementById("tripName").value.trim();
    const destination = document.getElementById("destination").value.trim();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const members = document.getElementById("members").value;


    const newTrip = {
        id: Date.now().toString(),
        name: tripName,
        destination: destination,
        startDate: startDate,
        endDate: endDate,
        members: Number(members)
    };

    addTrip(newTrip);
    hideTripForm();
    displayTrips();

});


/* Delete trips */
function removeTrip(tripId) {

    const shouldDelete = confirm(
        "Are you sure you want to delete this trip?"
    );

    if (!shouldDelete) {
        return;
    }

    deleteTrip(tripId);
    displayTrips();
}


/* Events */
createTripBtn.addEventListener("click", showTripForm);
addTripBtn.addEventListener("click", showTripForm);
cancelTripBtn.addEventListener("click", hideTripForm);


/* Load trips */
displayTrips();