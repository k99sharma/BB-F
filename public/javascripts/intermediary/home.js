const newAppointmentButton = document.querySelector('#new-appointment-button');
const newAppointmentCardHeader = document.querySelector('#newAppointmentHeader');

const upcomingAppointmentCardHeader = document.querySelector('#upcomingAppointmentHeader');
const upcomingAppointmentButton = document.querySelector('#upcoming-appointment-button');

const allAppointmentCardHeader = document.querySelector('#allAppointmentHeader');
const allAppointmentButton = document.querySelector('#all-appointment-button');

newAppointmentButton.addEventListener('mouseover', (e)=>{
    newAppointmentCardHeader.classList.add('bg-primary');
});

newAppointmentButton.addEventListener('mouseout', (e)=>{
    newAppointmentCardHeader.classList.remove('bg-primary');
});

upcomingAppointmentButton.addEventListener('mouseover', (e)=>{
    upcomingAppointmentCardHeader.classList.add('bg-success');
});

upcomingAppointmentButton.addEventListener('mouseout', (e)=>{
    upcomingAppointmentCardHeader.classList.remove('bg-success');
});

allAppointmentButton.addEventListener('mouseover', (e)=>{
    allAppointmentCardHeader.classList.add('bg-dark');
});

allAppointmentButton.addEventListener('mouseout', (e)=>{
    allAppointmentCardHeader.classList.remove('bg-dark');
})