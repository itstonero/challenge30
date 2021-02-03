  const GrowSlip = (slip) => 
  {

    if(slip.usedOdd >= slip.Quotation.odd)
    {
        let currentAmount = slip.totalAmount * slip.Quotation.initOdd * Math.pow(slip.Quotation.retryOdd, slip.retryIndex);
        slip.bonusAmount += currentAmount * (slip.usedOdd - slip.Quotation.odd);
        slip.usedOdd = 0;
        slip.retryIndex = 0;
        slip.progressIndex += 1;
        slip.totalAmount *= slip.Quotation.growOdd;
    }

    return slip;
  };
  
  
  const FormatSlipView = (slip) =>
  {
      let currentAmount = slip.totalAmount * slip.Quotation.initOdd * Math.pow(slip.Quotation.retryOdd, slip.retryIndex);
      if(slip.usedOdd > 0)
      {
        let receivedAmount = (currentAmount * slip.usedOdd) - currentAmount;
        currentAmount += receivedAmount;
      }
    return ({
        adviceAmount: Math.round(currentAmount), 
        totalAmount: Math.round(slip.totalAmount), 
        bonusAmount: Math.round(slip.bonusAmount), 
        progress: `${slip.progressIndex} / ${slip.Quotation.target}`,
        retries: `${slip.retryIndex + 1} / ${slip.Quotation.trial}`,
        adviceOdd: (slip.Quotation.odd - slip.usedOdd).toFixed(2) * 1
    })
  }

  module.exports = { GrowSlip, FormatSlipView };