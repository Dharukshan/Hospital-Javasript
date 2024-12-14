document.addEventListener('DOMContentLoaded',() => {
    const deliveryDate = document.getElementById('delivery-date');
    
    const today = new Date();
    const delivery = new Date(today.getTime() + (7*24*60*60*1000));
    const options = { day: 'numeric', month: 'long', year: 'numeric'};
    deliveryDate.textContent = delivery.toLocaleDateString(undefined,options);
});