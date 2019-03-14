//创建一个场景，这是基础
var scene = new THREE.Scene();
//创建一个透视相机，作为眼睛以某种角度来看场景中的物体
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
scene.add(camera);//将相机添加到场景中
var webGLRender = new THREE.WebGLRenderer({//创建render渲染器
    alpha:true,//是否包含透明度
    antialias:true,//是否执行抗锯齿
})

webGLRender.setClearColor(new THREE.Color(0xffffff));//设置颜色及其透明度
webGLRender.setClearAlpha(0);//设置alpha
webGLRender.setSize(window.innerWidth, window.innerHeight, false);//调整输出canvas的大小

//调整眼睛的位置
camera.position.x = 0;
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
//加载texture的一个类
var texture = new THREE.TextureLoader().load('../images/hardwood2_diffuse.jpg', function (map) {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10, 24);
    //匹配材质
    floorMat.map = map;
    //更新当前的这个材质
    floorMat.needsUpdate = true;
});
//将材质添加到场景中
scene.add(floorMesh);

//添加环境光，环境光会均匀的照亮场景中的所有物体。
//如果没有环境光整个场景都是漆黑的
var ambientLight = new THREE.AmbientLight(0Xffffff);
scene.add(ambientLight);

//将整个渲染器加到dom中
document.body.appendChild(webGLRender.domElement);
render();

function render() {
    webGLRender.render(scene, camera);//用相机(camera)渲染一个场景(scene)
    requestAnimationFrame(render);//添加动画效果
    var time = Date.now() * 0.0005;
}