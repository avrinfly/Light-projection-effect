//创建一个场景，这是基础
var scene = new THREE.Scene();
//创建一个透视相机，作为眼睛以某种角度来看场景中的物体
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
scene.add(camera);//将相机添加到场景中
var webGLRender = new THREE.WebGLRenderer({//创建render渲染器
    alpha:true,//是否包含透明度
    antialias:true,//是否执行抗锯齿
})

webGLRender.setClearColor(new THREE.Color(0xffffff,0));//设置颜色及其透明度
webGLRender.setClearAlpha(0);//设置alpha
webGLRender.setSize(window.innerWidth, window.innerHeight, false);//调整输出canvas的大小

//调整眼睛的位置
camera.position.x = -4;
camera.position.y = 2;
camera.position.z = 4;
camera.lookAt(new THREE.Vector3(0, 0, 0));

//创建材质，标准材质，标准网格材质
var floorMat = new THREE.MeshStandardMaterial({
    //材质的粗糙程度。0.0表示平滑的镜面反射，1.0表示完全漫反射。
    roughness: 0.8,
    //材质与金属的相似度。非金属材质，如木材或石材，使用0.0，金属使用1.0，通常没有中间值。 默认值为0.5。
    metalness: 0.2,
    //凹凸贴图会对材质产生多大影响。典型范围是0-1。默认值为1
    bumpScale: 0.0005,
    color: 0xffffff
});
//平面缓冲的几何体
var floorGeometry = new THREE.PlaneBufferGeometry(20, 20);
//将材质作为网格输出
var floorMesh = new THREE.Mesh(floorGeometry, floorMat);
//地板添加阴影
floorMesh.receiveShadow = true;
floorMesh.rotation.x = -Math.PI / 2;
//加载texture的一个类
var texture = new THREE.TextureLoader();
texture.load(
    '../images/hardwood2_diffuse.jpg',
    function (map) { //onLoad回调
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.repeat.set(10, 24);
        //匹配材质
        floorMat.map = map;
        //更新当前的这个材质
        floorMat.needsUpdate = true;
    },
    undefined,//onProgress 加载过程中的回调
    function (err) { //加载错误时的回调
        console.error(err);
    });
//将材质添加到场景中
scene.add(floorMesh);
//地板上的物体
var boxMat = new THREE.MeshStandardMaterial({ //标准网格材质
    color: 0xfff,
    roughness: .75,
    metalness:.2
})
texture.load(
    '../images/floor2.png',
    function (map) {
        map.wrapS = THREE.RepeatWrapping;//定义了纹理贴图在水平方向上将如何包裹
        map.wrapT = THREE.RepeatWrapping;//定义了纹理贴图在垂直方向上将如何包裹
        map.repeat.set(1, 1);
        boxMat.map = map;
        boxMat.needsUpdate = true;//实时更新地板上的物体
    },
    undefined,
    function (err) {
        console.error(err);
    });
var boxGeometry = new THREE.BoxBufferGeometry(.5, .5, .5);
var boxMesh = new THREE.Mesh(boxGeometry, boxMat);
boxMesh.position.set(.5, .25, 1);
//物体开启阴影
boxMesh.castShadow = true;
//将物体添加到场景中
scene.add(boxMesh);
//添加环境光，环境光会均匀的照亮场景中的所有物体。
//如果没有环境光整个场景都是漆黑的
// var ambientLight = new THREE.AmbientLight(0Xffffff);
// scene.add(ambientLight);
//添加点光源
var pointLight = new THREE.PointLight(0xffee88, 1, 100, 2);
//添加点光源的具体表现
var lightgeometry = new THREE.SphereBufferGeometry(0.02, 16, 8);
var material = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    //自身发光
    emissive: 0xFFFFFF,
    //自身发光强度
    emissiveIntensity:15
});
pointLight.add(new THREE.Mesh(lightgeometry, material));
pointLight.position.set(0, 2, 0);
//对光开启影子
pointLight.castShadow = true;
scene.add(pointLight);
//将整个渲染器加到dom中
document.body.appendChild(webGLRender.domElement);
render();

function render() {
    webGLRender.render(scene, camera);//用相机(camera)渲染一个场景(scene)
    requestAnimationFrame(render);//添加动画效果
    var time = Date.now() * 0.0005;
    pointLight.position.y = Math.cos(time) * 0.75 + 1.5;//给点光源添加动态移动效果
    webGLRender.shadowMap.enabled = true;
}