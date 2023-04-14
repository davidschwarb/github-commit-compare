var hashes = [];
var checkedCount = 0;

function onDocumentLoad() {
  SetupUi();
}

function SetupUi() {
  OverwriteStyles();
  var compareUi = BuildCompareUi();
  var fileNav = SetupFileNav();
  fileNav.appendChild(compareUi);
  AddCheckboxes();
}

function OverwriteStyles() {
  var styleElem = document.head.appendChild(document.createElement("style"));
  styleElem.innerHTML = `
        div.file-navigation:before {content: none;}
        div.file-navigation:after {content: none;}
      `;
}

function BuildCompareUi() {
  var wrapper = CreateWrapper();
  var button = CreateButton();
  var hashDisplay = CreateHashDisplay();

  wrapper.appendChild(hashDisplay);
  wrapper.appendChild(button);
  return wrapper;
}

function CreateWrapper() {
  var div = document.createElement("div");
  div.style.display = "flex";
  div.style.alignItems = "center";
  return div;
}

function CreateButton() {
  var button = document.createElement("button");
  button.addEventListener("click", openHashCompare);
  button.id = "hashCompareButton";
  button.innerHTML = "Compare ";
  button.disabled = true;
  button.classList.add("btn-outline", "btn");
  return button;
}

function CreateHashDisplay() {
  var hashDisplay = document.createElement("div");
  hashDisplay.id = "hashCompareDisplay";
  hashDisplay.innerHTML = "Comparing _______ ⬅️️ _______";
  hashDisplay.classList.add("text-normal");
  hashDisplay.style.marginRight = "5px";
  return hashDisplay;
}

function SetupFileNav() {
  var fileNav = document.querySelector("div.file-navigation");
  fileNav.style.display = "flex";
  fileNav.style.justifyContent = "space-between";
  return fileNav;
}

function AddCheckboxes() {
  var clipboards = document.querySelectorAll("clipboard-copy");

  clipboards.forEach((c, idx) => {
    var commit = c.attributes["value"].nodeValue;
    var el = document.createElement("input");
    el.value = commit;
    el.setAttribute("index", idx);
    el.classList.add("compare-checkbox");
    el.type = "checkbox";

    var div = document.createElement("div");
    div.classList.add("BtnGroup");
    div.style.display = "inline-block";
    div.appendChild(el);
    c.parentElement.parentElement.parentElement.appendChild(div);

    el.addEventListener("input", (event) => handleChange(event));
  });
}

function handleChange(event) {
  if (event.target.checked) {
    checkedCount++;
  }
  if (!event.target.checked) {
    checkedCount--;
  }

  hash = event.target.value;
  var index = event.target.getAttribute("index");

  if (event.target.checked) {
    hashes.push({ hash, index });
    hashes.sort((a, b) => {
      if (a.index < b.index) return 1;
      if (a.index > b.index) return -1;
      return 0;
    });
  } else {
    var hashIdx = hashes.findIndex((hashObj) => hashObj.hash === hash);
    hashes.splice(hashIdx, 1);
  }

  setDisplayText();

  if (checkedCount >= 2) {
    setButtonStatus(true);
    setCheckboxesStatus(true);
  } else {
    setButtonStatus(false);
    setCheckboxesStatus(false);
  }
  return;
}

function setDisplayText() {
  var hash1 = "_______",
    hash2 = "_______";
  if (hashes.length == 2) {
    hash1 = hashes[0].hash.substring(0, 7);
    hash2 = hashes[1].hash.substring(0, 7);
  } else if (hashes.length == 1) {
    hash1 = hashes[0].hash.substring(0, 7);
  }
  var displayText = `Comparing ${hash1} ⬅️ ${hash2}`;
  document.querySelector("#hashCompareDisplay").innerHTML = displayText;
}

function setButtonStatus(status) {
  document.querySelector("#hashCompareButton").disabled = !status;
}

function setCheckboxesStatus(status) {
  var allUnchecked = document.querySelectorAll(
    'input[type="checkbox"]:not(:checked)'
  );
  allUnchecked.forEach((allUnchecked) => (allUnchecked.disabled = status));
}

function openHashCompare() {
  if (hashes.length != 2) {
    throw "Compare length needs to be 2";
  }

  var currentLocation = window.location.href;
  var idx = currentLocation.indexOf("/commits/");
  var rootUrl = currentLocation.substring(idx, -1);

  var url = `${rootUrl}/compare/${hashes[0].hash}...${hashes[1].hash}`;
  window.open(url, "_blank");
}

document.onload = onDocumentLoad();