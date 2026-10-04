const TRIPS_KEY = "tripwise_trips";

function getTrips() {
    const trips = localStorage.getItem(TRIPS_KEY);

    if (trips === null) {
        return [];
    }

    return JSON.parse(trips);
}

function saveTrips(trips) {
    localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
}

function addTrip(trip) {
    const trips = getTrips();
    trips.push(trip);
    saveTrips(trips);
}

function deleteTrip(tripId) {
    const trips = getTrips();
    const updatedTrips = trips.filter(trip => trip.id !== tripId);
    saveTrips(updatedTrips);
}


/* Itinerary Storage */

const ITINERARY_KEY = "tripwise_itinerary";


function getActivities() {
    const activities = localStorage.getItem(ITINERARY_KEY);

    if (activities === null) {
        return [];
    }

    return JSON.parse(activities);
}


function saveActivities(activities) {
    localStorage.setItem(ITINERARY_KEY,JSON.stringify(activities));
}


function addActivity(activity) {
    const activities = getActivities();
    activities.push(activity);
    saveActivities(activities);
}


function updateActivity(activityId, updatedActivity) {
    const activities = getActivities();
    const updatedActivities = activities.map(activity => {

        if (activity.id === activityId) {
            return {
                ...activity,
                ...updatedActivity
            };
        }

        return activity;

    });

    saveActivities(updatedActivities);
}


function deleteActivity(activityId) {
    const activities = getActivities();
    const updatedActivities = activities.filter(
        activity => activity.id !== activityId
    );
    saveActivities(updatedActivities);
}


/* Trip members */

function getTripById(tripId) {
    const trips = getTrips();
    return trips.find(trip => trip.id === tripId);
}


function addMember(tripId, memberName) {
    const trips = getTrips();
    const trip = trips.find(trip => trip.id === tripId);

    if (!trip) {
        return;
    }

    if (!trip.membersList) {
        trip.membersList = [];
    }

    const newMember = {
        id: Date.now().toString(),
        name: memberName
    };

    trip.membersList.push(newMember);
    saveTrips(trips);
}


function deleteMember(tripId, memberId) {
    const trips = getTrips();
    const trip = trips.find(trip => trip.id === tripId);

    if (!trip || !trip.membersList) {
        return;
    }

    trip.membersList = trip.membersList.filter(
        member => member.id !== memberId
    );
    saveTrips(trips);
}


/* Expense Storage */

const EXPENSES_KEY = "tripwise_expenses";

function getExpenses() {
    const expenses = localStorage.getItem(EXPENSES_KEY);
    if (expenses === null) {
        return [];
    }
    return JSON.parse(expenses);
}

function saveExpenses(expenses) {
    localStorage.setItem(
        EXPENSES_KEY,
        JSON.stringify(expenses)
    );
}

function addExpense(expense) {
    const expenses = getExpenses();
    expenses.push(expense);
    saveExpenses(expenses);
}

function updateExpense(expenseId, updatedExpense) {
    const expenses = getExpenses();
    const updatedExpenses = expenses.map(expense => {
        if (expense.id === expenseId) {
            return {
                ...expense,
                ...updatedExpense
            };
        }
        return expense;
    });
    saveExpenses(updatedExpenses);
}

function deleteExpense(expenseId) {
    const expenses = getExpenses();
    const updatedExpenses = expenses.filter(
        expense => expense.id !== expenseId
    );
    saveExpenses(updatedExpenses);
}