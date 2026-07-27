/* =======================================================
 * 全局設定與工具函數
 * ======================================================= */

// 計算預設捲動 offset
function getHeaderOffset() {
  var baseFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  return 6 * baseFontSize;
}

// 統一的平滑捲動函數
function scrollToTarget(targetElement) {
  if (!targetElement) return;
  var offsetPx = getHeaderOffset();
  var elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
  window.scrollTo({
    top: elementPosition - offsetPx,
    behavior: "smooth"
  });
}

// 切換 TOC 展開/收合
window.mbtToggle = function() {
  var mbt = document.getElementById('mbtTOC');
  if (mbt) {
    var isHidden = mbt.style.display === 'none' || getComputedStyle(mbt).display === 'none';
    mbt.style.display = isHidden ? 'block' : 'none';
  }
};

/* =======================================================
 * 生成 TOC 文章目錄
 * ======================================================= */
window.mbtTOC = function() {
  var container = document.querySelector(".mbtTOC");
  var tocList = document.getElementById("mbtTOC");
  if (!container || !tocList) return;

  var tocTitles = document.querySelectorAll(".TOCtitle");
  var targetTitle = tocTitles.length > 0 ? tocTitles[tocTitles.length - 1] : container;
  var postBody = document.querySelector(".post-body") || document.body;
  var headers = postBody.querySelectorAll("h2:not(.TOCtitle), h3:not(.TOCtitle)");
  if (headers.length === 0) return;

  // 清空舊目錄
  tocList.innerHTML = "";

  var fragment = document.createDocumentFragment();
  var currentH2List = null;

  headers.forEach(function(header, i) {
    header.setAttribute("id", "point" + i);
    header.title = "點擊返回文章目錄";

    if (!header.dataset.tocBound) {
      header.dataset.tocBound = "true";
      header.addEventListener("click", function() { 
        scrollToTarget(targetTitle); 
      });
    }

    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = "#point" + i;
    a.textContent = header.textContent;
    // 將標題元素引用存於 Dataset 中供 Event Delegation 取用
    a.dataset.targetId = "point" + i;

    li.appendChild(a);

    var tagName = header.tagName.toLowerCase();
    if (tagName === "h2") {
      fragment.appendChild(li);
      currentH2List = null;
    } else if (tagName === "h3") {
      if (!currentH2List) {
        currentH2List = document.createElement("ol");
        currentH2List.className = "toc-sub-list";
        var lastLi = fragment.lastElementChild;
        (lastLi || fragment).appendChild(currentH2List);
      }
      currentH2List.appendChild(li);
    }
  });

  tocList.appendChild(fragment);

  if (!tocList.dataset.bound) {
    tocList.dataset.bound = "true";
    tocList.addEventListener("click", function(e) {
      var link = e.target.closest("a");
      if (!link) return;
      
      e.preventDefault();
      e.stopPropagation();

      var targetId = link.dataset.targetId;
      var targetElement = document.getElementById(targetId);
      if (targetElement) {
        scrollToTarget(targetElement);
      }
    });
  }
};

function initPostFeatures() {
  /* -------------------------------------------------------
   * 功能 1：處理更多作品標籤文字
   * ------------------------------------------------------- */
  var boxEl = document.getElementById("moreWorks");
  var listEl = document.getElementById("moreWorksList");
  var labelNodes = document.querySelectorAll("#postLabelsData .label-item");

  if (boxEl && listEl && labelNodes.length > 0) {
    var postTitle = boxEl.getAttribute("data-title") || "";
    var labels = Array.from(labelNodes).map(function(node) {
      return {
        name: node.getAttribute("data-name") || "",
        url: node.getAttribute("data-url") || ""
      };
    });

    var labelMap = new Map();
    labels.forEach(function(l) {
      labelMap.set(l.name, l);
    });

    var seriesConfig = [
      {
        requiredLabel: "製作紀錄",
        keyword: "英雄聯盟",
        name: "英雄聯盟",
        url: "https://midoriyuu.blogspot.com/search/label/%E8%8B%B1%E9%9B%84%E8%81%AF%E7%9B%9F",
        title: "綠夕的手作工坊｜英雄聯盟系列作品 @ 緑の庭"
      },
      {
        requiredLabel: "製作紀錄",
        keyword: "空洞騎士",
        name: "空洞騎士",
        url: "https://midoriyuu.blogspot.com/search/label/%E7%A9%BA%E6%B4%9E%E9%A8%8E%E5%A3%AB",
        title: "綠夕的手作工坊｜空洞騎士系列作品 @ 緑の庭"
      }
    ];

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
        fixedUrl: "https://midoriyuu.blogspot.com/p/mabinogi.html",
        fixedTitle: "綠夕的瑪奇服裝收集冊 @ 緑の庭"
      },
      {
        targetLabel: "製作紀錄",
        prefix: "鉤針作品",
        fixedName: "綠夕的手作工坊",
        fixedUrl: "https://midoriyuu.blogspot.com/p/craft.html",
        fixedTitle: "綠夕的手作工坊｜鉤針作品總整理 @ 緑の庭"
      }
    ];

    var htmlItems = [];

    // 處理系列設定
    seriesConfig.forEach(function(item) {
      var hasLabel = labelMap.has(item.requiredLabel);
      var hasKeyword = postTitle.indexOf(item.keyword) !== -1;
      if (hasLabel && hasKeyword) {
        htmlItems.push("<p><span class='fa' data-icon='bookmark'></span>更多" + item.name + "作品&#65306;<a href='" + item.url + "' title='" + item.title + "'>&#12304;" + item.name + "&#12305;</a></p>");
      }
    });

    // 處理分類設定
    categoryConfig.some(function(item) {
      // 支援模糊比對 targetLabel
      var matchedLabel = null;
      for (var entry of labelMap.entries()) {
        if (entry[0].indexOf(item.targetLabel) !== -1) {
          matchedLabel = entry[1];
          break;
        }
      }

      if (matchedLabel) {
        var linkName = item.fixedName || matchedLabel.name;
        var linkUrl = item.useLabelUrl ? matchedLabel.url : item.fixedUrl;
        var linkTitle = item.fixedTitle || (item.titlePrefix + matchedLabel.name + " @ 緑の庭");
        var firstPartText = item.prefix || matchedLabel.name;

        htmlItems.push("<p><span class='fa' data-icon='bookmark'></span>更多" + firstPartText + "&#65306;<a href='" + linkUrl + "' title='" + linkTitle + "'>&#12304;" + linkName + "&#12305;</a></p>");
        return true;
      }
    });

    if (htmlItems.length > 0) {
      listEl.innerHTML = htmlItems.join("");
      boxEl.style.display = "block";
    }
  }

  /* -------------------------------------------------------
   * 功能 2：執行 TOC 文章目錄
   * ------------------------------------------------------- */
  if (typeof window.mbtTOC === "function") {
    window.mbtTOC();
  }

  /* -------------------------------------------------------
   * 功能 3：監聽留言區 title 屬性
   * ------------------------------------------------------- */
  var commentsContainer = document.getElementById("comments");
  var targetTarget = commentsContainer || document.body;

  var observer = new MutationObserver(function(mutations, obs) {
    var commentLink = document.querySelector("#comments .footer a[onclick*='bloggerPopup']");
    if (commentLink) {
      commentLink.setAttribute("title", "歡迎留言(*´∀`)~♥");
      obs.disconnect(); 
    }
  });

  observer.observe(targetTarget, { childList: true, subtree: true });
}

// 腳本啟動器
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPostFeatures);
} else {
  initPostFeatures();
}
