const createTripBtn = document.getElementById("createTripBtn");
const addTripBtn = document.getElementById("addTripBtn");

const tripFormContainer = document.getElementById("tripFormContainer");
const tripForm = document.getElementById("tripForm");
const cancelTripBtn = document.getElementById("cancelTripBtn");

const tripsContainer = document.getElementById("tripsContainer");

const membersInput = document.getElementById("members");
const memberNamesContainer = document.getElementById("memberNamesContainer");


/* Show trips */
function showTripForm() {
    tripFormContainer.style.display = "block";

    tripForm.scrollIntoView({
        behavior: "smooth"
    });
}

/* Create Member name fields */

function createMemberNameFields() {
    const memberCount = Number(membersInput.value);

    memberNamesContainer.innerHTML = "";

    if (memberCount <= 0) {
        return;
    }

    for (let i = 1; i <= memberCount; i++) {
        const memberGroup = document.createElement("div");
        memberGroup.classList.add(
            "form-group"
        );

        memberGroup.innerHTML = `

            <label for="member-${i}">
                Member ${i} Name
            </label>

            <input
                type="text"
                id="member-${i}"
                class="member-name-input"
                placeholder="Enter member ${i} name"
                required
            >
        `;

        memberNamesContainer.appendChild(memberGroup);
    }
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

        tripsContainer.classList.remove("has-trips");

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

    tripsContainer.classList.add("has-trips");

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
                ${trip.membersList? trip.membersList.length : trip.members}
            </p>

            <div class="trip-card-actions">

                <button
                    class="secondary-btn"
                    onclick="showMembers('${trip.id}')"
                >
                    Manage Members
                </button>

                <button
                    class="delete-trip-btn"
                    onclick="removeTrip('${trip.id}')"
                >
                    Delete
                </button>

            </div>

            <div
                class="members-section"
                id="members-${trip.id}"
            >
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

    const memberInputs =
    document.querySelectorAll(".member-name-input");

    const membersList = [];


    memberInputs.forEach(input => {
        const memberName = input.value.trim();
        membersList.push({
            id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
            name: memberName
        });
    });


    const newTrip = {
        id: Date.now().toString(),
        name: tripName,
        destination: destination,
        startDate: startDate,
        endDate: endDate,
        members: membersList.length,
        membersList: membersList
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

/* Show members */

function showMembers(tripId) {
    const membersSection = document.getElementById(`members-${tripId}`);
    const trip = getTripById(tripId);

    if (!trip) {
        return;
    }

    if (!trip.membersList) {
        trip.membersList = [];
    }

    let membersHTML = `
        <div class="members-box">

            <h4>
                ${trip.name} Members
            </h4>

            <div class="member-list">
    `;

    if (trip.membersList.length === 0) {

        membersHTML += `
            <p class="no-members">
                No members added yet.
            </p>
        `;

    } else {
        trip.membersList.forEach(member => {

            membersHTML += `
                <div class="member-item">

                    <span>
                        ${member.name}
                    </span>

                    <button
                        class="delete-member-btn"
                        onclick="removeMember(
                            '${trip.id}',
                            '${member.id}'
                        )"
                    >
                        Delete
                    </button>

                </div>
            `;

        });

    }

    membersHTML += `

            </div>

            <form
                class="member-form"
                onsubmit="addNewMember(event, '${trip.id}')"
            >

                <input
                    type="text"
                    id="member-name-${trip.id}"
                    placeholder="Enter member name"
                    required
                >

                <button
                    type="submit"
                    class="primary-btn"
                >
                    Add Member
                </button>

            </form>

        </div>
    `;

    membersSection.innerHTML = membersHTML;
}

/* Add member */

function addNewMember(event, tripId) {

    event.preventDefault();

    const memberInput = document.getElementById(`member-name-${tripId}`);
    const memberName = memberInput.value.trim();

    if (memberName === "") {
        return;
    }


    addMember(tripId, memberName);
    displayTrips();
    showMembers(tripId);
}

/* Delete member */

function removeMember(tripId, memberId) {
    const shouldDelete = confirm(
        "Are you sure you want to delete this member?"
    );

    if (!shouldDelete) {
        return;
    }

    deleteMember(tripId, memberId);
    displayTrips();
    showMembers(tripId);
}

/* Events */
createTripBtn.addEventListener("click", showTripForm);
addTripBtn.addEventListener("click", showTripForm);
cancelTripBtn.addEventListener("click", hideTripForm);
membersInput.addEventListener("input",createMemberNameFields);

/* Load trips */
displayTrips();