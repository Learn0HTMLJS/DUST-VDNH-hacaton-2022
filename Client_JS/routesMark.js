window.RoutesBox = document.getElementById("choose");
let mymarkinput = document.getElementById("mymark");
let path1 = document.getElementById("PATH1");
let path2 = document.getElementById("PATH2");
let block1 = document.getElementById("block1");
let butt1 = document.getElementById("butt1");

function Reset(){
    window.RoutesBox.style.visibility = 'visible';
    butt1.style.visibility = 'visible';
    path1.style.visibility = 'hidden';
    block1.style.visibility = 'hidden';
    path2.style.visibility = 'hidden';
}

function Choose() {
    window.RoutesBox.style.visibility = 'hidden';
    butt1.style.visibility = 'hidden';
    path1.style.visibility = 'visible';
    block1.style.visibility = 'visible';
    path1.textContent = "Путь: " + window.LastWays[window.RoutesBox.value].path;
   
}

async function MyMark() {
    console.log(window.LastWays[window.RoutesBox.value].path);
    let S = JSON.stringify({
        Path: window.LastWays[window.RoutesBox.value].path,
        Change: mymarkinput.value
    });

    const response = await fetch("/setj", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: S
    });
    if (response.ok === true) {
        path2.style.visibility = 'visible';
        block1.style.visibility = 'hidden';
    }
}
