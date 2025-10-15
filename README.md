# HubSpot Form Input to Select Converter

A JavaScript utility function that dynamically replaces HubSpot form input fields with select dropdown elements. This is useful when you need to provide predefined options for fields that HubSpot renders as text inputs.

## Features

- Converts any HubSpot form input field to a select dropdown
- Preserves all original input attributes (name, id, classes, etc.)
- Works with HubSpot's form callback events
- Maintains form validation and submission functionality
- Simple and lightweight implementation

## Usage

### Basic Implementation

```javascript
/**
 * Replace a form input with a select dropdown
 * @param {string} fieldName - The name attribute of the input to replace
 * @param {Array} options - Array of option objects with {label, value} properties
 */
replaceInputWithSelect('your-field-name', [
  { label: 'Select an option', value: '' },
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' }
]);
```

### With HubSpot Form Events

The function works best when triggered after the HubSpot form is fully loaded:

```javascript
// Method 1: Using window message events
window.addEventListener('message', event => {
  if (event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormReady') {
    const options = [
      { label: 'Select an option', value: '' },
      { label: 'Small Business (1-50 employees)', value: 'small' },
      { label: 'Medium Business (51-200 employees)', value: 'medium' },
      { label: 'Enterprise (200+ employees)', value: 'enterprise' }
    ];
    
    replaceInputWithSelect('company_size', options);
  }
});
```

### With Dynamically Generated Options

You can also generate options dynamically from data sources like APIs, databases, or calculated values:

```javascript
// Example: Generate year options dynamically
function generateYearOptions() {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 10;
  const endYear = currentYear + 5;
  
  const years = [{ label: 'Select a year', value: '' }];
  
  for (let year = startYear; year <= endYear; year++) {
    years.push({
      label: year.toString(),
      value: year.toString()
    });
  }
  
  return years;
}

// Example: Generate budget ranges from configuration
function generateBudgetOptions() {
  const budgetRanges = [
    { min: 0, max: 10000, label: 'Under $10K' },
    { min: 10000, max: 50000, label: '$10K - $50K' },
    { min: 50000, max: 100000, label: '$50K - $100K' },
    { min: 100000, max: null, label: '$100K+' }
  ];
  
  const options = [{ label: 'Select budget range', value: '' }];
  
  budgetRanges.forEach(range => {
    const value = range.max ? `${range.min}-${range.max}` : `${range.min}+`;
    options.push({
      label: range.label,
      value: value
    });
  });
  
  return options;
}

// Example: Fetch options from an API
async function getCountryOptions() {
  try {
    const response = await fetch('https://api.example.com/countries');
    const countries = await response.json();
    
    const options = [{ label: 'Select a country', value: '' }];
    
    countries.forEach(country => {
      options.push({
        label: country.name,
        value: country.code
      });
    });
    
    return options;
  } catch (error) {
    console.error('Failed to fetch countries:', error);
    // Fallback to static options
    return [
      { label: 'Select a country', value: '' },
      { label: 'United States', value: 'US' },
      { label: 'Canada', value: 'CA' },
      { label: 'United Kingdom', value: 'UK' }
    ];
  }
}

// Using dynamic options with HubSpot forms
window.addEventListener('message', async event => {
  if (event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormReady') {
    // Replace multiple fields with dynamic options
    replaceInputWithSelect('project_year', generateYearOptions());
    replaceInputWithSelect('budget_range', generateBudgetOptions());
    
    // For async options, wait for the data
    const countryOptions = await getCountryOptions();
    replaceInputWithSelect('country', countryOptions);
  }
});
```

```javascript
// Method 2: Using HubSpot Forms API
hbspt.forms.create({
  portalId: 'YOUR_PORTAL_ID',
  formId: 'YOUR_FORM_ID',
  target: '#form-container',
  onFormReady: function($form) {
    const options = [
      { label: 'How did you hear about us?', value: '' },
      { label: 'Google Search', value: 'google' },
      { label: 'Social Media', value: 'social' },
      { label: 'Referral', value: 'referral' },
      { label: 'Advertisement', value: 'ad' }
    ];
    
    replaceInputWithSelect('lead_source', options);
  }
});
```

## Parameters

### `fieldName` (string)
The `name` attribute of the input field you want to replace. You can find this by inspecting the HubSpot form HTML or checking your HubSpot form configuration.

### `options` (array)
An array of objects representing the dropdown options. Each object should have:
- `label` (string): The text displayed to users
- `value` (string): The value submitted with the form

## How It Works

1. **Finds the target input** using the provided field name
2. **Creates a new select element** 
3. **Copies all attributes** from the original input to maintain HubSpot functionality
4. **Adds the provided options** to the select element
5. **Replaces the input** in the DOM while preserving the form structure

## Common Use Cases

- Converting "Company Size" text inputs to predefined ranges
- Replacing "How did you hear about us?" with specific sources
- Converting "Industry" fields to standardized categories
- Creating "Budget Range" dropdowns from text inputs
- **Dynamic year selection** for project timelines or graduation dates
- **API-driven location selection** for countries, states, or cities
- **Calculated budget ranges** based on business logic
- **Time-sensitive options** that update based on current date/season

## Important Notes

- **Timing**: Always wait for the HubSpot form to be fully loaded before calling this function
- **Field Names**: Ensure you're using the correct field name attribute from your HubSpot form
- **Validation**: The select element inherits all validation rules from the original input
- **Styling**: The select will inherit CSS classes from the original input for consistent styling

## Troubleshooting

### Input not found
If you see the warning "Input with name 'fieldName' not found":
- Verify the field name is correct
- Ensure the function runs after the form is loaded
- Check that the field exists in your HubSpot form

### Select not submitting correctly
- Ensure option values match what HubSpot expects
- Verify all required attributes were copied from the original input

### Styling issues
- The select inherits classes from the original input
- Add custom CSS targeting the select element if needed

## Browser Compatibility

This function works in all modern browsers that support:
- `document.querySelector()`
- `Array.from()`
- `forEach()`

## License

This code is provided as-is for use with HubSpot forms. Feel free to modify and adapt for your specific needs.
