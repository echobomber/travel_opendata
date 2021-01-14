//https://ithelp.ithome.com.tw/articles/10229458
let adminList = document.querySelector('#adminList');
let navBtn = document.querySelector('.hot-admin-btn');
let contentBox = document.querySelector('.content-box');
// 原始資料
let data;
//篩除重複的 Zone，並加入 adminList 
function zoneFilter(){
    let arr = data;
    let zoneArr = [];
    // 56 筆
    for(let i=0; i<arr.length; i++){
        zoneArr.push(arr[i].Zone);
    }
    //22 筆
    zoneArr = zoneArr.filter(function (element, index, self) {
        return self.indexOf(element) === index;
    });
    for(let i=0; i<zoneArr.length; i++){
        let options = document.createElement('option');
        options.value = zoneArr[i];
        options.textContent = zoneArr[i];
        adminList.appendChild(options);
    }
}
//顯示全部行政區
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
//更新 content-box
function refreshContent(e){
    e.preventDefault();
    let targetData = [];
    if(e.target.nodeName == 'INPUT' || e.target.nodeName == 'SELECT'){
        let targetValue = e.target.value;
        document.querySelector('.content-panel > h2').textContent = targetValue;
        // console.log(targetValue);
        for(let i = 0; i < data.length; i++){
            if(data[i].Zone == targetValue){
                targetData.push(data[i]);
            }else if(targetValue == '全部行政區'){
                targetData.push(data[i]);
            }
        }
        updateContent(targetData);
    }
}

// 遠端撈 JSON
let xhr = new XMLHttpRequest();
xhr.open('GET', 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json', true);
xhr.send(null);
xhr.onload = function(){
    let str = JSON.parse(xhr.responseText);
    // 原始資料存入
    data = str.result.records;
    zoneFilter();
    updateContent(data);
    navBtn.addEventListener('click', refreshContent, false);
    adminList.addEventListener('change', refreshContent, false);
}


