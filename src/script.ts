
interface Debt {
	creditor: string;
	amount: number;
}

interface RelativeDebt extends Debt {
	relativePart: number;
	relativeTotal: number;
}

interface FinalDebt {
  creditor: string;
  final: number;
}

interface PersonWithFinalDebts {
	personName: string;
  debts: FinalDebt[];
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
	return _.map(debts, (d: RelativeDebt) => ({creditor: d.creditor, final: d.relativeTotal ? d.relativeTotal : d.amount}));
}

const debtsToHtml = (peoplesWithDividedDebts: PersonWithFinalDebts[]) => {
  return _.join(_.map(peoplesWithDividedDebts, p => debtToHtml(p.personName, p.debts)), '<br />');
}

const debtToHtml = (personName: string, debts: FinalDebt[]): string => {
	let html = '<div>';
	html += `<h1>Person ${personName}</h1>`;
	_.each(debts, deb => {
		html += `<p>${JSON.stringify(deb)}</p>`;
	});
	html += '</div>';

	return html;
}

$(document).ready(() => {
  const peoples = [motiPerson];
  const peoplesWithDividedDebts: PersonWithFinalDebts[] = _.map(peoples, person => ({
    personName: person.personName,
    debts: divideAmountByDebts(motiPerson)
  }));

  const html = debtsToHtml(peoplesWithDividedDebts)
	document.write(html);
});