const model = document.querySelector(".model");
const createNewUser = document.querySelector("#create-new-user");

createNewUser.addEventListener("click", () => {
  model.style.display = "flex";
});

model.addEventListener("click", (e) => {
  if (e.target.className === "model") {
    model.style.display = "none";
  }
});
