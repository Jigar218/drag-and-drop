const canvas = document.getElementById("canvas");
const editor = document.getElementById("editForm");
let selectedElement = null;

document.querySelectorAll(".tools button").forEach((btn) => {
  btn.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("type", btn.dataset.type);
  });

  // btn.addEventListener("click", () => {
  //   const type = btn.dataset.type;
  //   const element = createElement(type);
  //   canvas.appendChild(element);
  // });

  if (isMobileDevice()) {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;
      const element = createElement(type);
      canvas.appendChild(element);
    });
  }
});

function isMobileDevice() {
  return (
    ("ontouchstart" in window || navigator.maxTouchPoints > 0) &&
    /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  );
}
canvas.addEventListener("dragover", (e) => e.preventDefault());

canvas.addEventListener("drop", (e) => {
  e.preventDefault();
  const type = e.dataTransfer.getData("type");
  const element = createElement(type);
  canvas.appendChild(element);
});

function createElement(type) {
  const el = document.createElement("div");
  el.className = "canvas-element";

  if (type === "text") {
    el.setAttribute("contenteditable", true);
    el.innerText = "Editable Text";
  }

  if (type === "image") {
    const img = document.createElement("img");
    img.src =
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    img.style.width = "100%";
    img.style.maxWidth = "100%";
    img.style.height = "auto";
    img.style.display = "block";
    el.appendChild(img);
  }

  if (type === "button") {
    el.setAttribute("contenteditable", false);
    el.innerHTML = "<button>Click Me</button>";
  }

  el.style.color = "#004d40";
  el.style.fontSize = "16px";
  el.style.backgroundColor = "#ffffff";

  el.addEventListener("click", () => selectElement(el));
  return el;
}

function selectElement(el) {
  selectedElement = el;
  document.getElementById("content").value = el.innerText || "";
  document.getElementById("color").value = rgbToHex(
    el.style.color || "#004d40"
  );
  document.getElementById("fontSize").value = parseInt(el.style.fontSize || 16);
  document.getElementById("bgColor").value = rgbToHex(
    el.style.backgroundColor || "#ffffff"
  );

  if (el.querySelector("img")) {
    document.getElementById("content").value = el.querySelector("img").src;
  }

  if (el.querySelector("button")) {
    document.getElementById("content").value =
      el.querySelector("button").innerText;
  }
}

editor.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!selectedElement) return;

  const content = document.getElementById("content").value;
  const color = document.getElementById("color").value;
  const fontSize = document.getElementById("fontSize").value;
  const bgColor = document.getElementById("bgColor").value;

  if (selectedElement.querySelector("img")) {
    selectedElement.querySelector("img").src = content;
  } else if (selectedElement.querySelector("button")) {
    selectedElement.querySelector("button").innerText = content;
  } else {
    selectedElement.innerText = content;
  }

  selectedElement.style.color = color;
  selectedElement.style.fontSize = fontSize + "px";
  selectedElement.style.backgroundColor = bgColor;
});

function rgbToHex(rgb) {
  if (!rgb) return "#004d40";
  const result = rgb.match(/\d+/g);
  if (!result) return "#004d40";
  return (
    "#" +
    result
      .map((x) => {
        const hex = parseInt(x).toString(16);
        return hex.length == 1 ? "0" + hex : hex;
      })
      .join("")
  );
}
