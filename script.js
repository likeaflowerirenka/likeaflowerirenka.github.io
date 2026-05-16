let state = "menu";

let player = { x: 200, y: 200, vx: 0, vy: 0, speed: 5 };
let camera = { x: 0, y: 0 };

let quests = { memories: 0, done: false };

const npcs = document.querySelectorAll(".npc");
const items = document.querySelectorAll(".item");

// Manage button state accurately
const activeKeys = {};

/* 🎬 START GAME */
document.getElementById("startBtn").onclick = () => {
  state = "game";

  document.getElementById("menu").style.display = "none";
  document.getElementById("game").style.display = "block";

  const music = document.getElementById("music");
  if (music) {
    music.volume = 0.4;
    music.play().catch(err => console.log("Audio waiting for user gesture context."));
  }

  initNPCs();
  loop();
};

/* 🎮 INPUT CONTROLS */
document.addEventListener("keydown", (e) => {
  if (state !== "game") return;
  activeKeys[e.key] = true;
  updateVelocity();
});

document.addEventListener("keyup", (e) => {
  if (state !== "game") return;
  delete activeKeys[e.key];
  updateVelocity();
});

function updateVelocity() {
  player.vx = 0;
  player.vy = 0;

  if (activeKeys["ArrowUp"] || activeKeys["w"] || activeKeys["W"]) player.vy = -1;
  if (activeKeys["ArrowDown"] || activeKeys["s"] || activeKeys["S"]) player.vy = 1;
  if (activeKeys["ArrowLeft"] || activeKeys["a"] || activeKeys["A"]) player.vx = -1;
  if (activeKeys["ArrowRight"] || activeKeys["d"] || activeKeys["D"]) player.vx = 1;
}

/* 🧑 NPC GENERATOR */
function initNPCs() {
  npcs.forEach(npc => {
    npc.style.backgroundImage = `url(${npc.dataset.img})`;

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    npc.appendChild(bubble);
  });
}

/* 🎮 CORE GAME LOOP */
function loop() {
  if (state !== "game") return;

  updatePlayer();
  updateCamera();
  updateNPCs();
  updateItems();
  updateQuest();
  updateGift();

  requestAnimationFrame(loop);
}

/* 🧍 PLAYER STATE MACHINE */
function updatePlayer() {
  player.x += player.vx * player.speed;
  player.y += player.vy * player.speed;

  // Boundary clipping inside world coordinate canvas
  player.x = Math.max(0, Math.min(3558, player.x));
  player.y = Math.max(0, Math.min(3558, player.y));

  const el = document.getElementById("player");
  el.style.left = player.x + "px";
  el.style.top = player.y + "px";
}

/* 🎥 CAMERA TRANSFORM ENGINE */
function updateCamera() {
  camera.x += (player.x - window.innerWidth / 2 - camera.x) * 0.07;
  camera.y += (player.y - window.innerHeight / 2 - camera.y) * 0.07;

  document.getElementById("world").style.transform = `translate(${-camera.x}px, ${-camera.y}px)`;
}

/* 🧑 NPC DIALOGUE SYSTEM */
function updateNPCs() {
  npcs.forEach(npc => {
    const bubble = npc.querySelector(".bubble");
    
    const dist = Math.hypot(
      player.x - npc.offsetLeft,
      player.y - npc.offsetTop
    );

    if (dist < 80) {
      bubble.innerText = npc.dataset.text;
      bubble.style.display = "block";
    } else {
      bubble.style.display = "none";
    }
  });
}

/* 🎁 ITEM COLLECTION SYSTEM */
function updateItems() {
  items.forEach(item => {
    if (item.style.display === "none") return;

    const dist = Math.hypot(
      player.x - item.offsetLeft,
      player.y - item.offsetTop
    );

    if (dist < 35) {
      item.style.display = "none";
      quests.memories++;
    }
  });
}

/* 📜 QUEST VERIFICATION */
function updateQuest() {
  if (quests.memories >= 3) {
    quests.done = true;
  }
}

/* 🎁 PRESENT CONTROLLER */
function updateGift() {
  const gift = document.getElementById("gift");
  if (!quests.done) return;

  gift.style.display = "block";

  const dist = Math.hypot(
    player.x - 2800,
    player.y - 2800
  );

  if (dist < 45) {
    endGame();
  }
}

/* 🎬 RUNTIME TERMINATION */
function endGame() {
  state = "end";
  document.getElementById("game").style.display = "none";
  document.getElementById("end").style.display = "flex";
}

// Show Menu view at initial processing tick
document.getElementById("menu").style.display = "flex";
