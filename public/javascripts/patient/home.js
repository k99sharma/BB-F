const patientPrescriptionButton = document.querySelector('#patient-prescription-button');
const patientPrescriptionCardHeader = document.querySelector('#patient-prescription-header');

patientPrescriptionButton.addEventListener('mouseover', (e)=>{
    patientPrescriptionCardHeader.classList.add('bg-primary');
});

patientPrescriptionButton.addEventListener('mouseout', (e)=>{
    patientPrescriptionCardHeader.classList.remove('bg-primary');
});