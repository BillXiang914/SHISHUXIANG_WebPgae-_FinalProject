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
   资源版本号  |  ASSET VERSION NUMBER
   --------------------------------------------------------------------------
   图片和样式表后面都带这个数字。换图或者改样式之后，
   把这里改成 7，浏览器就会自动拉新的文件。

   The number is added to the image and style sheet links. After an
   image or the style sheet is changed, raise this number to 7 and the
   browser will fetch the new file by itself.
   ========================================================================== */
var SITE_VERSION = "13";

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
   第 7 个功能：书籍数据 + 详情页
   FEATURE 7: BOOK DATA AND THE DETAIL PAGE
   --------------------------------------------------------------------------
   外教建议点击书籍卡片能打开详情页。这里存了全部十三本书的信息，
   book.html 用地址栏里的 ?book=书名 来找到对应的一本。

   The teacher asked for a detail page that opens when a book card is
   clicked. All thirteen books are listed here. The book.html page reads
   the ?book= parameter from the address bar and finds the matching entry.
   ========================================================================== */
var BOOK_DATA = {
    "活着": {
        title: "活着", en: "To Live", writer: "余华 Yu Hua",
        category: "文学类 Literature", price: 18,
        condition: "八成新，有少量批注 Good, with a few notes",
        intro: "余华的长篇小说，叙述一个家庭四代人的命运。书中的主人公一次次失去家人，却从不曾放弃。A long novel by Yu Hua about one family over four generations, and about a man who keeps losing his family but never gives up.",
        tags: ["中文小说 Chinese novel", "家庭回忆 Family story"]
    },
    "小王子": {
        title: "小王子", en: "The Little Prince", writer: "圣埃克苏佩里 Saint-Exupéry",
        category: "文学类 Literature", price: 12,
        condition: "八成新，封面有轻微折痕 Like new, a light crease on the cover",
        intro: "一位从小星球上来的小王子，在另一颗星球上遇见一只狐狸。他用简单的话说起了爱、照顾和真正重要的事。A little prince who came from a small planet meets a fox on another one. He says simple things about love, care and what really matters.",
        tags: ["儿童文学 Children's book", "想象小说 A fable"]
    },
    "人类简史": {
        title: "人类简史", en: "Sapiens", writer: "尤瓦尔·赫拉利 Yuval Noah Harari",
        category: "社科类 Social Science", price: 25,
        condition: "八成新，封面有轻微折痕 Like new, a light crease on the cover",
        intro: "一本大体量的非小说。作者回顾了历史上的关键转折，展开了农业造就社会的全过程。A big book of non-fiction. The author looks back at the turning points of history and explains how farming led to societies like the one we live in now.",
        tags: ["历史 History", "社会科学 Social science"]
    },
    "平凡的世界": {
        title: "平凡的世界", en: "The Ordinary World", writer: "路遥 Lu Yao",
        category: "文学类 Literature", price: 20,
        condition: "八成新，有少量批注 Like new, with a few notes",
        intro: "路遥的百万字长篇，叙述孙少平一家三代人在国家变局中的命运。Lu Yao's million-word novel follows the Sun family through three generations while the country changes around them.",
        tags: ["中文小说 Chinese novel", "历史画卷 A period drama"]
    },
    "人间失格": {
        title: "人间失格", en: "No Longer Human", writer: "太宰治 Osamu Dazai",
        category: "文学类 Literature", price: 15,
        condition: "八成新，内页无批注痕迹 Like new, no marks inside",
        intro: "太宰治的自传体小说。主人公大庭叶藏离弃世界，从而开始看不见人。A famous Japanese novel by Osamu Dazai. The main character breaks off from the world and slowly stops being able to see people.",
        tags: ["日本文学 Japanese literature", "自传 A memoir"]
    },
    "追风筝的人": {
        title: "追风筝的人", en: "The Kite Runner", writer: "卡勒德·胡赛尼 Khaled Hosseini",
        category: "文学类 Literature", price: 22,
        condition: "八成新，封面有轻微磨损 Slight wear on the cover, otherwise like new",
        intro: "一个关于风筝、红色风筝与彼得的故事，叙述两个友人之间的那种爱与罪感。A story about a kite, a red kite and a boy named Peter, about the love and the guilt between two friends.",
        tags: ["历史小说 A historical novel", "人物 A character study"]
    },
    "乡土中国": {
        title: "乡土中国", en: "From the Soil", writer: "费孝通 Fei Xiaotong",
        category: "社科类 Social Science", price: 28,
        condition: "八成新，封面很新 Like new, the cover is very clean",
        intro: "费孝通从乡村社会的视角研究中国农村的民族、社会与法律。Fei Xiaotong studies the people, the society and the rules of rural China, seen from the point of view of the countryside.",
        tags: ["社会学 Social studies", "国家研究 National studies"]
    },
    "消费社会": {
        title: "消费社会", en: "The Consumer Society", writer: "让·波伏娃 Simone de Beauvoir",
        category: "社科类 Social Science", price: 20,
        condition: "八成新，内页干净 Like new, the pages are clean",
        intro: "让·波伏娃选集里的文章，讨论中国现代社会中消费的意义与种类。A collection of essays by Simone de Beauvoir about what consumption means in modern Chinese society, and what kind of society it can create.",
        tags: ["社会科学 Social science", "文集 An essay collection"]
    },
    "国家与社会": {
        title: "国家与社会", en: "The Nation and Society", writer: "托马斯·霍克马特 Carl Schmitt",
        category: "社科类 Social Science", price: 16,
        condition: "八成新，有少量批注 Like new, with a few notes",
        intro: "德国政治思想家写关于国家、民族与治理关系的经典著作。A classic work by the German political thinker on the relation between the state, the people and politics.",
        tags: ["政治学 Political theory", "经典 A classic"]
    },
    "高等数学": {
        title: "高等数学", en: "Advanced Mathematics", writer: "同济大学出版社 Tongji University Press",
        category: "学科教材 Course Books", price: 18,
        condition: "八成新，无任何批注 Like new, no notes at all",
        intro: "高等数学的通常教材，包含高等代数、简明线性代数、微积分与多变量函数、微分方程、无级数列与概率统计等章节。The usual textbook for the first year course, covering higher algebra, linear algebra, calculus, differential equations and probability.",
        tags: ["高数 Higher mathematics", "教材 A textbook"]
    },
    "数据结构": {
        title: "数据结构", en: "Data Structures", writer: "清华大学出版社 Tsinghua University Press",
        category: "学科教材 Course Books", price: 22,
        condition: "八成新，有少量批注 Like new, with a few notes",
        intro: "让·加尼阿赫的经典教材，讲讲线性表、栈、队列、树、图、排序和查找等基本数据结构。The classic textbook for students who are not in computer science. It covers lists, stacks, queues, trees, graphs, sorting and searching.",
        tags: ["计算机 Computer science", "教材 A textbook"]
    },
    "计算机网络": {
        title: "计算机网络", en: "Computer Networks", writer: "清华大学出版社 Tsinghua University Press",
        category: "学科教材 Course Books", price: 28,
        condition: "八成新，封面很新 Like new, the cover is very clean",
        intro: "计算机网络的经典教材，讲讲物理层、数据链路层、网络层、传输层和应用层。The classic textbook on computer networks, covering the physical layer, the data link layer, the network layer, the transport layer and the application layer.",
        tags: ["计算机 Computer science", "教材 A textbook"]
    },
    "普通物理": {
        title: "普通物理", en: "General Physics", writer: "高等教育出版社 Higher Education Press",
        category: "学科教材 Course Books", price: 15,
        condition: "八成新，内页有少量铅笔痕迹 Like new, a few pencil marks inside",
        intro: "普通物理的通常教材，覆盖力学、热学、振动、光学和量子物理的基础内容。The usual textbook for general physics, covering mechanics, heat, vibration, optics and quantum physics.",
        tags: ["物理 Physics", "教材 A textbook"]
    }
};


/* ==========================================================================
   第 8 个功能：渲染书籍详情页
   FEATURE 8: RENDERING THE BOOK DETAIL PAGE
   --------------------------------------------------------------------------
   从地址栏读出 ?book=书名，在 BOOK_DATA 里找到对应的一本书，
   然后把封面、书名、作者、价格、状态和简介填进页面。

   Reads the ?book= parameter from the address bar, finds the matching
   book in BOOK_DATA, and writes the cover, the title, the writer, the
   price, the condition and the description onto the page.
   ========================================================================== */
function initBookDetail() {
    var box = document.getElementById("book-detail");

    // 这个页面才需要，其他页面没有这个元素
    // Only this page needs it; the other pages have no such element
    if (!box) {
        return;
    }

    // 从地址栏取出书名  |  Pull the book title out of the address bar
    var params = new URLSearchParams(window.location.search);
    var wanted = params.get("book");

    // 没带参数，或者带了不存在的书名
    // No parameter, or a book name we do not know
    if (!wanted || !BOOK_DATA[wanted]) {
        box.innerHTML = '<div class="book-detail-missing">' +
            '<p>\u6ca1\u6709\u627e\u5230\u8fd9\u672c\u4e66\u3002</p>' +
            '<p class="en-text">We could not find that book.</p>' +
            '<a href="detail.html" class="btn-primary">\u56de\u5230\u4e66\u5355 ' +
            '<span class="en-text">Back to the Catalogue</span></a></div>';
        return;
    }

    var b = BOOK_DATA[wanted];

    // 用模板字符串拼出整块内容
    // Build the whole block from a template string
    var html =
        '<div class="book-detail-cover">' +
            '<img src="images/' + wanted + '.jpg?v=' + SITE_VERSION + '" alt="\u300a' + b.title +
            '\u300b\u5c01\u9762 Cover of ' + b.en + '">' +
        '</div>' +
        '<div class="book-detail-info">' +
            '<p class="book-detail-category">' + b.category + '</p>' +
            '<h2 class="book-detail-title">' + b.title +
                ' <span class="en-text">' + b.en + '</span></h2>' +
            '<p class="book-detail-writer">\u4f5c\u8005 Writer: ' + b.writer + '</p>' +
            '<p class="book-detail-price"><strong>\uffe5' + b.price + '</strong>' +
                ' <span class="en-text">CNY ' + b.price + '</span></p>' +
            '<p class="book-detail-condition"><span class="condition-label">' +
                '\u6210\u4e66 Condition:</span> ' + b.condition + '</p>' +
            '<p class="book-detail-intro">' + b.intro + '</p>' +
            '<p class="book-detail-tags">' +
                b.tags.map(function (t) { return '<span class="tag">' + t + '</span>'; }).join('') +
            '</p>' +
            '<div class="book-detail-actions">' +
                '<a href="contact.html?book=' + encodeURIComponent(wanted) +
                    '" class="btn-primary">\u6211\u60f3\u6362\u8fd9\u672c\u4e66 ' +
                    '<span class="en-text">I want to exchange this book</span></a>' +
                '<a href="detail.html" class="btn-secondary">\u8fd4\u56de\u4e66\u5355 ' +
                    '<span class="en-text">Back to the Catalogue</span></a>' +
            '</div>' +
        '</div>';

    box.innerHTML = html;

    // 改掉网页标签的标题，显示当前这本书
    // Put the name of this book into the tab title
    document.title = b.title + ' ' + b.en + ' | \u62fe\u4e66\u5df7 Shishuxiang';

    // 加上淡入动画
    // Add the fade-in animation
    box.classList.add("book-detail-ready");
}


/* ==========================================================================
   第 9 个功能：滚动淡入动画
   FEATURE 9: FADE IN ANIMATION WHILE SCROLLING
   --------------------------------------------------------------------------
   外教建议增加动画效果。这里让每个小节在滚动进入画面时淡入，
   看起来更有层次。IntersectionObserver 是浏览器自带的观察工具。

   The teacher asked for more animation. Each section fades in as it
   comes into view. IntersectionObserver is a tool that every current
   browser has built in, so no extra file is needed.
   ========================================================================== */
function initScrollAnimation() {
    // 找到所有需要淡入的小节
    // Find every section that should fade in
    var sections = document.querySelectorAll(".section-banner, " +
        ".section-gallery, .section-about, .section-schedule, " +
        ".section-notice, .section-page-intro, .section-book-group, " +
        ".section-price, .section-tips, .section-register, .section-faq, " +
        ".section-book-detail");

    if (sections.length === 0) {
        return;
    }

    // 先全部加上 fade-in 类，CSS 里默认是透明的
    // Give them all the class first; the CSS starts them out transparent
    for (var i = 0; i < sections.length; i++) {
        sections[i].classList.add("fade-in");
    }

    // 如果浏览器不支持 IntersectionObserver，就直接全部显示
    // If the browser does not support it, simply show everything
    if (!("IntersectionObserver" in window)) {
        for (var j = 0; j < sections.length; j++) {
            sections[j].classList.add("is-visible");
        }
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                // 进入了画面，就显示出来，并且停止观察
                // It has come into view, so show it and stop watching it
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        // 元素露出 12% 就开始动画，比完全进入画面更早一点
        // Start when 12% of the element shows, a little before it is fully in view
        threshold: 0.12
    });

    for (var k = 0; k < sections.length; k++) {
        observer.observe(sections[k]);
    }
}


/* ==========================================================================
   第 10 个功能：顶部搜索框
   FEATURE 10: THE SEARCH BOX IN THE HEADER
   --------------------------------------------------------------------------
   在搜索框里输入书名或作者，按回车，就跳到书单页，
   并且那本书会被高亮出来。

   Type a book title or a writer in the search box and press Enter. The
   site opens the catalogue and the matching book is highlighted.
   ========================================================================== */
function initHeaderSearch() {
    var form = document.getElementById("header-search-form");
    var input = document.getElementById("header-search-input");

    if (!form || !input) {
        return;
    }

    var box = form;                    /* 外面的容器  The box around the input */
    var shortHint = input.getAttribute("placeholder") || "";
    var fullHint = input.getAttribute("data-hint-full") || shortHint;

    /* 点击搜索框的时候，把框变宽，英文提示出现在右边  */
    /* On a click the box grows and the English half appears on the right */
    function openBox() {
        box.classList.add("is-expanded");
        /* 完整的提示放在 title 上，鼠标停住就能看到  */
        /* The full hint goes into the title, so it shows on hover */
        input.setAttribute("title", fullHint);
    }

    /* 点了外面之后，又变回短短的样子  */
    /* After a click somewhere else it goes back to the short form */
    function closeBox() {
        box.classList.remove("is-expanded");
        input.removeAttribute("title");
    }

    /* 输入框里有字的时候加一个记号，英文提示就让位  */
    /* A mark is set when there is text, so the English hint gives way */
    function checkText() {
        if (input.value.trim() === "") {
            box.classList.remove("has-text");
        } else {
            box.classList.add("has-text");
        }
    }

    input.addEventListener("focus", openBox);

    /* 键盘 Tab 进来的时候也要展开  */
    /* It also opens when the box is reached with the Tab key */
    input.addEventListener("click", openBox);

    /* 每次打字都检查一下有没有内容  */
    /* The text is checked on every keystroke */
    input.addEventListener("input", checkText);

    /* 点到外面就收回去。mousedown 先跑，这样点击会先被输入框接住  */
    /* A click outside puts it back. mousedown runs first, so the input */
    /* still gets the click before the box closes                       */
    document.addEventListener("mousedown", function (event) {
        if (!box.contains(event.target)) {
            closeBox();
        }
    });

    /* 按 Esc 就收回去  */
    /* The Escape key also closes it */
    input.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeBox();
            input.blur();
        }
    });

    checkText();

    form.addEventListener("submit", function (event) {
        // 阻止表单默认的跳转行为，我们自己控制
        // Stop the form's own jump, we handle it ourselves
        event.preventDefault();

        var keyword = input.value.trim();

        if (keyword === "") {
            // 没输入东西就直接去书单页
            // Nothing typed, so just open the catalogue
            window.location.href = "detail.html";
            return;
        }

        // 把关键词放进地址栏的书单页
        // Put the keyword into the catalogue page address
        window.location.href = "detail.html?search=" + encodeURIComponent(keyword);
    });
}


/* ==========================================================================
   第 11 个功能：欢迎区文字依次出现
   FEATURE 11: THE HERO TEXT APPEARS IN TURN
   --------------------------------------------------------------------------
   页面刚打开时，标题、段落、按钮依次淡入。

   When the page opens, the heading, the paragraph and the button fade in
   one after another.
   ========================================================================== */
function initHeroAnimation() {
    var banner = document.querySelector(".section-banner");

    if (!banner) {
        return;
    }

    var heading = banner.querySelector("h2");
    var paragraph = banner.querySelector("p");
    var button = banner.querySelector(".btn-primary");

    if (heading) { heading.classList.add("hero-animate", "hero-animate-1"); }
    if (paragraph) { paragraph.classList.add("hero-animate", "hero-animate-2"); }
    if (button) { button.classList.add("hero-animate", "hero-animate-3"); }
}


/* ==========================================================================
   第 12 个功能：在书单页高亮搜索结果
   FEATURE 12: HIGHLIGHTING THE SEARCH RESULT ON THE CATALOGUE PAGE
   --------------------------------------------------------------------------
   搜索页跳过来时，地址栏里带着 ?search=关键词。
   这里找到匹配的书，给它加上高亮样式。

   When the visitor arrives from the search box, the address carries
   ?search=keyword. Here we find the matching book and mark it.
   ========================================================================== */
function initSearchHighlight() {
    var params = new URLSearchParams(window.location.search);
    var keyword = params.get("search");

    if (!keyword) {
        return;
    }

    var keywordLower = keyword.toLowerCase();

    // 找到每张书卡，看卡里的文字有没有包含关键词
    // Look at every book card and see whether its text holds the keyword
    var cards = document.querySelectorAll(".book-grid-card");

    for (var i = 0; i < cards.length; i++) {
        var text = cards[i].textContent.toLowerCase();

        if (text.indexOf(keywordLower) !== -1) {
            cards[i].classList.add("search-hit");
        }
    }

    // 告诉用户找到了几本
    // Tell the visitor how many were found
    var hits = document.querySelectorAll(".book-grid-card.search-hit");

    if (hits.length > 0) {
        var note = document.createElement("p");
        note.className = "search-note";
        note.innerHTML = '\u641c\u7d22 "' + keyword + '" \u627e\u5230 ' +
            hits.length + ' \u672c\u4e66\u3002 <span class="en-text">Found ' +
            hits.length + ' book(s) for "' + keyword + '".</span>';
        var first = document.querySelector(".section-book-group");
        if (first && first.parentNode) {
            first.parentNode.insertBefore(note, first);
        }
    }
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

    // 书籍详情页专用
    // Book detail page only
    initBookDetail();

    // 动画：滚动淡入、欢迎区依次出现、搜索框
    // Animation: fade in on scroll, the hero text, the search box
    initScrollAnimation();
    initHeroAnimation();
    initHeaderSearch();
    initSearchHighlight();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startEverything);
} else {
    // DOM 已经就绪，直接启动
    // The DOM is already ready, so start immediately
    startEverything();
}
