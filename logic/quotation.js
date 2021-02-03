
const InitQuotation = ({ odd, trial, target }) =>
{
    if(!odd || !trial || odd <= 1 || trial <= 1 || !target || target <= 1)
    {
        return null;
    }

    const response =  { initOdd : 0, retryOdd : 0, growOdd : 0, odd, trial};
    const zRequest = odd - 1;

    response.retryOdd = (odd / zRequest);
    const totalSum = (1 - Math.pow(response.retryOdd, trial)) / (1 - response.retryOdd);
    response.growOdd = (totalSum + zRequest) / totalSum;
    response.initOdd = (1 / totalSum);
    response["target"] = Math.trunc(Math.ceil(Math.log(target) / Math.log(response.growOdd)));

    return response;
}

module.exports = { InitQuotation };