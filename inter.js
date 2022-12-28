// get element from html by their id ,name

let form = document.getElementById("form");
let nom = document.getElementById("nom");
let marque = document.getElementById("marque");
let prix = document.getElementById("price");
let descoint = document.getElementsByName("radio");
let date = document.getElementById("date");
let type = document.getElementById("type");
let mis1 = document.querySelector(".mis1");
let Ajouter = document.getElementById("btn");
var promo;
const tableBody = document.querySelector("#productsdetails tbody");
const contIdEdit = document.getElementById("contIdEdit");
var arrow = [];

// validation the inputs
function checkinputs() {
  arrow.length = 0;
  let nomValue = nom.value;
  let marValue = marque.value;
  let prixValue = prix.value;
  let dateValue = date.value;
  let typvalue = type.value;
  let table = [
    nomValue,
    marValue,
    prixValue,
    dateValue,
    typvalue,
    promocheck(),
  ];
  if (nomValue === "") {
    setErrorFor(nom, "nom is required");
  } else if (nomValue.length < 3 || nomValue.length > 30) {
    setErrorFor(nom, "nom is invalid");
  } else {
    setSuccessFor(nom, "GREAT!!!!");
    arrow.push(true);
  }
  if (marValue === "") {
    setErrorFor(marque, "marque is required");
  } else if (marValue.length < 3 || marValue.length > 30) {
    setErrorFor(marque, "marque is invalid");
  } else {
    setSuccessFor(marque, "GREAT!!!");
    arrow.push(true);
  }
  if (prixValue == "") {
    setErrorFor(prix, "prix is required");
  } else {
    setSuccessFor(prix, "GREAT!!!");
    arrow.push(true);
  }
  if (dateValue == "") {
    setErrorFor(date, "Date is required");
  } else {
    setSuccessFor(date, "GREAT!!!");
    arrow.push(true);
  }
  if (typvalue == "") {
    setErrorFor(type, "choose one");
  } else {
    setSuccessFor(type, "GREAT!!!");
    arrow.push(true);
  }

  if (descoint[0].checked) {
    mis1.innerHTML = "GREAT!!!";
    arrow.push(true);
    mis1.style.color = "green";
    promo = document.getElementById("OUI").value;
  } else if (descoint[1].checked) {
    arrow.push(true);
    mis1.innerHTML = "Great!!!";
    mis1.style.color = "green";

    promo = document.getElementById("NON").value;
  } else {
    mis1.innerHTML = "Choose one";
    mis1.style.color = "red";
  }
  return table;
}

function setErrorFor(input, message) {
  let formControl = input.parentElement;
  let small = formControl.querySelector("small");
  formControl.className = "inputbox-error";
  small.innerHTML = message;
}
function setSuccessFor(input, message) {
  let formControl = input.parentElement;

  let samp = formControl.querySelector("small");

  formControl.className = "inputbox-success";
  samp.innerHTML = message;
}

function promocheck() {
  for (let i = 0; i < descoint.length; i++) {
    if (descoint[i].checked) {
      return descoint[i].value;
    }
  }
}

//  function to add informations in the table if we clic in ajout button
Ajouter.onclick = function addinformation() {
  if (Ajouter.value === "Ajouter") {
    // for the reset form
    arrow.length = 0;
    checkinputs();
    //  check if the inputs are valide befor the continuation the process
    if (arrow.length != 6) {
      arrow.length = 0;
    } else {
      // give the id a random number to get the exact  target in the table

      let id = Math.floor(Math.random() * 1000000);

      const newProd = new Product(
        id,nom.value,prix.value,marque.value,date.value,type.value,promo
      );

      //  called the class and show the data and storej the data
      newProd.showData().storeProduct();
      nom.value = "";
      prix.value = "";
      marque.value = "";
      date.value = "";
      type.value = "";
      descoint[0].checked = descoint[0].unchecked;
      descoint[1].checked = descoint[1].unchecked;
    }
    //  change the button  vlue from ajouter to modifier
  } else if (Ajouter.value === "Modifier") {
    arrow.length = 0;
    checkinputs();
    if (arrow.length != 6) {
      arrow.length = 0;
      checkinputs();
    } else {
      document.getElementById("btn").value = "Ajouter";

      var id = contIdEdit.value;
      const newProd = new Product(
        id, nom.value, prix.value, marque.value, date.value, type.value, promo
      );

      newProd.updateProduct(id);
      tableBody.innerHTML = "";
      Product.showAllProducts();
      nom.value = "";
      prix.value = "";
      marque.value = "";
      date.value = "";
      type.value = "";
      descoint[0].checked = descoint[0].unchecked;
      descoint[1].checked = descoint[1].unchecked;
    }
  }
};

class Product {
  constructor(id, nom, prix, marque, date, type, promo) {
    this.id = id;
    this.nom = nom;
    this.prix = prix;
    this.marque = marque;
    this.date = date;
    this.type = type;
    this.promo = promo;
  }
  showData() {
    Product.showHtml(
      this.id,
      this.nom,
      this.prix,
      this.marque,
      this.date,
      this.type,
      this.promo
    );
    return this;
  }

  storeProduct() {
    const allData = JSON.parse(localStorage.getItem("products")) ?? [];
    allData.push({
      id: this.id,
      nom: this.nom,
      prix: this.prix,
      marque: this.marque,
      date: this.date,
      type: this.type,
      promo: this.promo,
    });

    localStorage.setItem("products", JSON.stringify(allData));
  }
  static showAllProducts() {
    if (localStorage.getItem("products")) {
      JSON.parse(localStorage.getItem("products")).forEach((item) => {
        Product.showHtml(
          item.id,
          item.nom,
          item.prix,
          item.marque,
          item.date,
          item.type,
          item.promo
        );
      });
    }
  }

  updateProduct(id) {
    const newItem = {
      id: id,
      nom: this.nom,
      prix: this.prix,
      marque: this.marque,
      date: this.date,
      type: this.type,
      promo: this.promo,
    };
    const updateData = JSON.parse(localStorage.getItem("products")).map(
      (item) => {
        if (item.id == id) {
          return newItem;
        }
        return item;
      }
    );
    localStorage.setItem("products", JSON.stringify(updateData));
  }

  static showHtml(id, nom, prix, marque, date, type, promo) {
    const trEl = document.createElement("tr");
    trEl.innerHTML = `
              <tr  role='row'>
              <td>${nom}</td>
              <td>${prix}</td>
              <td>${marque}</td>
              <td>${date}</td>
              <td>${type}</td>
              <td>${promo}</td>
                  <td>
                      <button   class="btn btn-info edit" data-id="${id}">Edit</button>
                      <button  class="btn btn-danger delete" data-id="${id}">Delete</button>
                  </td>
              </tr>
          `;
    tableBody.appendChild(trEl);
  }
}

Product.showAllProducts();
tableBody.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    const id = +e.target.getAttribute("data-id");
    const Prods = JSON.parse(localStorage.getItem("products"));
    const newData = Prods.filter((el) => el.id != +id);
    localStorage.setItem("products", JSON.stringify(newData));
    e.target.parentElement.parentElement.remove();
  }
  if (e.target.classList.contains("edit")) {
    const id = e.target.getAttribute("data-id");
    const mainItem = JSON.parse(localStorage.getItem("products")).find(
      (item) => item.id == id
    );

    // stocke the id of each row in this id
    contIdEdit.value = id;
    nom.value = mainItem.nom;
    prix.value = mainItem.prix;
    marque.value = mainItem.marque;
    date.value = mainItem.date;
    type.value = mainItem.type;

    if (mainItem.promo === "oui") {
      document.getElementById("OUI").checked = true;
    } else {
      document.getElementById("NON").checked = true;
    }

    document.getElementById("btn").value = "Modifier";
  }
});
