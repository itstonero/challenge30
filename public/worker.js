self.addEventListener('push', e =>{
    
    console.log('Service worker Activated')
    const data = e.data.json();
    console.log(data);
    self.registration.showNotification(data.title, {
        body: data.body
    });
})