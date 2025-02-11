let price = 0;
let cid = [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]];

const cashInput = document.getElementById("cash");
const changeDue = document.getElementById("change-due");
const purchaseBtn = document.getElementById("purchase-btn");

purchaseBtn.addEventListener("click", () => {
    const cash = parseFloat(cashInput.value);

    if (isNaN(cash) || cash < price) {
        alert("Customer does not have enough money to purchase the item");
        return;
    }

    if (cash === price) {
        changeDue.textContent = "No change due - customer paid with exact cash";
        return;
    }

    const change = calculateChange(price, cash, cid);
    changeDue.textContent = formatChange(change);
});

function calculateChange(price, cash, cid) {
    let changeDue = cash - price;
    let totalCID = cid.reduce((acc, curr) => acc + curr[1], 0);

    if (changeDue > totalCID) {
        return "INSUFFICIENT_FUNDS";
    } else if (changeDue === totalCID) {
        return "CLOSED"; // Correctly handle CLOSED case
    }

    const currencyValues = {
        "ONE HUNDRED": 100,
        "TWENTY": 20,
        "TEN": 10,
        "FIVE": 5,
        "ONE": 1,
        "QUARTER": 0.25,
        "DIME": 0.1,
        "NICKEL": 0.05,
        "PENNY": 0.01
    };

    const changeArray = [];

    for (let currency in currencyValues) {
        let value = currencyValues[currency];
        let available = 0;
        for (let i = 0; i < cid.length; i++) {
            if (cid[i][0] === currency) {
                available = cid[i][1];
                break;
            }
        }

        let toReturn = 0;
        while (changeDue >= value && available > 0) {
            changeDue = parseFloat((changeDue - value).toFixed(2));
            available -= value;
            toReturn += value;
        }
        if (toReturn > 0) {
            changeArray.push([currency, toReturn]);
        }
    }

    if (changeDue > 0.001) { // Floating point check
        return "INSUFFICIENT_FUNDS";
    }

    // Update CID if change was successfully given.
    for (let changeItem of changeArray) {
        for (let i = 0; i < cid.length; i++) {
            if (cid[i][0] === changeItem[0]) {
                cid[i][1] -= changeItem[1];
                break;
            }
        }
    }


    return changeArray;
}

function formatChange(change) {
    if (change === "INSUFFICIENT_FUNDS") {
        return `Status: ${change}`;
    } else if (change === "CLOSED") {
        let closedChange = "";
        for (let i = cid.length -1; i >= 0; i--) {
            if(cid[i][1] > 0) {
                closedChange += ` ${cid[i][0]}: $${cid[i][1].toFixed(2)}`;
            }
        }
        return `Status: CLOSED${closedChange}`;
    } else {
        let result = "Status: OPEN";
        for (const item of change) {
            result += ` ${item[0]}: $${item[1].toFixed(2)}`;
        }
        return result.trim();
    }
}


// Example (for testing):
price = 19.5;
cid = [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]];
