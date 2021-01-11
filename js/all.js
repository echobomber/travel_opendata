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

// 遠端撈 JSON
let xhr = new XMLHttpRequest();
xhr.open('GET', 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json', true);
xhr.send(null);
xhr.onload = function(){
    let str = JSON.parse(xhr.responseText);
    // 原始資料存入
    data = str.result.records;
    // console.log(data); 
    zoneFilter();
}


