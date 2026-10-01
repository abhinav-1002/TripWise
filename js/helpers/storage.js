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