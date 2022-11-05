//**************************************************************************** */
canvas.addEventListener('mouseover', canvas_mouseover);
canvas.addEventListener('mouseout', canvas_mouseout);
let ModelsArray = [];

ModelsArray = LoadMap(engine, scene, assetsManager);
console.log(ModelsArray);

/*var mat1 = new BABYLON.StandardMaterial("green", scene);
mat1.diffuseColor = new BABYLON.Color3.Green();
ground.material = mat1;*/

function canvas_mouseover() {
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
}

function canvas_mouseout() {
    document.getElementsByTagName('body')[0].style.overflow = 'visible';
}
//**************************************************************************** */

function FindByName(name) {
    for (let i = 0; i < ModelsArray.length; i++) {
        if (ModelsArray[i]['ModelName'] == name)
            return i;
    }
    return null;
}

function SelectModel(mesh)
{
  var mat = new BABYLON.StandardMaterial("blue", scene);
  mat.diffuseColor = new BABYLON.Color3.Blue();
  mesh.material = mat;
}

async function BuildWay(Way) {
    for (let j = 0; j < Way.length; j++) {
        let myPoints = [];
        for (let i = 0; i < Way[j]['path'].length; i++) {
            const response = await fetch("/api/points/did/" + Way[j]['path'][i], {
                method: "GET",
            });
            if (response.ok === true) {
                const point = await response.json();
                let num = FindByName(point['name']);
                myPoints[i] = new BABYLON.Vector3(
                    ModelsArray[num]['ModelMesh'].position['_x'],
                    ModelsArray[num]['ModelMesh'].position['_y'],
                    ModelsArray[num]['ModelMesh'].position['_z']
                )
                if(i == 0 || i == Way[j]['path'].length-1)
                {
                    SelectModel(ModelsArray[num]['ModelMesh']);
                }
                else
                {
                    let sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {});
                    sphere.position = new BABYLON.Vector3(
                        ModelsArray[num]['ModelMesh'].position['_x'],
                        ModelsArray[num]['ModelMesh'].position['_y'] + 10,
                        ModelsArray[num]['ModelMesh'].position['_z']
                    )
                    SelectModel(sphere);
                }               
                console.log(myPoints);

            }
            // let myPoints = [
            //     new BABYLON.Vector3(0, 0, 0),
            //     new BABYLON.Vector3(50, 0, 60),
            //     new BABYLON.Vector3(100, 0, 200),
            // ];
        }
        let color = [new BABYLON.Color4(1, 0, 0, 1)];
        const options = {
            points: myPoints, //vec3 array,
            updatable: true
            //        colors: color
        }
        let lines = BABYLON.MeshBuilder.CreateLines("lines", options, scene);
    }
}

async function GetTheRoute() {
    console.log("запрос на построение");
    console.log();

    let S = JSON.stringify({
        age: document.getElementById("age").value,
        count: document.getElementById("count").value,
        time: document.getElementById("time").value,
        budget: document.getElementById("budget").value,
        walk: document.getElementById("walk").value,
        sens: document.getElementById("sens").value,
        street: document.getElementById("street").value,
        From: document.getElementById("start").value,
        To: document.getElementById("end").value,
        MaxCount: document.getElementById("max").value
    });
    const response = await fetch("/retgr", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: S
    });
    if (response.ok === true) {
        const users = await response.json();
        BuildWay(users);   // Доделать
        console.log(users);
    }
}
let s = document.getElementById("start");
let e = document.getElementById("end");
async function GetAllPoints() {
    const response = await fetch("/api/points", {
        method: "GET",
        headers: { "Accept": "application/json", "Content-Type": "application/json" }
    });
    if (response.ok === true) {
        const users = await response.json();
        for (let i = 0; i < users.length; i++) {
            if (users[i].name != '') {
                s.insertAdjacentHTML("beforeend", `<option value="` + users[i].did + `">` + users[i].did + ": " + users[i].info + `</option>`);
                e.insertAdjacentHTML("beforeend", `<option value="` + users[i].did + `">` + users[i].did + ": " + users[i].info + `</option>`);
            }
        }
        //        console.log(users);
    }
}

GetAllPoints();
