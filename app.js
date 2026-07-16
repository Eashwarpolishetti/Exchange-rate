// app.js - Currency Conversion Logic

const fromSelect = document.querySelector(".from-name");
const toSelect = document.querySelector(".to-name");
const fromFlagImg = document.querySelector(".p-from .flag img");
const toFlagImg = document.querySelector(".p-to .flag img");
const amountInput = document.querySelector(".dash-amount");
const convertBtn = document.querySelector(".convert-btn");
const resultText = document.querySelector(".dash-value");

// ---------- 1. Populate the dropdowns from countryList ----------
function populateDropdowns() {
  const currencyCodes = Object.keys(countryList);

  currencyCodes.forEach((currency) => {
    const optionFrom = document.createElement("option");
    optionFrom.value = currency;
    optionFrom.textContent = currency;
    fromSelect.appendChild(optionFrom);

    const optionTo = document.createElement("option");
    optionTo.value = currency;
    optionTo.textContent = currency;
    toSelect.appendChild(optionTo);
  });

  // Set sensible defaults matching the flags already in your HTML
  fromSelect.value = "USD";
  toSelect.value = "INR";
}

// ---------- 2. Update flag image whenever a dropdown changes ----------
function updateFlag(selectEl, imgEl) {
  const currency = selectEl.value;
  const countryCode = countryList[currency];
  if (countryCode) {
    imgEl.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
  }
}

fromSelect.addEventListener("change", () => updateFlag(fromSelect, fromFlagImg));
toSelect.addEventListener("change", () => updateFlag(toSelect, toFlagImg));

// ---------- 3. Conversion logic using live API ----------
async function convertCurrency() {
  const amount = parseFloat(amountInput.value);
  const fromCurrency = fromSelect.value;
  const toCurrency = toSelect.value;

  if (isNaN(amount) || amount <= 0) {
    resultText.textContent = "Please enter a valid amount";
    return;
  }

  resultText.textContent = "Converting...";

  try {
    const response = await fetch(
      `https://open.er-api.com/v6/latest/${fromCurrency}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    if (data.result !== "success") {
      throw new Error("API returned an error");
    }

    const rate = data.rates[toCurrency];

    if (!rate) {
      resultText.textContent = "Conversion rate not available";
      return;
    }

    const convertedValue = (amount * rate).toFixed(2);
    resultText.textContent = `${amount} ${fromCurrency} = ${convertedValue} ${toCurrency}`;
  } catch (error) {
    console.error("Conversion failed:", error);
    resultText.textContent = "Failed to fetch conversion rate. Try again.";
  }
}

convertBtn.addEventListener("click", convertCurrency);

// ---------- 4. Init ----------
populateDropdowns();