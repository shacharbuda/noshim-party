const _ = (window as any)._;
const $ = (window as any).$;

interface Debt {
	creditor: string;
	amount: number;
}

interface RelativeDebt extends Debt {
	relativePart: number;
	relativeTotal: number;
}

interface Person {
	personName: string;
	debts: Debt[];
	cashAmount: number;
}

const motiPerson: Person = {
	personName: 'moti',
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

const divideAmountByDebts = (person: Person) => {
	const total = person.cashAmount;

	const totalDebt = _.sumBy(person.debts, (debt: Debt) => debt.amount);

	if (total >= totalDebt) {
		return mapToResults({...person.debts});
	}

	// Debt has to be divided.
	const debtsAsRelative = _.map(person.debts, (debt: Debt): RelativeDebt => {
		// Relative part is amount / totalDebt
		const relativePart = debt.amount / totalDebt;

		return {
			...debt,
			relativePart,
			// Real amonut is part * totalAvailable
			relativeTotal: relativePart * person.cashAmount
		};
	});

	return mapToResults(debtsAsRelative);
}

const mapToResults = (debts: Debt[] | RelativeDebt[]) => {
	// Set only creditor name and final amount - relative if exists, real amount otherwise
	return _.map(debts, d => ({creditor: d.creditor, final: d.relativeTotal ? d.relativeTotal : d.amount}));
}

const getPersonDebts = (person: Person): string => {
	const res = divideAmountByDebts(person);
	let html = '<div>';
	html += `<h1>Person ${person.personName}</h1>`;
	_.each(res, deb => {
		html += `<p>${JSON.stringify(deb)}</p>`;
	});
	html += '</div>';

	return html;
}

$(document).ready(() => {
	const html = getPersonDebts(motiPerson);
	document.write(html);
});