/**
 * 綠夕的工坊 - 部落格客製化功能
 */
document.addEventListener("DOMContentLoaded", function() {


 * 功能 1：處理更多作品標籤文字
 * ======================================================= */
var containers = document.querySelectorAll(".moreWorks");

containers.forEach(function(container) {
  var rawText = container.getAttribute("data-raw");
  if (!rawText) return;

  var strongEl = container.querySelector("strong");
  if (!strongEl) return;

  // 1. 鉤針作品 (關鍵字: 製作紀錄)
  if (rawText.indexOf("製作紀錄") !== -1) {
    strongEl.innerHTML = "更多鉤針作品&#65306;<a href='https://midoriyuu.blogspot.com/p/craft.html' title='綠夕的手作工坊｜鉤針作品總整理 @ 緑の庭'>&#12304;全部作品&#12305;</a>";
  } 
  // 2. 瑪奇服裝 (關鍵字: 充滿時尚品味的)
  else if (rawText.indexOf("充滿時尚品味的") !== -1) {
    strongEl.innerHTML = "更多瑪奇服裝&#65306;<a href='https://midoriyuu.blogspot.com/p/mabinogi-fashion.html' title='綠夕的瑪奇服裝收集冊 @ 緑の庭'>&#12304;綠夕的瑪奇服裝收集冊&#12305;</a>";
  } 
  // 3. 原創作品 (關鍵字: 原創新詩、原創短篇)
  else if (rawText.indexOf("原創新詩") !== -1 || rawText.indexOf("原創短篇") !== -1) {
    var subCategory = rawText.indexOf("原創新詩") !== -1 ? "原創新詩" : "原創短篇";
    strongEl.innerHTML = "更多原創作品&#65306;<a href='https://midoriyuu.blogspot.com/p/creative.html' title='綠夕的原創作品 ｜ " + subCategory + " @ 緑の庭'>&#12304;" + subCategory + "&#12305;</a>";
  } 
  // 4. 歌詞翻譯 (關鍵字: 歌詞翻譯)
  else if (rawText.indexOf("歌詞翻譯") !== -1) {
    strongEl.innerHTML = "更多歌詞翻譯&#65306;<a href='https://midoriyuu.blogspot.com/p/lyrics.html' title='綠夕的歌詞翻譯整理 @ 緑の庭'>&#12304;歌詞翻譯&#12305;</a>";
  }
});

  /* =======================================================
   * 功能 2：修正按鈕的無障礙標籤 (aria-label)
   * ======================================================= */
  document.querySelector('.back-button')?.setAttribute('aria-label', '返回首頁');
  document.querySelector('.sidebar-back')?.setAttribute('aria-label', '關閉側邊欄');

  /* =======================================================
   * 功能 5：回到頂端功能 (原生 JS版)
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
BloggerPostTitle(".blog-pager-right a", ".blog-pager-older-title");

  /* =======================================================
   * 功能 6：Fancybox 燈箱觸發設定
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
   * 功能 8：監聽留言區並修改 title 屬性
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
