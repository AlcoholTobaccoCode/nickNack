
const GenerateTtwid = async () => {
    const response = await fetch(`http://172.16.5.17:1801/api/douyin/web/generate_ttwid`);
    return await response.json();
}

const FetchUserLiveVideos = async (webcast_id) => {
    const response = await fetch(`http://172.16.5.17:1801/api/douyin/web/fetch_user_live_videos?webcast_id=${webcast_id}`);
    return await response.json();
}

const gotoLivePage = async ({
    url,
    roomId
}) => {

    return new Promise(async (resolve, reject) => {
        const browserManager = new BrowserManager();
        await browserManager.init();

        await browserManager.loadPage({
            url
        }, {
            onLoaded: async (page) => {
                console.log('页面加载完成 ✨✨✨', 'col');
                const wssUrl = await getWssUrl(page, roomId);
                // console.log('wssUrl => ', wssUrl);
                await browserManager.close();
                resolve(wssUrl);
            },
            onError: async (error) => {
                console.error(`页面加载错误: ${error.message}`, 'col');
                await browserManager.close();
            }
        });
    });
}

router.get('/getLiveRoomWs', async (req, res) => {
    try {
        const { web_rid } = req.query;

        if (!/\d{8,12}/.test(web_rid)) {
            return res.status(400).json({
                code: 400,
                message: '请输入正确的房间号',
                data: null
            });
        }

        const roomInfo = await FetchUserLiveVideos(web_rid);
        const finalRoomId = roomInfo?.data?.data?.enter_room_id;
        const roomName = roomInfo?.data?.data?.data?.[0]?.title;

        // 生成 ttwid
        const getTtwid = await GenerateTtwid();
        // 默认
        let ttwid = '1%7CUIsYBp9HOuSwq6dP59Qf4ZdjwNCcZll0VRSE5ePbFzM%7C1742140517%7C82c777ecf691fa5b9850bd97d52e53d4e2cd33bb60d90ff410a277bb6c9ab34c';
        if (getTtwid.code === 200) {
            ttwid = getTtwid.data.ttwid;
        }

        const wssUrl = await gotoLivePage({
            url: `https://live.douyin.com/${web_rid}`,
            roomId: finalRoomId
        });

        console.log(`「${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}」:web_rid => ${web_rid}`);

        res.json({
            code: 200,
            message: '查询成功',
            data: {
                wssUrl,
                ttwid,
                roomName
            }
        });

    } catch (error) {
        res.status(500).json({
            code: 500,
            message: '服务器内部错误',
            data: null
        });

    }
});
