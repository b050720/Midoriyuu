// 切換 TOC 展開/收合
window.mbtToggle = function() {
  const mbt = document.getElementById('mbtTOC');
  if (mbt) {
    const isHidden = mbt.style.display === 'none' || getComputedStyle(mbt).display === 'none';
    mbt.style.display = isHidden ? 'block' : 'none';
  }
};

// 生成 TOC 文章目錄
window.mbtTOC = function() {
  const container = document.querySelector(".mbtTOC");
  const tocList = document.getElementById("mbtTOC");
  if (!container || !tocList) return;

  const tocTitles = document.querySelectorAll(".TOCtitle");
  const targetTitle = tocTitles.length > 0 ? tocTitles[tocTitles.length - 1] : container;
  const postBody = document.querySelector(".post-body") || document.body;
  const headers = postBody.querySelectorAll("h2:not(.TOCtitle), h3:not(.TOCtitle)");
  if (headers.length === 0) return;

  tocList.innerHTML = "";
  const baseFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const offsetPx = 5 * baseFontSize; 
  let currentH2List = null;

  function scrollToTarget(targetElement) {
    if (!targetElement) return;
    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
      top: elementPosition - offsetPx,
      behavior: "smooth"
    });
  }

  headers.forEach((header, i) => {
    header.setAttribute("id", "point" + i);
    header.title = "點擊返回文章目錄";

    header.addEventListener("click", () => scrollToTarget(targetTitle));

    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#point" + i;
    a.textContent = header.textContent;
    
    a.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      scrollToTarget(header);
    });

    li.appendChild(a);

    const tagName = header.tagName.toLowerCase();
    if (tagName === "h2") {
      tocList.appendChild(li);
      currentH2List = null;
    } else if (tagName === "h3") {
      if (!currentH2List) {
        currentH2List = document.createElement("ol");
        currentH2List.className = "toc-sub-list";
        const lastLi = tocList.lastElementChild;
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
  const boxEl = document.getElementById("moreWorks");
  const listEl = document.getElementById("moreWorksList");
  const labelNodes = document.querySelectorAll("#postLabelsData .label-item");

  if (boxEl && listEl && labelNodes.length > 0) {
    const postTitle = boxEl.getAttribute("data-title") || "";
    const labels = Array.from(labelNodes).map(node => ({
      name: node.getAttribute("data-name") || "",
      url: node.getAttribute("data-url") || ""
    }));

    const seriesConfig = [
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

    const categoryConfig = [
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

    const htmlItems = [];

    seriesConfig.forEach(item => {
      const hasLabel = labels.some(l => l.name === item.requiredLabel);
      const hasKeyword = postTitle.includes(item.keyword);
      if (hasLabel && hasKeyword) {
        htmlItems.push(`<p><span class='fa' data-icon='bookmark'></span>更多${item.name}作品&#65306;<a href='${item.url}' title='${item.title}'>&#12304;${item.name}&#12305;</a></p>`);
      }
    });

    categoryConfig.some(item => {
      const matchedLabel = labels.find(l => l.name.includes(item.targetLabel));
      if (matchedLabel) {
        const linkName = item.fixedName || matchedLabel.name;
        const linkUrl = item.useLabelUrl ? matchedLabel.url : item.fixedUrl;
        const linkTitle = item.fixedTitle || `${item.titlePrefix}${matchedLabel.name} @ 緑の庭`;
        const firstPartText = item.prefix || matchedLabel.name;

        htmlItems.push(`<p><span class='fa' data-icon='bookmark'></span>更多${firstPartText}&#65306;<a href='${linkUrl}' title='${linkTitle}'>&#12304;${linkName}&#12305;</a></p>`);
        return true;
      }
    });

    if (htmlItems.length > 0) {
      listEl.innerHTML = htmlItems.join("");
      boxEl.style.display = "block";
    }
  }

  /* -------------------------------------------------------
   * 功能 2：自動包裹 H2 內容區塊並加上 ResizeObserver 動態量測高度
   * ------------------------------------------------------- */
  const postBody = document.querySelector(".post-body");
  if (postBody) {
    // 建立 ResizeObserver 實例
    const cvObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const height = entry.borderBoxSize?.[0]?.blockSize ?? entry.target.offsetHeight;
        // 當確定抓到渲染高度時，動態更新 CSS 變數
        if (height > 0) {
          entry.target.style.setProperty('--rendered-height', `${height}px`);
        }
      }
    });

    const h2List = Array.from(postBody.querySelectorAll("h2:not(.TOCtitle)"));
    h2List.forEach(h2 => {
      const section = document.createElement("section");
      section.className = "cv";
      
      // 將 H2 及其內容都放入 section（修正語意結構）
      h2.parentNode.insertBefore(section, h2);
      section.appendChild(h2);
      
      let nextNode = section.nextSibling;
      while (nextNode) {
        const currentNode = nextNode;
        nextNode = nextNode.nextSibling;
        
        if (currentNode.nodeType === 1 && currentNode.tagName.toLowerCase() === "h2") {
          break;
        }
        section.appendChild(currentNode);
      }

      // 開始監聽這個動態生成的 section
      cvObserver.observe(section);
    });
  }

  /* -------------------------------------------------------
   * 功能 3：執行 TOC 文章目錄
   * ------------------------------------------------------- */
  if (typeof window.mbtTOC === "function") {
    window.mbtTOC();
  }

  /* -------------------------------------------------------
   * 功能 4：監聽留言區 title 屬性 (帶 Timeout 防止無限監聽)
   * ------------------------------------------------------- */
  const observer = new MutationObserver((mutations, obs) => {
    const commentLink = document.querySelector("#comments .footer a[onclick*='bloggerPopup']");
    if (commentLink) {
      commentLink.setAttribute("title", "歡迎留言(*´∀`)~♥");
      obs.disconnect(); 
    }
  });
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 10000);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPostFeatures);
} else {
  initPostFeatures();
}
