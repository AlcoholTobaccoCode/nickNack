大概功能描述是：
1. 监测网站上所有的图片
2. 对于以下图片，不做处理：
2.1 尺寸 < 100x100
2.8 图片类型为bmp
2.10 图片类型为tiff
2.12 图片类型为ico
3. 具体操作
3.1 右下角有一个类似购物车 🛒 的按钮
3.1.1 点击时，弹出所有选中图片的列表（同源协议隔离，避免所有）
3.1.2 购物车右上角有一个当前选中图片数量的数字
3.2 给每张图片的右下角添加两个按钮
3.2.1 选中，点击时，给当前图片添加高亮边框,并加入购物车中
3.2.2 下载，可以直接下载当前图片
3.3 购物车细节
3.3.1 点击购物车时,右侧抽屉弹出已选中图片列表
3.3.2 图片列表支持选中「全部/部分」下载/删除，支持单图下载/删除

其他补充：
已经导入 jquery@3.5.1
需要支持所有网站
需要注意动态加载的图片监测