// XmlProcessor helper functions:





// used to store the name of files
var fileList = new Array;


// 根据输入在文件列表内筛选
function fileFilter() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("searchFile");
    filter = input.value.toUpperCase();
    div = document.getElementById("fileList");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}


// 修改颜色并将文件名添加至fileList中
function selectFile(id){
    var file = document.getElementById(id);
    
    var inList = 0;

    var length = fileList.length;
    for(var i=0; i<length; i++){
        if(fileList[i] == file.textContent){
            fileList.splice(i,1);
            file.style.color = "#ffffff";
            inList = 1;
        }
    }
    if(inList == 0){
        fileList.push(file.textContent);
        file.style.color =  "#ffff00";
    }
    //var res = fileList.toString();
    //alert(res);
}


// 根据输入改变当前的XPath
function updateCurrentXPath() {
    var inputBox, showXPath, newValue;
    inputBox = document.getElementById("inputXPath");
    showXPath = document.getElementById("currentXPath");
    newValue = inputBox.value;
    // 对于长度超过65的输入以缩写模式展示，鼠标悬浮时可查看完整值
    if(newValue.length>65){
        shortValue = newValue.substring(0,65);
        showXPath.innerHTML = shortValue+"...";
    } else {
        showXPath.innerHTML = inputBox.value;
    }
    showXPath.title=newValue;
}


// 切换操作页面
function switchOper(evt, operType) {
    var i, operDivs;
    operDivs = document.getElementsByClassName("operDiv");
    document.getElementById("welcome").style.display="none";
    for (i = 0; i < operDivs.length; i++) {
        operDivs[i].style.display = "none";
    }
    document.getElementById(operType).style.display = "block";
    evt.currentTarget.className += " active";
}

