/*async function LoadMap(engine, scene, assetsManager, ModelsCollection) {
    let MapFile;
    ModelsCollection = [];
    await fetch('http://localhost:3000/api/models', {
        method: 'GET'
    })
    .then(response => response.text())
    .then((result) => {
        MapFile = JSON.parse(result);
        if (!MapFile)
            return;
        let width = MapFile['SceneWidtch'];
        let height = MapFile['SceneHeight'];
        if (ground)
            ground.dispose();
        ground = new BABYLON.MeshBuilder.CreateGround("ground",
        { width: width, height: height }, scene);
        let array = MapFile['Models'];
        array = JSON.parse(array);
        for (let i = 0; i < array.length; i++) {
            var meshTask = assetsManager.addMeshTask("obj task", "", "/models/", array[i]['ModelName']);
            meshTask.onSuccess = function (task) {
                task.loadedMeshes[0].position = array[i]['Position'];
                task.loadedMeshes[0].rotation = new BABYLON.Vector3( 
                    array[i]['Rotation']['_x'],
                    array[i]['Rotation']['_y'],
                    array[i]['Rotation']['_z'],
                );
                var t = {
                    ModelName: array[i]['ModelName'],
                    ModelMesh:  task.loadedMeshes[0]
                }
                ModelsCollection[i] = t;
            }
            assetsManager.onFinish = function (tasks) {
                engine.runRenderLoop(function () { scene.render(); });
            }            
        }
        assetsManager.load();
    })
    .catch((err) => { console.log(err); return false });
    return ModelsCollection;
}*/

function LoadMap(engine, scene, assetsManager, ground) {
    let MapFile;
    let ModelsCollection = [];
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/models', false);
    xhr.addEventListener("load", function () {
        let result = JSON.parse(xhr.response);
        MapFile = result;
        if (!MapFile)
            return;
        let width = MapFile['SceneWidtch'];
        let height = MapFile['SceneHeight'];
        if (ground)
            ground.dispose();
        ground = new BABYLON.MeshBuilder.CreateGround("ground",
        { width: width, height: height }, scene);
        var matGround = new BABYLON.StandardMaterial("Green", scene);
        matGround.diffuseColor = new BABYLON.Color3.Green();
        ground.material = matGround;
        let array = MapFile['Models'];
        array = JSON.parse(array);
        for (let i = 0; i < array.length; i++) {
            var meshTask = assetsManager.addMeshTask("obj task", "", "/models/", array[i]['ModelName']);
            meshTask.onSuccess = function (task) {
                task.loadedMeshes[0].position = array[i]['Position'];
                task.loadedMeshes[0].rotation = new BABYLON.Vector3( 
                    array[i]['Rotation']['_x'],
                    array[i]['Rotation']['_y'],
                    array[i]['Rotation']['_z'],
                );
                var matModel = new BABYLON.StandardMaterial("White", scene);
                matModel.diffuseColor = new BABYLON.Color3.White();
                task.loadedMeshes[0].material = matModel;
                var t = {
                    ModelName: array[i]['ModelName'],
                    ModelMesh:  task.loadedMeshes[0]
                }
                ModelsCollection[i] = t;
            }
            assetsManager.onFinish = function (tasks) {
                engine.runRenderLoop(function () { scene.render(); });
            }            
        }
        assetsManager.load();
//        console.log("ответ От check1: " + xhr.response);
    });
    xhr.send();
    return ModelsCollection;
}