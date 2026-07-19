<!-- 樹狀標籤 (純原生 JS 內建真實標籤優化版) -->
<script>
//<![CDATA[
var tl2 = {
  target: "Label1", // 標籤小工具的 ID
  category: ["綠夕的編織物語", "手作工坊", "文字創作", "瑪奇日常"], // 大分類名稱
  showLevel: 2, // 預設打開的標籤層數, 1 為全部收起
  showCategoryCount: "N", // 大分類若不顯示文章數請填入"N"
  openLogo: "❖", // 展開圖示
  closeLogo: "✦", // 收合圖示
  listLogo: ">", // 項目圖示
  openNav: "❖ 展開",
  closeNav: "✦ 收合"
};

// 初始化資料庫
tl2.dataSet = [];
tl2.labelSplitSet = [];
tl2.notTreeLabel = [];

// 純原生文字解析器
tl2.text = function(a) {
  var el = document.createElement("p");
  el.innerHTML = a;
  return el.textContent || el.innerText || "";
};

// 展開/收合全部的功能
tl2.toggle = function(n) {
  var o = tl2.labelSplitSet;
  var b = o.length;
  var p = tl2.openLogo;
  var h = tl2.closeLogo;
  
  for (var e = 0; e < b; e++) {
    var m = o[e];
    var f = m.length;
    for (var c = 0; c < f; c++) {
      var q = m.slice(0, c + 1).join("") + c;
      var d = "logo" + q;
      var g = document.getElementById(q);
      var a = document.getElementById(d);
      
      if (m[1] && n == 1) {
        if (a) {
          if (a.firstChild && a.firstChild.src) a.firstChild.src = p;
          else a.innerHTML = p;
        }
        if (g) g.style.display = "block";
      }
      if (m[1] && n == 0) {
        if (a) {
          if (a.firstChild && a.firstChild.src) a.firstChild.src = h;
          else a.innerHTML = h;
        }
        if (g) g.style.display = "none";
      }
    }
  }
};

// 單一節點點擊切換
tl2.swap = function(c, d) {
  var a = document.getElementById(d);
  var e = document.getElementById(c);
  var b = tl2.openLogo;
  var g = tl2.closeLogo;
  
  if (e) {
    if (!e.firstChild || !e.firstChild.src) {
      e.innerHTML = (tl2.text(e.innerHTML) == b) ? g : b;
    } else {
      e.firstChild.src = (e.firstChild.src == b) ? g : b;
    }
  }
  if (a) {
    a.style.display = (a.style.display == "block") ? "none" : "block";
  }
};

// 主程式主體
document.addEventListener("DOMContentLoaded", function() {
  var targetWidget = document.getElementById(tl2.target);
  if (!targetWidget) return;
  
  var collapsibleTitle = targetWidget.querySelector(".collapsible-title");
  if (collapsibleTitle) collapsibleTitle.click();

  var listItems = targetWidget.querySelectorAll("li");
  
  listItems.forEach(function(li) {
    var c = li.querySelector("a");
    var m = [];
    var a, d, g, b, e, h;
    var k = li.querySelector("span");
    
    if (c) {
      a = c.getAttribute("href");
      d = c.getAttribute("dir");
      var spanInA = c.querySelector("span");
      if (spanInA) {
        h = spanInA.innerHTML.replace("(", "").replace(")", "");
        spanInA.remove();
      } else if (k) {
        h = k.innerHTML.replace("(", "").replace(")", "");
      }
      g = tl2.text(c.innerHTML);
    } else if (k) {
      a = "//" + location.hostname + location.pathname;
      var spans = li.querySelectorAll("span");
      d = spans[0] ? spans[0].dir : "";
      g = spans[0] ? tl2.text(spans[0].innerHTML) : "";
      h = spans[1] ? spans[1].innerHTML.replace("(", "").replace(")", "") : "0";
    }
    
    if (!g) return;
    b = g.split("-");
    e = b.length;
    
    for (var f = 0; f < e; f++) {
      if (e == 1) {
        tl2.notTreeLabel.push([g, d, a, h]);
        return;
      }
      if (f > 0 && f != e - 1 && b[f].search(" ") != 0) {
        b[f] = " " + b[f];
      }
      m[f] = b[f];
    }
    tl2.dataSet.push([m, d, a, h]);
  });

  // 開始渲染 HTML 結構
  var data = tl2.dataSet;
  var catArray = tl2.category;
  var notTreeLabel = tl2.notTreeLabel;
  var lnArray = [], ldArray = [], luArray = [], lcArray = [];
  var cl = catArray.length, dl = data.length, l = notTreeLabel.length;
  var showLevel = tl2.showLevel;
  
  var imgHtml = function(str) {
    return str.search("http") < 0 ? str : "<img src='" + str + "'/>";
  };
  
  var openLogo = imgHtml(tl2.openLogo);
  var closeLogo = imgHtml(tl2.closeLogo);
  var listLogo = imgHtml(tl2.listLogo);
  var openNav = imgHtml(tl2.openNav);
  var closeNav = imgHtml(tl2.closeNav);
  
  var html = "", navHtml = "", end = "", endCheck = 0;
  var label, cLabel, i, j, k, x, y;
  
  data.sort();
  for (i = 0; i < dl; i++) {
    tl2.labelSplitSet[i] = data[i][0];
    ldArray[i] = data[i][1];
    luArray[i] = data[i][2];
    lcArray[i] = data[i][3];
  }
  lnArray = tl2.labelSplitSet;
  
  for (i = 0; i < cl; i++) {
    for (j = 0; j < dl; j++) {
      label = lnArray[j];
      if (label && label[1] && label[0] == catArray[i]) {
        endCheck++;
        if (endCheck != 0) endCheck = 1;
        
        var findSame = function() {
          if (j - 1 < 0) return 0;
          var n = 0;
          cLabel = lnArray[j - 1];
          function same() {
            if (cLabel && label[n] == cLabel[n]) {
              n++;
              same();
            }
          }
          same();
          return n;
        };
        
        k = findSame();
        
        var tree = function() {
          if (label && label[k + 1]) {
            var count = 0;
            var showCount = "";
            var catID = label.slice(0, k + 1).join("") + k;
            var logoID = "logo" + catID;
            var sLogo = (k < showLevel - 1) ? openLogo : closeLogo;
            var sDisplay = (k < showLevel - 1) ? "block" : "none";
            
            if (tl2.showCategoryCount == "Y") {
              for (x = 0; x < dl; x++) {
                cLabel = lnArray[x];
                for (y = k; y >= 0; y--) {
                  if (cLabel && label[y] != cLabel[y]) break;
                  if (cLabel && label[y] == cLabel[y] && y == 0) {
                    count += parseInt(lcArray[x]);
                    showCount = "(" + count + ")";
                  }
                }
              }
            }
            html += "<div class='tl2_category'><span onclick='tl2.swap(\"" + logoID + "\",\"" + catID + "\");'><a id='" + logoID + "' href='javascript:;'>" + sLogo + "</a>";
            html += "<span><a class='tl2_catText' href='javascript:;'> " + label[k] + " </a></span></span><span>" + showCount + "</span></div><div class='tl2_subArea' id='" + catID + "' style='display:" + sDisplay + "'>";
            k++;
            tree();
          } else if (label) {
            // 【⚠️ 這裡加入了只顯示真實標籤的邏輯】
            // 原本小工具會顯示完整的 label[k]（帶有前綴），我們在這裡把它切開，只拿最後一節
            var currentLabelName = label[k].trim();
            if (currentLabelName.indexOf("-") > 0) {
              var labelParts = currentLabelName.split("-");
              currentLabelName = labelParts[labelParts.length - 1];
            }

            html += "<div class='tl2_label'>" + listLogo + " <a dir='" + ldArray[j] + "' href='" + luArray[u = j] + "'><span dir='ltr'>" + currentLabelName + "</span></a> (" + lcArray[j] + ")</div>";
            cLabel = lnArray[j + 1] || "";
            end = "";
            
            var findEnd = function() {
              if (k - 1 > 0) {
                end += "</div>";
                if (!cLabel) {
                  k--;
                  findEnd();
                } else {
                  var n;
                  for (n = k; n >= 1; n--) {
                    if (label[n - 1] != cLabel[n - 1]) {
                      n = 2;
                      break;
                    }
                    if (label[n - 1] == cLabel[n - 1] && n == 1) break;
                  }
                  if (n == 1) {
                    end = end.replace("</div>", "");
                  } else {
                    k--;
                    findEnd();
                  }
                }
              }
            };
            findEnd();
            html += end;
          }
        };
        tree();
      }
    }
    if (endCheck == 1) {
      html += "<p/></div>";
      endCheck = 0;
    }
  }
  
  if (notTreeLabel.length) {
    for (i = 0; i < l; i++) {
      // 【⚠️ 這裡也同步加入處理獨立標籤（沒有大分類的標籤）的邏輯】
      var isolatedLabelName = notTreeLabel[i][0].trim();
      if (isolatedLabelName.indexOf("-") > 0) {
        var isolatedParts = isolatedLabelName.split("-");
        isolatedLabelName = isolatedParts[isolatedParts.length - 1];
      }

      html += "<div class='tl2_label'>" + listLogo + " <a dir='" + notTreeLabel[i][1] + "' href='" + notTreeLabel[i][2] + "'><span dir='ltr'>" + isolatedLabelName + "</span></a> (" + notTreeLabel[i][3] + ")</div>";
    }
  }
  
  navHtml += "<a href='javascript:tl2.toggle(1);'>" + openNav + "</a>";
  navHtml += "<a href='javascript:tl2.toggle(0);'>" + closeNav + "</a>";
  
  var mainContainer = document.createElement("div");
  mainContainer.className = "tl2_main";
  mainContainer.innerHTML = html;
  
  var navContainer = document.createElement("div");
  navContainer.className = "tl2_nav";
  navContainer.innerHTML = navHtml;
  
  var copyrightLink = document.createElement("a");
  copyrightLink.href = "https://www.wfublog.com/2014/11/blogger-tree-label-v2.html";
  copyrightLink.target = "_blank";
  copyrightLink.title = "Blogger 樹狀標籤 V2\n程式設計：WFU BLOG";
  copyrightLink.style.cssText = "float: right; margin-top: 5px; text-decoration: none; color: #ccc; font-family: helvetica, arial, sans-serif; font-size: 11px;";
  copyrightLink.innerHTML = "&#9436; Tree Label V2";
  
  var widgetContent = targetWidget.querySelector(".widget-content");
  if (widgetContent) {
    widgetContent.innerHTML = ""; 
    widgetContent.appendChild(navContainer);
    widgetContent.appendChild(mainContainer);
    widgetContent.appendChild(copyrightLink);
  }
});
//]]>
</script>