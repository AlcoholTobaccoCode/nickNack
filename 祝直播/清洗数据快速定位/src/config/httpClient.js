const axios = require('axios');

class HttpClient {
    /**
     * 构造函数
     * @param {Object} options 配置选项
     */
    constructor(options = {}) {
        this.options = {
            baseURL: options.baseURL || '',
            timeout: options.timeout || 30000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'zh-CN,zh;q=0.9',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive',
                ...options.headers
            },
            withCredentials: options.withCredentials || false,
            responseType: options.responseType || 'json',
            maxRedirects: options.maxRedirects || 5,
            // 是否需要平台Cookie
            account: false,
            // 是否需要代理
            needProxy: true,
            // 是否「不」需要重试
            passRetries: false,
        };

        this.retryTimes = options.retryTimes || 3;
        this.retryDelay = options.retryDelay || 1000;
        this.useProxy = options.useProxy !== undefined ? options.useProxy : true;
        this.useAccount = options.useAccount !== undefined ? options.useAccount : true;

        this._initAxiosInstance();
        this._setupInterceptors();
    }

    /**
     * 初始化Axios实例
     */
    _initAxiosInstance() {
        this.instance = axios.create(this.options);
    }

    /**
     * 设置请求和响应拦截器
     */
    _setupInterceptors() {
        // 请求拦截器
        this.instance.interceptors.request.use(
            async (config) => {
                // 记录请求开始时间
                config.metadata = { startTime: Date.now() };

                // 随机 UA
                const userAgentList = [
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/133.0.0.0',
                    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3.1 Mobile/15E148 Safari/604.1',
                    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36'
                ];
                config.headers['User-Agent'] = userAgentList[Math.floor(Math.random() * userAgentList.length)];

                console.info(`发起请求: ${config.method.toUpperCase()} ${config.url}`);
                return config;
            },
            (error) => {
                console.error('请求拦截器错误:', error);
                return Promise.reject(error);
            }
        );

        // 响应拦截器
        this.instance.interceptors.response.use(
            (response) => {
                // 计算请求耗时
                const duration = Date.now() - response.config.metadata.startTime;
                console.info(
                    `请求成功: ${response.config.method.toUpperCase()} ${response.config.url} - ${response.status} (${duration}ms)`
                );

                return response;
            },
            (error) => {
                // 计算请求耗时
                if (error.config && error.config.metadata) {
                    const duration = Date.now() - error.config.metadata.startTime;
                    let errorMsg = `请求失败: ${error.config.method.toUpperCase()} ${error.config.url}`;

                    if (error.response) {
                        errorMsg += ` - ${error.response.status} ${error.response.statusText} (${duration}ms)`;
                    } else {
                        errorMsg += ` - ${error.message || '未知错误'} (${duration}ms)`;
                    }

                    console.error(errorMsg);
                } else {
                    console.error(`请求错误: ${error.message}`);
                }

                return Promise.reject(error);
            }
        );
    }

    /**
     * 执行HTTP请求并处理重试逻辑
     * @param {Function} requestFn 请求函数
     * @param {Object} config 请求配置
     * @returns {Promise} 请求结果
     */
    async _executeRequest(requestFn, config = {}) {
        // 如果设置了 passRetries，则不进行重试
        if (config.passRetries) {
            return requestFn();
        }

        // 使用配置中的重试次数，如果没有则使用默认值
        const maxRetries = config.retries !== undefined ? config.retries : this.retryTimes;
        let retries = maxRetries;

        while (retries >= 0) {
            try {
                return await requestFn();
            } catch (error) {
                console.log('config => ', config);
                console.log('error.message => ', error.message);

                if (retries <= 0) {
                    console.error(`已达到最大重试次数(${maxRetries})，请求失败: ${error.message}`);
                    // 返回错误对象而不是抛出异常
                    return {
                        success: false,
                        error: error,
                        message: error.message,
                        data: {}
                    };
                }

                // 计算重试延迟时间
                const delay = this.retryDelay * (maxRetries - retries + 1);

                console.info(`请求失败，将在${delay}ms后重试，剩余重试次数: ${retries}`);
                await new Promise(resolve => setTimeout(resolve, delay));
                retries--;
            }
        }
    }

    /**
     * 设置默认请求头
     * @param {Object} headers 要设置的请求头
     */
    setDefaultHeaders(headers) {
        this.options.headers = {
            ...this.options.headers,
            ...headers
        };
        this._initAxiosInstance(); // 重新初始化实例以应用新的默认请求头
    }

    /**
     * 获取当前的默认请求头
     * @returns {Object} 当前的默认请求头
     */
    getDefaultHeaders() {
        return { ...this.options.headers };
    }

    /**
     * 合并请求头
     * @param {Object} config 请求配置
     * @returns {Object} 合并后的请求头
     */
    _mergeHeaders(config = {}) {
        return {
            ...this.options.headers,
            ...(config.headers || {})
        };
    }

    /**
     * GET请求
     * @param {String} url 请求URL
     * @param {Object} params 请求参数
     * @param {Object} config 请求配置
     * @returns {Promise} 请求结果
     */
    async get(url, params = {}, config = {}) {
        const finalConfig = {
            ...config,
            params,
            headers: this._mergeHeaders(config)
        };

        return this._executeRequest(
            () => this.instance.get(url, finalConfig),
            finalConfig
        ).then(response => response.data);
    }

    /**
     * POST请求
     * @param {String} url 请求URL
     * @param {Object} data 请求数据
     * @param {Object} config 请求配置
     * @returns {Promise} 请求结果
     */
    async post(url, data = {}, config = {}) {
        const finalConfig = {
            ...config,
            headers: this._mergeHeaders(config)
        };

        return this._executeRequest(
            () => this.instance.post(url, data, finalConfig),
            finalConfig
        ).then(response => response.data);
    }

    /**
     * PUT请求
     * @param {String} url 请求URL
     * @param {Object} data 请求数据
     * @param {Object} config 请求配置
     * @returns {Promise} 请求结果
     */
    async put(url, data = {}, config = {}) {
        return this._executeRequest(
            () => this.instance.put(url, data, config),
            config
        ).then(response => response.data);
    }

    /**
     * DELETE请求
     * @param {String} url 请求URL
     * @param {Object} config 请求配置
     * @returns {Promise} 请求结果
     */
    async delete(url, config = {}) {
        return this._executeRequest(
            () => this.instance.delete(url, config),
            config
        ).then(response => response.data);
    }

    /**
     * 上传文件
     * @param {String} url 请求URL
     * @param {FormData} formData 表单数据
     * @param {Object} config 请求配置
     * @returns {Promise} 请求结果
     */
    async upload(url, formData, config = {}) {
        const uploadConfig = {
            ...config,
            headers: {
                ...config.headers,
                'Content-Type': 'multipart/form-data'
            }
        };

        return this._executeRequest(() =>
            this.instance.post(url, formData, uploadConfig)
        ).then(response => response.data);
    }

    /**
     * 下载文件
     * @param {String} url 请求URL
     * @param {Object} config 请求配置
     * @returns {Promise<ArrayBuffer>} 文件内容
     */
    async download(url, config = {}) {
        const downloadConfig = {
            ...config,
            responseType: 'arraybuffer'
        };

        return this._executeRequest(() =>
            this.instance.get(url, downloadConfig)
        ).then(response => {
            return {
                data: response.data,
                filename: this._getFilenameFromResponse(response),
                type: response.headers['content-type']
            };
        });
    }

    /**
     * 从响应头中获取文件名
     * @param {Object} response Axios响应对象
     * @returns {String} 文件名
     */
    _getFilenameFromResponse(response) {
        const contentDisposition = response.headers['content-disposition'];
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (filenameMatch && filenameMatch[1]) {
                return filenameMatch[1].replace(/['"]/g, '');
            }
        }

        // 从URL中提取文件名
        const url = new URL(response.config.url, response.config.baseURL);
        const pathname = url.pathname;
        return pathname.substring(pathname.lastIndexOf('/') + 1) || 'download';
    }

    /**
     * 创建自定义配置的客户端实例
     * @param {Object} options 配置选项
     * @returns {HttpClient} 新的客户端实例
     */
    static create(options = {}) {
        return new HttpClient(options);
    }
}

// 默认导出一个预配置的实例
module.exports = new HttpClient();

// // 导出类以便创建自定义实例
// module.exports = { HttpClient };