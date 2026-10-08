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



    /* Members share */

    const memberShares = {};

    members.forEach(member => {
        memberShares[member.name] = 0;
    });


    expenses.forEach(expense => {
        let participants = expense.splitBetween;

        /* 
        Old expenses do not have splitBetween so treat them as shared by everyone.
        */

        if ( !participants || participants.length === 0) {
            participants =
                members.map(
                    member => member.name
                );
        }

        const share = Number(expense.amount) / participants.length;

        participants.forEach(memberName => {
            if (memberShares[memberName] !== undefined) {
                memberShares[memberName] += share;
            }
        });

    });


    /* Member Balances */

    const balances = [];

    members.forEach(member => {

        let paidAmount = 0;
        expenses.forEach(expense => {
            if (expense.paidBy === member.name) {
                paidAmount += Number(expense.amount);
            }
        });

        const amountOwed = memberShares[member.name] || 0;
        const balance = paidAmount - amountOwed;

        let status = "settled";

        if (balance > 0) {
            status = "gets";
        } 
        else if (balance < 0) {
            status = "owes";
        }

        balances.push({
            name: member.name,
            paidAmount: paidAmount,
            amountOwed: amountOwed,
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