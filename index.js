let catagoriesContainer = document.getElementById("catagories");

for (let catagory of catagories) {
    let container = document.createElement("li");
    let titleEl = document.createElement("h2");
    titleEl.innerHTML = `<a href = "catagory.html?catagory=${catagory.name}">${catagory.displayName}</a>`;
    let descEl = document.createElement("h4");
    descEl.innerText = catagory.desc;

    container.appendChild(titleEl);
    container.appendChild(descEl);

    document.getElementById("catagories").appendChild(container);
}