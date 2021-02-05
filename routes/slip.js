const { Slip, Quotation } = require('../configuration/database');
const { FormatSlipView, GrowSlip } = require('../logic/slip');
var router = require('express').Router();



router.get('/', async(req, res) =>
{
    return Slip.findAll({include: Quotation})
    .then(data => res.render('allSlips', {data : data.map(x => FormatSlipView(x))}))
    .catch(err => res.status(404).json(err));
});

router.get('/:slipId', async(req, res) =>
{
    return Slip.findOne({ where:{id: req.params.slipId}, include: Quotation})
    .then(data => res.render('slip', FormatSlipView(data)))
    .catch(err => res.status(404).json(err));
});

router.post('/', async(req, res) =>
{
    return Slip.create({
    quotationId: req.body.quotationId,
    progressIndex: 0,
    totalAmount: req.body.totalAmount,
    retryIndex: 0,
    bonusAmount: 0,
    usedOdd: 1
  })
  .then(data => res.redirect(`/slips/${data.id}`))
  .catch(err => res.status(404).json(err));

//   Quotation.findByPk(quotationId).then(data => res.json(data))
//   .catch(err => {
//       console.log("An Error Occured : " + JSON.stringify(err));
//       res.status(404).json(err);
//   });

});

router.put('/:slipId', async(req, res) =>
{
  return Slip.update(req.body, { where : { id : req.params.slipId}})
  .then(data => res.render('slip', FormatSlipView(data)))
  .catch(err => res.status(404).json(err));
});

router.delete('/:slipId', async(req, res) =>
{
    return Slip.destroy({ where: { id: req.params.slipId }})
    .then(data => res.redirect('/slips'))
    .catch(err => res.status(404).json(err));
});

router.post('/:slipId/retry', async (req, res) =>
{
    var givenSlip = await Slip.findOne({ where:{id: req.params.slipId}, include: Quotation});
    if(!givenSlip)
    {
        return res.status(400).json({"message" : "No Slip Found"});
    }

    const slip = givenSlip.toJSON();
    const retryIndex = ++slip.retryIndex;

    if(retryIndex < slip.Quotation.trial)
    {
        return Slip.update({retryIndex}, { where : { id : req.params.slipId}})
        .then(data => res.redirect(`/slips/${req.params.slipId}`))
        .catch(err => res.status(404).json(err));
    }

    return res.status(400).json({"message" : "Trials Reached"});
})

router.post('/:slipId/grow', async(req, res) =>
{
  const { oddUsed } = req.body;

  console.log(req.body);

  if(!oddUsed || Number.isNaN(oddUsed))
  {
      return res.status(404).json({ message : "No Number Given"});
  }

  var givenSlip = await Slip.findOne({ where:{id: req.params.slipId}, include: Quotation});
  if(!givenSlip)
  {
      return res.status(400).json({"message" : "No Slip Found"});
  }

  let slip = givenSlip.toJSON();
  slip.usedOdd *= oddUsed;
  slip = GrowSlip(slip);

  return Slip.update({ 
      retryIndex: slip.retryIndex,  
      bonusAmount: slip.bonusAmount,
      usedOdd: slip.usedOdd,
      progressIndex: slip.progressIndex,
      totalAmount: slip.totalAmount
    }, { where : { id : req.params.slipId}})
  .then(data => res.redirect(`/slips/${req.params.slipId}`))
  .catch(err => res.status(404).json(err));
})

module.exports = router;
