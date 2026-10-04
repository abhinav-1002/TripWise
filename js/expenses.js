const tripSelect = document.getElementById("tripSelect");
const addExpenseBtn = document.getElementById("addExpenseBtn");
const expenseFormContainer = document.getElementById("expenseFormContainer");
const expenseForm = document.getElementById("expenseForm");
const cancelExpenseBtn = document.getElementById("cancelExpenseBtn");
const expensesContainer = document.getElementById("expensesContainer");
const paidBySelect = document.getElementById("paidBy");


let editingExpenseId = null;


/* Load Trips */

function loadTrips() {
    const trips = getTrips();

    tripSelect.innerHTML = `
        <option value="">
            Select a trip
        </option>
    `;


    trips.forEach(trip => {
        const option = document.createElement("option");
        option.value = trip.id;

        option.textContent = `${trip.name} - ${trip.destination}`;
        tripSelect.appendChild(option);
    });
}


/* Load Members */

function loadMembers(tripId) {
    paidBySelect.innerHTML = `
        <option value="">
            Select Member
        </option>
    `;

    const trip = getTripById(tripId);

    if (!trip || !trip.membersList) {
        return;
    }

    trip.membersList.forEach(member => {
        const option = document.createElement("option");
        option.value = member.name;
        option.textContent = member.name;
        paidBySelect.appendChild(option);

    });
}


/* Show Form */

function showExpenseForm() {

    const selectedTrip = tripSelect.value;

    if (selectedTrip === "") {
        alert("Please select a trip first.");
        return;
    }

    expenseFormContainer.style.display = "block";

    expenseForm.scrollIntoView({
        behavior: "smooth"
    });

}


/* Hide Form */

function hideExpenseForm() {
    expenseFormContainer.style.display = "none";
    expenseForm.reset();
    editingExpenseId = null;
}


/* Display Expenses */

function displayExpenses() {
    const selectedTripId = tripSelect.value;

    if (selectedTripId === "") {
        expensesContainer.classList.remove(
            "has-expenses"
        );

        expensesContainer.innerHTML = `
            <div class="empty-state">
                <h3>
                    Select a trip
                </h3>
                <p>
                    Select a trip to view its expenses.
                </p>
            </div>
        `;
        return;
    }


    const expenses = getExpenses().filter(
            expense =>
                expense.tripId === selectedTripId
        );

    expensesContainer.innerHTML = "";

    if (expenses.length === 0) {
        expensesContainer.classList.remove(
            "has-expenses"
        );

        expensesContainer.innerHTML = `
            <div class="empty-state">
                <h3>
                    No expenses yet
                </h3>
                <p>
                    Add your first expense to start tracking your trip spending.
                </p>
            </div>
        `;

        return;
    }


    expensesContainer.classList.add(
        "has-expenses"
    );


    expenses.forEach(expense => {   
        const expenseCard = document.createElement("div");
        expenseCard.classList.add(
            "expense-card"
        );


        expenseCard.innerHTML = `
            <div class="expense-info">

                <p class="expense-date">
                    ${expense.date}
                </p>

                <h3>
                    ${expense.name}
                </h3>

                <p>
                    <strong>Paid by:</strong>
                    ${expense.paidBy}
                </p>

            </div>

            <div class="expense-right">
                <h3>
                    ₹${expense.amount.toFixed(2)}
                </h3>

                <div class="expense-actions">
                    <button
                        class="secondary-btn"
                        onclick="editExpense('${expense.id}')"
                    >
                        Edit
                    </button>
                    <button
                        class="delete-expense-btn"
                        onclick="removeExpense('${expense.id}')"
                    >
                        Delete
                    </button>
                </div>
            </div>
        `;

        expensesContainer.appendChild(expenseCard);
    });

}


/* Add/Update Expense */

expenseForm.addEventListener(
    "submit",
    function(event) {
        event.preventDefault();

        const tripId = tripSelect.value;
        const name = document.getElementById("expenseName").value.trim();
        const amount = Number(document.getElementById("expenseAmount").value);
        const paidBy = document.getElementById("paidBy").value;

        const date = document.getElementById("expenseDate").value;


        const expenseData = {
            tripId: tripId,
            name: name,
            amount: amount,
            paidBy: paidBy,
            date: date
        };


        if (editingExpenseId !== null) {
            updateExpense(
                editingExpenseId,
                expenseData
            );
        } else {
            const newExpense = {
                id: Date.now().toString(),
                ...expenseData
            };

            addExpense(newExpense);
        }


        hideExpenseForm();
        displayExpenses();
    }
);


/*Edit expense */

function editExpense(expenseId) {
    const expenses = getExpenses();
    const expense = expenses.find(expense =>expense.id === expenseId);

    if (!expense) {
        return;
    }

    tripSelect.value = expense.tripId;
    loadMembers(expense.tripId);


    document.getElementById("expenseName").value = expense.name;
    document.getElementById("expenseAmount").value = expense.amount;
    document.getElementById("paidBy").value = expense.paidBy;
    document.getElementById("expenseDate").value = expense.date;

    editingExpenseId = expenseId;
    showExpenseForm();
}


/* Delete Expense */

function removeExpense(expenseId) {

    const shouldDelete =
        confirm(
            "Are you sure you want to delete this expense?"
        );

    if (!shouldDelete) {
        return;
    }

    deleteExpense(expenseId);
    displayExpenses();
}


/* Evetns */

tripSelect.addEventListener(
    "change",
    function() {
        loadMembers(
            tripSelect.value
        );
        displayExpenses();
    }
);

addExpenseBtn.addEventListener(
    "click",
    showExpenseForm
);

cancelExpenseBtn.addEventListener(
    "click",
    hideExpenseForm
);


/* Initial Load */

loadTrips();
displayExpenses();