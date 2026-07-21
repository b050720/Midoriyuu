/**
 * 綠夕的工坊 - 部落格客製化功能
 */
document.addEventListener("DOMContentLoaded", function() {

/* =======================================================
 * 功能 1：處理更多作品標籤文字（支援多標籤比對）
 * ======================================================= */
var containers = document.querySelectorAll(".moreWorks");

containers.forEach(function(container) {
  var contentEl = container.querySelector(".moreWorks-content");
  var labelNodes = container.querySelectorAll(".label-item");
  if (!contentEl || labelNodes.length === 0) return;

  // 1. 將這篇文章的所有標籤轉成陣列物件
  var labels = [];
  labelNodes.forEach(function(node) {
    labels.push({
      name: node.getAttribute("data-name") || "",
      url: node.getAttribute("data-url") || ""
    });
  });

  // 2. 輔助函式：用來尋找第一個包含特定關鍵字的標籤
  function findLabel(keyword) {
    return labels.find(function(item) {
      return item.name.indexOf(keyword) !== -1;
    });
  }

  // 3. 依照優先順序比對所有標籤
  var targetLabel = null;

  // 【規則 1：原創作品系列】
  if ((targetLabel = findLabel("原創新詩")) || (targetLabel = findLabel("原創短篇"))) {
    contentEl.innerHTML = "更多文字創作&#65306;<a class='label-dynamic-link' href='" + targetLabel.url + "' title='綠夕的文字創作｜" + targetLabel.name + " @ 緑の庭'>&#12304;" + targetLabel.name + "&#12305;</a>";
    container.style.display = ""; // 顯示區塊
  } 
  // 【規則 2：瑪奇服裝系列】
  else if ((targetLabel = findLabel("充滿時尚品味的"))) {
    contentEl.innerHTML = "更多瑪奇日常&#65306;<a href='https://midoriyuu.blogspot.com/p/craft.html' title='綠夕的瑪奇服裝收集冊 @ 緑の庭'>&#12304;充滿時尚品味的&#12305;</a>";
    container.style.display = "";
  } 
  // 【規則 3：鉤針作品系列】
  else if ((targetLabel = findLabel("製作紀錄"))) {
    contentEl.innerHTML = "更多鉤針作品&#65306;<a href='https://midoriyuu.blogspot.com/p/craft.html' title='綠夕的手作工坊｜鉤針作品總整理 @ 緑の庭'>&#12304;全部作品&#12305;</a>";
    container.style.display = "";
  } 
  // 【規則 4：歌詞翻譯系列】
  else if ((targetLabel = findLabel("歌詞翻譯"))) {
    contentEl.innerHTML = "更多翻譯作品&#65306;<a class='label-dynamic-link' href='" + targetLabel.url + "' title='綠夕的文字創作｜" + targetLabel.name + " @ 緑の庭'>&#12304;" + targetLabel.name + "&#12305;</a>";
    container.style.display = "";
  }
});

  /* =======================================================
   * 功能 2：修正按鈕的無障礙標籤 (aria-label)
   * ======================================================= */
  document.querySelector('.back-button')?.setAttribute('aria-label', '返回首頁');
  document.querySelector('.sidebar-back')?.setAttribute('aria-label', '關閉側邊欄');

  /* =======================================================
   * 功能 3：回到頂端功能 (原生 JS版)
   * ======================================================= */
  var imgUrl = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh3FWDPR2RQAqQGt9umu0yhATNQDoESwxiGIXz6ocT6hopC9NhxRksna7oz6axJPgIFx4IvtKWIncy575PgtsVld7L5thQ1xCB8hgIL5hme03PfqKTQX58erzZkonp0SEGE4DYtwDt1rA/w40-rw/gotop.png";
  
  // 建立按鈕
  var goTopBtn = document.createElement("img");
  goTopBtn.id = "goTopButton";
  goTopBtn.src = imgUrl;
  goTopBtn.style.cssText = "display: none; z-index: 200; cursor: pointer; position: fixed; bottom: 8%; right: 10px; opacity: 0.4; transition: opacity 0.2s, display 0.2s;";
  document.body.appendChild(goTopBtn);

  // 滑鼠移入移出效果
  goTopBtn.addEventListener("mouseover", function() { goTopBtn.style.opacity = "0.6"; });
  goTopBtn.addEventListener("mouseout", function() { goTopBtn.style.opacity = "0.4"; });
  
  // 點擊平滑滾動到頂端
  goTopBtn.addEventListener("click", function() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // 監聽滾動動態顯示按鈕
  window.addEventListener("scroll", function() {
    if (window.scrollY > 100) {
      goTopBtn.style.display = "block";
    } else {
      goTopBtn.style.display = "none";
    }
  });

  /* =======================================================
   * 功能 4：Fancybox 燈箱觸發設定
   * ======================================================= */
  Fancybox.bind('[data-fancybox]', {
    Carousel: {
      breakpoints: {
        "(max-width: 800px)": { Arrows: false }
      },
      Toolbar: {
        display: {
          left: [""],
          middle: ["counter"],
          right: ["autoplay", "thumbs", "close"],
        },
      },
    },
  });
 
  /* =======================================================
   * 功能 5：監聽留言區並修改 title 屬性
   * ======================================================= */
  var observer = new MutationObserver(function(mutations, obs) {
    var commentLink = document.querySelector("#comments .footer a[onclick*='bloggerPopup']");
    if (commentLink) {
      commentLink.setAttribute("title", "歡迎留言(*´∀`)~♥");
      obs.disconnect(); 
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

}); // <-- 這行就是閉合最頂端：document.addEventListener("DOMContentLoaded", function() {
