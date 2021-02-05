var router = require('express').Router();
const { Quotation } = require('../configuration/database');
const { InitQuotation } = require('../logic/quotation');

const formatQuotation = (x) => ({...x, 
    initOdd: (x.initOdd * 1).toFixed(4), 
    growOdd: (x.growOdd * 1).toFixed(2), 
    retryOdd: (x.retryOdd * 1).toFixed(2)});

router.get('/', async(req, res) => 
{
    return Quotation.findAll()
    .then(data => res.render('allQuotations', { data : data.map(x => formatQuotation(x.toJSON()))}))
    .catch(err => res.status(400).json(err));
});

router.post('/', async(req, res) => 
{
    const newQuotation = InitQuotation(req.body);
    return Quotation.create(newQuotation)
        .then(data => res.redirect(`/quotations/${data.id}`))
        .catch(err => res.status(404).json(err));
});

router.get('/:quotationId', async (req, res) =>
{
    return Quotation.findByPk(req.params.quotationId)
    .then(data => res.render('quotation', { ...data.toJSON() }))
    .catch(err => res.status(400).json(err));
});

router.get('/:quotationId/create', async (req, res) =>
{
    return Quotation.findByPk(req.params.quotationId)
    .then(data => res.render('createSlip', { ...data.toJSON() }))
    .catch(err => res.status(400).json(err));
});


router.delete('/:quotationId', async (req, res) =>
{
    return Quotation.destroy({ where: { id: req.params.quotationId }})
    .then(data => res.json(data))
    .catch(err => res.status(400).json(err));
});

router.put('/:quotationId', async (req, res) =>
{
    return Quotation.update(req.body, { where : { id : req.params.quotationId}})
    .then(data => res.json(data))
    .catch(err => res.status(400).json(err));
});

module.exports = router;
