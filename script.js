let state = "menu";

let player = { x: 200, y: 200, vx: 0, vy: 0 };
let camera = { x: 0, y: 0 };

let quests = { memories: 0, done: false };

const npcs = document.querySelectorAll(".npc");
const items = document.querySelectorAll(".item");

/* 🎬 START GAME */
document.getElementById("startBtn").onclick = () => {
  state = "game";

  document.getElementById("menu").style.display = "none";
  document.getElementById("game").style.display = "block";

  document.getElementById("music").volume = 0.4;
  document.getElementById("music").play();

  initNPCs();
  loop();
};

/* 🎮 INPUT */
document.addEventListener("keydown", (e) => {
  if (state !== "game") return;

  if (e.key === "ArrowUp") player.vy = -1;
  if (e.key === "ArrowDown") player.vy = 1;
  if (e.key === "ArrowLeft") player.vx = -1;
  if (e.key === "ArrowRight") player.vx = 1;
});

document.addEventListener("keyup", () => {
  player.vx = 0;
  player.vy = 0;
});

/* 🧑 NPC INIT (editable system) */
function initNPCs() {
  npcs.forEach(npc => {
    npc.style.backgroundImage = `url(${npc.dataset.img})`;

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    npc.appendChild(bubble);
  });
}

/* 🎮 MAIN LOOP */
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

/* 🧍 PLAYER */
function updatePlayer() {
  player.x += player.vx * 4;
  player.y += player.vy * 4;

  const el = document.getElementById("player");
  el.style.left = player.x + "px";
  el.style.top = player.y + "px";
}

/* 🎥 CAMERA (smooth indie feel) */
function updateCamera() {
  camera.x += (player.x - window.innerWidth / 2 - camera.x) * 0.07;
  camera.y += (player.y - window.innerHeight / 2 - camera.y) * 0.07;

  document.getElementById("world").style.transform =
    `translate(${-camera.x}px, ${-camera.y}px)`;
}

/* 🧑 NPC DIALOGUE */
function updateNPCs() {
  npcs.forEach(npc => {
    const bubble = npc.querySelector(".bubble");

    const dist = Math.hypot(
      player.x - npc.offsetLeft,
      player.y - npc.offsetTop
    );

    bubble.innerText = dist < 70 ? npc.dataset.text : "";
  });
}

/* 🎁 ITEMS */
function updateItems() {
  items.forEach(item => {
    if (item.style.display === "none") return;

    const dist = Math.hypot(
      player.x - item.offsetLeft,
      player.y - item.offsetTop
    );

    if (dist < 25) {
      item.style.display = "none";
      quests.memories++;
    }
  });
}

/* 📜 QUEST */
function updateQuest() {
  if (quests.memories >= 3) {
    quests.done = true;
  }
}

/* 🎁 GIFT SYSTEM (FULL CONTROL) */
function updateGift() {
  const gift = document.getElementById("gift");

  if (!quests.done) return;

  gift.style.display = "block";

  const dist = Math.hypot(
    player.x - 2800,
    player.y - 2800
  );

  if (dist < 30) {
    endGame();
  }
}

/* 🎬 END */
function endGame() {
  state = "end";

  document.getElementById("game").style.display = "none";
  document.getElementById("end").style.display = "flex";

  document.getElementById("giftLink").href = "https://urodzinkimegaaa.carrd.co";
}

/* START LOOP */
loop();
