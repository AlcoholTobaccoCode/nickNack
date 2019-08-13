//得到吃豆人的身体
			var pmm0 = document.getElementById('pac-man-mouth0'),
				pmm1 = document.getElementById('pac-man-mouth1');
			var Timer, Timer1, Timer2 = null;
			var radBody = document.getElementsByClassName('radBody')[0];
			var radbox = document.getElementsByClassName('radbox')[0];
			let speed = -10;
			window.onload = function() {
				Timer = setInterval(function() {
					runOne()
				}, 600)
				Timer = setInterval(function() {
					runTwo()
				}, 1200)
				function runOne() {
					pmm0.style.transition = 'all ease .7s';
					pmm0.style.transform = "rotate(-43deg)";
					pmm1.style.transition = 'all ease .7s';
					pmm1.style.transform = "rotate(43deg)";
				}
				function runTwo() {
					pmm0.style.transition = 'all ease 1s';
					pmm0.style.transform = "rotate(43deg)";
					pmm1.style.transition = 'all ease 1s';
					pmm1.style.transform = "rotate(-43deg)";
				}
				radbox.innerHTML = radbox.innerHTML + radbox.innerHTML;
				Timer2 = setInterval(function() {
					if (radBody.offsetLeft < -radBody.offsetWidth / 4) {
						radBody.style.marginLeft = 0;
					}
					// console.log(radbox.offsetLeft)
					radBody.style.marginLeft = radBody.offsetLeft + speed + 'px';
				}, 300)
			}