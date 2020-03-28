const cashAmount = 500000.50;
const person1 = {
    personName: 'יוסי',
    debts: [
        {
            "creditor": "פרימיום אקספרס",
            "lawAmount": 9096.63,
            "settledAmount": undefined
        },
        {
            "creditor": "ישראכרט מימון",
            "lawAmount": 22330.39,
            "settledAmount": undefined
        },
        {
            "creditor": "ישראכרט",
            "lawAmount": 43459.28,
        },
        {
            "creditor": "מקס איט",
            "lawAmount": 42778.74,
            "settledAmount": 40000
        },
        {
            "creditor": "איגוד",
            "lawAmount": 29694.55,
            "settledAmount": undefined
        },
        {
            "creditor": "דוד אביגדור",
            "lawAmount": 24012.14,
            "settledAmount": 20000
        },
        {
            "creditor": "בנק יהב",
            "lawAmount": 187110,
            "settledAmount": undefined
        },
        {
            "creditor": "בנק הפועלים",
            "lawAmount": 457728.23,
            "settledAmount": undefined
        },
        {
            "creditor": "בנק איגוד",
            "lawAmount": 227841.56,
            "settledAmount": undefined
        },
        {
            "creditor": "בנק דיסקונט",
            "lawAmount": 39358.8,
            "settledAmount": undefined
        },
        {
            "creditor": "בנק לאומי",
            "lawAmount": 202268.59,
            "settledAmount": 195000
        }
    ],
    cashAmount
};
const person2 = {
    personName: 'מוטי',
    debts: [
        {
            "creditor": "פלאפון",
            "lawAmount": 24227.06,
            "settledAmount": 21000
        },
        {
            "creditor": "אמריקן אשראים",
            "lawAmount": 19775.03,
            "settledAmount": undefined
        },
        {
            "creditor": "אי אר אן",
            "lawAmount": 3657.28,
            "settledAmount": undefined
        },
        {
            "creditor": "תן דלק",
            "lawAmount": 4386.74,
            "settledAmount": undefined
        },
        {
            "creditor": "הוט מובייל",
            "lawAmount": 8105.59,
            "settledAmount": undefined
        },
        {
            "creditor": "מרכנתיל",
            "lawAmount": 56206.57,
            "settledAmount": 50000
        },
        {
            "creditor": "דוד אביגדור",
            "lawAmount": 24012.14,
            "settledAmount": 20000
        },
        {
            "creditor": "בנק יהב",
            "lawAmount": 187110,
            "settledAmount": undefined
        },
        {
            "creditor": "בנק הפועלים",
            "lawAmount": 457728.23,
            "settledAmount": undefined
        },
        {
            "creditor": "בנק איגוד",
            "lawAmount": 227841.56,
            "settledAmount": undefined
        },
        {
            "creditor": "בנק דיסקונט",
            "lawAmount": 39358.8,
            "settledAmount": undefined
        },
        {
            "creditor": "בנק לאומי",
            "lawAmount": 202268.59,
            "settledAmount": 195000
        },
        {
            "creditor": "מימון ישיר",
            "lawAmount": 60778.61,
            "settledAmount": 54566
        },
        {
            "creditor": "מימון ישיר",
            "lawAmount": 8122,
            "settledAmount": 7287
        },
        {
            "creditor": "אגוד",
            "lawAmount": 22333.05,
            "settledAmount": undefined
        },
        {
            "creditor": "מימון ישיר",
            "lawAmount": 7327.98,
            "settledAmount": 6590
        },
        {
            "creditor": "רצון ליברמן",
            "lawAmount": 4571.87,
            "settledAmount": 4000
        },
        {
            "creditor": "מ. אמיר",
            "lawAmount": 20450,
            "settledAmount": 17000
        },
        {
            "creditor": "מיטב דש",
            "lawAmount": 7500.21,
            "settledAmount": 6300
        },
        {
            "creditor": "בנק ירושלים",
            "lawAmount": 49531.93,
            "settledAmount": 40000
        },
        {
            "creditor": "ישראכרט",
            "lawAmount": 40296.79,
            "settledAmount": 33000
        },
        {
            "creditor": "טריא",
            "lawAmount": 20487.3,
            "settledAmount": undefined
        },
        {
            "creditor": "יונט",
            "lawAmount": 43451.17,
            "settledAmount": 42000
        },
        {
            "creditor": "כאל",
            "lawAmount": 105346.36,
            "settledAmount": undefined
        },
        {
            "creditor": "פרטנר",
            "lawAmount": 22399.67,
            "settledAmount": undefined
        },
        {
            "creditor": "לב אביבים",
            "lawAmount": 24834.87,
            "settledAmount": undefined
        },
        {
            "creditor": "פרטנר",
            "lawAmount": 15812.79,
            "settledAmount": undefined
        },
        {
            "creditor": "ענו החזקות",
            "lawAmount": 33294.31,
            "settledAmount": undefined
        },
        {
            "creditor": "איילון ייעוץ",
            "lawAmount": 13257.8,
            "settledAmount": 9000
        },
        {
            "creditor": "אשטרום",
            "lawAmount": 82276.64,
            "settledAmount": undefined
        }
    ],
    cashAmount
};
const getFinalDebts = (person) => {
    const totalAvailable = person.cashAmount;
    // Used to calculate actual total debt (with final amount for each debt)
    const totalLawDebt = _.sumBy(person.debts, debt => debt.lawAmount);
    // Total debt is total of lawAmount *without* debts with final amount as settled.
    const totalDebt = _.sumBy(person.debts, debt => {
        const debtAsRelative = debtToRelativeDebt(debt, totalLawDebt, totalAvailable);
        const finalAmount = getFinalAmount(debtAsRelative);
        // If settled - ignore in total debt.
        return finalAmount === debt.settledAmount ? 0 : debt.lawAmount;
    });
    // All Debts are dividable with total money available by debtor
    if (totalAvailable >= totalLawDebt) {
        alert('סכום החוב הכולל קטן מהכסף הזמין לחייב!');
        return debtsToFinalDebts(Object.assign({}, person.debts));
    }
    // Debt has to be divided.
    const debtsAsRelative = _.map(person.debts, debt => (debtToRelativeDebt(debt, totalDebt, totalAvailable)));
    return debtsToFinalDebts(debtsAsRelative);
};
const debtToRelativeDebt = (debt, totalDebt, totalAvailable) => {
    // Relative part is amount / totalDebt
    const relativePart = debt.lawAmount / totalDebt;
    return Object.assign(Object.assign({}, debt), { relativePart, 
        // Real amonut is part * totalAvailable
        relativeTotal: relativePart * totalAvailable });
};
const getFinalAmount = (debt) => {
    // debt as relative to get undefinded or defined relative
    const { relativeTotal, lawAmount, settledAmount: settledFinal } = debt;
    // By law, final amount to pay is relative if exist - other lawTotal
    const lawFinal = relativeTotal ? relativeTotal : lawAmount;
    // Final amonut is lawFinal or settledFinal - the min between ()
    return _.min([lawFinal, settledFinal]);
};
const debtsToFinalDebts = (debts) => {
    // Set only creditor name and final amount - relative if exists, real amount otherwise
    return _.map(debts, (d) => ({ creditor: d.creditor, lawAmount: d.lawAmount, final: getFinalAmount(d) }));
};
const debtsToHtml = (peoplesWithDividedDebts) => {
    return _.join(_.map(peoplesWithDividedDebts, p => debtToHtml(p.personName, p.debts)), '<br />');
};
const debtToHtml = (personName, debts) => {
    let html = '<div>';
    html += `<h1>חייב ${personName}</h1>`;
    html += `
  <table class="table">
    <tr>
      <th>נושה</th>
      <th>חוב מקורי</th>
      <th>סכום לתשלום בפועל</th>
    </tr>`;
    _.each(debts, deb => {
        html += '<tr>';
        html += '<td>' + deb.creditor;
        html += '</td>';
        html += '<td>' + deb.lawAmount.toFixed(2);
        html += '</td>';
        html += '<td>' + deb.final.toFixed(2);
        html += '</td>';
        html += `</tr>`;
    });
    html += '</table></div>';
    const total = _.sumBy(debts, d => d.final);
    html += `<h2>סך הכל תשלום בפועל: ${total.toFixed(2)}</h2>`;
    return html;
};
$(document).ready(() => {
    const peoples = [person1, person2];
    const peoplesWithDividedDebts = _.map(peoples, person => ({
        personName: person.personName,
        debts: getFinalDebts(person)
    }));
    const html = debtsToHtml(peoplesWithDividedDebts);
    $(document.body).html(html);
});
//# sourceMappingURL=script.js.map