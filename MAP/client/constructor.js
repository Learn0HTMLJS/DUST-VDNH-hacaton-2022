let Add_scene_button = document.getElementById('ADD_SCENE');
Add_scene_button.addEventListener('click', ADD_SCENE_Click);
let Add_model_button = document.getElementById('ADD_MODEL');
Add_model_button.addEventListener('click', ADD_MODEL_Click);
let Create_file_button = document.getElementById('CREATE_MAP_FILE');
Create_file_button.addEventListener('click', Create_file_button_Click);
let SET_COORDINATE_button = document.getElementById('SET_COORDINATE');
SET_COORDINATE_button.addEventListener('click', SET_COORDINATE_button_Click);
document.getElementsByTagName('body')[0].onkeydown = CANCEL_SET_COORDINATE_Keypress;
let SET_ROTATION_button = document.getElementById('SET_ROTATION');
SET_ROTATION_button.addEventListener('click', SET_ROTATION_button_Click);
let GET_FILE_button = document.getElementById('GET_MAP_FILE');
GET_FILE_button.addEventListener('click', GET_MAP_FILE_button_Click);
//let RenderCanvas = document.getElementById('renderCanvas');
//RenderCanvas.addEventListener('click', renderCanvas_Click);

function ADD_SCENE_Click() {
  GroundWidtch = document.getElementById('width').value;
  GroundHeight = document.getElementById('height').value;
  AddGround(GroundWidtch, GroundHeight);
  //    window.location.reload();
}

function AddGround(width, height) {
  if (width <= 0 || height <= 0)
    return;
  if (ground)
    ground.dispose();
  ground = new BABYLON.MeshBuilder.CreateGround("ground",
    { width: width, height: height },
    scene);
  return ground;
}

function ADD_MODEL_Click() {
  if(!ModelLable.files || !ModelLable.files[0]['name'])
    return;
  ModelAdding = !ModelAdding;
  if (ModelAdding) {
    Add_model_button.style.backgroundColor = 'blue';
  }
  else {
    Add_model_button.style.backgroundColor = 'white';
  }
}

function Create_file_button_Click() {
//console.log(ModelsArray.length);
  if (ModelsArray == 0 || !ModelsArray){
    console.log('!!!!');
    return null;
  }
  const formData = new FormData();
  formData.append('SceneWidtch', ground._width);
  formData.append('SceneHeight', ground._height);
  let array = GetModelsList();
  formData.append('Models', JSON.stringify(array));
  fetch('http://localhost:3000/api/models', {
    method: 'POST',
    body: formData
  })
  .then((res) => {
    console.log(res);
  })
  .catch((err) => console.log(err));
}

function SET_COORDINATE_button_Click()
{
  if(SelectedModel != null)
  {
    SelectedModel.position.x = CurrentXpos.value;
    SelectedModel.position.z = CurrentYpos.value;
    SelectedModel.position.y = CurrentZpos.value;
    ModelManipulationEnd();
  }
}

function SET_ROTATION_button_Click()
{
  if(SelectedModel != null)
  {
SelectedModel.rotation = new BABYLON.Vector3(
  Math.PI / 180 * CurrentXrot.value, 
  Math.PI / 180 * CurrentZrot.value, 
  Math.PI / 180 * CurrentYrot.value);
/*    SelectedModel.rotation.x = CurrentXrot.value;
    SelectedModel.rotation.z = CurrentYrot.value;
    SelectedModel.rotation.y = CurrentZrot.value;*/
    ModelManipulationEnd();
  }
}

function CANCEL_SET_COORDINATE_Keypress(e)
{
  if(SelectedModel != null && e.key == 'Escape')
    ModelManipulationEnd();
}

function GET_MAP_FILE_button_Click()
{
  LoadMap(engine, scene, assetsManager, ModelsArray);
}