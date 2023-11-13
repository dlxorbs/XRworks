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
let disp = document.querySelector("#disp");
let biki = document.querySelector("#bikinicity");

var videoEl = document.querySelector("#gods");
videoEl.currentTime = 0; // Seek to 122 seconds.
videoEl.pause();
videoEl.volume = 0;

$(".button").click(function () {
  $(".startpage").css({ "z-index": "0", display: "none" });
});

//캐릭터 상하 회전 보정하는 함수
AFRAME.registerComponent("rotation-reader", {
  tick: function () {
    const rotationx = rig.object3D.rotation.x * -1;
    player.object3D.rotation.set(rotationx, 0, 0);
  },
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

// 모니터 클릭시 영상재생
function monitorclick() {
  if (videoEl.paused) {
    videoEl.play();
    videoEl.volume = 0.4;

    disp.setAttribute(
      "animation",
      "property:scale; to:1.490 0.838 1.000; dur:100;"
    );
  } else {
    videoEl.pause();
    videoEl.volume = 0.0;
    disp.setAttribute(
      "animation",
      "property:scale; to:1.490 0 1.000; dur:100;"
    );
  }
}

$(desktop).click(function () {
  monitorclick();
});
// 의자 클릭시 애니메이션 재생
function chairclick() {
  chairup.setAttribute("animation-mixer", "clip: up; loop : once;");
  chairdown.setAttribute("animation-mixer", "clip: down; loop : once;");
}

$(chair).click(function () {
  chairclick();
  $(chairup).on("animation-finished", function () {
    chairup.removeAttribute("animation-mixer");
  });
  $(chairdown).on("animation-finished", function () {
    chairdown.removeAttribute("animation-mixer");
  });
});

// 냉장고 클릭시 애니메이션 재생
function refgclick() {
  reffront.setAttribute("animation-mixer", "clip: open; loop: once;");
}

function refgclick2() {
  reffront.setAttribute("animation-mixer", "clip: close; loop: once;");
}

$("#reffront").click(function () {
  if ($(".open").length > 0) {
    refgclick2();
    $(reffront).on("animation-finished", function () {
      reffront.removeAttribute("animation-mixer");
      $(reffront).removeClass("open");
    });
  } else {
    refgclick();
    $(reffront).on("animation-finished", function () {
      reffront.setAttribute("animation-mixer", "clip: ooo;");
      $(reffront).addClass("open");
    });
  }
});

// 비키니시티 클릭시 애니메이션 재생

$(biki).click(function () {
  $(".modal").addClass("show");
});

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
  rig.setAttribute("movement-controls", "speed:0.05");
  camera.setAttribute("animation", "property:position; to: 0 1 0; dur:800;");
  player.setAttribute("visible", "false");
}
function TPP() {
  //   let cmloc = camera.object3D.position;
  //   cmloc.x = 0;
  //   cmloc.y = 3;
  //   cmloc.z = 4;
  rig.setAttribute("movement-controls", "speed:0.3");
  camera.setAttribute("animation", "property:position; to: 0 3 4; dur:1000;");
  player.setAttribute("visible", "true");
}

let objs = [];
let obj = {};

AFRAME.registerComponent("raycaster-detected", {
  updateSchema: function () {
    this.el.addEventListener("click", function (evt) {
      let object = evt.detail.intersection.object.el.id;
      console.log(object);
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
      if (obj.distance < 1.5) {
        FPP();
      } else {
        TPP();
      }
    }
  },
});

init();
animate();
