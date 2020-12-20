const todayAppointmentButton = document.querySelector('#today-appointment-button');
const todayAppointmentCardHeader = document.querySelector('#todayAppointmentHeader');

const appointmentHistoryCardHeader = document.querySelector('#appointmentHistoryHeader');
const appointmentHistoryButton = document.querySelector('#appointment-history-button');

//const allAppointmentCardHeader = document.querySelector('#allAppointmentHeader');
//const allAppointmentButton = document.querySelector('#all-appointment-button');

todayAppointmentButton.addEventListener('mouseover', (e)=>{
    todayAppointmentCardHeader.classList.add('bg-primary');
});

todayAppointmentButton.addEventListener('mouseout', (e)=>{
    todayAppointmentCardHeader.classList.remove('bg-primary');
});

appointmentHistoryButton.addEventListener('mouseover', (e)=>{
    appointmentHistoryCardHeader.classList.add('bg-success');
});

appointmentHistoryButton.addEventListener('mouseout', (e)=>{
    appointmentHistoryCardHeader.classList.remove('bg-success');
});
//
// allAppointmentButton.addEventListener('mouseover', (e)=>{
//     allAppointmentCardHeader.classList.add('bg-dark');
// });
//
// allAppointmentButton.addEventListener('mouseout', (e)=>{
//     allAppointmentCardHeader.classList.remove('bg-dark');
// })