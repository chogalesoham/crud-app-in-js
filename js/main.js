const model = document.querySelector(".model");
const createNewUser = document.querySelector("#create-new-user");
const modelForm = document.querySelector(".model-form");
const allInputes = document.querySelectorAll("input");
const tableBody = document.querySelector(".table-body");

// toggle a model
createNewUser.addEventListener("click", () => {
  model.style.display = "flex";
});

model.addEventListener("click", (e) => {
  if (e.target.className === "model") {
    model.style.display = "none";
  }
});

let modelFormData = [];
let profileUrl = "";

if (localStorage.getItem("FormData") != null) {
  modelFormData = JSON.parse(localStorage.getItem("FormData"));
}

//create a new user
modelForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let checkEmail = modelFormData.find(
    (data) => data.email === allInputes[2].value
  );

  if (checkEmail == undefined) {
    modelFormData.push({
      name: allInputes[1].value,
      email: allInputes[2].value,
      number: allInputes[3].value,
      dob: allInputes[4].value,
      userProfile:
        profileUrl === ""
          ? "http://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Free-Image.png"
          : profileUrl,
      password: allInputes[6].value,
    });
    localStorage.setItem("FormData", JSON.stringify(modelFormData));
    swal("Good job!", "User Created Successfully!", "success");
    modelForm.reset();
    model.style.display = "none";
    displayUserData();
  } else {
    swal("Error", "Email already exists!", "error");
  }
});

//red file inpute
allInputes[5].addEventListener("change", () => {
  const fileReader = new FileReader();
  const file = allInputes[5].files[0];

  if (file) {
    fileReader.readAsDataURL(file);
    fileReader.onload = (e) => {
      profileUrl = e.target.result;
      console.log(profileUrl);
    };
  }
});

// Display User
const displayUserData = () => {
  tableBody.innerHTML = "";
  modelFormData.forEach((user, idx) => {
    tableBody.innerHTML += `
     <tr>
        <td data-label="Sr">${idx + 1}</td>
        <td data-label="Profile">
          <img
          class='user-profile'
            src=${user.userProfile}
          />
        </td>
        <td data-label="Name">${user.name}</td>
        <td data-label="Email">${user.email}</td>
        <td data-label="Mobile">+${user.number}</td>
        <td data-label="Date of Birth">${user.dob}</td>
        <td data-label="Action">
          <button class="add-btn">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="delete-btn">
            <i class="fa-solid fa-trash-can-arrow-up"></i>
          </button>
        </td>
      </tr>`;
  });
};

displayUserData();
