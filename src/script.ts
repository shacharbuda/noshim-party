
interface Debt {
	creditor: string;
  lawAmount: number;
  settledAmount?: number;
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
      lawAmount: 500,
      settledAmount: 416
		},
		{
			creditor: 'discount',
			lawAmount: 700
		}
	],
	cashAmount: 1000
};

const getFinalDebts = (person: Person): FinalDebt[] => {
	const totalAvailable = person.cashAmount;

  // TODO: is totalDebt for relative calculation is by settlement or law??
	const totalDebt = _.sumBy(person.debts, (debt: Debt) => getFinalAmount(debt))

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
  const relativePart = debt.lawAmount / totalDebt;

  return {
    ...debt,
    relativePart,
    // Real amonut is part * totalAvailable
    relativeTotal: relativePart * totalAvailable
  };
}

const getFinalAmount = (debt: Debt): number => {
  // debt as relative to get undefinded or defined relative
  const { relativeTotal, lawAmount, settledAmount: settledFinal } = debt as RelativeDebt;

  // By law, final amount to pay is relative if exist - other lawTotal
  const lawFinal = relativeTotal ? relativeTotal : lawAmount;

  // Final amonut is lawFinal or settledFinal - the min between ()
  return _.min([lawFinal, settledFinal]);
}

const debtsToFinalDebts = (debts: Debt[] | RelativeDebt[]): FinalDebt[] => {
	// Set only creditor name and final amount - relative if exists, real amount otherwise
	return _.map(debts, (d: RelativeDebt) => ({creditor: d.creditor, final: getFinalAmount(d)}));
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