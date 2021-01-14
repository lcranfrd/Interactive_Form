"use strict";
const nameIn = document.querySelector('#name');
const emailIn = document.querySelector('#email');
const activitiesFieldset = document.querySelector('#activities');
const ccNumIn = document.querySelector('#cc-num');
const zipIn = document.querySelector('#zip');
const cvvIn = document.querySelector('#cvv');
  //.name
  //.email
  //.activities
  //.cc-num
  //.zip
  //.cvv

const otherJobRolIn = document.querySelector('#other-job-role');
const titleSel = document.querySelector('#title');
const shirtDesignSel = document.querySelector('#design');
const shirtColorsSel = document.querySelector('#color');
const paymentSel = document.querySelector('#payment');
const creditPayOpt = document.querySelector('[value="credit-card"')

nameIn.focus();
otherJobRolIn.style.display = 'none';
shirtColorsSel.disabled = true;
creditPayOpt.selected = true;
setPaymentMeth(creditPayOpt);

/***
 * 
 ***/
function setPaymentMeth(obj) {
  const selectedPayment = (!obj.value)? obj.target.value: obj.value;
  const paymentMethods = document.querySelectorAll('.credit-card, .paypal, .bitcoin');
  for(let i = 0; i < paymentMethods.length; i++) {
    paymentMethods[i].style.display = (selectedPayment === paymentMethods[i].getAttribute('id'))
    ? ''
    : 'none';
  }
}

paymentSel.addEventListener('change', setPaymentMeth);

titleSel.addEventListener('change', (e) => {
  otherJobRolIn.style.display = (e.target.value === 'other')? '': 'none';
});

shirtDesignSel.addEventListener('change', (e) => {
  const selectedDesign = e.target.value;
  Object.entries(shirtColorsSel).forEach((v) =>{
    v[1].hidden = (v[1].getAttribute('data-theme') !== selectedDesign);
    v[1].selected = false;
  });
  shirtColorsSel.disabled = false;
});

function convStartEndTime24hr(arr) {
  arr[2] = (/^[1-9][01]?pm$/.test(arr[2]))? +(arr[2]).match(/\d+/) + 12: +arr[2].match(/\d+/);
  arr[3] = (/^[1-9][01]?pm$/.test(arr[3]))? +(arr[3]).match(/\d+/) + 12: +arr[3].match(/\d+/);
}

function clearDisabledActivies(node) {
  node.forEach((v) => {
    v.disabled = false;
    v.parentNode.classList.remove('disabled');
   });
}

activitiesFieldset.addEventListener('change', (e) => {
  const fieldset = e.currentTarget;
  const activityParent = e.target.parentElement;
  const activitiesIn = activitiesFieldset.querySelectorAll('input');
  const activitiesChecked = activitiesFieldset.querySelectorAll('[type="checkbox"]:checked');
  const activityHint = document.querySelector('#activities-hint');
  const attrb = 'data-day-and-time';

  if(activitiesChecked.length === 0) {
    fieldset.classList.add('not-valid');
    fieldset.classList.remove('valid');
    activityHint.style.display = '';
  }
    else {
      fieldset.classList.add('valid');
      fieldset.classList.remove('not-valid');
      activityHint.style.display = 'none';
    }
  clearDisabledActivies(activitiesIn);
  if(activityParent.classList.contains('focus')) 
    activityParent.classList.remove('focus');
    else
      activityParent.classList.add('focus');
  

  activitiesChecked.forEach((chkd) => {
    if(chkd.hasAttribute(attrb)) {
      activitiesIn.forEach((toChk) => {
        if(toChk.hasAttribute(attrb) && chkd !== toChk) {
          let newComp = toChk.getAttribute(attrb).match(/^(\w+) (\d+.?m)-(\d+.?m)$/i);
          let chkdComp = chkd.getAttribute(attrb).match(/^(\w+) (\d+.?m)-(\d+.?m)$/i);

          convStartEndTime24hr(newComp);
          convStartEndTime24hr(chkdComp);

          if(chkdComp[1] === newComp[1]){
            if((chkdComp[2] <= newComp[2] && chkdComp[3] >= newComp[2]) ||
              (chkdComp[2] <= newComp[3] && chkdComp[3] >= newComp[3])) {
               toChk.disabled = true;
               toChk.parentNode.classList.add('disabled');
            }
          }
        }
      });
    }
  });

  const activitiesCostSpan = activitiesFieldset.querySelector('#activities-cost');
  const activitiesTotal = Object.entries(activitiesIn).reduce((acc,v) => 
    acc += v[1].checked && +v[1].getAttribute('data-cost'),0);
  activitiesCostSpan.textContent = `Total: $${activitiesTotal}`;
});

function isMthYr(e) {
  const select = e.currentTarget;
  const isSelected = select.selectedIndex;
  const selParent = select.parentElement;
  if(isSelected > 0) {
    select.classList.remove('error');
    selParent.classList.remove('not-valid');
    selParent.classList.add('valid');
  };
}
document.querySelector('#exp-month').addEventListener('change', isMthYr);
document.querySelector('#exp-year').addEventListener('change', isMthYr);




/**-----------------------
 * *      Toggle Hints
 *------------------------**/


const helperHints = [
  {
    id: 'name',
    type: 'input',
    hintId: 'name-hint',
    textContent: 'Please enter First Name and Last Name (last name hyphen accepted)',
    regExp: /^([a-zA-Z-]+)( [a-zA-Z]{2,})(-[a-zA-Z]{2,})?$/i
  },
  {
    id: 'email',
    type: 'input',
    hintId: 'email-hint',
    textContent: 'Please enter well formated Email: user@domain.com',
    regExp: /^[\w+-]+(\.[\w]+)*@[\w-]+\.\w{2,4}$/i
  },
  {
    id: 'activities',
    type: 'checkbox',
    hintId: 'activities-hint',
    textContent: 'Choose at least one activity',
    regExp: /\d+/
  },
  {
    id: 'exp-month',
    type: 'select',
    regExp: /\d+/
  },
  {
    id: 'exp-year',
    type: 'select',
    regExp: /\d+/
  },
  {
    id: 'cc-num',
    type: 'input',
    hintId: 'cc-hint',
    textContent: 'Number must be 13 to 16 digits in length. Spaces and dashes are permitted',
    regExp: /^\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{1,4}$/
  },
  {
    id: 'zip',
    type: 'input',
    hintId: 'zip-hint',
    textContent: 'Zip Code must contain 5 digits',
    regExp: /^\d{5}$/
  },
  {
    id: 'cvv',
    type: 'input',
    hintId: 'cvv-hint',
    textContent: 'CVV must contain 3 digits',
    regExp: /^\d{3}$/
  }
]

function toggleHint(e) {
  const id = e.currentTarget.id;
  const hintObj = helperHints.find((v) => v.id === id);
  const hintEle = document.querySelector(`#${hintObj.hintId}`);
  e.currentTarget.setAttribute('autocomplete', 'off');
   if(hintObj.regExp.test(e.currentTarget.value)) {
     if(hintEle){
     hintEle.parentElement.classList.add('valid');
     hintEle.parentElement.classList.remove('not-valid');
     e.currentTarget.classList.remove('error')
     hintEle.style.display = 'none';
   } else {
     e.currentTarget.parentElement.classList.remove('not-valid');
     e.currentTarget.classList.add('error');
    }
   } else {
      if(hintEle) {
        hintEle.textContent = hintObj.textContent;
        hintEle.style.display = '';
        hintEle.parentElement.classList.add('not-valid');
        hintEle.parentElement.classList.remove('valid');
        e.currentTarget.classList.add('error');
      } else {
     e.currentTarget.parentElement.classList.add('not-valid');
     e.currentTarget.classList.remove('error');
   }
  }
}

helperHints.forEach((v) => {
  if(v.type === 'input')
    document.querySelector(`#${v.id}`).addEventListener('keyup', toggleHint);
}); 

 /**------------------------------------------------------------------------
 * *                                INFO
 *   Form validation
 *------------------------------------------------------------------------**/

function processForm(e) {
  e.preventDefault();
  const isFormValid = helperHints.every((v) => {
    const hintEle = document.querySelector(`#${v.hintId}`);
    switch(v.type) {
      case 'input':
        const input = document.querySelector(`#${v.id}`);
        if(!v.regExp.test(input.value)) {
          hintEle.textContent = v.id.textContent;
          hintEle.style.display = '';
          input.classList.add('error');
          hintEle.parentElement.classList.add('not-valid');
          input.focus();
          return false;
        }
        return true;
      break;
      case 'checkbox':
        const fieldset = document.querySelector(`#${v.id}`);
        const checkBoxes = fieldset.querySelectorAll('[type="checkbox"]');
        if(!(Object.entries(checkBoxes).some((v) => v[1].checked))) {
          hintEle.textContent = v.id.textContent;
          hintEle.style.display = '';
          fieldset.classList.add('error');
          hintEle.parentElement.classList.add('not-valid');
          checkBoxes[0].focus();
          return false;
        }
        return true;
      break;
      case 'select':
        const select = document.querySelector(`#${v.id}`);
        if(select.selectedIndex <= 0) {
          select.classList.add('error');
          select.parentElement.classList.add('not-valid');
          select.focus();
          return false
        }
        return true;
      break;
    }
  });
  return (isFormValid)? alert('good form'): false;
}

 document.querySelector('form').addEventListener('submit', processForm);
