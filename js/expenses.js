const tripSelect = document.getElementById("tripSelect");
const addExpenseBtn = document.getElementById("addExpenseBtn");
const expenseFormContainer = document.getElementById("expenseFormContainer");
const expenseForm = document.getElementById("expenseForm");
const cancelExpenseBtn = document.getElementById("cancelExpenseBtn");
const expensesContainer = document.getElementById("expensesContainer");
const paidBySelect = document.getElementById("paidBy");

const splitWorker = new Worker("./../js/workers/splitWorker.js");

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

        clearSplitData();
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

        clearSplitData();
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
    calculateSplit();

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


/* Run Split Calculation */

function calculateSplit() {

    const selectedTripId = tripSelect.value;

    if (selectedTripId === "") {
        return;
    }

    const trip = getTripById(selectedTripId);

    if (!trip || !trip.membersList) {
        return;
    }


    const expenses =
        getExpenses().filter(
            expense =>
                expense.tripId === selectedTripId
        );


    splitWorker.postMessage({
        expenses: expenses,
        members: trip.membersList
    });

}

/* Receive Worker Result */

splitWorker.onmessage = function(event) {

    const result = event.data;

    displaySplitSummary(result);
    displayAnalytics(result.analytics);

};

/* Display Split Summary */

function displaySplitSummary(result) {

    const totalExpensesElement = document.getElementById("totalExpenses");
    const eachPersonPaysElement = document.getElementById("eachPersonPays");
    const balanceList = document.getElementById("balanceList");

    totalExpensesElement.textContent = `₹${result.totalExpenses.toFixed(2)}`;
    eachPersonPaysElement.textContent = `₹${result.eachPersonPays.toFixed(2)}`;

    balanceList.innerHTML = "";

    if (result.balances.length === 0) {

        balanceList.innerHTML = `
            <p class="no-members">
                Add members to this trip to calculate balances.
            </p>
        `;

        return;

    }


    result.balances.forEach(member => {

        let balanceText = "";
        let balanceClass = "";

        if (member.status === "gets") {
            balanceText = `Gets ₹${member.balance.toFixed(2)}`;
            balanceClass = "positive-balance";

        } else if (member.status === "owes") {
            balanceText = `Owes ₹${Math.abs(member.balance).toFixed(2)}`;
            balanceClass = "negative-balance";
        } else {
            balanceText = "Settled";
            balanceClass = "zero-balance";
        }

        const balanceItem = document.createElement("div");

        balanceItem.classList.add(
            "balance-item"
        );


        balanceItem.innerHTML = `

            <div>

                <h3>
                    ${member.name}
                </h3>

                <p>
                    Paid: ₹${member.paidAmount.toFixed(2)}
                </p>

            </div>


            <div class="${balanceClass}">

                ${balanceText}

            </div>

        `;

        balanceList.appendChild(balanceItem);

    });

}

/* Display Analytics */

function displayAnalytics(analytics) {

    document.getElementById("analyticsTotal").textContent = `₹${analytics.totalExpenses?.toFixed(2) || "0.00"}`;
    document.getElementById("analyticsAverage").textContent = `₹${analytics.averageExpense.toFixed(2)}`;

    document.getElementById("analyticsCount").textContent = analytics.expenseCount;

    if (analytics.highestExpense) {
        document.getElementById("analyticsHighest").textContent =`₹${Number(analytics.highestExpense.amount).toFixed(2)}`;
    } else {
        document.getElementById("analyticsHighest").textContent ="₹0.00";
    }


    if (analytics.lowestExpense) {
        document.getElementById("analyticsLowest").textContent =`₹${Number(analytics.lowestExpense.amount).toFixed(2)}`;
    } else {
        document.getElementById("analyticsLowest").textContent ="₹0.00";
    }

    document.getElementById("analyticsHighestSpender").textContent =analytics.highestSpender || "-";

}

/* Clear Split Data */

function clearSplitData() {

    document.getElementById("totalExpenses").textContent = "₹0.00";
    document.getElementById("eachPersonPays").textContent = "₹0.00";


    document.getElementById("balanceList").innerHTML = "";
    document.getElementById("analyticsTotal").textContent = "₹0.00";


    document.getElementById("analyticsAverage").textContent = "₹0.00";
    document.getElementById("analyticsHighest").textContent = "₹0.00";


    document.getElementById("analyticsLowest").textContent = "₹0.00";
    document.getElementById("analyticsCount").textContent = "0";


    document.getElementById("analyticsHighestSpender").textContent = "-";
}