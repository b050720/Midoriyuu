/**
 * 綠夕的工坊 - 部落格客製化功能
 */
document.addEventListener("DOMContentLoaded", function() {
  
  // 1. 處理更多作品標籤文字
  var containers = document.querySelectorAll(".moreWorks");
  containers.forEach(function(container) {
    var rawText = container.getAttribute("data-raw");
    if (rawText) {
      if (rawText.indexOf("製作紀錄") !== -1) {
        var strongEl = container.querySelector("strong");
        if (strongEl) {
          strongEl.innerHTML = "更多鉤針作品&#65306;<a href='https://midoriyuu.blogspot.com/p/craft.html' title='綠夕的手作工坊｜鉤針作品總整理 @ 緑の庭'>&#12304;全部作品&#12305;</a>";
        }
      } 
      else if (rawText.indexOf("-") > 0) {
        var parts = rawText.split("-");
        var firstPart = parts[0];
        var lastPart = parts[parts.length - 1];
        
        var firstPartEl = container.querySelector(".label-first-part");
        var lastPartEl = container.querySelector(".label-last-part");
        var dynamicLinkEl = container.querySelector(".label-dynamic-link");
        
        if (firstPartEl) firstPartEl.innerHTML = firstPart;
        if (lastPartEl) lastPartEl.innerHTML = lastPart;
        
        if (dynamicLinkEl) {
          var customTitle = "綠夕的" + firstPart + "｜" + lastPart + " @ 緑の庭";
          dynamicLinkEl.setAttribute("title", customTitle);
        }
      }
    }
  });

  // 2. 修正按鈕的無障礙標籤 (aria-label)
  document.querySelector('.back-button')?.setAttribute('aria-label', '返回首頁');
  document.querySelector('.sidebar-back')?.setAttribute('aria-label', '關閉側邊欄');

  // 5. 回到頂端功能 (原生 JS版)
  var imgUrl = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh3FWDPR2RQAqQGt9umu0yhATNQDoESwxiGIXz6ocT6hopC9NhxRksna7oz6axJPgIFx4IvtKWIncy575PgtsVld7L5thQ1xCB8hgIL5hme03PfqKTQX58erzZkonp0SEGE4DYtwDt1rA/w40-rw/gotop.png";
  
  // 建立按鈕
  var goTopBtn = document.createElement("img");
  goTopBtn.id = "goTopButton";
  goTopBtn.src = imgUrl;
  // 修正：移除了重複且無效的 fixed; 關鍵字，維持樣式乾淨
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

  // 6. Fancybox 燈箱觸發
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

  // 監聽留言區並修改 title 屬性 (放在最後默默執行)
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

});