const allFixture = {};

const openQuotation = (id) => 
{
    window.location = `/quotations/${id}`;
}

const openSlip = (id) =>
{
    window.location = `/slips/${id}`;
}

const finalize = (form) => 
{
    console.log(form)
}

const retrySlip = (id) =>
{
    if(confirm("Want to Make a Retry?"))
    {
        const form = document.createElement('form');
        form.method = 'post';
        form.action = `/slips/${id}/retry`;
        form.submit();
        console.log(form)
    }

    console.log(`cancelled`)
}


const withdrawBonus = (id) => {
    if(confirm("Want To Withdraw Bonus ?"))
    {
        //fetch()
        const form = document.createElement('form');
        form.method = 'post';
        form.action = `/slips/${id}/clearBonus`;
        form.submit();
        console.log(form)
    }

    console.log(`cancelled`)
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
    form.action = '/fixtures';
    
    if(canTrim)
    {
        const flagTrim = document.createElement('input');
        flagTrim.type = 'hidden';
        flagTrim.name = 'canTrim';
        flagTrim.value = 'canTrim';
        form.appendChild(flagTrim);
    }

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
  
const suggestFixture = (fixtureId) =>
{
    console.log(fixtureId);
    const matchId = document.getElementById("fixtureId");
    console.log(matchId);
    matchId.value = `${fixtureId}`;
}