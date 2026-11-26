/* ==========================================================================
   拾书巷 (Shishuxiang) - 校园二手书交换站  交互脚本
   Campus Second-hand Book Exchange Site - Interaction Scripts
   ----------------------------------------------------------------------------
   负责人 Owner: 向梓辰 Xiang Zichen (202412320227)
   协作者 Collaborator: 李佳豪 Li Jiahao (202412320211)
   ----------------------------------------------------------------------------
   文件结构 File structure:
     common.js   三个页面公用（页脚年份、返回顶部、平滑滚动）
     index.js    首页专用（站内公告轮播）
     detail.js   书单页专用（分类筛选）
     contact.js  留言板页专用（表单验证）

   本文件共实现 6 个交互功能 Six interactive features:
     1. 页脚年份自动更新   Auto-updating footer year
     2. 平滑滚动回到顶部   Smooth scroll back to top
     3. 站内公告轮播       Rotating site notices
     4. 书籍分类筛选       Book category filter
     5. 表单必填项验证     Required field validation
     6. 提交成功提示框     Submission confirmation panel
   ========================================================================== */


/* ==========================================================================
   第 1 个功能：页脚年份自动更新
   FEATURE 1: AUTO-UPDATING FOOTER YEAR
   --------------------------------------------------------------------------
   HTML 里预留了一个空的 <span id="footer-year"></span>，
   这里用 JavaScript 把当前年份填进去，这样年份永远不用手动改。
   The HTML contains an empty <span id="footer-year"></span>. This script fills
   it with the current year, so it never has to be updated by hand.
   ========================================================================== */
function initFooterYear() {
    var yearEl = document.getElementById("footer-year");

    // 如果页面上没有这个元素就直接退出，避免报错
    // If the element is not on this page, stop here instead of throwing an error
    if (!yearEl) {
        return;
    }

    // new Date() 得到当前时间，getFullYear() 取年份部分
    // new Date() gives the current moment; getFullYear() pulls out the year
    yearEl.textContent = new Date().getFullYear();
}


/* ==========================================================================
   第 2 个功能：返回顶部 + 平滑滚动
   FEATURE 2: BACK TO TOP WITH SMOOTH SCROLLING
   --------------------------------------------------------------------------
   页面底部已经有一个"返回顶部"链接，href="#header-top"。
   这里用 JavaScript 接管它，改成平滑滚动，滚上去不会突然一跳。
   The footer already has a "Back to Top" link pointing at #header-top.
   JavaScript takes it over and turns the jump into a smooth scroll.
   ========================================================================== */
function initBackToTop() {
    var backLink = document.querySelector('.footer-links a[href="#header-top"]');

    if (!backLink) {
        return;
    }

    backLink.addEventListener("click", function (event) {
        // 阻止浏览器默认的"瞬间跳到顶部"
        // Stop the browser from jumping to the top instantly
        event.preventDefault();

        // scrollTo 的第一个参数是横向位置，第二个是纵向位置
        // The first argument of scrollTo is the horizontal position, the second vertical
        window.scrollTo({
            top: 0,
            behavior: "smooth"     /* 平滑滚动效果  Smooth scrolling */
        });
    });
}


/* ==========================================================================
   第 3 个功能：站内公告轮播
   FEATURE 3: ROTATING SITE NOTICES
   --------------------------------------------------------------------------
   首页的"站内公告"有三条。默认只显示第一条，其余两条用 CSS 藏起来。
   这里每隔一段时间自动切换到下一条，像一个简易的轮播图。
   The home page has three notices. Only one is shown at a time and this
   script switches to the next one every 2.5 seconds, like a simple carousel.

   为了让用户知道这里会动，下面还有一排圆点指示器，
   圆点也可以点击，可以直接跳到某一条。
   So that the user knows something is happening, there is a row of dots below
   the notices. The dots are clickable and jump straight to a notice.
   ========================================================================== */
function initNoticeRotation() {
    var noticeList = document.querySelector(".notice-list");

    if (!noticeList) {
        return;
    }

    var notices = noticeList.querySelectorAll("li");

    // 少于两条就没必要轮播
    // With fewer than two notices there is nothing to rotate
    if (notices.length < 2) {
        return;
    }

    var currentIndex = 0;
    // 每 2500 毫秒（2.5 秒）切换一次
    // Switch every 2500 milliseconds (2.5 seconds)
    var interval = 2500;
    // 记录当前是否已经暂停
    // Keep track of whether the rotation is currently paused
    var isPaused = false;
    // 存放定时器的号码
    // Holds the id of the timer
    var timer = null;

    /* 切换函数：更新公告的显示状态和圆点的高亮  */
    /* The switch function: update the notices and the dot indicator */
    function showNotice(index) {
        for (var i = 0; i < notices.length; i++) {
            if (i === index) {
                notices[i].classList.add("is-active");
            } else {
                notices[i].classList.remove("is-active");
            }
        }

        // 同步更新圆点
        // Keep the dots in sync
        var dots = document.querySelectorAll("#notice-dots .notice-dot");

        for (var j = 0; j < dots.length; j++) {
            if (j === index) {
                dots[j].classList.add("active");
            } else {
                dots[j].classList.remove("active");
            }
        }
    }

    /* 开始轮播  */
    /* Start the rotation */
    function startTimer() {
        // 先停掉旧的定时器，避免重复调用时出现多个轮播  */
        // Clear the old timer first, so starting twice does not create two loops
        if (timer !== null) {
            clearInterval(timer);
        }

        timer = setInterval(function () {
            currentIndex = (currentIndex + 1) % notices.length;
            showNotice(currentIndex);
        }, interval);
    }

    /* 停止轮播  */
    /* Stop the rotation */
    function stopTimer() {
        if (timer !== null) {
            clearInterval(timer);
            timer = null;
        }
    }

    /* 更新“自动播放”这个标签  */
    /* Update the "auto rotating" label */
    function updateLabel() {
        var label = document.querySelector(".notice-auto-label");

        if (!label) {
            return;
        }

        if (isPaused) {
            // 暂停时换文字
            // When paused the wording changes
            // 外层用单引号，里面的 class="en-text" 用双引号，这样才不会打架
            // The outer string uses single quotes so the double quotes inside
            // class="en-text" do not clash with it.
            label.innerHTML = '已暂停 <span class="en-text">Paused</span>';
        } else {
            label.innerHTML = '自动播放中 <span class="en-text">Auto-rotating</span>';
        }
    }

    /* 生成圆点指示器  */
    /* Build the dot indicator */
    var dotsBox = document.getElementById("notice-dots");

    if (dotsBox) {
        for (var k = 0; k < notices.length; k++) {
            // 每个圆点是一个 button，可以被键盘操作  */
            // Each dot is a button, so it can be reached with the keyboard
            var dot = document.createElement("button");
            dot.type = "button";
            dot.className = "notice-dot";
            // aria-label 说明这个圆点对应第几条公告  */
            // aria-label says which notice this dot stands for
            dot.setAttribute("aria-label", "第 " + (k + 1) + " 条公告 Notice " + (k + 1));

            // 用闭包把下标出关，避免直接嵌入一个无意义的按钮  */
            // Wrap the index in a closure so each dot remembers its own number
            (function (dotIndex) {
                dot.addEventListener("click", function () {
                    currentIndex = dotIndex;
                    showNotice(currentIndex);
                    // 点了圆点就重新计时，让用户看一个完整周期  */
                    // Restart the timer after a manual click so the user gets a
                    // full interval to read the notice they picked
                    startTimer();
                });
            })(k);

            dotsBox.appendChild(dot);
        }
    }

    // 页面刚打开时先显示第一条，否则所有公告都是隐藏的
    // Show the first notice straight away, otherwise every notice would be
    // hidden until the timer fired for the first time
    showNotice(currentIndex);

    // 开始自动轮播
    // Start the automatic rotation
    startTimer();

    /* 鼠标悬停时暂停，方便阅读  */
    /* Pause while the mouse is over the notices, so they can be read */
    noticeList.addEventListener("mouseenter", function () {
        isPaused = true;
        stopTimer();
        updateLabel();
    });

    noticeList.addEventListener("mouseleave", function () {
        isPaused = false;
        startTimer();
        updateLabel();
    });

    updateLabel();
}


/* ==========================================================================
   第 4 个功能：书籍分类筛选
   FEATURE 4: BOOK CATEGORY FILTER
   --------------------------------------------------------------------------
   书单页顶部有四个按钮：全部 / 文学类 / 社科类 / 学科教材。
   按钮上的 data-filter 属性写着它对应哪个分组，
   分组 section 上的 data-category 属性是分组自己的名字，两者配对。
   The catalogue page has four buttons. Each button carries a data-filter
   attribute naming the group it controls, and each group section carries a
   matching data-category attribute.
   ========================================================================== */
function initCategoryFilter() {
    var filterButtons = document.querySelectorAll(".filter-btn");
    var groups = document.querySelectorAll(".section-book-group");

    if (filterButtons.length === 0 || groups.length === 0) {
        return;
    }

    // 教材价格参考表格里带分类标记的行
    // The rows of the price reference table that carry a category tag
    var priceRows = document.querySelectorAll(".table-price tbody tr[data-category]");

    /* 点击按钮的处理函数  */
    /* The handler for a button click */
    function applyFilter(category) {
        // 遍历所有分组
        // Loop over every group
        for (var i = 0; i < groups.length; i++) {
            var group = groups[i];

            // 选"全部"时显示所有分组
            // The "All" option shows every group
            if (category === "all") {
                group.classList.remove("is-hidden");
            } else if (group.getAttribute("data-category") === category) {
                // 只显示被选中的那个分组
                // Show only the group that was picked
                group.classList.remove("is-hidden");
            } else {
                // 其余的分组藏起来
                // Hide all the other groups
                group.classList.add("is-hidden");
            }
        }

        // 教材价格参考表格也要跟着筛选
        // The price reference table follows the same filter
        for (var r = 0; r < priceRows.length; r++) {
            var row = priceRows[r];

            if (category === "all") {
                row.classList.remove("is-hidden");
            } else if (row.getAttribute("data-category") === category) {
                row.classList.remove("is-hidden");
            } else {
                row.classList.add("is-hidden");
            }
        }

        // 同步所有按钮的高亮状态
        // Keep the highlight on the buttons in sync
        for (var j = 0; j < filterButtons.length; j++) {
            if (filterButtons[j].getAttribute("data-filter") === category) {
                filterButtons[j].classList.add("active");
            } else {
                filterButtons[j].classList.remove("active");
            }
        }
    }

    // 给每个按钮绑定点击事件
    // Attach the click handler to every button
    for (var k = 0; k < filterButtons.length; k++) {
        filterButtons[k].addEventListener("click", function (event) {
            // 取出被点击按钮的 data-filter 值
            // Read the data-filter value off the button that was clicked
            var category = event.currentTarget.getAttribute("data-filter");
            applyFilter(category);
        });
    }
}


/* ==========================================================================
   第 5 个功能：书籍分类与下方书单联动
   FEATURE 5: THE CATEGORY DROPDOWNS FILTERS THE BOOK LIST
   --------------------------------------------------------------------------
   留言板的表单里有一个「书籍分类」下拉框，下面是「想交换的书」。
   下拉框一换，下面的复选框就只显示该分类的书。
   每个复选框的 label 上都有 data-category 属性，说明它属于哪一类。
   The form has a category drop-down and, below it, a list of books to
   exchange. When the drop-down changes, only the checkboxes whose
   data-category matches that group stay visible.
   ========================================================================== */
function initCategoryToBooksLink() {
    var select = document.getElementById("category");

    if (!select) {
        return;
    }

    // 所有带 data-category 的复选项
    // Every checkbox item that carries a data-category attribute
    var items = document.querySelectorAll(".check-item[data-category]");

    if (items.length === 0) {
        return;
    }

    var hint = document.getElementById("books-hint");

    /* 根据当前分类刷新下方的书单  */
    /* Refresh the book list according to the current category */
    function refreshBooks() {
        // 取下拉框当前的值
        // Read the value currently selected in the drop-down
        var category = select.value;

        // 记录有多少本书符合当前分类
        // Count how many books match the current category
        var visibleCount = 0;

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var itemCategory = item.getAttribute("data-category");

            // 分类相同就显示，不同就藏起来
            // Show the ones that match and hide the rest
            if (category !== "" && itemCategory === category) {
                item.classList.remove("is-hidden");
                visibleCount++;
            } else {
                item.classList.add("is-hidden");
            }
        }

        // 没选分类时显示提示文字
        // Show the hint when no category has been chosen
        if (hint) {
            if (category === "") {
                hint.classList.add("is-visible");
            } else {
                hint.classList.remove("is-visible");
            }
        }
    }

    // 下拉框一变就刷新
    // The "change" event fires the moment a different option is picked
    select.addEventListener("change", refreshBooks);

    // 页面刚加载时也调一次，先把不属于任何分类的项藏起来
    // Run it once on load as well, so every book starts out hidden
    refreshBooks();
}


/* ==========================================================================
   第 5 个功能：表单必填项与邮箱格式验证
   FEATURE 5: FORM VALIDATION
   --------------------------------------------------------------------------
   留言板的表单有四个必填项：姓名、邮箱、至少选一本书、留言内容。
   提交时逐项检查，不通过就在对应位置显示红色错误提示。
   The form has four required fields: name, email, at least one book, and a
   message. Each one is checked on submit and a red message appears next to
   the field that failed.
   ========================================================================== */

/* 邮箱的正则表达式  |  The email regular expression */
var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* 显示一条错误提示  |  Show one error message */
function showError(errorId, message) {
    var box = document.getElementById(errorId);

    if (!box) {
        return;
    }

    box.textContent = message;
    box.classList.add("is-visible");
}

/* 隐藏一条错误提示  |  Hide one error message */
function hideError(errorId) {
    var box = document.getElementById(errorId);

    if (!box) {
        return;
    }

    box.textContent = "";
    box.classList.remove("is-visible");
}


/* ==========================================================================
   第 6 个功能：提交成功提示框
   FEATURE 6: SUBMISSION CONFIRMATION PANEL
   --------------------------------------------------------------------------
   表单通过验证后，页面顶部会出现一个绿色的成功提示框，
   同时把用户填写的姓名显示出来。
   Once the form passes validation, a green confirmation panel appears at the
   top of the form, showing the name that was entered.
   ========================================================================== */
function showSuccessPanel(name) {
    var form = document.getElementById("exchange-form");

    if (!form) {
        return;
    }

    // 如果已经有一个提示框，先删掉旧的
    // Remove an old panel if one is already there
    var old = document.getElementById("success-panel");
    if (old) {
        old.parentNode.removeChild(old);
    }

    // 用 createElement 生成一个 div
    // createElement builds a new div
    var panel = document.createElement("div");
    panel.id = "success-panel";
    panel.className = "success-msg";

    // innerHTML 写入内容，中文和英文都有
    // innerHTML writes the content, in both Chinese and English
    panel.innerHTML =
        "<strong>\u63d0\u4ea4\u6210\u529f\uff01 Submission received!</strong><br>" +
        "<span class=\"en-text\">\u4f60\u7684\u767b\u8bb0\u5df2\u6536\u5230\uff0c\u6211\u4eec\u4f1a\u5f88\u5feb\u4e0e\u4f60\u8054\u7cfb\u3002 " +
        "Your registration has been received and we will contact you shortly.</span>";

    // insertBefore 把提示框插到表单最前面
    // insertBefore puts the panel at the very top of the form
    form.parentNode.insertBefore(panel, form);

    // 滚动到提示框的位置，让用户马上看到
    // Scroll to the panel so the user notices it straight away
    panel.scrollIntoView({ behavior: "smooth", block: "center" });
}


/* ==========================================================================
   表单验证的主函数
   THE MAIN VALIDATION FUNCTION
   ========================================================================== */
function initFormValidation() {
    var form = document.getElementById("exchange-form");

    if (!form) {
        return;
    }

    // 表单一提交就接管，不让它真的发到服务器
    // Take over the submit event so nothing is actually sent to a server
    form.addEventListener("submit", function (event) {
        // 阻止默认提交行为
        // Prevent the default submission
        event.preventDefault();

        // 清空所有旧的错误提示
        // Clear every previous error message
        hideError("name-error");
        hideError("email-error");
        hideError("books-error");
        hideError("message-error");

        // 记录这一轮有没有出错
        // Keep track of whether anything failed this round
        var isValid = true;

        /* --- 检查姓名 --- */
        var nameInput = document.getElementById("name");
        var nameValue = nameInput ? nameInput.value.trim() : "";

        if (nameValue === "") {
            showError("name-error", "\u8bf7\u586b\u5199\u59d3\u540d Please enter your name");
            isValid = false;
        } else if (nameValue.length < 2) {
            showError("name-error", "\u59d3\u540d\u81f3\u5c11\u4e24\u4e2a\u5b57 The name needs at least two characters");
            isValid = false;
        }

        /* --- 检查邮箱格式 --- */
        var emailInput = document.getElementById("email");
        var emailValue = emailInput ? emailInput.value.trim() : "";

        if (emailValue === "") {
            showError("email-error", "\u8bf7\u586b\u5199\u90ae\u7bb1\u5730\u5740 Please enter your email address");
            isValid = false;
        } else if (!EMAIL_PATTERN.test(emailValue)) {
            showError("email-error", "\u90ae\u7bb1\u683c\u5f0f\u4e0d\u5bf9\uff0c\u8bf7\u68c0\u67e5 The email format looks wrong, please check it");
            isValid = false;
        }

        /* --- 检查是否至少选了一本书 --- */
        var bookBoxes = document.querySelectorAll('input[name="books"]:checked');

        if (bookBoxes.length === 0) {
            showError("books-error", "\u8bf7\u81f3\u5c11\u52fe\u9009\u4e00\u672c\u4e66 Please select at least one book");
            isValid = false;
        }

        /* --- 检查留言内容 --- */
        var messageInput = document.getElementById("message");
        var messageValue = messageInput ? messageInput.value.trim() : "";

        if (messageValue === "") {
            showError("message-error", "\u8bf7\u586b\u5199\u7559\u8a00\u5185\u5bb9 Please write a short message");
            isValid = false;
        } else if (messageValue.length < 10) {
            showError("message-error", "\u7559\u8a00\u5185\u5bb9\u592a\u77ed\uff0c\u8bf7\u5199\u5f97\u518d\u5177\u4f53\u4e00\u4e9b The message is too short, please add a little more detail");
            isValid = false;
        }

        /* --- 全部通过才显示成功提示 --- */
        /* Only show the confirmation when everything passed */
        if (isValid) {
            showSuccessPanel(nameValue);

            // 清空表单，让用户可以再登记一次
            // Reset the form so the user can register again
            form.reset();
        }
    });
}


/* ==========================================================================
   页面载入时启动所有功能
   RUN EVERYTHING WHEN THE PAGE LOADS
   --------------------------------------------------------------------------
   DOMContentLoaded 表示整个页面结构已经解析完毕，
   这时候才能安全地找到并操作页面上的元素。
   DOMContentLoaded fires once the whole document has been parsed, which is
   the earliest safe moment to look for and manipulate elements.

   如果脚本是在 DOMContentLoaded 之后才被加载的（缓存命中时偶尔会发生），
   readyState 已经不是 "loading"，这时直接执行即可。
   If the script happens to be evaluated after DOMContentLoaded has already
   fired, readyState is no longer "loading" and we run straight away.
   ========================================================================== */
function startEverything() {
    // 公用功能（三个页面都有）
    // Shared features (present on every page)
    initFooterYear();
    initBackToTop();

    // 首页专用
    // Home page only
    initNoticeRotation();

    // 书单页专用
    // Catalogue page only
    initCategoryFilter();

    // 留言板页专用：分类与书单联动
    // Message board page only: the category filters the book list
    initCategoryToBooksLink();

    // 留言板页专用
    // Message board page only
    initFormValidation();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startEverything);
} else {
    // DOM 已经就绪，直接启动
    // The DOM is already ready, so start immediately
    startEverything();
}
