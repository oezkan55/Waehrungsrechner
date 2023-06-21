"use strict";

// API => EUR Wechselkurs
// "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/eur.json";

const form = document.querySelector("form");
const API =
  "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/eur.json";

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const formInpData = [...new FormData(this)];
  const { fromCurrency, toCurrency, amount } = Object.fromEntries(formInpData);

  //?+++++ Auf LEEREN Input Prüfen +++++
  if (!fromCurrency || !toCurrency || !amount) return errorMessage("input");

  currencyExchange(fromCurrency, toCurrency, amount);
});

//*****************************************************************
const currencyExchange = async function (p_fromCurr, p_toCurr, amount) {
  try {
    const exchangeResult = await convertCurrency(p_fromCurr, p_toCurr, amount);
    document.querySelector(".currency-item").textContent = exchangeResult;

    setTimeout(() => location.reload(), 4000);
  } catch (p_error) {
    errorMessage(p_error);
  }
};

//*****************************************************************
const convertCurrency = async function (p_fromCurr, p_toCurr, p_amount) {
  try {
    const amountExchangeRate = await getExchangeRate(p_fromCurr, p_toCurr);
    const convertedAmount = (p_amount * amountExchangeRate).toFixed(2);

    return `${p_amount} ${p_fromCurr.toUpperCase()} ===> ${convertedAmount} ${p_toCurr.toUpperCase()}`;
  } catch (p_err) {
    throw p_err;
  }
};

//***************************************************************** */
const getExchangeRate = async function (p_fromCurrency, p_toCurrency) {
  try {
    const response = await fetch(API);

    const { eur: currencyRates } = await response.json();

    const baseCurrency = 1 / currencyRates[p_fromCurrency.toLowerCase()];
    const exchangeRate =
      baseCurrency * currencyRates[p_toCurrency.toLowerCase()];

    if (isNaN(exchangeRate)) {
      throw new Error("currency");
    }

    return exchangeRate;
  } catch (p_err) {
    throw p_err.message;
  }
};

//******************************* Error-Message **********************************
const errorMessage = function (p_type) {
  document.querySelector(`.invalid-${p_type}`).classList.add("show");
  setTimeout(() => {
    document.querySelector(`.invalid-${p_type}`).classList.remove("show");
  }, 2000);
};
