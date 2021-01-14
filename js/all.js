//https://ithelp.ithome.com.tw/articles/10229458
let adminList = document.querySelector('#adminList');
let navBtn = document.querySelector('.hot-admin-btn');
let contentBox = document.querySelector('.content-box');
let pageBtn = document.querySelector('.pagination');
let data = []; // 原始資料
let targetData = []; //目標資料

// 篩除重複的 Zone，並加入 adminList 
function zoneFilter(){
    let arr = data;
    // 篩選完的 Zone 會放在這
    let zoneArr = [];
    // 56 筆
    for(let i=0; i<arr.length; i++){
        zoneArr.push(arr[i].Zone);
    }
    // 22 筆
    zoneArr = zoneArr.filter(function (element, index, self) {
        return self.indexOf(element) === index;
    });
    // 更新 adminList 列表選項
    for(let i=0; i<zoneArr.length; i++){
        let options = document.createElement('option');
        options.value = zoneArr[i];
        options.textContent = zoneArr[i];
        adminList.appendChild(options);
    }
}
// 會依照傳進來的陣列更新 contentBox 資料
function updateContent(updateData){
    let str = '';
    for(let i=0; i<updateData.length; i++){
        str += 
        `
            <div class="content">
                <div class="content-img">
                    <a href="#" style="background-image: url(${updateData[i].Picture1});"></a>
                    <h3 class="content-title">
                        ${updateData[i].Name}
                    </h3>
                    <h4 class="content-admin">
                        ${updateData[i].Zone}
                    </h4>
                </div>
                <div class="content-info">
                    <div>
                        <img src="img/icons_clock.png" alt="">
                        <p id="Opentime">${updateData[i].Opentime}</p>
                    </div>
                    <div>
                        <img src="img//icons_pin.png" alt="">
                        <p id="Add">${updateData[i].Add}</p>
                    </div>
                    <div>
                        <img src="img/icons_phone.png" alt="">
                        <a href="tel:${updateData[i].Tel}" id="Tel" >${updateData[i].Tel}</a>
                        <div class="Ticketinfo" id="Ticketinfo">
                            <img src="img/icons_tag.png" alt="">
                            <p id="Ticketinfo">${updateData[i].Ticketinfo}</p>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
    contentBox.innerHTML = str;
}
// 找出符合的所有資料塞入 targetData，並透過 updateContent() 更新
function refreshContent(e){
    e.preventDefault();
    targetData = [];
    // 改成嚴格等於
    if(e.target.nodeName === 'INPUT' || e.target.nodeName === 'SELECT'){
        let targetValue = e.target.value;
        document.querySelector('.content-panel > h2').textContent = targetValue;
        // console.log(targetValue);
        for(let i = 0; i < data.length; i++){
            //
            if(data[i].Zone == targetValue){
                targetData.push(data[i]);
            }else if(targetValue == '全部行政區'){
                targetData.push(data[i]);
            }
        }
        console.log(targetData);
        // 加入分頁邏輯 (先有資料 -> 處理分頁 -> 更新資料)
        pagination(targetData);
    }
}
// 分頁邏輯，預設 nowPage 為第 1 頁
function pagination(targetData, nowPage = 1){
    // console.log(targetData);
    let dataLength = targetData.length;
    let perPage = 6;
    let pageTotal = Math.ceil(dataLength / perPage);
    let currentPage = nowPage;
    if (currentPage > pageTotal) {
        currentPage = pageTotal;
    }
    let minData = (currentPage * perPage) - perPage + 1;
    let maxData = (currentPage * perPage);
    let singlePageData = [];
    targetData.forEach((item, index) => {
        let num = index + 1;
        // 從 0 開始找，如果 index+1 在 minData 與 maxData 之間，則填入陣列
        if (num >= minData && num <= maxData) {
            singlePageData.push(item);
        }
    })
    // console.log(singlePageData);
    let pageInfo = {
        pageTotal,
        currentPage,
        hasPrev: currentPage > 1,
        hasNext: currentPage < pageTotal
    }
    updateContent(singlePageData);
    updatePageBtn(pageInfo);
}
// 更新頁數按鈕
function updatePageBtn(pageInfo){
    let str = '';
    let pageTotal = pageInfo.pageTotal;
    let currentPage = parseInt(pageInfo.currentPage);
    if(pageInfo.hasPrev) {
        str += `<li><a href="#" data-page="${Number(pageInfo.currentPage) - 1}" >prev</a></li>`;
    }else{
        str += `<li><span href="#" class="disabled">prev</span></li>`;
    }
    //最多顯示 x 頁 -> 尚未完成
    for(let i=1; i<=pageTotal; i++){
        if(i === currentPage){
            str += `<li><a href="#" class="active" data-page="${i}">${i}</a></li>`;
        }else{
            str += `<li><a href="#" data-page="${i}">${i}</a></li>`;
        }
    }
    if(pageInfo.hasNext){
        str += `<li><a href="#" data-page="${Number(pageInfo.currentPage) + 1}" >next</a></li>`;
    }else{
        str += `<li><span class="disabled">next</span></li>`;
    }
    pageBtn.innerHTML = str;
}
// switch page
function switchPage(e){
    e.preventDefault();
    if(e.target.nodeName !== 'A') {return};
    let nowPage = e.target.dataset.page;
    // console.log(nowPage);
    pagination(targetData, nowPage);
}

// 遠端撈 JSON
let xhr = new XMLHttpRequest();
xhr.open('GET', 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json', true);
xhr.send(null);
xhr.onload = function(){
    let str = JSON.parse(xhr.responseText);
    // 原始資料存入 data 陣列 (備註: 需要等遠端撈完資料 data 才會被 defined)
    data = str.result.records;
    targetData = data;
    console.log(targetData);
    zoneFilter();
    // 遠端載完資料後，先使用 data (全部資料) 更新一次 contentBox 
    pagination(targetData);
}
// 之後再根據點選更新符合的資料
navBtn.addEventListener('click', refreshContent, false);
adminList.addEventListener('change', refreshContent, false);
pageBtn.addEventListener('click', switchPage, false);

//直接使用 data 是會報錯的，如果加上 setTimeout 就可以正常顯示。但是如果是綁定事件，則不受影響 (因為使用者操作的時候資料已經跑完了)。
//console.log(data)