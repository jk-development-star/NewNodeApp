// masking on wndow load
window.addEventListener("load", (event) => {
  let budgetValue = document.querySelector("input#lead_budget");
  const bValues = budgetValue.value.replace(/,/g, "");
  budgetValue.value = Number(bValues).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    style: "currency",
    currency: "INR",
  });
});

// masking on blur
const budget = document.querySelector("input#lead_budget");
budget.addEventListener("blur", (event) => {
  let budgetValue = event.target.value.replace(/,/g, "");
  event.target.value = Number(budgetValue).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    style: "currency",
    currency: "INR",
  });
});
