const addActivityBtn = document.getElementById("addActivityBtn");
const activityFormContainer = document.getElementById("activityFormContainer");
const activityForm = document.getElementById("activityForm");
const cancelActivityBtn = document.getElementById("cancelActivityBtn");
const itineraryContainer = document.getElementById("itineraryContainer");

let editingActivityId = null;


/* Show Form */
function showActivityForm() {
    activityFormContainer.style.display = "block";
    activityForm.scrollIntoView({
        behavior: "smooth"
    });
}


/* Hide form */
function hideActivityForm() {
    activityFormContainer.style.display = "none";
    activityForm.reset();
    editingActivityId = null;
}


/* Display activitities */
function displayActivities() {
    const activities = getActivities();
    itineraryContainer.innerHTML = "";

    if (activities.length === 0) {
        itineraryContainer.classList.remove("has-activities");
        itineraryContainer.innerHTML = `
            <div class="empty-state">
                <h3>
                    No activities yet
                </h3>
                <p>
                    Add your first activity to start planning your itinerary.
                </p>
            </div>
        `;
        return;
    }

    itineraryContainer.classList.add("has-activities");

    activities.sort((a, b) => {
        if (a.day !== b.day) {
            return a.day - b.day;
        }
        return a.time.localeCompare(b.time);
    });


    activities.forEach(activity => {
        const activityCard = document.createElement("div");
        activityCard.classList.add("activity-card");

        activityCard.innerHTML = `
            <div class="activity-info">
                <p class="activity-day">
                    Day ${activity.day}
                </p>

                <h3>
                    ${activity.name}
                </h3>

                <p>
                    <strong>Time:</strong>
                    ${activity.time}
                </p>

                <p>
                    <strong>Location:</strong>
                    ${activity.location}
                </p>

                <p>
                    ${activity.description}
                </p>
            </div>

            <div class="activity-actions">
                <button
                    class="secondary-btn"
                    onclick="editActivity('${activity.id}')"
                >
                    Edit
                </button>

                <button
                    class="delete-activity-btn"
                    onclick="removeActivity('${activity.id}')"
                >
                    Delete
                </button>
            </div>
        `;

        itineraryContainer.appendChild(activityCard);
    });

}


/* Add update activity */

activityForm.addEventListener(
    "submit",
    function(event) {
        event.preventDefault();
        const day = Number(document.getElementById("activityDay").value);
        const time = document.getElementById("activityTime").value;
        const name = document.getElementById("activityName").value.trim();

        const location = document.getElementById("activityLocation").value.trim();
        const description = document.getElementById("activityDescription").value.trim();

        const activityData = {
            day: day,
            time: time,
            name: name,
            location: location,
            description: description
        };

        if (editingActivityId !== null) {
            updateActivity(
                editingActivityId,
                activityData
            );

        } else {
            const newActivity = {
                id: Date.now().toString(),
                ...activityData
            };
            addActivity(newActivity);
        }

        hideActivityForm();
        displayActivities();
    }
);


/* Edit activity */

function editActivity(activityId) {
    const activities = getActivities();
    const activity = activities.find(activity => activity.id === activityId);

    if (!activity) {
        return;
    }

    document.getElementById("activityDay").value = activity.day;
    document.getElementById("activityTime").value = activity.time;
    document.getElementById("activityName").value = activity.name;
    document.getElementById("activityLocation").value = activity.location;
    document.getElementById("activityDescription").value = activity.description;

    editingActivityId = activityId;
    showActivityForm();
}


/* Delete Activity */

function removeActivity(activityId) {
    const shouldDelete = confirm(
        "Are you sure you want to delete this activity?"
    );


    if (!shouldDelete) {
        return;
    }

    deleteActivity(activityId);
    displayActivities();
}


/* Events */

addActivityBtn.addEventListener(
    "click",
    showActivityForm
);

cancelActivityBtn.addEventListener(
    "click",
    hideActivityForm
);


/* Load activities */

displayActivities();