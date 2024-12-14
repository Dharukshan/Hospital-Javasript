//Fetching the product data from JASON file
function getdata() {
    fetch("pharmacy.json")
        .then(res => res.json())
        .then(data => processData(data))
        .catch(error => console.log(`Error - ${error}`));
}

// Processing the JSON data tp create the product cards
function processData(products){

    // Clearing existing products that displays
    document.querySelectorAll('.products').forEach((container) => {
        // Reseting the containers before adding
        container.innerHTML = ''; 
    });

    for (let i in products.data) {
        let product = products.data[i];
        //creating card for each product
        let card = document.createElement('div');
        card.classList.add("card", product.category);

        // creating a container to fill the image
        let imgContainer = document.createElement("div");
        imgContainer.classList.add("image-container")

        // Adding image
        let image = document.createElement("img");
        image.setAttribute("src", product.image);
        image.setAttribute("alt", product.name);
        imgContainer.appendChild(image);
        card.appendChild(imgContainer);

        // Creating another container to store my product details
        let container = document.createElement("div");
        container.classList.add("container");

        // Adding name for the given products
        let name = document.createElement("h5");
        name.classList.add("product-name");
        name.innerText = product.name.toUpperCase();
        container.appendChild(name);

        // Adding price for the given products
        let price = document.createElement("h6");
        price.classList.add("product-price");
        price.innerText = "Rs " + product.price;
        container.appendChild(price);

        // Adding quantity to the products
        let quantity = document.createElement("label");
        quantity.innerText = "Quantity: ";

        let inputQuantity= document.createElement("input");
        inputQuantity.classList.add("input-quantity");
        inputQuantity.setAttribute("type","number");
        inputQuantity.setAttribute("max","50");
        inputQuantity.setAttribute("min","1");
        inputQuantity.setAttribute("value","1");

        quantity.appendChild(inputQuantity);
        container.append(quantity);
        
        card.appendChild(container)

        // Connecting the card to relevent Fieldset
        let medicineContainer = document.getElementById(product.category + "-products"); 
        medicineContainer.appendChild(card);

        // quantity change
        inputQuantity.addEventListener("change", () => {
            storeFavouritesTable(product, inputQuantity.value, product.price);
        });
    }
}

// Function to add the products to table while increasing or decreasing the quantity
function storeFavouritesTable(product, quantity, price) {
    const favoritesList = document.getElementById("favoritesList");

    // Calculating the total price
    let priceVal = parseFloat(product.price.replace("Rs ",""));
    let totalPrice = priceVal * parseInt(quantity);

    // Updating the row  for product
    let existingRow = document.getElementById(product.name.toLowerCase());

    if (existingRow) {
        existingRow.querySelector(".cell-quantity").innerText = quantity;
        existingRow.querySelector(".total-price-cell").innerText = "Rs " + totalPrice;
    } else {
        // creating a row when the product is empty in table
        let row = document.createElement("tr");
        row.id = product.name.toLowerCase();

        // Product name
        let cellName =  document.createElement("td");
        cellName.innerText =  product.name;
        row.appendChild(cellName);

        // Quantity
        let cellQuantity =  document.createElement("td");
        cellQuantity.classList.add("cell-quantity");
        cellQuantity.innerText = quantity;
        row.appendChild(cellQuantity);

        // Total price of all products
        let cellTotalPrice =  document.createElement("td");
        cellTotalPrice.classList.add("total-price-cell");
        cellTotalPrice.innerText = "Rs " + totalPrice;
        row.appendChild(cellTotalPrice);

        favoritesList.appendChild(row);
    }

    // Updating the final total amount
    updateCalctotal();

    // Saveing them to local storage
    saveLocalStorage();
}

// Function to save the table details to local storage
function saveLocalStorage(){
    const favs = [];
    const rows = document.querySelectorAll("#favoritesList tr");

    rows.forEach((row) => {
        const product = row.querySelector("td").innerText;
        const quantity = row.querySelector(".cell-quantity").innerText;
        const totalPrice = row.querySelector(".total-price-cell").innerText;

        favs.push({ name: product, quantity: parseInt(quantity), totalPrice: totalPrice });
    });

    localStorage.setItem("favs",JSON.stringify(favs));
}

// function to update the final total
function updateCalctotal(){
    const rows = document.querySelectorAll("#favoritesList tr");
    let calctotal = 0;

    rows.forEach((row) => {
        let totalPrice = parseFloat(row.querySelector(".total-price-cell").innerText.replace("Rs ",""));
        calctotal += totalPrice;
    });

    document.getElementById("calctotal").innerText = "Rs " + calctotal.toFixed(2);
}

// Function to save the table details to local storage
function addTofavourites(){
    const favs = [];
    const rows = document.querySelectorAll("#favoritesList tr");

    rows.forEach((row) => {
        const product = row.querySelector("td").innerText;
        const quantity = row.querySelector(".cell-quantity").innerText;
        const totalPrice = row.querySelector(".total-price-cell").innerText;

        favs.push({ name: product, quantity: parseInt(quantity), totalPrice: totalPrice});
    });

    localStorage.setItem("favs", JSON.stringify(favs));
    alert("Added to favourites!");
}

// Function to load the table through local storage and display on the table
document.querySelector(".applyToFavorites").addEventListener("click", () => {
    applyingFavourites();
    alert("Favourites have been added!")
})

function applyingFavourites(){
    const favs = JSON.parse(localStorage.getItem("favs")) || [];
    const favoritesList = document.getElementById("favoritesList");

    favoritesList.innerHTML = "";

    favs.forEach((fav) => {
        let row = document.createElement("tr");

        // product name
        let cellName = document.createElement("td");
        cellName.innerText = fav.name;
        row.appendChild(cellName);

        // Quantity
        let cellQuantity = document.createElement("td");
        cellQuantity.classList.add("cell-quantity");
        cellQuantity.innerText = fav.quantity;
        row.appendChild(cellQuantity);

        // Total price
        let cellTotalPrice = document.createElement("td");
        cellTotalPrice.classList.add("total-price-cell");
        cellTotalPrice.innerText = fav.totalPrice;
        row.appendChild(cellTotalPrice);

        favoritesList.appendChild(row);
    });

    // Updating the final total amount
    updateCalctotal();
}

// Function to clear the favourites from  the table
document.querySelector(".clearFavorites").addEventListener("click", () => {
    clearingFavourites();
    alert("Favourites have been cleared!")
})

function clearingFavourites(){
    localStorage.removeItem("favs");
    document.getElementById("favoritesList").innerHTML = "";
    document.getElementById("calctotal").innerText = "Rs 0";
}

// Function to check whether the table is filled
// So that the buynow button works
function validatingorder(){
    const favoritesList = document.getElementById('favoritesList');
    if (favoritesList.children.length === 0 ) {
        alert("Error! You haven't added any products to purchase!")
    }
    else{
        window.location.href = "checkout.html";
    }
}

// Geting the ordered data for checkout page
function getOrderData() {
    const rows = document.querySelectorAll("#favoritesList tr");
    const order = [];

    rows.forEach((row) => {
        const product = row.querySelector("td").innerText;
        const quantity = row.querySelector(".cell-quantity").innerText;
        const totalPrice = row.querySelector(".total-price-cell").innerText;

        order.push({ name: product, quantity: quantity, totalPrice: totalPrice });
    });

    return order;
}

document.querySelector(".addToFavorites").addEventListener("click", addTofavourites);
document.querySelector(".applyToFavorites").addEventListener("click", applyingFavourites);
document.querySelector(".clearFavorites").addEventListener("click", clearingFavourites);


// Filter search
function filterProduct(value){
    let buttons = document.querySelectorAll('.button-value');
    buttons.forEach((button) => {
        if (value.toUpperCase() == button.innerHTML.toUpperCase()) {
            button.classList.add("active");
        }
        else{
            button.classList.remove("active");
        }
    });
    
    // hiding and diplaying products based on category
    let Fieldsets= document.querySelectorAll('fieldset');
    Fieldsets.forEach((Fieldset) => {
        if (value==="All" || Fieldset.id.toLowerCase() === value.toLowerCase()) {
            Fieldset.style.display = "block";
        } else {
            Fieldset.style.display = "none";
        }
    })
}

// Search button
document.addEventListener('DOMContentLoaded', function(){
    var searchButton = document.getElementById("search");
    if(searchButton){
        searchButton.addEventListener("click", () => {
            let searchInput= document.getElementById("search-input").value.toLowerCase();
            let elements= document.querySelectorAll(".product-name");
            let cards= document.querySelectorAll(".card");

            // Displaying all if search-input is empty
            if(!searchInput.trim()){
                cards.forEach((card) => card.classList.remove("hide"));
                return;
            }

            // Looping through all elements
            elements.forEach((element, index) => {
                if (element.innerText.toLowerCase().includes(searchInput)) {
                    cards[index].classList.remove("hide");
                } else {
                    cards[index].classList.add("hide");
                }
            });
        });
    }
});

// Making the products visible when the page is loaded
document.addEventListener('DOMContentLoaded',() => {
    filterProduct("All");
})

// Calling the function to display the fetched products
getdata();