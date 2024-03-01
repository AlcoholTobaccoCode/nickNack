window.onload = function() {
  addMenu();
}

function addMenu() {
  var domMenu = document.getElementById("panel-extend-main");
  if (domMenu !== null) {
    return;
  }
  domMenu = document.createElement("div");
  domMenu.id = "panel-extend-main";
  domMenu.classList.add("panel-extend-main");
  var domHtml = `
    <div class="panel-extend-item">
      <div id="remove-menu" class="panel-extend-item-btn" title="关闭">关闭</div>
    </div>
    <div class="panel-extend-item">
      <div id="calc-folder-size" class="panel-extend-item-btn" title="计算当前页面下的文件夹大小">计算大小</div>
    </div>`;


  var styleElement = document.createElement('style');
  styleElement.innerHTML = `.panel-extend-main{max-width:200px;display:flex;gap:8px;padding:8px;background-color:#e6e6e6;border-radius:8px;position:fixed;right:10px;top:150px;z-index: 1000;transition: opacity ease-in-out .3s;}.panel-extend-item{display:flex;flex-direction:column;width:fit-content;}.panel-extend-item-btn{vertical-align:top;display:inline-block;text-align:center;margin:8px;width:80px;border-radius:4px;color:#fff;cursor:pointer;height:34px;line-height:34px;background:#55acee;transition:all 0.5s;box-shadow:0px 5px 0px 0px #3486d5;}.panel-extend-item-btn:active{transform:translate(0px,4px);box-shadow:0px 1px 0px 0px #3486d5;}`;
  styleElement.classList.add('panel-extend-main_style');
  var head = document.head || document.getElementsByTagName('head')[0];
  head.appendChild(styleElement);

  domMenu.innerHTML = domHtml;
  document.body.appendChild(domMenu);

  // 添加事件
  document
    .querySelector("#calc-folder-size")
    .addEventListener("click", function (e) {
      calcFolderSize();
    });
  // 关闭按钮
  document
    .querySelector("#remove-menu")
    .addEventListener("click", function (e) {
      removeMenu();
    });
}

// 从页面中移除菜单
function removeMenu() {
  var domMenu = document.getElementById("panel-extend-main");
  if (domMenu) {
    domMenu.style.opacity = 0;
    setTimeout(() => {
      domMenu.remove();
    }, 400);
  }
  var domMenuStyle = document.querySelector("panel-extend-main_style");
  if (domMenuStyle) {
    domMenuStyle.remove();
  }
}

// 计算当前页面下的文件夹大小
function calcFolderSize() {
  const spans = document.querySelectorAll("span[data-v-eff991a2]");
  const handleClick = (index = 0) => {
    if (index < spans.length) {
      const ele = spans[index];
      if (ele.innerHTML === "计算") {
        ele.click();
        setTimeout(() => handleClick(index + 1), 100);
      } else {
        handleClick(index + 1);
      }
    }
  };

  handleClick();
}
