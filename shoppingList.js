let ul;
let newItemForm;
let shoppingList;
document.addEventListener("DOMContentLoaded", () => {
    ul = document.getElementById("shoppingList");
    newItemForm = document.getElementById("newItemForm");
    let inputError = document.getElementById("inputError");
    getShoppingList();

    newItemForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let input = event.target.elements[0];
        if (!input.value.startsWith(" ") && input.value.length > 2) {
            for (let shopItem of shoppingList) {
                if (shopItem === input.value) {
                    return;
                }
            }
            shoppingList.push(input.value);
            localStorage.setItem("shoppingList", JSON.stringify(shoppingList));

            input.value = "";
            input.classList.remove("input-danger");
            inputError.innerText = "";

            renderList();
        } else {
            inputError.innerText = "Nazwa nie spełnia kryteriów";
            input.classList.add("input-danger");
        }

    })
    console.log(shoppingList);
})

const renderList = () => {
    ul.innerHTML = "";

    shoppingList.forEach((shopItem, index) => {
        let li = document.createElement('li');
        let removeButton = document.createElement("button");
        //removeButton.style.visibility = "hidden";
        removeButton.addEventListener("click", removeItem);
        //.addEventListener("mouseover", showButton);            
        
        removeButton.dataset.itemId = index;
        removeButton.innerText = "remove";
        removeButton.classList.add("btn", "btn-secondary", "btn-sm")
        removeButton.style.marginLeft = "5px";
        li.style.marginBottom = "5px";
        

        
        
        li.innerText = shopItem;
        li.appendChild(removeButton);
        ul.appendChild(li);
    })
}
const getShoppingList = () => {
    if (localStorage.getItem("shoppingList")) {
        shoppingList = JSON.parse(localStorage.getItem("shoppingList"));
        renderList()
    } else {
        shoppingList = []
    }
}
const removeItem = (event) => {
    let itemToRemove = shoppingList[Math.round(event.target.dataset.itemId)];
    shoppingList = shoppingList.filter((shopItem) => {
        if (shopItem !== itemToRemove) {
            return true;
        }
    })
    renderList();
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
}
const showButton = () =>{
    removeButton.style.visibility = "visible";
}