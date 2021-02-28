  const GrowSlip = (slip) => 
  {
    if(slip.usedOdd >= slip.Quotation.odd)
    {
        let currentAmount = slip.totalAmount * slip.Quotation.initOdd * Math.pow(slip.Quotation.retryOdd, slip.retryIndex);
        slip.bonusAmount += currentAmount * (slip.usedOdd - slip.Quotation.odd);
        slip.usedOdd = 1;
        slip.retryIndex = 0;
        slip.progressIndex += 1;
        slip.totalAmount *= slip.Quotation.growOdd;
    }
    return slip;
  };
  
  const ReverseSlip = (slip) => 
  {
    console.log(slip)
    slip.usedOdd = 1;
    slip.retryIndex -= 1;
    
    if(slip.retryIndex < 0)
    {
      slip.retryIndex = 0;
      slip.progressIndex -= 1;
      slip.totalAmount /= slip.Quotation.growOdd;
    }
    
    console.log(slip)
    
    return slip;
  }
  
  const FormatSlipView = (slip) =>
  {
      let formatter = new Intl.NumberFormat('en-US');

      let stageStartAmount = slip.totalAmount * slip.Quotation.initOdd;
      let currentAmount = stageStartAmount * Math.pow(slip.Quotation.retryOdd, slip.retryIndex);
      let receivedAmount = (currentAmount * slip.usedOdd) - currentAmount;
      let totalSum = ( stageStartAmount * (1 - Math.pow(slip.Quotation.retryOdd, slip.retryIndex))) / (1 - slip.Quotation.retryOdd);
      
    return ({
        adviceAmount: formatter.format(Math.round(currentAmount + receivedAmount)),
        totalAmount: formatter.format(Math.round(slip.totalAmount)),
        bonusAmount: formatter.format(Math.round(slip.bonusAmount)), 
        progress: `${slip.progressIndex} / ${slip.Quotation.target}`,
        retries: `${slip.retryIndex + 1} / ${slip.Quotation.trial}`,
        adviceOdd: (slip.Quotation.odd / slip.usedOdd).toFixed(2) * 1,
        id: slip.id,
        balanceAmount: formatter.format(Math.round(slip.totalAmount - totalSum + receivedAmount))
    })
  }

  module.exports = { GrowSlip, FormatSlipView, ReverseSlip };