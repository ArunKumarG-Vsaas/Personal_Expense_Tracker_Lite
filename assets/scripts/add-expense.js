// Form Fields:
const expenseField = document.getElementById("expense");
const amountField = document.getElementById("amount");
const categoryField = document.getElementById("category");
const modeField = document.getElementById("mode");
const dateField = document.getElementById("date");
const noteField = document.getElementById("note");
const submitButton = document.getElementById("submit");
const spinnerElement = document.getElementById("spinner");

const today = new Date().toISOString().split('T')[0];
dateField.setAttribute("max", today);


// Validation Call
// expenseField.addEventListener('focus', validateExpenseName)
expenseField.addEventListener('change', validateExpenseName)

// amountField.addEventListener('focus', validateAmount)
amountField.addEventListener('change', validateAmount)

categoryField.addEventListener('focus', validateCategory)
categoryField.addEventListener('change', validateCategory)

modeField.addEventListener('focus', validateMode)
modeField.addEventListener('change', validateMode)

dateField.addEventListener('change', validateDate)

// Validation Logics
function validateExpenseName(){
    let value = expenseField.value;
    let errorElement = expenseField.parentElement.parentElement.querySelector('div[role="alert"]');
    hideErrorText(errorElement);
    if(!value) return showErrorText(errorElement);
    if (value && value.trim().length == 0) return showErrorText(errorElement);
    if (value && value.trim().length > 0) {
        let letters = value.match(/[a-zA-Z]/g);
        if (!letters || letters.length < 3) return showErrorText(errorElement);
    }
    return true;
}

function validateAmount(){
    let value = amountField.value;
    let errorElement = amountField.parentElement.parentElement.querySelector('div[role="alert"]');
    const amountRegex = /^\d+(\.\d{1,2})?$/;
    hideErrorText(errorElement);
    if(!value) return showErrorText(errorElement);
    if (value && value.length && !amountRegex.test(value)) {
        return showErrorText(errorElement);   
    }
    return true;
}

function validateCategory(){
    let categoryErrorElement = categoryField.parentElement.parentElement.querySelector('div[role="alert"]');
    hideErrorText(categoryErrorElement);
    if(categoryField.value == "default") return  showErrorText(categoryErrorElement);
    return true;
}

function validateMode(){
    let modeErrorElement = modeField.parentElement.parentElement.querySelector('div[role="alert"]');
    hideErrorText(modeErrorElement);
    if(modeField.value == "default") return  showErrorText(modeErrorElement);
    return true
}

function validateDate(){
    let dateErrorElement = dateField.parentElement.querySelector('div[role="alert"]');
    hideErrorText(dateErrorElement);
    if(new Date(dateField.value) >= new Date()) return showErrorText(dateErrorElement);
    return true;
}

function showErrorText(element){
    element.classList.remove('opacity-0', 'translate-y-4');
    element.classList.add('opacity-100', 'translate-y-0');
}

function hideErrorText(element){
    element.classList.add('opacity-0', 'translate-y-4');
    element.classList.remove('opacity-100', 'translate-y-0');
}

// Submit
submitButton.addEventListener('click',async function() {
    if(!validateExpenseName() || 
        !validateAmount() ||
        !validateCategory() ||
        !validateMode() ||
        !validateDate()){
        return null
    }
    startSpinner();
    setTimeout(stopSpinner,5000)
    let response = await fetch("https://script.google.com/macros/s/AKfycbyqKlB2KSMmhnAk4Cf7CG3RVW2Pyn3dbuWbj_-RgaHerVS0SpBwBvHhgqmBFMm9ei8/exec",
        {
            method: 'POST',
            body: JSON.stringify([
                {
                    "name": expenseField.value, 
                    "amount": amountField.value,
                    "mode": modeField.value,
                    "category": categoryField.value,
                    "date": new Date(dateField.value).toDateString(),
                    "note": noteField.value,
                    "createdAt" : new Date().toDateString()
                   }
            ])
        }
    );
    response = await response.json();

    console.log(response);
    stopSpinner();
    showAlertBox(response.message, "success");
})


function startSpinner(){
    spinnerElement.style.removeProperty("display"); 
}

function stopSpinner(){
    spinnerElement.style.display = "none";
}


function showAlertBox(message, type){
    const alertElement = document.getElementById("alert");
    const alertHtml = `
    <div class="alert-text  ${(type == 'success') ? 'alert-success' : 'alert-error'}">
            ${message}
    </div>
    `;

    alertElement.innerHTML = alertHtml;
    alertElement.style.removeProperty("display");
    alertElement.classList.add("fade-in")
    setTimeout(() => {
        alertElement.innerHTML = "";
        alertElement.style.display = "none";
    }, 5000)
    
}