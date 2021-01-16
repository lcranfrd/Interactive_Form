/**------------------------------------------------------------------------
 * ?                                ABOUT
 * @author         :  L. Bennett Crantford
 * @email          :  lcranfrd@comcast.net
 * @repo           :  https://github.com/lcranfrd/Interactive_Form.git
 * @createdOn      :  1/15/2021
 * @description    :  TreeHouse FS TechDegree Project #3
 * @description    :  Interactive Form
 *------------------------------------------------------------------------**/

"use strict";

/**------------------------------------------------------------------------
 * *                                HelperHints
 *   array of objects used to set helper hints and validate form submission.
 *   Its types are determined through the required form input types. Those
 *   that have cooresponding hints will have rexexp values and textContent
 *   for input validation and hint display.
 *------------------------------------------------------------------------**/

const helperHints = [
  {
    id: 'name',
    type: 'input',
    hintId: 'name-hint',
    liveCheckTextContent: 'Please enter First Name and Last Name (last name hyphen accepted)',
    submitTextContent: 'Name field cannot be blank',
    regExp: /^([a-zA-Z-]+)( [a-zA-Z]{2,})(-[a-zA-Z]{2,})?$/i
  },
  {
    id: 'email',
    type: 'input',
    hintId: 'email-hint',
    liveCheckTextContent: 'Please enter well formated Email ex: user@domain.com',
    submitTextContent: 'Email address must be formatted correctly',
    regExp: /^[\w+-]+(\.[\w]+)*@[\w-]+\.\w{2,4}$/i
  },
  {
    id: 'activities',
    type: 'checkbox',
    hintId: 'activities-hint',
    liveCheckTextContent: 'Choose at least one activity',
    submitTextContent: 'Choose at least one activity',
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
    card: true,
    hintId: 'cc-hint',
    liveCheckTextContent: 'Number must be 13 - 16 digits in length. Spaces and dashes are permitted',
    submitTextContent: 'Credit card number must be between 13 - 16 digits',
    regExp: /^\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{1,4}$/
  },
  {
    id: 'zip',
    type: 'input',
    card: true,
    hintId: 'zip-hint',
    tliveCheckTextContent: 'Zip Code must contain 5 digits',
    submitTextContent: 'Zip Code must contain 5 digits',
    regExp: /^\d{5}$/
  },
  {
    id: 'cvv',
    type: 'input',
    card: true,
    hintId: 'cvv-hint',
    liveCheckTextContent: 'CVV must contain 3 digits',
    submitTextContent: 'CVV must contain 3 digits',
    regExp: /^\d{3}$/
  }
];


const nameIn = document.querySelector('#name');
const emailIn = document.querySelector('#email');
const activitiesFieldset = document.querySelector('#activities');
const ccNumIn = document.querySelector('#cc-num');
const zipIn = document.querySelector('#zip');
const cvvIn = document.querySelector('#cvv');
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


/**========================================================================
 **                           setPaymentMeth
 *?  Will set the default behaviour of the Payment Methods.
 *?  Will show the elements associated with the users choice.
 *?  Function will be first called with a default setting after which
 *?  will be called by eventListen change on the payment Selector
 *@param obj HTMLElement value 
 *@return null
 *========================================================================**/


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

/**------------------------------------------------------------------------
 * *                   Job Role and T-Shirt Info Behavious
 *------------------------------------------------------------------------**/

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

/**------------------------------------------------------------------------
 **                       Set Behavious for Activites
 *------------------------------------------------------------------------**/  


 /**========================================================================
  **                           convStartEndTime24
 *?  convert 2 string elements in passed array to number representing
 *?  24 hr time component to be used for comparison. 
 *@param arr array object from match()
 *@return null
  *========================================================================**/

function convStartEndTime24hr(arr) {
  arr[2] = (/^[1-9][01]?pm$/.test(arr[2]))? +(arr[2]).match(/\d+/) + 12: +arr[2].match(/\d+/);
  arr[3] = (/^[1-9][01]?pm$/.test(arr[3]))? +(arr[3]).match(/\d+/) + 12: +arr[3].match(/\d+/);
}

/**========================================================================
 **                           clearDisaledActivities
 *?  Reset the displayed attributes of the activites area in order set via
 *?  to user response.
 *@param node NODECollection input elements
 *@return null
 *========================================================================**/

function clearDisabledActivities(node) {
  node.forEach((v) => {
    v.disabled = false;
    v.parentNode.classList.remove('disabled');
   });
}

/**------------------------------------------------------------------------
 * *                         Activities Fieldset
 *  EventListener for 'change' will disable activities with conflicting
 *  running times and update the displayed dollar cost. Start/End times are
 *  read from the html and split via regexp then compared to determing
 *  conflict
 *------------------------------------------------------------------------**/

activitiesFieldset.addEventListener('change', (e) => {
  const fieldset = e.currentTarget;
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
  clearDisabledActivities(activitiesIn);

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

/**------------------------------------------------------------------------
 * *                         Activites Cost
 *   Adjust the reported cost in activities total display in $. Will update
 *   to user's activity choices.
 *------------------------------------------------------------------------**/

  const activitiesCostSpan = activitiesFieldset.querySelector('#activities-cost');
  const activitiesTotal = Object.entries(activitiesIn).reduce((acc,v) => 
    acc += v[1].checked && +v[1].getAttribute('data-cost'),0);
  activitiesCostSpan.textContent = `Total: $${activitiesTotal}`;
});

/**========================================================================
 **                        focusActivityLabels
 *?  EventListner callback. Add/remove focus classList to selected
 *?  activity depending on called focus/blur event.
 *@param e focus or blur event
 *@return null
 *========================================================================**/

function focusActivityLabels(e) {
  (e.type === 'focus') 
    ? e.target.parentElement.classList.add('focus')
    : e.target.parentElement.classList.remove('focus');
}

  const checkEles = document.querySelectorAll('[type="checkbox"]');
  checkEles.forEach((v) => v.addEventListener('focus', focusActivityLabels));
  checkEles.forEach((v) => v.addEventListener('blur', focusActivityLabels));

/**========================================================================
 **                           isMthYr
 *?  This function is outside of Project's required instructions!! It will
 *?  make the Credit Card Month and Year selectors required behaviours for
 *?  final form submission. This function will add/remove valid/not-valid
 *?  classLists depending on whether options have been chosen. 
 *@param e change event
 *@return null
 *========================================================================**/

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


/**========================================================================
 **                           toggleHint
 *?  callback function for 'input' event on input elements. Will get info
 *?  from helperHints array and process associated element. Will alter
 *?  display properties and live-check (Exceeds Expectations) input for required inputs
 *@param e input event
 *@return null
 *========================================================================**/

function toggleHint(e) {
  if(e.keyCode === 9) return false;
  const hintObj = helperHints.find((v) => v.id === e.currentTarget.id);
  const hintEle = document.querySelector(`#${hintObj.hintId}`);
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
      hintEle.textContent = hintObj.liveCheckTextContent;
      hintEle.parentElement.classList.add('not-valid');
      hintEle.parentElement.classList.remove('valid');
      e.currentTarget.classList.add('error');
      hintEle.style.display = 'inherit';
    } else {
      e.currentTarget.parentElement.classList.add('not-valid');
      e.currentTarget.classList.remove('error');
    }
  }
}

helperHints.forEach((v) => {
  if(v.type === 'input') {
  const input = document.querySelector(`#${v.id}`)
  input.addEventListener('input', toggleHint);
  input.setAttribute('autocomplete', 'off');
}
}); 

 /**------------------------------------------------------------------------
 * *                                INFO
 *   Form validation
 *------------------------------------------------------------------------**/

 /**========================================================================
  **                           processForm
  *?  main form process function. Input elements are processed by
  *?  type(input, checkbox, select). Each type has information in the
  *?  helperHints array to make validation and will return with focus on
  *?  the failed validation with the appropriate element with a preventDefault.
  *?  If there are no failures, fucntion will return true, therefore mimicing
  *?  successful form submission.
  *@param e submit event   
  *@return Boolean
  *========================================================================**/

function processForm(e) {
  const isFormValid = helperHints.every((v) => {
    const paymentMethIndx = document.querySelector('#payment').selectedIndex;
    const hintEle = document.querySelector(`#${v.hintId}`);
    switch(v.type) {
      case 'input':
        const input = document.querySelector(`#${v.id}`);
        if(!(paymentMethIndx > 1 &&  v.card !== undefined)) {
          if(!v.regExp.test(input.value)) {
            hintEle.textContent = v.submitTextContent;
            hintEle.style.display = 'inherit';
            input.classList.add('error');
            hintEle.parentElement.classList.add('not-valid');
            e.preventDefault();
            input.focus();
            return false;
          }
        }
        return true;
      break;
      case 'checkbox':
        const fieldset = document.querySelector(`#${v.id}`);
        const checkBoxes = fieldset.querySelectorAll('[type="checkbox"]');
        if(!(Object.entries(checkBoxes).some((v) => v[1].checked))) {
          hintEle.textContent = v.submitTextContent;
          hintEle.style.display = 'inherit';
          fieldset.classList.add('error');
          hintEle.parentElement.classList.add('not-valid');
          e.preventDefault();
          checkBoxes[0].focus();
          return false;
        }
        return true;
      break;
      case 'select':
        const select = document.querySelector(`#${v.id}`);
        if(paymentMethIndx === 1) {
          if(select.selectedIndex <= 0) {
            select.classList.add('error');
            select.parentElement.classList.add('not-valid');
            e.preventDefault();
            select.focus();
            return false
          }
        }
        return true;
      break;
    }
  });
  return (isFormValid)? true: false;
}

 document.querySelector('form').addEventListener('submit', processForm);