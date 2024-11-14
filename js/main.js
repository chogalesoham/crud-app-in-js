// DOM Elements
const model = document.querySelector(".model");
const createNewUser = document.querySelector("#create-new-user");
const modelForm = document.querySelector(".model-form");
const allbuttons = modelForm.querySelectorAll("button");
const allInputes = document.querySelectorAll("input");
const tableBody = document.querySelector(".table-body");
const searchInput = document.querySelector("#search-input");
const deleteAllButton = document.querySelector(".delete-all-button");
const paginationButtons = document.querySelector(".pagination__buttons");
const btnLeft = document.querySelector(".pagination__btn-left");
const btnRight = document.querySelector(".pagination__btn-right");

// Toggle Model
createNewUser.addEventListener("click", () => {
  model.style.display = "flex";
  allbuttons[0].disabled = true; // Update button
  allbuttons[1].disabled = false; // Create button
});

model.addEventListener("click", (e) => {
  if (e.target.className === "model") {
    model.style.display = "none";
    modelForm.reset();
    allbuttons[0].disabled = true;
    allbuttons[1].disabled = false;
  }
});

let modelFormData = [];
let profileUrl = "";

// Initialize modelFormData from localStorage
if (localStorage.getItem("FormData") != null) {
  modelFormData = JSON.parse(localStorage.getItem("FormData"));
}

// Create a new user
modelForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Check if email already exists in modelFormData
  let checkEmail = modelFormData.find(
    (data) => data.email === allInputes[2].value
  );

  if (!checkEmail) {
    // Add new user data to modelFormData array
    modelFormData.push({
      name: allInputes[1].value,
      email: allInputes[2].value,
      number: allInputes[3].value,
      dob: allInputes[4].value,
      userProfile:
        profileUrl === ""
          ? "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
          : profileUrl,
      password: allInputes[6].value,
    });

    // Try to store updated data in localStorage
    try {
      localStorage.setItem("FormData", JSON.stringify(modelFormData));
      swal("Good job!", "User Created Successfully!", "success");
      modelForm.reset();
      model.style.display = "none";
      displayUserData(0, 5);
      pagination();
    } catch (error) {
      if (error.name === "QuotaExceededError") {
        swal(
          "Error",
          "Storage limit exceeded. Unable to save user data.",
          "error"
        );
        console.error("QuotaExceededError: ", error);
      } else {
        swal("Error", "An unexpected error occurred.", "error");
        console.error("Unexpected error: ", error);
      }
    }
  } else {
    // Email already exists
    swal("Error", "Email already exists!", "error");
  }
});

// File input change handler
allInputes[5].addEventListener("change", () => {
  const fileReader = new FileReader();
  const file = allInputes[5].files[0];

  if (file) {
    fileReader.readAsDataURL(file);
    fileReader.onload = (e) => {
      profileUrl = e.target.result;
    };
  }
});

// Display User Data
const displayUserData = (from, to) => {
  const filterData = modelFormData.slice(from, to);
  tableBody.innerHTML = "";
  filterData.forEach((user, idx) => {
    tableBody.innerHTML += `
     <tr>
        <td data-label="Sr">${idx + 1}</td>
        <td data-label="Profile">
          <img class='user-profile' src=${user.userProfile} />
        </td>
        <td data-label="Name">${user.name}</td>
        <td data-label="Email">${user.email}</td>
        <td data-label="Mobile">+${user.number}</td>
        <td data-label="Date of Birth">${user.dob}</td>
        <td data-label="Action">
          <button data='${JSON.stringify(
            user
          )}' index=${idx} id='edit-btn' class="add-btn">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button index=${idx} class="del-btn delete-btn">
            <i class="fa-solid fa-trash-can-arrow-up"></i>
          </button>
        </td>
      </tr>`;
  });

  setupActions();
};

// Delete or Edit User Actions
const setupActions = () => {
  const allDelButtons = tableBody.querySelectorAll(".del-btn");
  allDelButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      let isConfirm = await confirmPopup();
      if (isConfirm) {
        let index = btn.getAttribute("index");
        modelFormData.splice(index, 1);
        localStorage.setItem("FormData", JSON.stringify(modelFormData));
        displayUserData(0, 5);
        pagination();
      }
    });
  });

  const allUpdateButtons = tableBody.querySelectorAll("#edit-btn");
  allUpdateButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      model.style.display = "flex";
      const index = btn.getAttribute("index");
      const finalData = JSON.parse(btn.getAttribute("data"));

      allInputes[1].value = finalData.name;
      allInputes[2].value = finalData.email;
      allInputes[3].value = finalData.number;
      allInputes[4].value = finalData.dob;
      allInputes[6].value = finalData.password;

      // Toggle button states for update mode
      allbuttons[0].disabled = false;
      allbuttons[1].disabled = true;

      // Update the user data on click of the update button
      allbuttons[0].onclick = () => {
        modelFormData[index] = {
          name: allInputes[1].value,
          email: allInputes[2].value,
          number: allInputes[3].value,
          dob: allInputes[4].value,
          userProfile: profileUrl || finalData.userProfile,
          password: allInputes[6].value,
        };
        localStorage.setItem("FormData", JSON.stringify(modelFormData));
        swal("Good job!", "User Updated Successfully!", "success");

        model.style.display = "none";
        allbuttons[0].disabled = true;
        allbuttons[1].disabled = false;
        profileUrl = ""; // Reset profileUrl
        modelForm.reset();
        displayUserData(0, 5);
      };
    });
  });
};

deleteAllButton.addEventListener("click", async () => {
  const conform = await confirmPopup();
  if (conform) {
    modelFormData = [];
    localStorage.removeItem("FormData");
    displayUserData(0, 5);
  }
});

displayUserData(0, 5);

// Confirmation Popup
const confirmPopup = () => {
  return new Promise((resolve) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        resolve(true);
        swal("Poof! Your imaginary file has been deleted!", {
          icon: "success",
        });
      } else {
        resolve(false);
        swal("Your imaginary file is safe!");
      }
    });
  });
};

//Search logic
searchInput.oninput = () => {
  searchUser();
};

const searchUser = () => {
  let value = searchInput.value.toLowerCase();
  let tr = tableBody.querySelectorAll("TR");
  let i;
  for (i = 0; i < tr.length; i++) {
    let allTd = tr[i].querySelectorAll("TD");
    let name = allTd[2].innerHTML;
    let email = allTd[3].innerHTML;
    let phone = allTd[4].innerHTML;
    if (name.toLocaleLowerCase().indexOf(value) != -1) {
      tr[i].style.display = "";
    } else if (email.toLocaleLowerCase().indexOf(value) != -1) {
      tr[i].style.display = "";
    } else if (phone.toLocaleLowerCase().indexOf(value) != -1) {
      tr[i].style.display = "";
    } else {
      tr[i].style.display = "none";
    }
  }
};

//pagination logic
const pagination = () => {
  let length = modelFormData.length / 5;
  if (length.toString().indexOf(".") != -1) {
    length = length + 1;
  }
  let skipData = 0;
  let datalode = 5;
  for (let i = 1; i < length; i++) {
    paginationButtons.innerHTML += `
      <button skip-data='${skipData}' data-lode='${datalode}'  class="pagination__btn">${i}</button>
    `;
    skipData = skipData + 5;
    datalode = datalode + 5;
  }
};
pagination();

const paginationBtn = document.querySelectorAll(".pagination__btn");
paginationBtn.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    controllNextAndPrev(paginationBtn, index);
    for (let el of paginationBtn) {
      el.classList.remove("pagination__btn_active");
    }

    btn.classList.add("pagination__btn_active");
    let skip = btn.getAttribute("skip-data");
    let lode = btn.getAttribute("data-lode");
    displayUserData(skip, lode);
  });
});

// pagination left right button logic

btnRight.onclick = () => {
  let curIndex = 0;
  paginationBtn.forEach((btn, index) => {
    if (btn.classList.contains("pagination__btn_active")) {
      curIndex = index;
    }
  });
  paginationBtn[curIndex + 1].click();
  controllNextAndPrev(paginationBtn, curIndex + 1);
};

btnLeft.onclick = () => {
  let curIndex = 0;
  paginationBtn.forEach((btn, index) => {
    if (btn.classList.contains("pagination__btn_active")) {
      curIndex = index;
    }
  });
  paginationBtn[curIndex - 1].click();
  controllNextAndPrev(paginationBtn, curIndex - 1);
};

const controllNextAndPrev = (paginationBtn, curIndex) => {
  let length = paginationBtn.length - 1;

  if (curIndex === length) {
    btnRight.disabled = true;
    btnLeft.disabled = false;
  } else if (curIndex > 0) {
    btnLeft.disabled = false;
    btnRight.disabled = false;
  } else {
    btnLeft.disabled = true;
    btnRight.disabled = false;
  }
};
