/* Split It WebWorker */

self.onmessage = function(event) {

    const data = event.data;
    const expenses = data.expenses;
    const members = data.members;


    /* Total Expense */

    let totalExpenses = 0;

    expenses.forEach(expense => {
        totalExpenses += Number(expense.amount);
    });


    /* Each Person's Share */

    let eachPersonPays = 0;

    if (members.length > 0) {
        eachPersonPays = totalExpenses / members.length;
    }


    /* Member Balances */

    const balances = [];

    members.forEach(member => {

        let paidAmount = 0;

        expenses.forEach(expense => {

            if (expense.paidBy === member.name) {
                paidAmount += Number(expense.amount);
            }

        });


        const balance = paidAmount - eachPersonPays;

        let status = "settled";

        if (balance > 0) {
            status = "gets";
        } else if (balance < 0) {
            status = "owes";
        }

        balances.push({
            name: member.name,
            paidAmount: paidAmount,
            balance: balance,
            status: status
        });

    });


    /* Expense Analytics */

    let highestExpense = null;
    let lowestExpense = null;

    let highestSpender = null;
    let highestSpenderAmount = 0;


    expenses.forEach(expense => {

        const amount = Number(expense.amount);

        if (highestExpense === null || amount > Number(highestExpense.amount)
        ) {
            highestExpense = expense;
        }

        if (lowestExpense === null || amount < Number(lowestExpense.amount)
        ) {
            lowestExpense = expense;
        }

    });


    balances.forEach(member => {

        if (member.paidAmount > highestSpenderAmount) {
            highestSpenderAmount = member.paidAmount;
            highestSpender = member.name;
        }

    });


    let averageExpense = 0;

    if (expenses.length > 0) {
        averageExpense = totalExpenses / expenses.length;
    }


    /* Send Result Back */

    self.postMessage({

        totalExpenses: totalExpenses,
        eachPersonPays: eachPersonPays,
        balances: balances,

        analytics: {
            totalExpenses: totalExpenses,
            averageExpense: averageExpense,
            highestExpense: highestExpense,
            lowestExpense: lowestExpense,
            highestSpender: highestSpender,
            highestSpenderAmount: highestSpenderAmount,
            expenseCount: expenses.length
        }

    });

};