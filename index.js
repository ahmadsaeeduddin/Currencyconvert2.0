const base_url =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

let drop = document.querySelectorAll(".dropdown select");
let inputElement1 = document.querySelector('.amount1 input[type="text"]');
let inputElement2 = document.querySelector('.amount2 input[type="text"]');
let fromcurr = document.querySelector(".from select");
let tocurr = document.querySelector(".to select");
let swap = document.querySelector("i");

for (let i = 0; i < drop.length; i++) {
  for (code in countryList) {
    let newOp = document.createElement("option");
    newOp.innerText = code;
    newOp.value = code;
    if (drop[i].name === "from" && code === "PKR") {
      newOp.selected = true;
    } else if (drop[i].name === "to" && code === "USD") {
      newOp.selected = true;
    }
    drop[i].append(newOp);
  }
  drop[i].addEventListener("change", (e) => {
    updateFlag(e.target);
    conversion(inputElement1, inputElement2, true);
  });
}
function updateFlag(ele) {
  let currcode = ele.value;
  let councode = countryList[currcode];
  let newImg = `https://flagsapi.com/${councode}/flat/64.png`;
  let img = ele.parentElement.querySelector("img");
  img.src = newImg;
}

async function conversion(inElement, changeto, flag) {
  let am = parseFloat(inElement.value);
  if (isNaN(am) || am < 1) {
    am = 1;
    inElement.value = am;
  }

  let baseCode = fromcurr.value.toLowerCase();
  let targetCode = tocurr.value.toLowerCase();
  let rate;

  try {
    if (flag) {
      const url = `${base_url}/${baseCode}.json`;
      let resp = await fetch(url);
      let data = await resp.json();
      rate = data[baseCode][targetCode];
    } else {
      const url = `${base_url}/${targetCode}.json`;
      let resp = await fetch(url);
      let data = await resp.json();
      rate = data[targetCode][baseCode];
    }

    let convertedAmount = am * rate;
    changeto.value = convertedAmount.toFixed(4);
  } catch (error) {
    console.error("Error fetching currency data:", error);
    changeto.value = "";
  }
}

inputElement1.addEventListener("input", (e) => {
  e.preventDefault();
  conversion(inputElement1, inputElement2, true);
});

inputElement2.addEventListener("input", (e) => {
  e.preventDefault();
  conversion(inputElement2, inputElement1, false);
});

conversion(inputElement1, inputElement2, true);
