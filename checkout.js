document.addEventListener('DOMContentLoaded', function() {
    lordOrder();
});

// Loading the added order from the loacal storage and displaying it

function lordOrder(){
    const orderData = JSON.parse(localStorage.getItem("favs")) || [];

    const orderTable = document.querySelector("#orderTable tbody");
    let totalAmount = 0;

    orderData.forEach( item => {
        let row = document.createElement("tr");

        let cellName = document.createElement("td");
        cellName.innerText = item.name;
        row.appendChild(cellName);

        let cellQuantity = document.createElement("td");
        cellQuantity.innerText = item.quantity;
        row.appendChild(cellQuantity);

        let cellTotalPrice = document.createElement("td");
        cellTotalPrice.innerText = item.totalPrice;
        row.appendChild(cellTotalPrice);

        orderTable.appendChild(row);

        totalAmount += parseFloat(item.totalPrice.replace("Rs","").trim());
    });

    document.getElementById("orderTotal").innerText = "Rs " + totalAmount.toFixed(2);
}