/**
 * 綠夕的工坊 - 文章與頁面專用客製化功能
 */

// 切換 TOC 展開/收合
window.mbtToggle = function() {
  var mbt = document.getElementById('mbtTOC');
  if (mbt) {
    var isHidden = mbt.style.display === 'none' || getComputedStyle(mbt).display === 'none';
    mbt.style.display = isHidden ? 'block' : 'none';
  }
};

// 生成 TOC 文章目錄
window.mbtTOC = function() {
  var container = document.querySelector(".mbtTOC");
  var tocList = document.getElementById("mbtTOC");
  if (!container || !tocList) return;

  var tocTitles = document.querySelectorAll(".TOCtitle");
  var targetTitle = tocTitles.length > 0 ? tocTitles[tocTitles.length - 1] : container;
  var postBody = document.querySelector(".post-body") || document.body;
  var headers = postBody.querySelectorAll("h2:not(.TOCtitle), h3:not(.TOCtitle)");
  if (headers.length === 0) return;

  tocList.innerHTML = "";
  var baseFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  var offsetPx = 5 * baseFontSize; 
  var currentH2List = null;

  function scrollToTarget(targetElement) {
    if (!targetElement) return;
    var elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
      top: elementPosition - offsetPx,
      behavior: "smooth"
    });
  }

  headers.forEach(function(header, i) {
    header.setAttribute("id", "point" + i);
    header.title = "點擊返回文章目錄";

    header.addEventListener("click", function() { scrollToTarget(targetTitle); });

    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = "#point" + i;
    a.textContent = header.textContent;
    
    a.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      scrollToTarget(header);
    });

    li.appendChild(a);

    var tagName = header.tagName.toLowerCase();
    if (tagName === "h2") {
      tocList.appendChild(li);
      currentH2List = null;
    } else if (tagName === "h3") {
      if (!currentH2List) {
        currentH2List = document.createElement("ol");
        currentH2List.className = "toc-sub-list";
        var lastLi = tocList.lastElementChild;
        (lastLi || tocList).appendChild(currentH2List);
      }
      currentH2List.appendChild(li);
    }
  });
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

    seriesConfig.forEach(function(item) {
      var hasLabel = labels.some(function(l) { return l.name === item.requiredLabel; });
      var hasKeyword = postTitle.indexOf(item.keyword) !== -1;
      if (hasLabel && hasKeyword) {
        htmlItems.push("<p><f-a name='bookmark'></f-a>更多" + item.name + "作品&#65306;<a href='" + item.url + "' title='" + item.title + "'>&#12304;" + item.name + "&#12305;</a></p>");
      }
    });

    categoryConfig.some(function(item) {
      var matchedLabel = labels.find(function(l) { return l.name.indexOf(item.targetLabel) !== -1; });
      if (matchedLabel) {
        var linkName = item.fixedName || matchedLabel.name;
        var linkUrl = item.useLabelUrl ? matchedLabel.url : item.fixedUrl;
        var linkTitle = item.fixedTitle || (item.titlePrefix + matchedLabel.name + " @ 緑の庭");
        var firstPartText = item.prefix || matchedLabel.name;

        htmlItems.push("<p><f-a name='bookmark'></f-a>更多" + firstPartText + "&#65306;<a href='" + linkUrl + "' title='" + linkTitle + "'>&#12304;" + linkName + "&#12305;</a></p>");
        return true;
      }
    });

    if (htmlItems.length > 0) {
      listEl.innerHTML = htmlItems.join("");
      boxEl.style.display = "block";
    }
  }

  /* -------------------------------------------------------
   * 功能 2：修正按鈕無障礙標籤
   * ------------------------------------------------------- */
  document.querySelector('.back-button')?.setAttribute('aria-label', '返回首頁');
  document.querySelector('.sidebar-back')?.setAttribute('aria-label', '關閉側邊欄');

  /* -------------------------------------------------------
   * 功能 3：執行 TOC 文章目錄
   * ------------------------------------------------------- */
  if (typeof window.mbtTOC === "function") {
    window.mbtTOC();
  }

  /* -------------------------------------------------------
   * 功能 4：監聽留言區 title 屬性
   * ------------------------------------------------------- */
  var observer = new MutationObserver(function(mutations, obs) {
    var commentLink = document.querySelector("#comments .footer a[onclick*='bloggerPopup']");
    if (commentLink) {
      commentLink.setAttribute("title", "歡迎留言(*´∀`)~♥");
      obs.disconnect(); 
    }
  });
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPostFeatures);
} else {
  initPostFeatures();
}