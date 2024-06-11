console.log(catagories);

for (let catagory of catagories) {
    let catagoryButton = document.createElement("button");
    let name = catagory.name
    catagoryButton.innerHTML = catagory.name;
    catagoryButton.onclick = function () {
        window.open("catagory.html?catagory=" + name);
    };

    document.getElementById("catagory-buttons").appendChild(catagoryButton);
}