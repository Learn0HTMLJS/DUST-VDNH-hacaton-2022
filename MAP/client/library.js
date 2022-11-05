//******** Глобальные константы и переменные *********
let GroundWidtch = 0;
let GroundHeight = 0;
let ground;
let ModelAdding = false;
let countMod = 0;
let ModelLable = document.getElementById('Model');
let SelectedModel = null;
let ModelMooving = false;
let CurrentXpos = document.getElementById('Xpos');
let CurrentYpos = document.getElementById('Ypos');
let CurrentZpos = document.getElementById('Zpos');
let CurrentXrot = document.getElementById('Xrot');
let CurrentYrot = document.getElementById('Yrot');
let CurrentZrot = document.getElementById('Zrot');

var canvas = document.getElementById("renderCanvas");
var engine = null;
var scene = null;
var sceneToRender = null;
var assetsManager;

let ModelsArray = [];
//****************************************************