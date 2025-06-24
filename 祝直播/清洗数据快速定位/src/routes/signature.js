/*
 * @Description:
 * @Author: WeiDengYang
 * @Date: 2024-07-19 11:21:29
 * @LastEditors: WeiDengYang
 * @LastEditTime: 2024-08-05 22:33:38
 */
/**
 * 将字符串转换为字节数组
 * @param {string} str 输入字符串
 * @returns {number[]} 字节数组
 */
const stringToBytes = (str) => {
    const encoded = decodeURIComponent(encodeURIComponent(str));
    const bytes = [];
    for (let i = 0; i < encoded.length; i++) {
        bytes.push(encoded.charCodeAt(i) & 0xFF);
    }
    return bytes;
};

/**
 * 将字节数组转换为字符串
 * @param {number[]} bytes 字节数组
 * @returns {string} 字符串
 */
const bytesToString = (bytes) => {
    return bytes.map(byte => String.fromCharCode(byte)).join('');
};

/**
 * 将字节数组转换为32位字数组
 * @param {number[]} bytes 字节数组
 * @returns {number[]} 32位字数组
 */
const bytesToWords = (bytes) => {
    const words = [];
    for (let i = 0, b = 0; i < bytes.length; i++, b += 8) {
        words[b >>> 5] |= (bytes[i] & 0xFF) << (24 - b % 32);
    }
    return words;
};

/**
 * 将32位字数组转换为字节数组
 * @param {number[]} words 32位字数组
 * @returns {number[]} 字节数组
 */
const wordsToBytes = (words) => {
    const bytes = [];
    for (let i = 0; i < words.length * 32; i += 8) {
        bytes.push((words[i >>> 5] >>> (24 - i % 32)) & 0xFF);
    }
    return bytes;
};

/**
 * 将字节数组转换为16进制字符串
 * @param {number[]} bytes 字节数组
 * @returns {string} 16进制字符串
 */
const bytesToHex = (bytes) => {
    return bytes.map(byte => {
        const hex = byte.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
};

/**
 * MD5 转换函数 F
 */
const _ff = (a, b, c, d, x, s, t) => {
    const n = a + ((b & c) | (~b & d)) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
};

/**
 * MD5 转换函数 G
 */
const _gg = (a, b, c, d, x, s, t) => {
    const n = a + ((b & d) | (c & ~d)) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
};

/**
 * MD5 转换函数 H
 */
const _hh = (a, b, c, d, x, s, t) => {
    const n = a + (b ^ c ^ d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
};

/**
 * MD5 转换函数 I
 */
const _ii = (a, b, c, d, x, s, t) => {
    const n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
};

/**
 * 循环左移
 */
const rotl = (n, b) => (n << b) | (n >>> (32 - b));

/**
 * 字节序转换
 */
const endian = (n) => {
    if (typeof n === 'number') {
        return (rotl(n, 8) & 0x00FF00FF) | (rotl(n, 24) & 0xFF00FF00);
    }
    return n.map(x => endian(x));
};

function un(t, n) {
    t = stringToBytes(t);
    let e = bytesToWords(t),
        r = 8 * t.length,
        o = 1732584193,
        i = -271733879,
        u = -1732584194,
        l = 271733878;
    for (let t = 0; t < e.length; t++) e[t] = 16711935 & (e[t] << 8 | e[t] >>> 24) | 4278255360 & (e[t] << 24 | e[t] >>> 8);
    e[r >>> 5] |= 128 << r % 32, e[14 + (r + 64 >>> 9 << 4)] = r;
    let f = _ff,
        s = _gg,
        c = _hh,
        d = _ii;
    for (let p = 0; p < e.length; p += 16) {
        var g = o,
            _ = i,
            h = u,
            a = l;
        o = d(o = c(o = c(o = c(o = c(o = s(o = s(o = s(o = s(o = f(o = f(o = f(o = f(o, i, u, l, e[p + 0], 7, -680876936), i = f(i, u = f(u, l = f(l, o, i, u, e[p + 1], 12, -389564586), o, i, e[p + 2], 17, 606105819), l, o, e[p + 3], 22, -1044525330), u, l, e[p + 4], 7, -176418897), i = f(i, u = f(u, l = f(l, o, i, u, e[p + 5], 12, 1200080426), o, i, e[p + 6], 17, -1473231341), l, o, e[p + 7], 22, -45705983), u, l, e[p + 8], 7, 1770035416), i = f(i, u = f(u, l = f(l, o, i, u, e[p + 9], 12, -1958414417), o, i, e[p + 10], 17, -42063), l, o, e[p + 11], 22, -1990404162), u, l, e[p + 12], 7, 1804603682), i = f(i, u = f(u, l = f(l, o, i, u, e[p + 13], 12, -40341101), o, i, e[p + 14], 17, -1502002290), l, o, e[p + 15], 22, 1236535329), u, l, e[p + 1], 5, -165796510), i = s(i, u = s(u, l = s(l, o, i, u, e[p + 6], 9, -1069501632), o, i, e[p + 11], 14, 643717713), l, o, e[p + 0], 20, -373897302), u, l, e[p + 5], 5, -701558691), i = s(i, u = s(u, l = s(l, o, i, u, e[p + 10], 9, 38016083), o, i, e[p + 15], 14, -660478335), l, o, e[p + 4], 20, -405537848), u, l, e[p + 9], 5, 568446438), i = s(i, u = s(u, l = s(l, o, i, u, e[p + 14], 9, -1019803690), o, i, e[p + 3], 14, -187363961), l, o, e[p + 8], 20, 1163531501), u, l, e[p + 13], 5, -1444681467), i = s(i, u = s(u, l = s(l, o, i, u, e[p + 2], 9, -51403784), o, i, e[p + 7], 14, 1735328473), l, o, e[p + 12], 20, -1926607734), u, l, e[p + 5], 4, -378558), i = c(i, u = c(u, l = c(l, o, i, u, e[p + 8], 11, -2022574463), o, i, e[p + 11], 16, 1839030562), l, o, e[p + 14], 23, -35309556), u, l, e[p + 1], 4, -1530992060), i = c(i, u = c(u, l = c(l, o, i, u, e[p + 4], 11, 1272893353), o, i, e[p + 7], 16, -155497632), l, o, e[p + 10], 23, -1094730640), u, l, e[p + 13], 4, 681279174), i = c(i, u = c(u, l = c(l, o, i, u, e[p + 0], 11, -358537222), o, i, e[p + 3], 16, -722521979), l, o, e[p + 6], 23, 76029189), u, l, e[p + 9], 4, -640364487), i = c(i, u = c(u, l = c(l, o, i, u, e[p + 12], 11, -421815835), o, i, e[p + 15], 16, 530742520), l, o, e[p + 2], 23, -995338651), u, l, e[p + 0], 6, -198630844), i = d(i = d(i = d(i = d(i, u = d(u, l = d(l, o, i, u, e[p + 7], 10, 1126891415), o, i, e[p + 14], 15, -1416354905), l, o, e[p + 5], 21, -57434055), u = d(u, l = d(l, o = d(o, i, u, l, e[p + 12], 6, 1700485571), i, u, e[p + 3], 10, -1894986606), o, i, e[p + 10], 15, -1051523), l, o, e[p + 1], 21, -2054922799), u = d(u, l = d(l, o = d(o, i, u, l, e[p + 8], 6, 1873313359), i, u, e[p + 15], 10, -30611744), o, i, e[p + 6], 15, -1560198380), l, o, e[p + 13], 21, 1309151649), u = d(u, l = d(l, o = d(o, i, u, l, e[p + 4], 6, -145523070), i, u, e[p + 11], 10, -1120210379), o, i, e[p + 2], 15, 718787259), l, o, e[p + 9], 21, -343485551), o = o + g >>> 0, i = i + _ >>> 0, u = u + h >>> 0, l = l + a >>> 0
    }
    return endian([o, i, u, l])
}

export function getSTUB(t) {
    let n = wordsToBytes(un(t));
    return bytesToHex(n)
}

export const getSign = async (page, t, n) => {
    return new Promise(async (resolve, reject) => {
        const e = {
            "X-MS-STUB": getSTUB(`live_id=1,aid=6383,version_code=180800,webcast_sdk_version=1.3.0,room_id=${roomId},sub_room_id=,sub_channel_id=,did_rule=3,user_unique_id=${n},device_platform=web,device_type=,ac=,identity=audience`)
        };
        const signature = await page.evaluate((e) => {
            return window.byted_acrawler.frontierSign(e);
        }, e);
        resolve(signature);
    });
};

export const getWssUrl = async (page, roomId) => {
    return new Promise(async (resolve, reject) => {
        const uniqueId = await page.evaluate(() => {
            const tokens_7497 = localStorage.getItem('__tea_cache_tokens_7497');
            const tokens_7497_json = JSON.parse(tokens_7497);
            return tokens_7497_json.user_unique_id;
        });
        const e = {
            "X-MS-STUB": getSTUB(`live_id=1,aid=6383,version_code=180800,webcast_sdk_version=1.3.0,room_id=${roomId},sub_room_id=,sub_channel_id=,did_rule=3,user_unique_id=${uniqueId},device_platform=web,device_type=,ac=,identity=audience`)
        };
        const getXBogus = await page.evaluate((e) => {
            return window.byted_acrawler.frontierSign(e);
        }, e);
        const signature = getXBogus?.['X-Bogus'];
        const now = Date.now();

        const wsUrl = `wss://webcast3-ws-web-hl.douyin.com/webcast/im/push/v2/?app_name=douyin_web&version_code=180800&webcast_sdk_version=1.3.0&update_version_code=1.3.0&compress=gzip&internal_ext=internal_src:dim|wss_push_room_id:${roomId}|wss_push_did:${uniqueId}|fetch_time:${now}|seq:1|wss_info:0-${now}-0-0&cursor=t-${now}_r-1_d-1_u-1_h-1&host=https://live.douyin.com&aid=6383&live_id=1&did_rule=3&debug=false&maxCacheMessageNumber=20&endpoint=live_pc&support_wrds=1&im_path=/webcast/im/fetch/&user_unique_id=${uniqueId}&device_platform=web&cookie_enabled=true&screen_width=1920&screen_height=1080&browser_language=zh-CN&browser_platform=Win32&browser_name=Mozilla&browser_version=5.0%20(Windows%20NT%2010.0;%20Win64;%20x64)%20AppleWebKit/537.36%20(KHTML,%20like%20Gecko)%20Chrome/111.0.0.0%20Safari/537.36%20Edg/111.0.1661.62&browser_online=true&tz_name=Asia/Shanghai&identity=audience&room_id=${roomId}&heartbeatDuration=0&signature=${signature}`

        resolve(wsUrl);
    });
};
