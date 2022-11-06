/*
<div class="info_object">
    <div class="info_img">
        <img src="http://s2.fotokto.ru/photo/full/418/4182404.jpg" alt="Фонтан дружба народов">
        <img src="http://s2.fotokto.ru/photo/full/418/4182404.jpg" alt="Фонтан дружба народов">
    </div>
    <h1 id="info_name">Название</h1>
    <p id="info_info">Фонта́н «Дру́жба наро́дов» — главный фонтан и один из основных символов ВДНХ. Создан к открытию ВДНХ в 1954 году по проекту Константина Топуридзе и Г. Д. Константиновского.</p>
</div>
*/

let infoObj = document.getElementById('info_object1');
let infoImg = document.getElementById('info_img1');
let infoName = document.getElementById('info_name');
let infoInfo = document.getElementById('info_info');
let SelectedMesh = null;
document.getElementsByTagName('body')[0].onkeydown = CANCEL_SELECTION_Keypress;

const INFO = [
    {image: "/img/input_main.jpg", 
    information: "Самая мощная ассоциация с ВДНХ у любого человека — это арка парадного входа на Выставку, открывающая Центральную аллею." + 
    "На вершине арки «Тракторист и колхозница» возносят на 32-метровую высоту аллегорический сноп колосьев — тяжелую промышленность и сельское хозяйство." +
    "Арка была построена к открытию ВСХВ в 1954 году, архитектор — Иннокентий Мельчаков, который принимал участие в оформлении советского павильона на Всемирной выставке в Нью-Йорке в 1939 году. " +  
    "Над скульптурой «Тракторист и колхозница» — эмблемой Выставки — трудился целый творческий коллектив: А. П. Антропов, С. Д. Рабинович, И. Л. Слоним, Н. Л. Штамм под руководством С. М. Орлова. ",
    model_name: "center_input.stl",
    name: "Арка Главного входа"},
    {image: "", 
    information: "",
    model_name: "druhba_narodov.stl",
    name: "Фонтан Дружба народов СССР"},
    {image: "", 
    information: "",
    model_name: "povilion_1_center.stl",
    name: "Павильон 1"},
    {image: "", 
    information: "",
    model_name: "Dvores_GOS_MFS.stl",
    name: "Дворец госуслуг МФЦ"},
    {image: "", 
    information: "",
    model_name: "povilion_67_Karelia.stl",
    name: "Павильон 67 Карелия"},
    {image: "", 
    information: "",
    model_name: "povilion_2_robostation.stl",
    name: "Павильон 2 робостанция"},
    {image: "", 
    information: "",
    model_name: "povilion_5_MGXM.stl",
    name: "Павильон 5 музей городского хозяйства Москвы"},
    {image: "", 
    information: "",
    model_name: "povilion_5_Abhasia.stl",
    name: "Павильон 6 Абхазия"},
    {image: "", 
    information: "",
    model_name: "povilion_10_Moldova.stl",
    name: "Павильон 10 Молдова"},
    {image: "", 
    information: "",
    model_name: "povilion_68_Armenia.stl",
    name: "Павильон 68 Армения"}
]

function GetInfo(mesh)
{
    let name = -1;
    for (let i = 0; i < ModelsArray.length; i++) {
        if (ModelsArray[i]['ModelMesh'] == mesh)
        {
            name = ModelsArray[i]['ModelName'];
            break;
        }
    }
    for (let i = 0; i < INFO.length; i++) {
        if(INFO[i].model_name == name)
        {
            infoImg.innerHTML = `<img src="${INFO[i].image}" alt="${INFO[i].name}">`;
            infoName.innerHTML = INFO[i].name;
            infoInfo.innerHTML = INFO[i].information;
            break;
        }
    }
    infoObj.style.visibility = 'visible';    
}

function CanSelect(mesh)
{  
    for (let i = 0; i < ModelsArray.length; i++) {
        if (ModelsArray[i]['ModelMesh'] == mesh)
            return true;
    }
    return false;
}

function SelectMesh(mesh){
    if(mesh == SelectedMesh)
    {
        UnselectMesh();
        return;
    }
    if(CanSelect(mesh))
    {
        UnselectMesh();
        SelectedMesh = mesh;
        var localMaterial = new BABYLON.StandardMaterial("Yellow", scene);
        localMaterial.diffuseColor = new BABYLON.Color3.Yellow();
        SelectedMesh.material = localMaterial;
        GetInfo(SelectedMesh);
    }
}

function UnselectMesh() {
    if (SelectedMesh != null) {
        var localMaterial = new BABYLON.StandardMaterial("White", scene);
        localMaterial.diffuseColor = new BABYLON.Color3.White();
        SelectedMesh.material = localMaterial;
        SelectedMesh = null;
        infoObj.style.visibility = 'hidden';
    }
}

function CANCEL_SELECTION_Keypress(e)
{
    if(SelectedMesh != null && e.key == 'Escape')
        UnselectMesh();
}