var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };

var startRenderLoop = function (engine, canvas) {
  engine.runRenderLoop(function () {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
    }
  });
};
//**************************************************************************************** */
function createScene() {
  canvas.style.width = '100%';
  canvas.style.height = '600px';
  var scene = new BABYLON.Scene(engine);
  const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 50, new BABYLON.Vector3(0, 0, 0));
  camera.attachControl(canvas, true);
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
  light.intensity = 0.7;
  BABYLON.STLFileLoader.DO_NOT_ALTER_FILE_COORDINATES = true;
  assetsManager = new BABYLON.AssetsManager(scene);
  
  var music = new BABYLON.Sound("Music", "/sound.mp3", scene, 
  function() {
    music.play();
 },
 {      loop: true,
   autoplay: true}
 );
  //  Взаимодействие с моделью  
  const pointerDown_ModelSelect = (mesh, vect) => {
    SelectMesh(mesh);
  }

  scene.onPointerObservable.add((pointerInfo) => {
    switch (pointerInfo.type) {
      case BABYLON.PointerEventTypes.POINTERDOWN:
        if (pointerInfo.pickInfo.hit) {
            pointerDown_ModelSelect(pointerInfo.pickInfo.pickedMesh, 
            pointerInfo.pickInfo.pickedPoint);        
        }
        break;
    }
  });

  return scene;
};

//**************************************************************************************** */

window.initFunction = async function () {
  var asyncEngineCreation = async function () {
    try {
      return createDefaultEngine();
    } catch (e) {
      console.log("the available createEngine function failed. Creating the default engine instead");
      return createDefaultEngine();
    }
  }
  window.engine = await asyncEngineCreation();
  if (!engine) throw 'engine should not be null.';
  startRenderLoop(engine, canvas);
  window.scene = createScene();
};
initFunction().then(() => {
  sceneToRender = scene
});

window.addEventListener("resize", function () {
  engine.resize();
});