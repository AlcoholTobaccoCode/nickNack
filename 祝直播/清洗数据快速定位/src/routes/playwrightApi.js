import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

/**
 * 浏览器管理工具类
 */
export class BrowserManager {
    constructor(options = {}) {
        this.browser = null;
        this.context = null;
        this.page = null;
        this.browserEnv = null;

        // 配置项
        this.options = {
            // headless: false,
            headless: true,
            channel: 'msedge',
            ...options
        };

        // 重试次数
        this.retryCount = 0;
        this.maxRetries = 3;
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    generateBrowserEnv() {
        return {
            viewport: {
                width: this.getRandomInt(1280, 1920),
                height: this.getRandomInt(720, 1080)
            },
            userAgent: [
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
            ][this.getRandomInt(0, 2)],
            platform: ['Win32', 'Win64', 'MacIntel'][this.getRandomInt(0, 2)],
            hardwareConcurrency: this.getRandomInt(4, 16),
            deviceMemory: [2, 4, 8, 16][this.getRandomInt(0, 3)],
            languages: ['zh-CN', 'en-US', 'zh-TW'][this.getRandomInt(0, 2)]
        };
    }

    async init() {
        try {
            this.browserEnv = this.generateBrowserEnv();

            chromium.use(StealthPlugin());

            this.browser = await chromium.launch({
                headless: this.options.headless,
                channel: this.options.channel,
                args: [
                    '--disable-blink-features=AutomationControlled',
                    '--disable-features=IsolateOrigins,site-per-process',
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--inprivate',
                    '--incognito',
                    '--disable-infobars',
                    '--disable-notifications',
                    '--disable-popup-blocking',
                    '--disable-gpu',
                    '--disable-dev-shm-usage',
                    '--disable-web-security', // 禁用同源策略
                    '--disable-site-isolation-trials' // 禁用站点隔离
                ],
                ignoreDefaultArgs: ['--enable-automation'],
                ignoreHTTPSErrors: true,
                timeout: 60000 // 增加超时时间到60秒
            });

            const browserContent = {
                viewport: this.browserEnv.viewport,
                userAgent: this.browserEnv.userAgent,
                deviceScaleFactor: this.getRandomInt(1, 2),
                hasTouch: false,
                isMobile: false,
                permissions: ['geolocation'],
                locale: this.browserEnv.languages,
                timezoneId: 'Asia/Shanghai',
                geolocation: { latitude: 39.9042, longitude: 116.4074 },
                colorScheme: 'light'
            };

            this.context = await this.browser.newContext(browserContent);

            // 设置默认超时时间
            this.context.setDefaultTimeout(60000);
            this.context.setDefaultNavigationTimeout(60000);

            this.page = await this.context.newPage();
            this.page.browserRestart = this.restart.bind(this);


            console.log('浏览器初始化完成 ✨✨✨', 'col');
        } catch (error) {
            console.error(`浏览器初始化失败: ${error.message}`, 'col');
            if (this.retryCount < this.maxRetries) {
                this.retryCount++;
                console.log(`正在进行第 ${this.retryCount} 次重试...`, 'col');
                await this.close();
                return await this.init();
            }
            throw error;
        }
    }

    /**
     * 关闭浏览器
     */
    async close() {
        if (this.browser) {
            try {
                await this.browser.close();
            } catch (error) {
                console.error(`浏览器关闭失败: ${error.message}`, 'col');
            } finally {
                this.browser = null;
                this.context = null;
                this.page = null;
            }
        }
    }

    /**
     * 重启浏览器
     */
    async restart({
        firstUrl,
        secondUrl
    }) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // 增加等待时间
        await this.close();
        await this.init();
        if (firstUrl && secondUrl) {
            await this.loadPage({
                firstUrl,
                secondUrl
            });
        }
    }

    /**
     * 加载指定页面
     */
    async loadPage({
        url
    }, options = {}) {
        const {
            timeout = 60000, // 增加默认超时时间
            waitTime = 5000,
            onLoaded = null,
            onError = null
        } = options;

        try {
            // 先进入首页，获取游客 cookie
            await this.page.goto(url, {
                timeout,
            });
            await this.page.waitForTimeout(waitTime);

            if (onLoaded && typeof onLoaded === 'function') {
                await onLoaded(this.page);
            }
            return this.page;
        } catch (error) {
            console.error(`页面加载失败: ${error.message}`, 'col');
            if (onError && typeof onError === 'function') {
                await onError(error);
            }
            throw error;
        }
    }
}
