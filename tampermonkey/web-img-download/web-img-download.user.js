// ==UserScript==
// @name         Web Image Download Manager
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  网页图片下载管理器，支持批量选择和下载
// @author       Your name
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @grant        window.showDirectoryPicker
// @icon         https://nicoy.cn/favicon.ico
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href.includes('/login')) {
        return;
    }

    // 样式定义
    const styles = `
        .img-download-container {
            position: relative;
            display: inline-block;
        }
        .img-controls {
            position: absolute;
            bottom: 5px;
            right: 5px;
            display: none;
            gap: 5px;
            background: rgba(255,255,255,0.8);
            padding: 5px;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .img-download-container:hover .img-controls {
            display: flex;
        }
        .img-btn {
            cursor: pointer;
            padding: 4px 8px;
            border: none;
            border-radius: 4px;
            background: #4CAF50;
            color: white;
            font-size: 12px;
        }
        .img-btn:hover {
            opacity: 0.8;
        }
        .selected-img {
            border: 3px solid #4CAF50 !important;
        }
        .cart-btn {
            width: 40px;
            height: 40px;
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #fff;
            color: white;
            padding: 10px;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .cart-count {
            position: absolute;
            top: -5px;
            right: -5px;
            background: red;
            color: white;
            border-radius: 50%;
            padding: 2px 6px;
            font-size: 12px;
        }

        .cart-count[data-count="0"] {
            display: none;
        }

        .cart-drawer {
            position: fixed;
            top: 0;
            right: -400px;
            width: 400px;
            height: 100vh;
            background: white;
            box-shadow: -2px 0 5px rgba(0,0,0,0.1);
            transition: right 0.3s;
            z-index: 9999;
            padding: 20px;
            box-sizing: border-box;
        }
        .cart-drawer.active {
            right: 0;
        }
        .cart-drawer-mask {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.2);
            z-index: 9998;
            display: none;
        }
        .cart-drawer-mask.active {
            display: block;
        }
        .cart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        .cart-close {
            cursor: pointer;
            font-size: 24px;
        }
        .cart-actions {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
        }
        .cart-list {
            overflow-y: auto;
            height: calc(100vh - 120px);
            position: relative;
        }
        .cart-list:empty::after {
            content: "暂无数据";
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #999;
            font-size: 18px;
            letter-spacing: 2px;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
        }

        .cart-item {
            display: flex;
            align-items: center;
            padding: 10px;
            border-bottom: 1px solid #eee;
            gap: 10px;
        }
        .cart-item-image-container {
            width: 120px;
            height: 120px;
            flex-shrink: 0;
            cursor: pointer;
            overflow: hidden;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            padding: 4px 6px;
            transition: border 0.3s ease-in-out;
            border: 1px solid #e6e6e6;
        }
        .cart-item-image-container:hover {
            border: 1px solid #4CAF50;
        }

        .cart-item-image-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .cart-item-image-container .img-controls {
            display: none !important;
        }

        .cart-item-actions {
            display: flex;
            gap: 5px;
            margin-left: auto;
        }
        .preview-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 10001;
        }
        .preview-overlay.active {
            display: flex;
        }
        .preview-image {
            max-width: 90%;
            max-height: 90vh;
            object-fit: contain;
        }
        .preview-close {
            position: absolute;
            top: 20px;
            right: 20px;
            color: white;
            font-size: 30px;
            cursor: pointer;
        }

        .save-all-work-button {
            width: fit-content;
            height: 40px;
            position: fixed;
            bottom: 20px;
            right: 66px;
            background: #fff;
            color: #000;
            padding: 10px;
            border-radius: 10px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 10000;
        }

        .download-progress {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.95);
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10002;
            width: 300px;
            text-align: center;
        }

        .download-progress.active {
            display: block;
        }

        .progress-bar {
            width: 100%;
            height: 6px;
            background: #f0f0f0;
            border-radius: 3px;
            margin: 15px 0;
            overflow: hidden;
        }

        .progress-bar-inner {
            width: 0%;
            height: 100%;
            background: #4CAF50;
            transition: width 0.3s ease;
        }

        .progress-text {
            font-size: 14px;
            color: #333;
            margin: 10px 0;
        }

        .progress-status {
            margin: 10px 0;
            font-size: 13px;
            color: #666;
        }

        .progress-error {
            color: #ff4444;
            margin: 10px 0;
            font-size: 13px;
            max-height: 100px;
            overflow-y: auto;
        }

        .progress-btn {
            display: none;
            margin: 15px auto 0;
            padding: 8px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        .progress-btn:hover {
            opacity: 0.9;
        }

        .progress-btn.show {
            display: inline-block;
        }

        .progress-mask {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.3);
            z-index: 10001;
        }

        .progress-mask.active {
            display: block;
        }
    `;

    // 全局变量
    let selectedImages = new Set();
    let cartDrawerVisible = false;
    let processedImages = new WeakSet(); // 用于记录已处理过的图片

    // 日志函数
    function log(message, data = '') {
        GM_log(`[图片下载管理器] ${message}`, data);
    }

    // 添加样式
    GM_addStyle(styles);
    log('样式已加载');

    // 创建购物车按钮
    function createCartButton() {
        const cartBtn = $('<div class="cart-btn">🛒<span class="cart-count" data-count="0">0</span></div>');
        $('body').append(cartBtn);
        log('购物车按钮已创建');
        return cartBtn;
    }

    // 创建保存所有按钮
    function createSaveAllWorkButton() {
        const saveAllWorkButton = $('<div class="save-all-work-button">下载所有</div>');
        $('body').append(saveAllWorkButton);
        log('保存所有按钮已创建');
        return saveAllWorkButton;
    }

    // 创建购物车抽屉
    function createCartDrawer() {
        const drawer = $(`
            <div class="cart-drawer">
                <div class="cart-header">
                    <h2>已选择的图片</h2>
                    <span class="cart-close">×</span>
                </div>
                <div class="cart-actions">
                    <button class="img-btn" id="selectAll">全选</button>
                    <button class="img-btn" id="downloadSelected">下载选中</button>
                    <button class="img-btn" id="removeSelected">删除选中</button>
                </div>
                <div class="cart-list"></div>
            </div>
            <div class="cart-drawer-mask" id="cart-drawer-mask"></div>
        `);
        $('body').append(drawer);
        log('购物车抽屉已创建');
        return drawer;
    }

    // 创建图片预览遮罩
    function createPreviewOverlay() {
        const overlay = $(`
            <div class="preview-overlay">
                <span class="preview-close">×</span>
                <img class="preview-image" src="" alt="预览图片">
            </div>
        `);
        $('body').append(overlay);

        overlay.click(function(e) {
            if (e.target === this || $(e.target).hasClass('preview-close')) {
                overlay.removeClass('active');
            }
        });

        return overlay;
    }

    // 辅助函数：获取安全的文件名
    function getSafeFileName(name) {
        return name.replace(/[<>:"/\\|?*]+/g, '_').trim();
    }

    // 辅助函数：获取文件扩展名
    function getFileExtension(url) {
        // 正确提取图片后缀名，忽略 query string 里的 format 参数
        const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|#|$)/);
        const ext = match ? match[1].toLowerCase() : '';
        return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext) ? ext : 'jpg';
    }

    // 辅助函数：使用 GM_xmlhttpRequest 下载图片
    function fetchImage(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(response.response);
                    } else {
                        reject(new Error(`HTTP error! status: ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error('Network error: ' + error.error));
                }
            });
        });
    }

    // 辅助函数：打包下载
    function downloadToFolder(urls, folderName) {
        if (!urls || urls.length === 0) {
            log('没有可下载的图片');
            return;
        }

        folderName = getSafeFileName(folderName);
        log('开始文件夹下载模式', `共${urls.length}张图片`);

        // 使用延时队列下载，避免浏览器限制
        urls.forEach((url, idx) => {
            setTimeout(() => {
                const ext = getFileExtension(url);
                const filename = `${folderName}/image_${(idx + 1).toString().padStart(3, '0')}.${ext}`;
                downloadSingleImage(url, filename);
            }, idx * 500); // 每张图片间隔 500ms
        });
    }

    // 辅助函数：下载单张图片
    function downloadSingleImage(url, filename) {
        if (!url) {
            log('图片URL无效');
            return;
        }

        log('开始下载图片', url);
        fetchImage(url)
            .then(blob => {
                const a = document.createElement('a');
                const objectUrl = URL.createObjectURL(blob);
                a.href = objectUrl;
                a.download = filename || getSafeFileName(url.split('/').pop().split('?')[0]);
                document.body.appendChild(a);
                a.click();
                log('图片下载成功', `${a.download} (${(blob.size / 1024).toFixed(2)}KB)`);
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(objectUrl);
                }, 100);
            })
            .catch(err => {
                console.error('下载图片失败:', url, err);
                log('下载图片失败', `${url}: ${err.message}`);
            });
    }

    // 创建下载进度条
    function createProgressBar() {
        const progress = $(`
            <div class="progress-mask">
                <div class="download-progress">
                    <h3>正在下载图片</h3>
                    <div class="progress-bar">
                        <div class="progress-bar-inner"></div>
                    </div>
                    <div class="progress-text">准备开始下载...</div>
                    <div class="progress-status"></div>
                    <div class="progress-error"></div>
                    <button class="progress-btn">确定</button>
                </div>
            </div>
        `);

        // 绑定确定按钮事件
        progress.find('.progress-btn').click(() => {
            toggleProgress(false);
        });

        $('body').append(progress);
        return progress;
    }

    // 更新进度条
    function updateProgress(current, total, filename = '', error = null) {
        const percent = Math.round((current / total) * 100);
        $('.progress-bar-inner').css('width', `${percent}%`);
        $('.progress-text').text(`正在下载 ${current}/${total} (${percent}%)`);
        
        if (filename) {
            $('.progress-status').text(`当前文件: ${filename}`);
        }

        if (error) {
            const errorDiv = $('.progress-error');
            const currentErrors = errorDiv.html();
            errorDiv.html(currentErrors + `<div>❌ ${error}</div>`);
        }
    }

    // 显示/隐藏进度条
    function toggleProgress(show, forceShow = false) {
        if (!show && !forceShow) {
            $('.progress-mask, .download-progress').removeClass('active');
            // 重置进度条状态
            $('.progress-bar-inner').css('width', '0%');
            $('.progress-text').text('准备开始下载...');
            $('.progress-status').text('');
            $('.progress-error').empty();
            $('.progress-btn').removeClass('show');
        } else {
            $('.progress-mask, .download-progress').addClass('active');
        }
    }

    // 新增：使用 File System Access API 下载到文件夹
    async function downloadToFolderModern(urls, folderName) {
        if (!urls || urls.length === 0) {
            log('没有可下载的图片');
            return;
        }

        // 检查浏览器是否支持 File System Access API
        if (!window.showDirectoryPicker) {
            log('浏览器不支持现代文件系统API，切换到传统下载模式');
            downloadToFolder(urls, folderName);
            return;
        }

        try {
            log('请选择保存文件夹');
            const dirHandle = await window.showDirectoryPicker();
            
            log('开始批量下载', `共${urls.length}张图片`);
            let successCount = 0;
            let failCount = 0;

            // 显示进度条
            toggleProgress(true);
            updateProgress(0, urls.length);

            for (let i = 0; i < urls.length; i++) {
                const url = urls[i];
                try {
                    const blob = await fetchImage(url);
                    const ext = getFileExtension(url);
                    const filename = `image_${(i + 1).toString().padStart(3, '0')}.${ext}`;
                    
                    // 创建文件
                    const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
                    const writable = await fileHandle.createWritable();
                    await writable.write(blob);
                    await writable.close();
                    
                    successCount++;
                    log('图片保存成功', `${filename} (${(blob.size / 1024).toFixed(2)}KB)`);
                    updateProgress(i + 1, urls.length, filename);
                } catch (err) {
                    failCount++;
                    console.error('errorMsg =======> ', errorMsg)
                    const errorMsg = `${url.split('/').pop()}: ${err.message}`;
                    log('图片保存失败', errorMsg);
                    updateProgress(i + 1, urls.length, null, errorMsg);
                }
            }

            // 更新最终状态
            $('.progress-text').text(`下载完成！成功：${successCount}张，失败：${failCount}张`);
            if (failCount > 0) {
                $('.progress-status').text('部分图片下载失败，请查看详细信息');
                $('.progress-btn').addClass('show');
            } else {
                // 如果全部成功，3秒后自动关闭
                setTimeout(() => {
                    toggleProgress(false);
                }, 3000);
            }

            log('批量下载完成', `成功：${successCount}张，失败：${failCount}张`);
        } catch (err) {
            if (err.name === 'AbortError') {
                log('用户取消了文件夹选择');
                toggleProgress(false);
            } else {
                console.error('现代下载模式失败', err);
                log('现代下载模式失败，切换到传统下载模式', err.message);
                updateProgress(0, 0, null, '下载过程出错：' + err.message);
                $('.progress-btn').addClass('show');
            }
        }
    }

    // 修改下载图片函数
    function downloadImage(urls) {
        if (!urls || (Array.isArray(urls) && urls.length === 0)) {
            log('没有可下载的图片');
            return;
        }
        
        const pageTitle = getSafeFileName(document.title || 'download');

        // 转换单个URL为数组
        const urlsArray = Array.isArray(urls) ? urls : [urls];

        // 过滤掉无效的URL
        const validUrls = urlsArray.filter(url => {
            if (!url || typeof url !== 'string') {
                log('发现无效URL', url);
                return false;
            }
            return true;
        });

        if (validUrls.length === 0) {
            log('没有有效的图片URL');
            return;
        }

        if (validUrls.length === 1) {
            log('下载单张图片', validUrls[0]);
            downloadSingleImage(validUrls[0]);
            return;
        }

        log('开始批量下载', `共${validUrls.length}张图片`);
        downloadToFolderModern(validUrls, pageTitle);
    }

    // 更新购物车计数
    function updateCartCount() {
        $('.cart-count').text(selectedImages.size).attr('data-count', selectedImages.size);
        log('购物车计数更新', selectedImages.size);
    }

    // 更新购物车列表
    function updateCartList() {
        const cartList = $('.cart-list');
        cartList.empty();
        
        selectedImages.forEach(url => {
            const item = $(`
                <div class="cart-item">
                    <input type="checkbox" class="cart-item-check">
                    <div class="cart-item-image-container">
                        <img src="${url}" alt="已选图片">
                    </div>
                    <div class="cart-item-actions" data-url="${url}">
                        <button class="img-btn download-btn cart-list-download-btn">下载</button>
                        <button class="img-btn remove-btn cart-list-remove-btn">删除</button>
                    </div>
                </div>
            `);

            // 绑定预览事件
            item.find('.cart-item-image-container').click(function() {
                const overlay = $('.preview-overlay');
                overlay.find('.preview-image').attr('src', url);
                overlay.addClass('active');
            });

            cartList.append(item);
        });
        log('购物车列表已更新', selectedImages.size);
    }

    // 处理图片
    function processImage(img) {
        // 如果已经处理过，直接返回
        if (processedImages.has(img)) {
            return;
        }

        // 检查图片是否符合条件
        const checkImage = () => {
            if (img.naturalWidth < 100 || img.naturalHeight < 100) return false;
            const ext = img.src.split('.').pop().toLowerCase();
            if (['bmp', 'tiff', 'ico'].includes(ext)) return false;
            return true;
        };

        if (!checkImage()) {
            processedImages.add(img); // 记录不符合条件的图片，避免重复处理
            return;
        }

        // 创建控制容器
        const container = $('<div class="img-download-container"></div>');
        $(img).wrap(container);

        // 添加控制按钮
        const controls = $(`
            <div class="img-controls">
                <button class="img-btn select-btn">${selectedImages.has(img.src) ? '取消' : '选择'}</button>
                <button class="img-btn download-btn">下载</button>
            </div>
        `);
        $(img).after(controls);

        // 绑定事件
        controls.find('.select-btn').click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            const imgUrl = img.src;
            if (selectedImages.has(imgUrl)) {
                selectedImages.delete(imgUrl);
                $(img).removeClass('selected-img');
                $(this).text('选择');
                log('图片已取消选择', imgUrl);
            } else {
                selectedImages.add(imgUrl);
                $(img).addClass('selected-img');
                $(this).text('取消');
                log('图片已选择', imgUrl);
            }
            updateCartCount();
        });

        controls.find('.download-btn').click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            downloadImage(img.src);
        });

        processedImages.add(img); // 记录已处理的图片
        log('图片已处理', img.src);
    }

    // 初始化
    function init() {
        log('开始初始化脚本');
        const cartBtn = createCartButton();
        const cartDrawer = createCartDrawer();
        createPreviewOverlay();
        createProgressBar();

        // 监测当前 url 中是否存在指定关键字
        const keywords = [
            'zcool'
        ];

        let saveAllWorkButton = null;
        if (keywords.some(keyword => window.location.href.includes(keyword))) {
            saveAllWorkButton = createSaveAllWorkButton();
        }

        // 处理现有图片
        $('img').each((_, img) => {
            if (img.complete) {
                processImage(img);
            } else {
                img.onload = () => processImage(img);
            }
        });

        // 使用防抖处理动态加载的图片
        const debounce = (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };

        // 监听动态加载的图片
        const observer = new MutationObserver(debounce((mutations) => {
            log('检测到页面变化，开始处理新图片');
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName === 'IMG') {
                        if (node.complete) {
                            processImage(node);
                        } else {
                            node.onload = () => processImage(node);
                        }
                    }
                    $(node).find('img').each((_, img) => {
                        if (img.complete) {
                            processImage(img);
                        } else {
                            img.onload = () => processImage(img);
                        }
                    });
                });
            });
        }, 200)); // 200ms 的防抖时间

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        log('MutationObserver 已启动');

        // 购物车点击事件
        cartBtn.click(() => {
            cartDrawerVisible = !cartDrawerVisible;
            cartDrawer.toggleClass('active');
            if (cartDrawerVisible) {
                updateCartList(); // 只在打开时更新列表
            }
            log('购物车抽屉状态切换', cartDrawerVisible);
        });

        // 关闭购物车
        $('.cart-close').click(() => {
            cartDrawerVisible = false;
            cartDrawer.removeClass('active');
            log('购物车抽屉已关闭');
        });

        // 全选按钮
        $('#selectAll').click(() => {
            $('.cart-item-check').prop('checked', true);
            log('已全选购物车中的图片');
        });

        // 下载所有图片
        saveAllWorkButton?.click(() => {
            log('开始下载所有图片');
            const images = document.querySelectorAll('.photoImage');
            // const urls = Array.from(images).map(img => img.src);
            // downloadImage(urls);
            // 记录当前 scroll 位置
            const scrollTop = window.scrollY;
            // 滚动到最后一个 images 所在位置
            const lastImgY = images[images.length - 1]?.getBoundingClientRect?.()?.y;
            if (!lastImgY) {
                alert('没有找到图片');
                return;
            };
            window.scrollTo({
                top: lastImgY,
                // behavior: 'smooth'
            });

            setTimeout(() => {
                // 滚动回原来的位置
                window.scrollTo({
                    top: scrollTop,
                    behavior: 'smooth'
                });
                const urls = Array.from(images).map(img => img.src);
                downloadImage(urls);
            }, 100);
        });

        // 下载选中图片
        $('#downloadSelected').click(() => {
            const selectedCount = $('.cart-item-check:checked').length;
            log('开始批量下载', selectedCount);
            const urls = [];
            $('.cart-item-check:checked').each((_, checkbox) => {
                const url = $(checkbox).closest('.cart-item').find('img').attr('src');
                urls.push(url);
            });

            downloadImage(urls);
        });

        // 删除选中图片
        $('#removeSelected').click(() => {
            const selectedCount = $('.cart-item-check:checked').length;
            log('开始批量删除', selectedCount);
            $('.cart-item-check:checked').each((_, checkbox) => {
                const item = $(checkbox).closest('.cart-item');
                const url = item.find('img').attr('src');
                const decodeUrl = decodeURIComponent(url);
                selectedImages.delete(url);
                $(`img[src="${url}"]`).removeClass('selected-img');
                $(`img[src="${decodeUrl}"]`).removeClass('selected-img');
                item.remove();
            });
            updateCartCount();
        });

        // 点击遮罩关闭购物车
        $(document).on('click', '#cart-drawer-mask', () => {
            cartDrawerVisible = false;
            cartDrawer.removeClass('active');
            log('购物车抽屉已关闭');
        });

        // 购物车列表下载按钮
        $(document).on('click', '.cart-list-download-btn', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const url = $(this).parent().data('url');
            downloadImage(url);
        });

        // 购物车列表删除按钮
        $(document).on('click', '.cart-list-remove-btn', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const url = $(this).parent().data('url');
            const decodeUrl = decodeURIComponent(url);
            selectedImages.delete(url);
            // 原页面中元素取消高亮
            document.querySelectorAll(`img[src="${url}"]`)?.forEach(img => img.classList.remove('selected-img'));
            document.querySelectorAll(`img[src="${decodeUrl}"]`)?.forEach(img => img.classList.remove('selected-img'));
            // 删除当前列元素
            $(this).parents('.cart-item').remove();
            updateCartCount();
        });

        log('脚本初始化完成');
    }

    // 等待 jQuery 加载完成后初始化
    if (window.jQuery) {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})(); 