
function urlBase64ToUint8Array(base64String) 
{
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

let register = null;

const registerPushNotification = async(id) => {
    
    if(register)
    {
        console.log("Sending Push Request");
        const sub = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array("BE1g9tsffcKB4aFW1Fd6-De1Ow7HkXSkfZk3SjstZrxTkWA2aZAgWu8SnIpX0XqHvV7puEmnUFO5ygkwu_RZT0c")
        });
    
        await fetch(`/subscription/${id}`, {
            method: 'POST',
            body: JSON.stringify(sub),
            headers : { 'content-type' : 'application/json'}
        });
        return;
    }

    console.log("Failed to send Request")
}

const pushSlip = () => {
    registerPushNotification(document.getElementById("fixtureId").value);
}

const registration = navigator.serviceWorker.register;

if(!register && 'serviceWorker' in navigator)
{
    setTimeout(async() => {
        register = await navigator.serviceWorker.register('/public/worker.js');
        console.log(register)
    }, 1000);
}

window.setInterval(() => window.location.reload(), (1000 * 60 * 30));


const allFixture = {};

const openQuotation = (id) => (window.location = `/quotations/${id}`)

const openSlip = (id) =>  (window.location = `/slips/${id}`)

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
        const form = document.createElement('form');
        form.method = 'post';
        form.action = `/slips/${id}/clearBonus`;
        form.submit();
    }
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
  
const suggestFixture = (fixtureId, adviceOdd, suggestion) =>
{
    document.getElementById("fixtureId").value = `${fixtureId}`;
    document.getElementById("fixtureAdvice").value = `${adviceOdd}`;
    document.getElementById("fixtureSuggestion").value = `${suggestion}`;
}

const removeSlip = () =>
{
    const fixtureId = document.getElementById("fixtureId").value;

    if(confirm("Want To Remove Slip ?"))
    {
        //fetch()
        const form = document.createElement('form');
        form.method = 'post';
        form.action = `/fixtures/${fixtureId}/remove`;
        document.body.appendChild(form);
        form.submit();
        console.log(form)
    }
}

var elements = document.getElementsByClassName("suggestThis");

var suggestThis = function(){
    let prediction = "";
    for(let tags of this.children)
    {
        prediction += tags.innerHTML.length == 0 ? " " : tags.innerHTML;
    }
    document.getElementById("fixtureSuggestion").value = prediction;
    document.getElementById("gameUpdate").submit();
};

for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener('click', suggestThis, false);
}