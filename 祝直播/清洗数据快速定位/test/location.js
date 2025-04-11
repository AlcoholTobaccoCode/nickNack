// ==UserScript==
// @name         直播间定位工具
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  直播间定位工具
// @author       duqings
// @match        *://zhibo-test.yeeshun.net/*
// @match        *://localhost/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    const BASE_URL = 'http://124.222.150.175:40001';
    // const BASE_URL = 'http://localhost:40001';

    // 添加样式
    GM_addStyle(`
        .location-tool {
            position: fixed;
            top: 100px;
            right: 100px;
            z-index: 9999;
            background: white;
            padding: 10px;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            cursor: move;
            user-select: none;
            min-width: 250px;
        }
        .location-tool.collapsed {
            min-width: auto;
            padding: 5px;
        }
        .location-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            padding-bottom: 4px;
            border-bottom: 1px solid #f0f0f0;
        }
        .location-title {
            font-weight: bold;
            font-size: 14px;
            color: #333;
        }
        .location-controls {
            display: flex;
            gap: 8px;
        }
        .location-control-btn {
            cursor: pointer;
            padding: 2px 4px;
            color: #666;
            background: none;
            border: none;
            font-size: 12px;
        }
        .location-control-btn:hover {
            color: #1890ff;
        }
        .location-content {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .location-content.hidden {
            display: none;
        }
        .location-input {
            padding: 4px 8px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            width: 200px;
        }
        .location-button-group {
            display: flex;
            gap: 8px;
        }
        .location-button {
            padding: 4px 15px;
            background: #1890ff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            flex: 1;
        }
        .location-button.clear {
            background: #ff4d4f;
        }
        .location-button.clear-url {
            background: #ff4d4f;
            width: 100%;
        }
        .url-section {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #f0f0f0;
        }
        .location-textarea {
            padding: 4px 8px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            width: 200px;
            resize: vertical;
            min-height: 60px;
        }
        .error-message {
            color: red;
            font-size: 12px;
            margin-top: 4px;
        }
        .task-msg {
            font-size: 12px;
            color: #666;
            word-break: break-all;
        }
        .highlight-row {
            background-color: #ffd591 !important;
            transition: background-color 0.3s;
        }
    `);

    // 创建GUI界面
    function createGUI() {
        const container = document.createElement('div');
        container.className = 'location-tool';
        
        // 添加头部
        const header = document.createElement('div');
        header.className = 'location-header';
        
        const title = document.createElement('div');
        title.className = 'location-title';
        title.textContent = '直播间定位工具';
        
        const controls = document.createElement('div');
        controls.className = 'location-controls';
        
        const collapseBtn = document.createElement('button');
        collapseBtn.className = 'location-control-btn';
        collapseBtn.innerHTML = '收起';
        
        controls.appendChild(collapseBtn);
        header.appendChild(title);
        header.appendChild(controls);
        
        // 添加内容区
        const content = document.createElement('div');
        content.className = 'location-content';
        
        const input = document.createElement('input');
        input.className = 'location-input';
        input.placeholder = '请输入房间ID';
        
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'location-button-group';
        
        const locateButton = document.createElement('button');
        locateButton.className = 'location-button';
        locateButton.textContent = '定位';
        
        const clearButton = document.createElement('button');
        clearButton.className = 'location-button clear';
        clearButton.textContent = '清除';
        
        buttonGroup.appendChild(locateButton);
        buttonGroup.appendChild(clearButton);

        // 添加URL部分
        const urlSection = document.createElement('div');
        urlSection.className = 'url-section';
        
        const urlInput = document.createElement('textarea');
        urlInput.className = 'location-textarea';
        urlInput.placeholder = '请输入房间URL';
        
        const urlClearButton = document.createElement('button');
        urlClearButton.className = 'location-button clear-url';
        urlClearButton.textContent = '删除';
        
        urlSection.appendChild(urlInput);
        urlSection.appendChild(urlClearButton);
        
        const taskMsg = document.createElement('div');
        taskMsg.className = 'task-msg';
        
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        
        content.appendChild(input);
        content.appendChild(buttonGroup);
        content.appendChild(urlSection);
        content.appendChild(errorMsg);
        content.appendChild(taskMsg);
        
        container.appendChild(header);
        container.appendChild(content);
        document.body.appendChild(container);

        // 添加拖拽功能
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        function dragStart(e) {
            if (e.target.closest('.location-button') || e.target.closest('.location-input')) {
                return;
            }
            
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === header || e.target.closest('.location-header')) {
                isDragging = true;
            }
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;

                container.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        }

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        // 添加收缩功能
        let isCollapsed = false;
        collapseBtn.addEventListener('click', () => {
            isCollapsed = !isCollapsed;
            content.classList.toggle('hidden');
            container.classList.toggle('collapsed');
            collapseBtn.innerHTML = isCollapsed ? '展开' : '收起';
        });

        // 添加清除功能
        function clearAll() {
            input.value = '';
            taskMsg.textContent = '';
            errorMsg.textContent = '';
            // 清除表格高亮
            document.querySelectorAll('.highlight-row').forEach(el => {
                el.classList.remove('highlight-row');
            });
        }

        clearButton.addEventListener('click', clearAll);

        // URL输入框失焦事件
        urlInput.addEventListener('blur', async () => {
            const url = urlInput.value.trim();
            if (!url) return;

            try {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${BASE_URL}/api/getSourceTasks?url=${encodeURIComponent(url)}`,
                    onload: function(response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.code === 200 && data.data) {
                                window.sourceTaskData = data.data;
                                taskMsg.innerHTML = `找到源任务ID: ${data.data.id} <br /> room_id: ${data.data.room_id} <br /> 创建人: ${data.data.createBy}/${data.data.source} <br /> 创建时间: ${data.data.createTime}`;
                            } else {
                                window.sourceTaskData = null;
                                taskMsg.textContent = '未找到相关任务';
                            }
                        } catch (error) {
                            errorMsg.textContent = `解析数据失败: ${error.message}`;
                            window.sourceTaskData = null;
                        }
                    },
                    onerror: function(error) {
                        errorMsg.textContent = `查询失败: ${error.message}`;
                        window.sourceTaskData = null;
                    }
                });
            } catch (error) {
                errorMsg.textContent = `请求失败: ${error.message}`;
                window.sourceTaskData = null;
            }
        });

        // URL删除按钮点击事件
        urlClearButton.addEventListener('click', async () => {
            if (!window.sourceTaskData || !window.sourceTaskData.id) {
                errorMsg.textContent = '没有可删除的任务';
                return;
            }

            const shouldDelete = window.confirm('确定要删除该任务吗？');
            if (!shouldDelete) return;

            try {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${BASE_URL}/api/deleteSourceTasks?id=${window.sourceTaskData.id}&room_id=${window.sourceTaskData.room_id}`,
                    onload: function(response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.code === 200) {
                                window.sourceTaskData = null;
                                urlInput.value = '';
                                taskMsg.textContent = '删除成功';
                                errorMsg.textContent = '';
                                alert('删除成功');
                                setTimeout(() => {
                                    taskMsg.textContent = '';
                                }, 2000);
                            } else {
                                throw new Error(data.message || '删除失败');
                            }
                        } catch (error) {
                            errorMsg.textContent = `删除失败: ${error.message}`;
                        }
                    },
                    onerror: function(error) {
                        errorMsg.textContent = `删除请求失败: ${error.message}`;
                    }
                });
            } catch (error) {
                errorMsg.textContent = `发起删除请求失败: ${error.message}`;
            }
        });

        return { 
            input, 
            locateButton, 
            clearButton, 
            errorMsg, 
            taskMsg,
            clearAll 
        };
    }

    // 调用API获取数据
    async function fetchTaskData(roomId) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${BASE_URL}/api/tasks?room_id=${roomId}`,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data);
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // 定位到指定页面
    async function navigateToPage(targetPage) {
        const paginationList = document.querySelector('.ant-pagination');
        if (!paginationList) return false;

        const currentPage = parseInt(document.querySelector('.ant-pagination-item-active')?.textContent || '1');
        
        // 如果目标页码超出范围
        const lastPageElement = Array.from(document.querySelectorAll('.ant-pagination-item')).pop();
        const maxPage = parseInt(lastPageElement?.textContent || '1');
        
        if (targetPage > maxPage) {
            throw new Error(`目标页码 ${targetPage} 超出最大页数 ${maxPage}`);
        }

        if (targetPage !== currentPage) {
            // 如果目标页面在当前可见的页码中
            let pageLink = document.querySelector(`.ant-pagination-item-${targetPage}`);
            
            if (!pageLink) {
                // 如果目标页不可见，需要使用快速跳转
                const jumper = document.querySelector('.ant-pagination-options-quick-jumper input');
                if (jumper) {
                    jumper.value = targetPage;
                    jumper.dispatchEvent(new Event('input'));
                    
                    // 模拟回车键
                    const enterEvent = new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        bubbles: true
                    });
                    jumper.dispatchEvent(enterEvent);
                }
            } else {
                pageLink.querySelector('a')?.click();
            }

            // 等待页面加载和渲染
            await new Promise(resolve => setTimeout(resolve, 1000));
            return true;
        }
        return true;
    }

    // 高亮指定行
    function highlightRow(taskId) {
        // 移除之前的高亮
        document.querySelectorAll('.highlight-row').forEach(el => {
            el.classList.remove('highlight-row');
        });

        // 选择实际的数据行（跳过度量行）
        const rows = Array.from(document.querySelectorAll('.ant-table-tbody tr')).filter(row => 
            !row.classList.contains('ant-table-measure-row')
        );

        for (const row of rows) {
            const idCell = row.querySelector('td:first-child');
            if (idCell && idCell.textContent.trim() === taskId.toString()) {
                row.classList.add('highlight-row');
                row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return true;
            }
        }
        return false;
    }

    // 获取分页信息
    function getPaginationInfo() {
        // 获取页面大小
        const pageSizeText = document.querySelector('.ant-pagination-options .ant-select-selection-item')?.textContent;
        const pageSize = pageSizeText ? parseInt(pageSizeText) : 20;

        // 获取总页数
        const paginationItems = document.querySelectorAll('.ant-pagination-item');
        const lastPageItem = Array.from(paginationItems).pop();
        const totalPages = lastPageItem ? parseInt(lastPageItem.textContent) : 1;

        // 获取当前页码
        const currentPage = parseInt(document.querySelector('.ant-pagination-item-active')?.textContent || '1');

        return {
            pageSize,
            totalPages,
            currentPage
        };
    }

    // 更新查找目标行并定位的函数
    async function locateTargetRow(taskData) {
        const targetId = taskData.data.id;
        
        // 先在当前页查找
        if (highlightRow(targetId)) {
            return true;
        }

        // 获取分页信息
        const { pageSize, totalPages, currentPage } = getPaginationInfo();
        
        // 计算目标页码
        let targetPage = Math.ceil(targetId / pageSize);

        // 检查目标页码是否有效
        if (targetPage > totalPages) {
            // throw new Error(`计算的目标页码 ${targetPage} 超出总页数 ${totalPages}`);
            targetPage = totalPages;
        }

        try {
            // 如果目标页码与当前页码不同，进行跳转
            if (targetPage !== currentPage) {
                const navigated = await navigateToPage(targetPage);
                if (navigated) {
                    // 等待内容加载
                    await new Promise(resolve => setTimeout(resolve, 500));
                    if (highlightRow(targetId)) {
                        return true;
                    }
                }
            }
        } catch (error) {
            throw new Error(`定位失败: ${error.message}`);
        }
        
        throw new Error(`未找到ID为 ${targetId} 的记录`);
    }

    // 主函数
    function init() {
        const { input, locateButton, clearButton, errorMsg, taskMsg, clearAll } = createGUI();

        locateButton.addEventListener('click', async () => {
            const roomId = input.value.trim();
            errorMsg.textContent = '';
            locateButton.disabled = true;
            clearButton.disabled = true;
            locateButton.textContent = '定位中...';

            try {
                if (!roomId) {
                    throw new Error('请输入房间ID');
                }

                const data = await fetchTaskData(roomId);
                if (data.code === 200) {
                    taskMsg.innerHTML = `找到任务ID: ${data.data.id} <br /> 直播间地址: ${data.data.liveUrl}`;
                    await locateTargetRow(data);
                } else {
                    throw new Error(data.message || '查询失败');
                }
            } catch (error) {
                errorMsg.textContent = error.message;
                console.error('Error:', error);
            } finally {
                locateButton.disabled = false;
                clearButton.disabled = false;
                locateButton.textContent = '定位';
            }
        });

        // 添加回车键支持
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !locateButton.disabled) {
                locateButton.click();
            }
        });
    }

    // 启动脚本
    init();
})();
