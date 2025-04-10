
const getDYSearch = async () => {
    const allLiveUrls = [];
    
    // 循环请求10页数据
    for(let page = 0; page < 10; page++) {
        console.info(`请求第${page}页`);
        const params = new URLSearchParams({
            aid: '6383',
            device_platform: 'webapp',
            keyword: '女装',
            offset: page,
            count: '15',
            search_channel: 'aweme_live',
            search_source: 'switch_tab', 
            query_correct_type: '1',
            is_filter_search: '0',
            from_group_id: '',
            sort_type: '0',
            publish_time: '0',
            enter_from: 'homepage_hot'
        });

        const list = await fetch(`https://www.douyin.com/aweme/v1/web/live/search/?${params}`, {
            headers: {
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'zh-CN,zh;q=0.9',
                'cache-control': 'no-cache',
                'pragma': 'no-cache',
                'sec-ch-ua': '"Not(A:Brand";v="24", "Chromium";v="122"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'referer': `https://www.douyin.com/search/${encodeURIComponent('女装')}?aid=6383&enter_from=homepage_hot`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0',
                'cookie': 'UIFID_TEMP=a061b0aeafc5f81960457244188fc0aa90cbddf27d4ca38da72bcf4a38905bfbd80b3aba7c9169af47ee7cbb3a92c3f11cc8fd4e690a3916f7f8f14cb23703c934a06085402d463dd148e271ea1a1adc; s_v_web_id=verify_m6yia814_zvOY9DvP_93pX_4BMZ_8zwz_NZ8kw8zNINgB; hevc_supported=true; passport_csrf_token=d67acefe063a63bfba1b27f3b1e206b6; passport_csrf_token_default=d67acefe063a63bfba1b27f3b1e206b6; fpk1=U2FsdGVkX1+PmU8vxMm9F2cD4/10gnz0NJY2mUFri/00aq6LEuFbM/B97SlB3Pt2pfxgy0uEygX/+lw6k/aTZw==; fpk2=40b65ea82f99d9ae2d2769173a01ce1b; xgplayer_user_id=977638847014; __security_mc_1_s_sdk_crypt_sdk=19a6ca4b-4d58-8c44; bd_ticket_guard_client_web_domain=2; UIFID=a061b0aeafc5f81960457244188fc0aa90cbddf27d4ca38da72bcf4a38905bfbd80b3aba7c9169af47ee7cbb3a92c3f1b198d7b5f447aaeec9b6395502d369f370ce56c6d1c761d709626392ab058f3f99a2174f5c237e0aadf53384d23f0578e25515aa5546dc9327683ce339fad6951b86da2dbb724503153973a6e402cff4f9634aad4031826f31e4b5aefddbb46643cc581c8c666f2cb63e64adc613b33e; live_use_vvc=%22false%22; SEARCH_RESULT_LIST_TYPE=%22single%22; __security_mc_1_s_sdk_sign_data_key_sso=1bc2ef51-4eff-9bbf; __security_mc_1_s_sdk_cert_key=e236496b-4e40-b11f; _bd_ticket_crypt_doamin=2; __security_server_data_status=1; store-region=cn-zj; store-region-src=uid; xgplayer_device_id=94162970534; my_rd=2; FORCE_LOGIN=%7B%22videoConsumedRemainSeconds%22%3A180%2C%22isForcePopClose%22%3A1%7D; n_mh=9-mIeuD4wZnlYrrOvfzG3MuT6aQmCUtmr8FxV8Kl8xY; SelfTabRedDotControl=%5B%5D; dy_sheight=1440; is_dash_user=1; passport_mfa_token=CjfF%2FTVvHLspLa1VyTSir3Zk4I0QgzEiglOXA3EQe36mj%2B50sPa%2FEjz5e7zotyybkTdZAtwwNPJ%2FGkoKPAAAAAAAAAAAAABOzgl2IYKUujO0hhS1Kj97y3xZ9Lto4Jy52cCYEx6ykr72JCguP5MS3hGX2CRri53P7BCiju0NGPax0WwgAiIBA6fKmrQ%3D; d_ticket=43c08ad67328680a17f0e378cdcd29d74984a; ttwid=1%7CsPSe1yiztsbzCvPRNPXwtTb2NBDaYxPSN0nOwglzkMg%7C1743319067%7Ce635139ac9c8f09bbcb29ea13ffd97b3f90fa5931a7602c0908b73c48669485b; passport_assist_user=CkGIoIX_ocxPZTwpjePzC0Lx6g7iywVD8zE_Yv1BBm4ExrT2RDTuvYdiTW3Vgz6DyLKBRdif24C8CnrXpBA8zfZcYRpKCjxUFg8bK7cpyB3rPQFDpDYhhE4xvco046WfFLg_sNm0qJJpI2YzLFChFV7oRo87gOzzGjLAi-qAHQvBOD0QnrztDRiJr9ZUIAEiAQPK-oDc; sid_guard=7983dbfbd52edaf0c4e6fa9c7bc9db99%7C1743403335%7C5183999%7CFri%2C+30-May-2025+06%3A42%3A14+GMT; uid_tt=4055888a61cac6dc90b06a8dbc8907dc; uid_tt_ss=4055888a61cac6dc90b06a8dbc8907dc; sid_tt=7983dbfbd52edaf0c4e6fa9c7bc9db99; sessionid=7983dbfbd52edaf0c4e6fa9c7bc9db99; sessionid_ss=7983dbfbd52edaf0c4e6fa9c7bc9db99; is_staff_user=true; sid_ucp_v1=1.0.0-KDE4OTY5YzBkMzBhNDYwYzhlYjY2NzY4NDQyOGRhNjI0MjdjMmRmYWIKIQib2bG2m8yDBRDH8qi_BhjvMSAMMLnY7bgGOAdA9AdIBBoCaGwiIDc5ODNkYmZiZDUyZWRhZjBjNGU2ZmE5YzdiYzlkYjk5; ssid_ucp_v1=1.0.0-KDE4OTY5YzBkMzBhNDYwYzhlYjY2NzY4NDQyOGRhNjI0MjdjMmRmYWIKIQib2bG2m8yDBRDH8qi_BhjvMSAMMLnY7bgGOAdA9AdIBBoCaGwiIDc5ODNkYmZiZDUyZWRhZjBjNGU2ZmE5YzdiYzlkYjk5; login_time=1743403334389; _bd_ticket_crypt_cookie=2cf10cdd4898d8d540f92c7932512cc4; __security_mc_1_s_sdk_sign_data_key_web_protect=5de0d4c0-4d5c-8236; volume_info=%7B%22isUserMute%22%3Atrue%2C%22isMute%22%3Atrue%2C%22volume%22%3A0.5%7D; dy_swidth=2160; stream_recommend_feed_params=%22%7B%5C%22cookie_enabled%5C%22%3Atrue%2C%5C%22screen_width%5C%22%3A2160%2C%5C%22screen_height%5C%22%3A1440%2C%5C%22browser_online%5C%22%3Atrue%2C%5C%22cpu_core_num%5C%22%3A16%2C%5C%22device_memory%5C%22%3A8%2C%5C%22downlink%5C%22%3A10%2C%5C%22effective_type%5C%22%3A%5C%224g%5C%22%2C%5C%22round_trip_time%5C%22%3A50%7D%22; strategyABtestKey=%221743751269.197%22; publish_badge_show_info=%220%2C0%2C0%2C1743751273693%22; WallpaperGuide=%7B%22showTime%22%3A1743661528815%2C%22closeTime%22%3A0%2C%22showCount%22%3A6%2C%22cursor1%22%3A283%2C%22cursor2%22%3A90%2C%22hoverTime%22%3A1741243492265%7D; __ac_nonce=067f2cc23009e82a1ecb4; __ac_signature=_02B4Z6wo00f01uQwiaAAAIDAB.95NUY4B3rkEI0AAN8M43; csrf_session_id=27e2522168042a39de5511ff9d1e4c43; passport_fe_beating_status=true; home_can_add_dy_2_desktop=%221%22; __live_version__=%221.1.3.363%22; download_guide=%222%2F20250407%2F0%22; bd_ticket_guard_client_data=eyJiZC10aWNrZXQtZ3VhcmQtdmVyc2lvbiI6MiwiYmQtdGlja2V0LWd1YXJkLWl0ZXJhdGlvbi12ZXJzaW9uIjoxLCJiZC10aWNrZXQtZ3VhcmQtcmVlLXB1YmxpYy1rZXkiOiJCS0NycGhTODRyNHo0UTh5TTJraTlzbVNGQWVrYW40c1RzVnkxc2lhQU5HcGVKRTdreVF6Yzd2TEpER3JidDNOWU5TcEJlVzh6aTQrV05PdnFoT25hV2M9IiwiYmQtdGlja2V0LWd1YXJkLXdlYi12ZXJzaW9uIjoyfQ%3D%3D; odin_tt=1e3d07de352b54222af984d075260d8b5976867ae970491e10ddf9fae0e78bff951c13fc79c173b9eac2e5efa2fa33e0c7632362293645d6dec844ab2b063e28; live_can_add_dy_2_desktop=%221%22; IsDouyinActive=true'
            }
        }).then(res => res.json());

        // 提取直播间URL并添加到结果数组
        const pageUrls = list.data.map(item => {
            const rawData = JSON.parse(item.lives.rawdata);
            return `https://live.douyin.com/${rawData.owner.web_rid}`;
        });
        
        allLiveUrls.push(...pageUrls);

        // 每次请求间隔1秒,避免请求过快
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return {
        data: {
            records: allLiveUrls.map(item => ({
                liveUrl: item
            }))
        }
    };
}


const list = await getDYSearch();
console.info(list);
