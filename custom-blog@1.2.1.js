/**
 * 綠夕的工坊 - 部落格客製化功能
 */
document.addEventListener("DOMContentLoaded", function() {
  
/* =======================================================
 * 功能 1：處理更多作品標籤文字（支援多標籤比對）
 * ======================================================= */
var boxEl = document.getElementById("moreWorks");
var listEl = document.getElementById("moreWorksList");
var labelNodes = document.querySelectorAll("#postLabelsData .label-item");
if (!boxEl || !listEl || labelNodes.length === 0) return;

var postTitle = boxEl.getAttribute("data-title") || "";
var labels = Array.from(labelNodes).map(function(node) {
  return {
    name: node.getAttribute("data-name") || "",
    url: node.getAttribute("data-url") || ""
  };
});

// 1. 【系列 Config】
var seriesConfig = [
  {
    requiredLabel: "製作紀錄",
    keyword: "英雄聯盟",
    name: "英雄聯盟",
    url: "https://midoriyuu.blogspot.com/p/craft.html",
    title: "綠夕的手作工坊｜英雄聯盟系列作品 @ 緑の庭"
  },
  {
    requiredLabel: "製作紀錄",
    keyword: "空洞騎士",
    name: "空洞騎士",
    url: "https://midoriyuu.blogspot.com/p/craft.html",
    title: "綠夕的手作工坊｜空洞騎士系列作品 @ 緑の庭"
  },
];

// 2. 【大分類 Config】
var categoryConfig = [
  {
    targetLabel: "原創新詩",
    prefix: "文字創作",
    titlePrefix: "綠夕的文字創作｜",
    useLabelUrl: true
  },
  {
    targetLabel: "充滿時尚品味的",
    prefix: "瑪奇日常",
    fixedName: "充滿時尚品味的",
    fixedUrl: "https://midoriyuu.blogspot.com/p/craft.html",
    fixedTitle: "綠夕的瑪奇服裝收集冊 @ 緑の庭"
  },
  {
    targetLabel: "製作紀錄",
    prefix: "鉤針作品",
    fixedName: "綠夕的手作工坊",
    fixedUrl: "https://midoriyuu.blogspot.com/p/craft.html",
    fixedTitle: "綠夕的手作工坊｜鉤針作品總整理 @ 緑の庭"
  },
];

var htmlItems = [];

// ─── 比對 1：系列 Router ───
seriesConfig.forEach(function(item) {
  var hasLabel = labels.some(function(l) { return l.name === item.requiredLabel; });
  var hasKeyword = postTitle.indexOf(item.keyword) !== -1;

  if (hasLabel && hasKeyword) {
    htmlItems.push(
      "<p><f-a name='bookmark'></f-a>更多" + item.name + "作品&#65306;<a href='" + item.url + "' title='" + item.title + "'>&#12304;" + item.name + "&#12305;</a></p>"
    );
  }
});

// ─── 比對 2：分類 Router ───
categoryConfig.some(function(item) {
  var matchedLabel = labels.find(function(l) { return l.name.indexOf(item.targetLabel) !== -1; });
  if (matchedLabel) {
    var linkName = item.fixedName || matchedLabel.name;
    var linkUrl = item.useLabelUrl ? matchedLabel.url : item.fixedUrl;
    var linkTitle = item.fixedTitle || (item.titlePrefix + matchedLabel.name + " @ 緑の庭");
    var firstPartText = item.prefix || matchedLabel.name;

    htmlItems.push(
      "<p><f-a name='bookmark'></f-a>更多" + firstPartText + "&#65306;<a href='" + linkUrl + "' title='" + linkTitle + "'>&#12304;" + linkName + "&#12305;</a></p>"
    );
    return true;
  }
});

// ─── 渲染結果 ───
if (htmlItems.length > 0) {
  listEl.innerHTML = htmlItems.join("");
  boxEl.style.display = "block";
}

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
