
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

const getFinalDebts = (person: Person): FinalDebt[] => {
	const totalAvailable = person.cashAmount;

	const totalDebt = _.sumBy(person.debts, (debt: Debt) => debt.amount);

  // All Debts are dividable with total money available by debtor
	if (totalAvailable >= totalDebt) {
		return debtsToFinalDebts({...person.debts});
	}

	// Debt has to be divided.
	const debtsAsRelative = _.map(person.debts, debt => (
    debtToRelativeDebt(debt, totalDebt, totalAvailable)
  ));

	return debtsToFinalDebts(debtsAsRelative);
}

const debtToRelativeDebt = (debt: Debt, totalDebt: number, totalAvailable: number): RelativeDebt => {
  // Relative part is amount / totalDebt
  const relativePart = debt.amount / totalDebt;

  return {
    ...debt,
    relativePart,
    // Real amonut is part * totalAvailable
    relativeTotal: relativePart * totalAvailable
  };
}

const debtsToFinalDebts = (debts: Debt[] | RelativeDebt[]): FinalDebt[] => {
	// Set only creditor name and final amount - relative if exists, real amount otherwise
	return _.map(debts, (d: RelativeDebt) => ({creditor: d.creditor, final: d.relativeTotal ? d.relativeTotal : d.amount}));
}

const debtsToHtml = (peoplesWithDividedDebts: PersonWithFinalDebts[]): string => {
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
    debts: getFinalDebts(motiPerson)
  }));

  const html = debtsToHtml(peoplesWithDividedDebts)
	document.write(html);
});