/**
 * Replaces a HubSpot form input with a select element
 * @param {string} fieldName - The name attribute of the input to replace
 * @param {Array} options - Array of option objects with {label, value} properties
 */
function replaceInputWithSelect(fieldName, options) {
  // Find the input element by name attribute
  const input = document.querySelector(`input[name="${fieldName}"]`);
  
  if (!input) {
    console.warn(`Input with name "${fieldName}" not found`);
    return;
  }
  
  // Create the new select element
  const select = document.createElement('select');
  
  // Copy all attributes from input to select
  Array.from(input.attributes).forEach(attr => {
    select.setAttribute(attr.name, attr.value);
  });
  
  // Add the predefined options
  options.forEach(opt => {
    const option = document.createElement('option');
    option.value = opt.value;
    option.textContent = opt.label;
    select.appendChild(option);
  });
  
  // Replace the input with the select
  input.parentNode.replaceChild(select, input);
  
  return select;
}

// Usage example with HubSpot form ready event
window.addEventListener('message', event => {
  if (event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormReady') {
    // Define your options
    const myOptions = [
      { label: 'Select an option', value: '' },
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' }
    ];
    
    // Replace the input with the select
    replaceInputWithSelect('fieldName', myOptions);
  }
});

// Alternative: If using HubSpot Forms API directly
// hbspt.forms.create({
//   portalId: 'YOUR_PORTAL_ID',
//   formId: 'YOUR_FORM_ID',
//   target: '#form-container',
//   onFormReady: function($form) {
//     const myOptions = [
//       { label: 'Select an option', value: '' },
//       { label: 'Option 1', value: 'option1' },
//       { label: 'Option 2', value: 'option2' }
//     ];
//     replaceInputWithSelect('fieldName', myOptions);
//   }
// });
