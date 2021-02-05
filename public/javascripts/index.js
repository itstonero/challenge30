
const openQuotation = (id) => 
{
    window.location = `/quotations/${id}`;
}

const openSlip = (id) =>
{
    window.location = `/slips/${id}`;
}

const retrySlip = (id) =>
{
    window.location = `/slips/${id}/retry`
}