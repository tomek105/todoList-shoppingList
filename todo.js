"use strict" //zapobiega tworzeniu zmiennych globalnych
import debil, { getFullName } from "./userInfo.js"; // *Moduły* importowanie z userInfo.js obiektu 
                                                    // i funkcji. Jeżeli wyexportuje elementy jako
                                                    // default, mogę użyć dowolnej nazwy(debil=user).
                                                    // 

console.log(debil);
console.log(getFullName());

let ul; //wyświetlana lista zadań
let todoForm; // formularz do wpisywania zadań z opisami
let todoList; // = []; //tablica przechowująca obiekty "todo"

document.addEventListener("DOMContentLoaded", () => {
    //Przechywytwanie listy zadań, formularzu oraz pól typu Error z Html 
    ul = document.getElementById("todoList");
    todoForm = document.getElementById("todoForm");
    let todoNameError = document.getElementById("todoNameError");
    let todoDescError = document.getElementById("todoDescError");
    getTodoList();

    todoForm.addEventListener('submit', (event) => { //Głowne działanie formularza todo  w Event Listenerze (nasłuchiwacz zdarzeń np. kliknięcia buttona czyli submit)
        event.preventDefault(); //zapobieganie zachowaniu domyślnemu formularza np. przeładowanie strony przy wciśnięciu submit
        let todoName = event.target.elements[0];
        let todoDesc = event.target.elements[1]; //Nazwa i opis zadania wpisane z formularza, znajdujące się w target.elements pod indeksem 0 i 1

        if (todoName.value.length > 2) {
            todoName.classList.remove("input-danger");
            todoNameError.innerText = "";
        }
        if (todoDesc.value.length > 20) {
            todoDesc.classList.remove("input-danger");
            todoDescError.innerText = "";
        }
        if (todoName.value.length > 2 && todoDesc.value.length > 20) {
            let newTodo = {
                name: todoName.value, //Warunek sprawdzający czy nazwa zadania i opis są poprawne(ilosc znakow), jeśli tak to tworzony jest obiekt todo
                desc: todoDesc.value,
                done: false
            }

            //walidacja, sprawdza dla obiektow todo czy powtarzają się opisy i nazwy. Jeżeli choć jedna rzecz się różni przechodzi dalej       
            for (let todo of todoList) {
                if (todo.name === todoName.value && todo.desc === todoDesc.value) {
                    return;
                }
            }

            todoList.push(newTodo); //dodawanie do tablicy todoList (listy zadań) obiektów todo poprzez nacisnięcie Add w formularzu(submit)
            localStorage.setItem("todoList", JSON.stringify(todoList));

            todoName.value = ""; //Czyszczenie pól do wpisywania nazwy i opisu zadania
            todoDesc.value = "";

            renderList(); ///funkcja tworząca listę zadań
        } else {
            //walidacja poprawności wpisanych danych
            if (todoName.value.length < 3) {
                todoName.classList.add("input-danger");
                todoNameError.innerText = "Nazwa jest za krótka(>3 znaki)";
            }
            if (todoDesc.value.length < 20) {
                todoDesc.classList.add("input-danger");
                todoDescError.innerText = "Opis jest za krótki(>20 znaków)";
            }
        }
    })
})
const renderList = () => {
    let liList = Array.from(ul.getElementsByTagName("li")); // tablica przypisana liList getElementsByTagName to nie jest typowa tablica, więc musimy ją przekonwertować
    liList.forEach((li) => {
        let button = li.getElementsByTagName("button")[0]; //Operacje poprawiające wydajnośc aplikacji, gdy używamy dużo eventlistenerów. Usuwanie Event listenerów dla poprzednich "wciśnięć statusu wykonania zadania"
        button.removeEventListener("click", changeTaskStatus);
    })

    ul.innerHTML = ""; //wyczyszczenie listy z poprzednich elementów przed dodaniem nowego(inaczej będą dodawane na okrągło te stare!)

    todoList.forEach((todo, index) => { //petla foreach dla kazdego obiektu todo z listy todolist pobiera index tablicy,
        let li = document.createElement('li'); //tworzenie pojedynczego wiersza w liscie(zadania)
        li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center"); //style bootstrapowe dla wygladu pojedynczego wiersza

        let main = document.createElement("main"); //Tworzenie  diva 'main', ktory zawiera w sobie heading <h5>(nazwa zadania) oraz paragraf <p>(opis zadania)
        let div = document.createElement("div"); //Tworzenie  diva zawierającego w sobie buttony 
        let heading = document.createElement("h5");
        let paragraph = document.createElement("p");
        let button = document.createElement("button"); //Tworzenie buttona, ktory zmienia swoj opis i wyglad zaleznie od statusu zadania
        let removeButton = document.createElement("button"); //Tworzenie buttona, ktorym można usunąć element listy

        button.addEventListener("click", changeTaskStatus); //nasluchiwacz klikniecia przycisku
        button.dataset.taskId = index; //tworzenie datasetu dla pojedynczego wcisniecia przycisku przechowujacego jako taskId index z tablicy todoList aktualnego zadania todo

        removeButton.addEventListener("click", removeTask); //nasluchiwacz klikniecia przycisku
        removeButton.dataset.taskId = index; // dataset dla buttona remove,
        removeButton.innerText = "remove";
        removeButton.classList.add("btn", "btn-secondary", "btn-sm")
        removeButton.style.marginLeft = "5px"

        //walidacja wygladu button zaleznie od statusu
        if (!todo.done) {
            button.innerText = "finish";
            button.classList.add('btn', 'btn-success', 'btn-sm')
        } else {
            button.innerText = "revert";
            button.classList.add('btn', 'btn-danger', 'btn-sm')
            main.style.textDecoration = "line-through";
            li.style.background = "gray";
        }

        heading.innerText = todo.name; //przypisanie do h5 oraz p nazwy zadania oraz opisu wklepanego w formularzu
        paragraph.innerText = todo.desc;

        main.appendChild(heading); //dodanie jako dzieci do diva main heading i paragrafu    
        main.appendChild(paragraph);
        div.appendChild(button);
        div.appendChild(removeButton);

        li.appendChild(main); //dodanie jako dzieci main oraz button do pojedynczego wierszu z listy 
        li.appendChild(div);

        ul.appendChild(li); //dodanie jako dziecko pojedynczego wiersza listy do listy
    })
}
//funkcja zmieniajaca status zadania 
const changeTaskStatus = (event) => {
    let todo = todoList[Math.round(event.target.dataset.taskId)]; // obiektem todo jest obiekt przynalezny do indeksu listy(taksId to indeks)
    if (todo.done === true) {
        todo.done = false;
    } else { //zmiana stanu przycisku z finish na revert
        todo.done = true;
    }
    renderList();
    localStorage.setItem("todoList", JSON.stringify(todoList));
}

const removeTask = (event) => {
    let todoToRemove = todoList[Math.round(event.target.dataset.taskId)]; //  Obiekt zadania, które ma być usunięte 

    todoList = todoList.filter((todo) => {
        if (todo !== todoToRemove) {
            return true;
        }

    })
    renderList();
    localStorage.setItem("todoList", JSON.stringify(todoList));
}

const getTodoList = () => {
    if (localStorage.getItem("todoList")) {
        todoList = JSON.parse(localStorage.getItem("todoList"));
        renderList()
    } else {
        todoList = []
    }
}