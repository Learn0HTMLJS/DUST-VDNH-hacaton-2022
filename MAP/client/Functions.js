function AddModel(vector)
{
  var meshTask = assetsManager.addMeshTask("obj task", "", "../models/", ModelLable.files[0]['name']);
console.log(ModelLable.files[0]['name']);
  meshTask.onSuccess = function (task) {
    task.loadedMeshes[0].position = vector;
    var t = {
      ModelName: ModelLable.files[0]['name'],
      ModelMesh:  task.loadedMeshes[0]
    }
    ModelsArray[countMod] = t;
//    ModelsArray.push(t);
    countMod++;
  }
  assetsManager.onFinish = function (tasks) {
    engine.runRenderLoop(function () { scene.render(); });
  }
  assetsManager.load();
}

function GetModelsList()
{
  let res = [];
console.log(ModelsArray);
  for(let i = 0; i < countMod; i++)
  {
    var t = {
      ModelName: ModelsArray[i]['ModelName'],
      Number: i,
      Position: ModelsArray[i]['ModelMesh'].position,
      Rotation: ModelsArray[i]['ModelMesh'].rotation 
    }
    res[i] = t;
  } 
  return res;
}

function AddModelCancel()
{
  ModelAdding = false;
  Add_model_button.style.backgroundColor = 'white';
}

function SelectModel(mesh, vect)
{
  SelectedModel = mesh;
  ModelMooving = true;
  var mat = new BABYLON.StandardMaterial("blue", scene);
  mat.diffuseColor = new BABYLON.Color3.Blue();
  SelectedModel.material = mat;
  CurrentXpos.value = SelectedModel.position.x;
  CurrentYpos.value = SelectedModel.position.z;
  CurrentZpos.value = SelectedModel.position.y;
  CurrentXrot.value = 180 / Math.PI * SelectedModel.rotation.x;
  CurrentYrot.value = 180 / Math.PI * SelectedModel.rotation.z;
  CurrentZrot.value = 180 / Math.PI * SelectedModel.rotation.y;
}

function ModelMove(vect)
{
//  SelectedModel.position = vect;
  SelectedModel.position.x = vect.x;
  SelectedModel.position.z = vect.z;
  CurrentXpos.value = vect.x;
  CurrentYpos.value = vect.z;
  CurrentZpos.value = vect.y;
}

function ModelManipulationEnd()
{
  var mat2 = new BABYLON.StandardMaterial("gray", scene);
  mat2.diffuseColor = new BABYLON.Color3.Gray();
  SelectedModel.material = mat2;
  SelectedModel = null;
  ModelMooving = false;
  CurrentXpos.value = 0;
  CurrentYpos.value = 0;
  CurrentZpos.value = 0;
  CurrentXrot.value = 0;
  CurrentYrot.value = 0;
  CurrentZrot.value = 0;
}