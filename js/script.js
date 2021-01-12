"use strict";
const nameIn = document.querySelector('#name');
const otherJobRolIn = document.querySelector('#other-job-role');
const titleSel = document.querySelector('#title');
const shirtDesignSel = document.querySelector('#design');
const shirtColorsSel = document.querySelector('#color');
const activitiesFieldset = document.querySelector('#activities');
const paymentSel = document.querySelector('#payment');
const creditPayOpt = document.querySelector('[value="credit-card"')
const hintDispEles = document.querySelectorAll('[id$="-hint"]')
// const hintEles = inElements.querySelectorAll(`#${/^(.+)(-hint){1}$/.exec(inElements.id)}`);
//console.log(hintDispEles);


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

function disableActivies(node) {
  node.forEach((v) => {
    v.disabled = false;
    v.parentNode.style.opacity = 1;
   });
}

activitiesFieldset.addEventListener('change', (e) => {
  const activitiesIn = activitiesFieldset.querySelectorAll('input');
  const activitiesChecked = activitiesFieldset.querySelectorAll('[type="checkbox"]:checked');
  const attrb = 'data-day-and-time';
  disableActivies(activitiesIn);

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
               toChk.parentNode.style.opacity = .25;
            }
          }
        }
      });
    }
  });
  const activitiesTime = '';
  const activitiesCostSpan = activitiesFieldset.querySelector('#activities-cost');
  const activitiesTotal = Object.entries(activitiesIn).reduce((acc,v) => 
    acc += v[1].checked && +v[1].getAttribute('data-cost'),0);
  activitiesCostSpan.textContent = `Total: $${activitiesTotal}`;
});

paymentSel.addEventListener('change', setPaymentMeth);


/**-----------------------
 * *      Toggle Hints
 * 
 *  
 *  
 *------------------------**/

function toggleHints(e) {
  const fieldset = e.currentTarget;
  const formHints = fieldset.querySelectorAll('.hint');
  Object.entries(formHints).forEach((v) => {
    v[1].style.display = (e.type === 'focusin')
    ? 'inherit' :
    '';
  });
}

// document.querySelector('.basic-info').addEventListener('focusin', toggleHints);
// document.querySelector('.basic-info').addEventListener('focusout', toggleHints);
// document.querySelector('.activities').addEventListener('focusin', toggleHints);
// document.querySelector('.activities').addEventListener('focusout', toggleHints);
// document.querySelector('.payment-methods').addEventListener('focusin', toggleHints);
// document.querySelector('.payment-methods').addEventListener('focusout', toggleHints);

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
  // {
  //   id: 'activities',
  //   hintId: 'activities-hint',
  //   textContent: 'Select Activities that are free of running time conflicts',
  //   regExp: ''},
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
  console.log(e.currentTarget);
  e.currentTarget.setAttribute('autocomplete', 'off');
  //const orgHintVal = hintEle.textContent;
   if(hintObj.regExp.test(e.currentTarget.value)) {
     hintEle.classList.add('hint');
     //hintEle.classList.add('valid');
   } else {
    hintEle.textContent = hintObj.textContent;
    hintEle.classList.remove('hint');
   }
}

helperHints.forEach((v) => {
  document.querySelector(`#${v.id}`).addEventListener('keyup', toggleHint);
}); 
// nameIn.addEventListener('keyup', toggleHint);
// emailIn.addEventListener('keyup', toggleHint);


 /**------------------------------------------------------------------------
 * *                                INFO
 *   Form validation
 *------------------------------------------------------------------------**/

function processForm(e) {
  e.preventDefault();

  //.basic-info
  //.shirts
  //.activities
  //payment-methods
}

 document.querySelector('form').addEventListener('submit', processForm);

 function isValBasicInfo() {
  /**============================================
   **Name, Email Address, Job info
   *=============================================**/
  isName = /^([a-zA-Z-]+)( [a-zA-Z-]+)*$/.test(document.querySelector('.name').value);
  isEmail = /^[\w+-]+(\.[\w]+)*@[\w-]+\.\w{2,4}$/i.test(document.querSelector('email').value);
  isJobInfo = /^\w+$/i.test(otherJobRolIn.value);
 }

 function isValShirts() {

}

function isValActivities() {

}

function isValPayment() {

}
