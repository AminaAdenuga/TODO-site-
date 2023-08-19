"use strict";
const iconSun = document.querySelector(".icon-toggle-sun");
const inputValue = document.getElementById("input-input-value");
const formInputContainer = document.querySelector(".form-input-value");
const inputCheckbox = document.querySelector(".input-checkboxes");
const li = document.querySelector(".li");
const liElem = document.querySelector(".liElem");
const bottomLinkMobile = document.querySelector(".bottom-link");
const divLiElem = document.querySelector(".div-li-elem");
const numIndex = document.querySelector(".num-index");
const bottomLinksDesktop = document.querySelector(".bottom-links");
const buttonpara = document.querySelectorAll(".btn");

// LOCALSTORAGE

const listItems = JSON.parse(localStorage.getItem("listItems")) || [];

if (localStorage.getItem("listItems")) {
  listItems.map((listItem) => {
    createListItemAdded(listItem);
  });
}
const mylist = [];
const filterBtns = document.querySelectorAll(".filter_btn");
// toggling moon and sun image and formInputContainer background and inputValue text color
iconSun.addEventListener("click", () => {
  if (iconSun.getAttribute("src") === "./images/icon-moon.svg") {
    iconSun.setAttribute("src", "./images/icon-sun.svg");
  } else {
    iconSun.setAttribute("src", "./images/icon-moon.svg");
  }

  document.body.classList.toggle("body-dark-toggle");
  formInputContainer.classList.toggle("form-dark-toggle");
  inputValue.classList.toggle("input-input-dark-toggle");
  divLiElem.classList.toggle("div-li-elem-dark");
  bottomLinkMobile.classList.toggle("bottom-link-dark-toggle");
  inputValue.focus();
});

// input value submit/enter button
formInputContainer.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputValueValue = inputValue.value;
  if (inputValueValue === "") {
    return;
  }
  const listItem = {
    id: new Date().getTime(),
    name: inputValueValue,
    isCompleted: false,
    status: "active",
  };
  listItems.push(listItem);

  createListItemAdded(listItem);

  inputCheckbox.classList.add("check");
  setTimeout(() => {
    inputCheckbox.classList.remove("check");
  }, 1000);
  localStorage.setItem("listItems", JSON.stringify(listItems));
});

// dynamic generated html
function createListItemAdded(listItem) {
  let liElement = document.createElement("li");
  liElement.setAttribute("id", listItem.id);

  const html = `
 <div class="liElem" id='item_row${listItem.id}'>
 <div class="checkbox-spantext">
 <input onChange="toggleCompleted(${
   listItem.id
 })" type="checkbox" class="input-checkboxes ${
    listItem.isCompleted ? "check" : ""
  }"   id="input-checkbox${listItem.id}"  />
 <span contenteditable="false" id="span_text${listItem.id}" class="${
    listItem.isCompleted ? "completed" : ""
  }"  >${listItem.name} </span>
</div>
<button onclick="removeItem(${listItem.id})" class="remove-btn" id="btn_${
    listItem.id
  }">
   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
   <path
    fill="#494C6B"
    fill-rule="evenodd"
    d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"
    />
   </svg>
 </button>
</div>`;

  liElement.innerHTML = html;
  li.insertAdjacentHTML("afterbegin", liElement.innerHTML);
  formInputContainer.reset();

  countLi();
  reorder(document.querySelector("#reorder_container"));
}

// counter left btn
function countLi() {
  numIndex.textContent = listItems.length;
}

// clear completed btn
const clearCompleted = () => {
  const lis = listItems.filter((list) => {
    return list.isCompleted === true;
  });
  lis.forEach((liss) => {
    let ind = listItems.indexOf(liss);
    listItems.splice(ind, 1);
    const delItem = document.querySelector(`#item_row${liss.id}`);
    delItem.remove();
  });
  countLi();
  localStorage.setItem("listItems", JSON.stringify(listItems));
};

// x button
const removeItem = (id) => {
  listItems.forEach((listItem) => {
    if (listItem.id === id) {
      let ind = listItems.indexOf(listItem);
      listItems.splice(ind, 1);
      const remItem = document.querySelector(`#item_row${id}`);
      remItem.remove();
    }
  });
  countLi();
  localStorage.setItem("listItems", JSON.stringify(listItems));
};

// toggle checkbox
const toggleCompleted = (id) => {
  let inputChecks = document.querySelector(`#input-checkbox${id}`);
  inputChecks.classList.toggle("check");
  const el = document.querySelector(`#span_text${id}`);
  el.classList.toggle("completed");
  listItems.forEach((item) => {
    if (item.id === id) {
      item.isCompleted = !item.isCompleted;
      item.status = item.status === "active" ? "completed" : "active";
    }
  });
  countLi();
  localStorage.setItem("listItems", JSON.stringify(listItems));
};

// js for default todo checkbox
function checked() {
  let inputs = document.getElementById("input-checkbox1");
  inputs.classList.add("check");
  liElem.classList.add("completed");
}
checked();

// drag and drop js
function reorder(target) {
  target.classList.add("reorder");
  let lists = target.getElementsByClassName("liElem");
  let currentList = null;

  for (let list of lists) {
    list.draggable = true;
    list.ondragstart = (e) => {
      currentList = list;
      for (let otherListItems of lists) {
        otherListItems != currentList && otherListItems.classList.add("hint");
      }
    };
    list.ondragenter = (e) => {
      list != currentList && list.classList.add("active");
    };
    list.ondragleave = () => {
      list.classList.remove("active");
    };
    list.ondragend = () => {
      for (let otherListItems of lists) {
        otherListItems.classList.remove("hint");
        otherListItems.classList.remove("active");
      }
    };
    list.ondragover = (e) => e.preventDefault();

    list.ondrop = (e) => {
      e.preventDefault();
      if (list != currentList) {
        let currentpos = 0,
          droppedpos = 0;
        for (
          let otherListItems = 0;
          otherListItems < lists.length;
          otherListItems++
        ) {
          if (currentList == lists[otherListItems]) {
            currentpos = otherListItems;
          }
          if (list == lists[otherListItems]) {
            droppedpos = otherListItems;
          }
        }
        if (currentpos < droppedpos) {
          list.parentNode.insertBefore(currentList, list.nextSibling);
        } else {
          list.parentNode.insertBefore(currentList, list);
        }
      }
    };
  }
}

const filter = () => {
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target = e.currentTarget.dataset.id;

      listItems.forEach((list) => {
        if (target === list.status) {
          document.querySelector(`#item_row${list.id}`).style.display = "flex";
        } else if (target === "all") {
          document.querySelector(`#item_row${list.id}`).style.display = "flex";
        } else {
          document.querySelector(`#item_row${list.id}`).style.display = "none";
        }
      });
    });
  });

  countLi();
  localStorage.setItem("listItems", JSON.stringify(listItems));
};

filter();
