
interface Debt {
  creditor: string;
  lawAmount: number;
  settledAmount?: number;
}

interface RelativeDebt extends Debt {
  relativePart: number;
  relativeTotal: number;
}

interface FinalDebt extends Debt {
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

const person1: Person = {
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
  cashAmount: 549003.50
};

const getFinalDebts = (person: Person): FinalDebt[] => {
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
    alert('סכום החוב הכולל קטן מהכסף הזמין לחייב!')
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
  return _.map(debts, (d: RelativeDebt) => ({creditor: d.creditor, lawAmount: d.lawAmount, final: getFinalAmount(d)}));
}

const debtsToHtml = (peoplesWithDividedDebts: PersonWithFinalDebts[]): string => {
  return _.join(_.map(peoplesWithDividedDebts, p => debtToHtml(p.personName, p.debts)), '<br />');
}

const debtToHtml = (personName: string, debts: FinalDebt[]): string => {
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

  return html;
}

$(document).ready(() => {
  const peoples = [person1];
  const peoplesWithDividedDebts: PersonWithFinalDebts[] = _.map(peoples, person => ({
    personName: person.personName,
    debts: getFinalDebts(person1)
  }));

  const html = debtsToHtml(peoplesWithDividedDebts)
  $(document.body).html(html);
});