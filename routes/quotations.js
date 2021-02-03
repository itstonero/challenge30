var router = require('express').Router();
const { Quotation } = require('../configuration/database');
const { InitQuotation } = require('../logic/quotation');


router.get('/', async(req, res) => 
{
    return Quotation.findAll()
    .then(data => res.json(data))
    .catch(err => res.status(400).json(err));
});

router.post('/', async(req, res) => 
{
    const newQuotation = InitQuotation(req.body);
    return Quotation.create(newQuotation)
        .then(data => res.json(data))
        .catch(err => res.status(404).json(err));
});

router.get('/:quotationId', async (req, res) =>
{
    return Quotation.findByPk(req.params.quotationId)
    .then(data => res.json(data))
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
