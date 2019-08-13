var block = document.getElementById('block');   //得到id为block的节点
block.addEventListener('touchmove', showBlockMove);  //监听 block 的touchmove事件
// console.log(block.offsetLeft)  //观察block节点左距离
var GetBlockSLeft = block.style.left;
// console.log(block.offsetLeft + "*----*") //同上
function showBlockMove(e) {
	let getScreen = e.touches[0].clientX - 190;
	console.log(e.touches)
	//touchmove 手指滑动，得到的是一个数组，(可以console.log()输出观察数组元素)，此处我们提取数组中我们需要的数据
	block.offsetLeft = 0;  
	if (block.offsetLeft >= 0 && block.offsetLeft <= 523) {
		// console.log(e.touches[0].clientX);
		block.style.left = getScreen + 'px';
		// console.log(block.offsetLeft + "*----*")
		if (block.offsetLeft >= 523) {}
	}
	if (block.offsetLeft <= 0) {
		block.style.left = '0';

	}
	if (block.offsetLeft > 523) { //左右两端尽头来回滑动
		block.style.left = '523px';

	}
}