const allFixture = {};

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

const addFixture = (fixture) => 
{
    
    const selectedFixture = JSON.parse(fixture);
    var input = document.getElementById(`${selectedFixture.fixtureId}`);
    if(input.type == "checkbox")
    {
        input.checked = !input.checked;
        const fixID = selectedFixture.fixtureId;

        console.log(selectedFixture);
        allFixture[fixID] = selectedFixture;

        if(!input.checked && allFixture.hasOwnProperty(fixID))
        {
            delete allFixture.fixID;
        }

    }
}

const insertFixtures = (canTrim) =>
{
    const form = document.createElement('form');
    form.method = 'post';
    form.action = canTrim ? '/fixtures/trim' : '/fixtures';
  
    Object.values(allFixture).forEach(item => {
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = `${item.fixtureId}`;
        hiddenField.value = JSON.stringify(item);
        form.appendChild(hiddenField);
    });
  
    document.body.appendChild(form);
    form.submit();
}
  