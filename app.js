/**
 * Intentra - Market Interest Check
 * Client-side application logic
 */

(function() {
  'use strict';

  // ============================================
  // DOM Elements
  // ============================================

  const elements = {
    // Forms
    vehicleForm: document.getElementById('vehicle-form'),
    contactForm: document.getElementById('contact-form'),

    // Sections
    vehicleFormSection: document.getElementById('vehicle-form-section'),
    resultsSection: document.getElementById('results-section'),
    contactSection: document.getElementById('contact-section'),
    successSection: document.getElementById('success-section'),

    // Vehicle form fields
    yearSelect: document.getElementById('vehicle-year'),
    makeSelect: document.getElementById('vehicle-make'),
    modelInput: document.getElementById('vehicle-model'),
    mileageSelect: document.getElementById('vehicle-mileage'),
    conditionSelect: document.getElementById('vehicle-condition'),

    // Results elements
    interestLevel: document.getElementById('interest-level'),
    interestLabel: document.getElementById('interest-label'),
    resultsSummary: document.getElementById('results-summary'),

    // Hidden fields for contact form
    hiddenVehicleInfo: document.getElementById('hidden-vehicle-info'),
    hiddenInterestLevel: document.getElementById('hidden-interest-level'),

    // Buttons
    submitBtn: document.getElementById('submit-btn'),
    learnMoreBtn: document.getElementById('learn-more-btn'),
    startOverBtn: document.getElementById('start-over-btn')
  };

  // ============================================
  // State
  // ============================================

  let vehicleData = {};
  let currentInterestLevel = '';

  // ============================================
  // Initialization
  // ============================================

  function init() {
    populateYearSelect();
    bindEvents();
  }

  function populateYearSelect() {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear + 1; // Include next year for new models
    const endYear = currentYear - 25;

    for (let year = startYear; year >= endYear; year--) {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      elements.yearSelect.appendChild(option);
    }
  }

  function bindEvents() {
    elements.vehicleForm.addEventListener('submit', handleVehicleFormSubmit);
    elements.contactForm.addEventListener('submit', handleContactFormSubmit);
    elements.learnMoreBtn.addEventListener('click', handleLearnMoreClick);
    elements.startOverBtn.addEventListener('click', handleStartOver);
  }

  // ============================================
  // Event Handlers
  // ============================================

  async function handleVehicleFormSubmit(event) {
    event.preventDefault();

    // Collect form data
    vehicleData = {
      year: elements.yearSelect.value,
      make: formatMakeName(elements.makeSelect.value),
      model: elements.modelInput.value.trim(),
      mileage: elements.mileageSelect.value,
      condition: elements.conditionSelect.value
    };

    // Show loading state
    setButtonLoading(elements.submitBtn, true);

    // Simulate processing time for a more natural feel
    await delay(800);

    // Calculate and display results
    const result = calculateMarketInterest(vehicleData);
    displayResults(result);

    // Remove loading state
    setButtonLoading(elements.submitBtn, false);

    // Show results section
    showSection('results');

    // Scroll to results
    scrollToSection(elements.resultsSection);
  }

  function handleContactFormSubmit(event) {
    // Let Netlify Forms handle the submission
    // But first, populate hidden fields
    elements.hiddenVehicleInfo.value = formatVehicleInfo(vehicleData);
    elements.hiddenInterestLevel.value = currentInterestLevel;

    // Show success after form submission
    // Using the form's native submit with a slight delay for UX
    setTimeout(() => {
      showSection('success');
      scrollToSection(elements.successSection);
    }, 100);
  }

  function handleLearnMoreClick() {
    showSection('contact');
    scrollToSection(elements.contactSection);
  }

  function handleStartOver() {
    // Reset forms
    elements.vehicleForm.reset();
    elements.contactForm.reset();

    // Reset state
    vehicleData = {};
    currentInterestLevel = '';

    // Show initial form
    showSection('form');
    scrollToSection(elements.vehicleFormSection);
  }

  // ============================================
  // Market Interest Calculation
  // ============================================

  /**
   * Calculate market interest based on vehicle attributes
   * This produces consumer-friendly results without exposing internal scoring logic
   */
  function calculateMarketInterest(data) {
    // Factors that influence general market activity
    let score = 50; // Base score

    // Year factor - newer vehicles generally see more activity
    const vehicleAge = new Date().getFullYear() - parseInt(data.year);
    if (vehicleAge <= 3) {
      score += 20;
    } else if (vehicleAge <= 6) {
      score += 10;
    } else if (vehicleAge <= 10) {
      score += 0;
    } else {
      score -= 10;
    }

    // Mileage factor
    const mileageFactors = {
      '0-15000': 15,
      '15000-30000': 10,
      '30000-50000': 5,
      '50000-75000': 0,
      '75000-100000': -5,
      '100000+': -10
    };
    score += mileageFactors[data.mileage] || 0;

    // Condition factor
    const conditionFactors = {
      'excellent': 15,
      'good': 10,
      'fair': 0,
      'rough': -10
    };
    score += conditionFactors[data.condition] || 0;

    // Popular makes factor (general market trends)
    const popularMakes = ['toyota', 'honda', 'ford', 'chevrolet', 'subaru', 'mazda', 'hyundai', 'kia'];
    const luxuryMakes = ['bmw', 'mercedes-benz', 'audi', 'lexus', 'porsche', 'tesla'];

    const makeValue = data.make.toLowerCase().replace(/\s+/g, '-');
    if (popularMakes.includes(makeValue)) {
      score += 5;
    } else if (luxuryMakes.includes(makeValue)) {
      score += 3;
    }

    // Normalize score to 0-100
    score = Math.max(0, Math.min(100, score));

    // Determine interest level
    let level, label, description;

    if (score >= 70) {
      level = 'high';
      label = 'Strong Market Interest';
      description = getHighInterestDescription(data);
    } else if (score >= 45) {
      level = 'moderate';
      label = 'Moderate Market Interest';
      description = getModerateInterestDescription(data);
    } else {
      level = 'steady';
      label = 'Steady Market Interest';
      description = getSteadyInterestDescription(data);
    }

    return { level, label, description, score };
  }

  function getHighInterestDescription(data) {
    const year = data.year;
    const make = data.make;

    return `
      <p>Vehicles like your ${year} ${make} are seeing strong activity in the current market.
      This means there's generally healthy interest from buyers looking at similar vehicles.</p>
      <p>Factors like the model year, condition, and mileage range you selected are typically
      associated with higher market engagement.</p>
    `;
  }

  function getModerateInterestDescription(data) {
    const year = data.year;
    const make = data.make;

    return `
      <p>Your ${year} ${make} falls into a category that sees consistent market activity.
      Vehicles with similar characteristics typically attract a steady level of interest.</p>
      <p>The combination of factors you've described puts your vehicle in a comfortable
      middle range for market engagement.</p>
    `;
  }

  function getSteadyInterestDescription(data) {
    const year = data.year;
    const make = data.make;

    return `
      <p>The market shows steady, ongoing interest in vehicles like your ${year} ${make}.
      While activity levels may be more measured, there's still consistent engagement
      with vehicles in this category.</p>
      <p>Many factors can influence individual interest, and this general view reflects
      broad market patterns.</p>
    `;
  }

  // ============================================
  // Display Functions
  // ============================================

  function displayResults(result) {
    currentInterestLevel = result.level;

    // Create interest level dots
    const dotsHTML = createInterestDots(result.level);
    elements.interestLevel.innerHTML = dotsHTML;

    // Set label
    elements.interestLabel.textContent = result.label;

    // Set description
    elements.resultsSummary.innerHTML = result.description;
  }

  function createInterestDots(level) {
    const levels = ['steady', 'moderate', 'high'];
    const activeLevels = levels.indexOf(level) + 1;

    let dotsHTML = '';
    for (let i = 0; i < 5; i++) {
      const isActive = i < Math.ceil((activeLevels / 3) * 5);
      const levelClass = isActive ? `active ${level}` : '';
      dotsHTML += `<span class="interest-dot ${levelClass}"></span>`;
    }

    return dotsHTML;
  }

  function showSection(sectionName) {
    // Hide all dynamic sections
    elements.resultsSection.hidden = true;
    elements.contactSection.hidden = true;
    elements.successSection.hidden = true;

    // Show appropriate sections based on state
    switch (sectionName) {
      case 'form':
        // Just form is visible (initial state)
        break;
      case 'results':
        elements.resultsSection.hidden = false;
        break;
      case 'contact':
        elements.resultsSection.hidden = false;
        elements.contactSection.hidden = false;
        break;
      case 'success':
        elements.successSection.hidden = false;
        break;
    }
  }

  // ============================================
  // Utility Functions
  // ============================================

  function formatMakeName(makeValue) {
    // Convert value like "mercedes-benz" to "Mercedes-Benz"
    return makeValue
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace(/Bmw/g, 'BMW')
      .replace(/Gmc/g, 'GMC')
      .replace(/Mini/g, 'MINI');
  }

  function formatVehicleInfo(data) {
    return `${data.year} ${data.make} ${data.model} | ${formatMileage(data.mileage)} | ${capitalizeFirst(data.condition)} condition`;
  }

  function formatMileage(mileageRange) {
    const mileageLabels = {
      '0-15000': 'Under 15K miles',
      '15000-30000': '15K-30K miles',
      '30000-50000': '30K-50K miles',
      '50000-75000': '50K-75K miles',
      '75000-100000': '75K-100K miles',
      '100000+': 'Over 100K miles'
    };
    return mileageLabels[mileageRange] || mileageRange;
  }

  function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function setButtonLoading(button, isLoading) {
    button.classList.toggle('loading', isLoading);
    button.disabled = isLoading;
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function scrollToSection(element) {
    setTimeout(() => {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  // ============================================
  // Initialize on DOM Ready
  // ============================================

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
