const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const catagoryName = urlParams.get("catagory");

let titleAreaEl = document.getElementById("title-area");
let catagoryData = catagories.filter(catagoryInfo => catagoryInfo.name == catagoryName)[0];
let titleEl = document.createElement("h2");
let descEl = document.createElement("p");
titleEl.innerText = catagoryData.displayName;
descEl.innerText = catagoryData.desc;

titleAreaEl.appendChild(titleEl);
titleAreaEl.appendChild(descEl);

function sortDate(a, b) {
    console.log(a,b);
    let dateA = a.date;
    let dateB = b.date;

    if (dateA == undefined){
        dateA = new Date();
    }
    if (dateB == undefined){
        dateB = new Date();
    }

    return dateB - dateA;
}

catagoryData.files.sort(sortDate);
let fileListEl = document.getElementById("file-list");

for (let file of catagoryData.files) {
    let parentEl = document.createElement("li");
    let nameEl = document.createElement("h3");
    let descEl = document.createElement("p");

    console.log(catagoryData.default_name);
    const name = file.name || catagoryData.default_name;
    let date = file.date || "Predates Website";
    if (date != "Predates Website") {
        date = file.date.toDateString();
    }
    const description = file.desc || "No description logged.";
    const filename = catagoryName + "/" + file.filename;
    const fileType = (file.type || catagoryData.type);

    nameEl.innerHTML = name;
    descEl.innerHTML = `Date: ${date}<br>${description}`;

    parentEl.appendChild(nameEl);
    parentEl.appendChild(descEl);
    
    if (fileType == "mp3") {
        let audioEl = document.createElement("audio");
        let songEl = document.createElement("source");
        audioEl.setAttribute("controls", "true");
        songEl.setAttribute("src", filename);
        songEl.setAttribute("type","audio/mp3");
        audioEl.appendChild(songEl);
        parentEl.appendChild(audioEl);
    }
    else if (fileType == "download") {
        let downloadEl = document.createElement("a");
        downloadEl.setAttribute("href", filename);
        downloadEl.setAttribute("download", "");
        downloadEl.innerText = filename.split("/")[1];
        parentEl.appendChild(downloadEl);
    }
    fileListEl.appendChild(parentEl);
    //alert(name + date + description + filename);jj
    /*
your not the sigma gigachad
bro your selling the whole company
you say your cooking. you're cooking who? noone.
    */
}

/*
Dan the Man
Benjamin the Baker

Floor 5 - 13
Murray*/