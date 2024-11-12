// DOM Elements
const model = document.querySelector(".model");
const createNewUser = document.querySelector("#create-new-user");
const modelForm = document.querySelector(".model-form");
const allbuttons = modelForm.querySelectorAll("button");
const allInputes = document.querySelectorAll("input");
const tableBody = document.querySelector(".table-body");

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

  let checkEmail = modelFormData.find(
    (data) => data.email === allInputes[2].value
  );

  if (checkEmail === undefined) {
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
const displayUserData = () => {
  tableBody.innerHTML = "";
  modelFormData.forEach((user, idx) => {
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
        displayUserData();
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
        displayUserData();
      };
    });
  });
};

displayUserData();

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
