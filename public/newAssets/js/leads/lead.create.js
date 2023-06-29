const budget = document.querySelector("input.budget");
budget.addEventListener("blur", (event) => {
  let budgetValue = event.target.value.replace(/,/g, "");
  event.target.value = Number(budgetValue).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    style: "currency",
    currency: "INR",
  });
});
