// Global setup
const intlNumFormat = (n) => new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(n).replace(/\D00(?=\D*$)/, '');
const cashAmount = 2562 / 2;
const person1 = {
    personName: 'מרים',
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
    personName: 'אהוד',
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
            "settledAmount": 7025.91
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
            "settledAmount": 85711.50
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
            "settledAmount": 0
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
    // First calc - total debt by law, to enable calc of divison relative
    const totalLawDebt = _.sumBy(person.debts, debt => debt.lawAmount);
    // Calc relative debts by totalLawDebt and totalAvailable
    const debtsAsRelativeLaw = _.map(person.debts, debt => debtToRelativeDebt(debt, totalLawDebt, totalAvailable));
    // totalLeft is all money without settled debts
    const totalMoneyLeft = totalAvailable - _.sumBy(debtsAsRelativeLaw, d => isSettled(d) ? d.settledAmount : 0);
    // totalDebtLeft is all debts without settled debts
    const totalDebtLeft = _.sumBy(debtsAsRelativeLaw, d => isSettled(d) ? 0 : d.lawAmount);
    // Add initialDebt data for debts to show on final view
    const debtsWithInitialData = _.map(debtsAsRelativeLaw, d => (Object.assign(Object.assign({}, d), { initialRelativeTotal: d.relativeTotal })));
    // All Debts are dividable with total money available by debtor
    if (totalAvailable >= totalLawDebt) {
        alert('סכום החוב הכולל קטן מהכסף הזמין לחייב!');
        return debtsToFinalDebts(Object.assign({}, person.debts));
    }
    // Debt has to be divided.
    const debtsAsRelative = _.map(debtsWithInitialData, debt => (
    // Use totalDebtLeft and totalLeft - ignore settled!
    debtToRelativeDebt(debt, totalDebtLeft, totalMoneyLeft)));
    return debtsToFinalDebts(debtsAsRelative);
};
const isSettled = (d) => d.settledAmount !== undefined && getFinalAmount(d) === d.settledAmount;
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
    return _.map(debts, (d) => (Object.assign(Object.assign({}, d), { final: getFinalAmount(d) })));
};
const debtsToHtml = (peoplesWithDividedDebts) => {
    return _.join(_.map(peoplesWithDividedDebts, p => debtToHtml(p.personName, p.debts)), '<br />');
};
const debtToHtml = (personName, debts) => {
    let html = '<div>';
    html += `<h1>חייב ${personName}</h1>`;
    html += `
  <table class="table table-hover text-center">
    <tr>
      <th>נושה</th>
      <th>חוב מקורי</th>
      <th>חוב לתשלום עפ דין</th>
      <th>חוב לתשלום עפ הסדר</th>
      <th>סכום לתשלום בפועל</th>
    </tr>`;
    _.each(debts, deb => {
        const lawAmount = deb.lawAmount;
        html += '<tr>';
        html += td(deb.creditor);
        html += td(lawAmount);
        html += td(deb.initialRelativeTotal);
        html += td(isSettled(deb) ? deb.settledAmount : '-');
        html += td(deb.final);
        html += `</tr>`;
    });
    html += '</table></div>';
    const total = _.sumBy(debts, d => d.final);
    html += `<h2>סך הכל תשלום בפועל: ${intlNumFormat(total)}</h2>`;
    return html;
};
const td = (textContent) => {
    let finalText;
    if (isNaN(textContent)) {
        finalText = textContent;
    }
    else {
        finalText = intlNumFormat(textContent);
    }
    return `<td>${finalText}</td>`;
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