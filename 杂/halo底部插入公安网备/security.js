window.onload = function () {
  // 获取公网安备DOM
  const sitePolice = document.querySelector(".site_police");

  if (sitePolice) {
    const sitePoliceLink = sitePolice.children[0];
    const codeStr = sitePoliceLink.innerText;
    // 正则获取 code
    const code = codeStr.replace(/[^a-zA-Z0-9]/g, "");
    if (!code) {
      return;
    }
    // 重建超链接
    sitePoliceLink.href = `https://beian.mps.gov.cn/#/query/webSearch?code=${code}`;

    console.log("%cSecurityJs RUN", "padding: 6px 8px;color:#fff;background:linear-gradient(270deg, teal, #f15206);border-radius: 3px;")
  }
  
};

// window.onload = function() {
//   //从 url 获取 code
//   const url = window.location.href;
//   const urlParams = new URLSearchParams(url.split('?')[1]);
//   const codeStr = urlParams.get('code');

//   // 获取
//   const siteLife = document.querySelector('.site_life');

//   if (codeStr && siteLife) {

//     // 正则获取 code
//     const code = codeStr.replace(/[^a-zA-Z0-9]/g, '');
//     console.info('code ', code);

//     if (!code) {
//       console.warn('code 为空');
//       return;
//     }

//     // 创建父容器
//     const sitePolice = document.createElement('p');

//     // 创建超链接
//     const sitePoliceLink = document.createElement('a');
//     sitePoliceLink.href = `https://beian.mps.gov.cn/#/query/webSearch?code=${code}`;
//     sitePoliceLink.target = '_blank';
//     sitePoliceLink.innerText = codeStr;
//     sitePoliceLink.rel = 'noopener noreferrer nofollow';
//     // 父容器中插入超链接
//     sitePolice.appendChild(sitePoliceLink);

//     // 添加
//     siteLife.parentNode.appendChild(sitePolice);
//   } else {
//     console.warn('sitePolice 为空')
//   }
// }
