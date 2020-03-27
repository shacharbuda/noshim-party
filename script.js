const _ = window._;
const $ = window.$;
const motiPerson = {
    personName: 'test',
    debts: [
        {
            creditor: 'mizrahi',
            amount: 500
        },
        {
            creditor: 'discount',
            amount: 700
        }
    ],
    cashAmount: 1000
};
const divideAmountByDebts = (person) => {
    const total = person.cashAmount;
    const totalDebt = _.sumBy(person.debts, (debt) => debt.amount);
    if (total >= totalDebt) {
        return mapToResults(Object.assign({}, person.debts));
    }
    // Debt has to be divided.
    const debtsAsRelative = _.map(person.debts, (debt) => {
        // Relative part is amount / totalDebt
        const relativePart = debt.amount / totalDebt;
        return Object.assign(Object.assign({}, debt), { relativePart, 
            // Real amonut is part * totalAvailable
            relativeTotal: relativePart * person.cashAmount });
    });
    return mapToResults(debtsAsRelative);
};
const mapToResults = (debts) => {
    // Set only creditor name and final amount - relative if exists, real amount otherwise
    return _.map(debts, d => ({ creditor: d.creditor, final: d.relativeTotal ? d.relativeTotal : d.amount }));
};
const getPersonDebts = (person) => {
    const res = divideAmountByDebts(person);
    let html = '<div>';
    html += `<h1>Person ${person.personName}</h1>`;
    _.each(res, deb => {
        html += `<p>${JSON.stringify(deb)}</p>`;
    });
    html += '</div>';
    return html;
};
$(document).ready(() => {
    const html = getPersonDebts(motiPerson);
    document.write(html);
});
//# sourceMappingURL=script.js.map