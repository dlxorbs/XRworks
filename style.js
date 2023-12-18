let bikinicity = document.querySelector("#bikinicity");
// console.log(bikinicity.object3D);

let reffront = document.querySelector("#reffront");

let chair = document.querySelector(".chair");
let chairup = document.querySelector("#chair");
let chairdown = document.querySelector("#chairdown");
let desktop = document.querySelector("#desktop");
let player = document.querySelector("#player");
let camera = document.querySelector("#camera");
let rig = document.querySelector("#rig");

let npc = document.querySelector("#npc01");

// var videoEl = document.querySelector("#gods");
// videoEl.currentTime = 0; // Seek to 122 seconds.
// videoEl.pause();
// videoEl.volume = 0;

// 캐릭터 상하 회전 보정하는 함수
AFRAME.registerComponent("rotation-reader", {
  tick: function () {
    const rotationx = rig.object3D.rotation.x * -1;
    player.object3D.rotation.set(rotationx, 0, 0);
  },
});

$(".button").click(function () {
  $(".startpage").css({ "z-index": "0", display: "none" });
});

//키보드 누른 값 받아오기
function init() {
  keys = {
    a: false,
    s: false,
    d: false,
    w: false,
    space: false,
  };

  document.body.addEventListener("keydown", function (e) {
    const key = e.code.replace("Key", "").toLowerCase();
    if (keys[key] !== undefined) {
      if (key == "spacebar") {
        spacebar = true;
        keys[key] = false;
      } else {
        keys[key] = true;
      }

      //   console.log(keys);
    }
  });

  document.body.addEventListener("keyup", function (e) {
    const key = e.code.replace("Key", "").toLowerCase();
    if (keys[key] !== undefined) {
      keys[key] = false;
    }
  });
}

//   키보드 클릭시 애니메이션 실행
function animate() {
  requestAnimationFrame(animate);

  if (keys.w) {
    player.setAttribute("animation-mixer", "clip: walking;");
  } else if (keys.s) {
    player.setAttribute("animation-mixer", "clip: walking;");
  } else if (keys.a) {
    player.setAttribute("animation-mixer", "clip: walking;");
  } else if (keys.d) {
    player.setAttribute("animation-mixer", "clip: walking;");
  } else if (keys.space) {
    player.setAttribute("animation-mixer", "clip: clicking;");
  } else {
    player.setAttribute("animation-mixer", "clip: default;");
  }
}

// 비키니시티 클릭시 애니메이션 재생

$(".no").click(function () {
  $(".modal").removeClass("show");
});

$(".yes").click(function () {
  let box = document.querySelector("#box");
  $(box).click();
});

//1인칭 3인칭 변경

function FPP() {
  //   let cmloc = camera.object3D.position;

  //   cmloc.x = 0;
  //   cmloc.y = 2;
  //   cmloc.z = 0;
  rig.setAttribute("movement-controls", "speed:0.8");
  rig.setAttribute("look-controls", "enabled : false;");
  rig.setAttribute("animation", "property:rotation; to:  0 0 0; dur:800;");

  camera.setAttribute("animation", "property:position; to: 3.5 3 -1; dur:800;");
  camera.setAttribute(
    "animation__2",
    "property:rotation; to: -20 90 0; dur:800;"
  );

  rig.setAttribute("animation", "property:rotation; to: 0 0 0; dur:800;");
}
function TPP() {
  //   let cmloc = camera.object3D.position;
  //   cmloc.x = 0;
  //   cmloc.y = 3;
  //   cmloc.z = 4;
  rig.setAttribute("movement-controls", "speed:0.3");
  rig.setAttribute("look-controls", "enabled : true;");
  camera.setAttribute("animation", "property:position; to: 0 3 4; dur:1000;");
  player.setAttribute("visible", "true");
  camera.setAttribute("animation__2", "property:rotation; to: 0 0 0; dur:800;");
}

let objs = [];
let obj = {};

AFRAME.registerComponent("raycaster-detected", {
  updateSchema: function () {
    this.el.addEventListener("click", function (evt) {
      let object = evt.detail.intersection.object.el.id;
    });
  },

  init: function () {
    // 이 객체의 아이디와, 거리, 방향을 담는 개체 생성
    obj = {
      id: this.el.id,
      distance: "",
      position: "",
      direction: "",
    };

    objs.push(obj);
  },

  tick: function () {
    let p = rig.object3D.position;
    let item = this.el.object3D.position;
    // 벡터를 통해 물체와 캐릭터의 거리를 구하는 변수
    const a = new THREE.Vector3(item.x, item.y, item.z);
    const b = new THREE.Vector3(p.x, p.y, p.z);
    const d = a.distanceTo(b).toFixed(1);
    let angle = Math.atan2(item.z - p.z, item.x - p.x);

    // 이 객체의 아이디와, 거리, 방향을 담는 개체 생성
    for (let i = 0; i < objs.length; i += 1) {
      if (objs[i].id == this.el.id) {
        (objs[i].distance = d),
          (objs[i].position = item),
          (objs[i].direction = angle);
      }
    }

    if (this.el.id == "box") {
      if (obj.distance < 4.6) {
        FPP();
      } else {
        TPP();
      }
    }
  },
});

let points = 0;
let curve = 0;
var camPosIndex = 0;

//"some-line"속성을 가진 객체안에 곡선을 넣고 그 곡선을 따라서 움직일 수 있도록
AFRAME.registerComponent("some-line", {
  init: function () {
    // create an array of points.
    curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0)], true);

    // 라인 가시화
    const points = curve.getPoints(50);
    const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    this.el.object3D.add(line);
  },

  tick: function () {
    // 현재 캐릭터와 npc의 위치를 받아옴
    let p = rig.object3D.position;
    let item = npc.object3D.position;

    // 위치를 벡터로 저장
    const a = new THREE.Vector3(p.x, p.y, p.z);
    const b = new THREE.Vector3(item.x, item.y, item.z);

    // 두 벡터의 거리를 측정
    const d = a.distanceTo(b).toFixed(1);

    // 두 벡터의 각도를 측정
    let angle2 = Math.atan2(item.z - p.z, item.x - p.x);

    // if (d < 4) {
    //   camPosIndex;
    //   npc.object3D.rotation.set(0, -angle2, 0);
    // } else {
    //   camPosIndex++;
    //   if (camPosIndex > 2000) {
    //     camPosIndex = 0;
    //   }
    //   npc.object3D.rotation.set(0, -angle, 0);
    // }
  },
});

init();
animate();
