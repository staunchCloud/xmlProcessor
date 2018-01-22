// This files contains interface functions

var matchColor = "#AADCF0"; // rgb(170, 220, 240)
var inputColor = "#6FC8DC"; // rgb(111, 200, 220)

// ================================================================================
// change the editor for fileContent, must be listed before resize frames

// default setting of fileContent

var editor;
var curFilePath;

$(document).ready(function () {
    editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        mode: "xml",
        lineNumbers: true,
        styleActiveLine: true,
        matchClosing: true,
        theme: "solarized dark"
    });
})

// change fileContent when click a file name

function onClicks(event, treeId, treeNode, clickFlag) {
    if (!treeNode.isParent) {
        changeFileContent(treeNode.filePath);
    }
}

function changeFileContent(filePath) {
    var rpc = b.invoker();
    rpc.module = 'handler';
    rpc.printFile(filePath).then(res => {
        setNewFileContent(res);
        curFilePath = filePath;
    });
}

function setNewFileContent(res) {
    var textArea = document.getElementById('code');
    editor = CodeMirror.fromTextArea(textArea);
    $("#code").empty;
    $("#code").text(res);
    $(".CodeMirror").remove();



    editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        mode: "xml",
        lineNumbers: true,
        styleActiveLine: true,
        matchClosing: true,
        theme: "solarized dark"
    });

    // set the size accroding to the fileContent area
    var winH = $(window).height();
    var flH = winH - 30;
    if (flH < 576) {
        flH = 576;
    }
    var winW = $(window).width();
    var flW = winW - 30;
    if (flW < 720) {
        flW = 720;
    }
    editor.setSize(flW * 0.55 - 3, flH - 100);
}

// ================================================================================
// resize frames accroding to window size, it has a minimum size

function resizeFrames() {
    // height
    var winH = $(window).height();
    var flH = winH - 30;
    if (flH < 576) {
        flH = 576;
    }

    // width
    var winW = $(window).width();
    var flW = winW - 30;
    if (flW < 720) {
        flW = 720;
    }

    // change height
    $("#fileArea").css('height', flH);
    $("#operationArea").css('height', flH);

    $("#fileTreeArea").css('height', flH - 100);

    $("#operArea").css('height', flH - 50);
    $("#xPathArea").css('height', (flH - 50) * 0.2);
    $("#operFnArea").css('height', (flH - 50) * 0.8);

    $("#fileContentArea").css('height', flH - 50);
    $("#fileContent").css('height', flH - 100);

    // change width
    $("#xmlProcessor").css('width', flW * 1.01);

    $("#fileArea").css('width', flW * 0.225);
    $("#operAndContent").css('width', flW * 0.775);

    $("#searchArea").css('width', flW * 0.225);
    $("#fileTreeArea").css('width', flW * 0.225);
    $("#fileTreeFnArea").css('width', flW * 0.225);

    $("#fnArea").css('width', flW * 0.775);

    $("#operArea").css('width', flW * 0.225);
    $("#xPathArea").css('width', flW * 0.225);
    $("#operFnArea").css('width', flW * 0.225);

    $("#fileContentArea").css('width', flW * 0.55);
    $("#fileContent").css('width', flW * 0.55);
    $("#contentFnArea").css('width', flW * 0.55);


    // change width of .fileAreaInput
    var faW = $("#searchArea").width();
    $(".fileAreaInput").css('width', faW - 70);
    $(".operationAreaInput").css('width', faW - 30);

    // change width and height of .operFnDiv
    $('.operFnDiv').css('height', (flH - 50) * 0.8);
    $('.operFnDiv').css('width', flW * 0.225);

    // codeMirror
    editor.setSize(flW * 0.55 - 3, flH - 100);
}

$(window).resize(function () {
    resizeFrames();
})

$(document).ready(function () {
    resizeFrames();
})

// ================================================================================
// file serach & ztree list files
// 以下为ZTree的搜索功能，感谢博客园的insaneXs分享的搜索方式

// change search type
var searchType = "normal";
var validDate = /^(>|<|=)(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1]))$/;
var validTime = /^(>|<|=)(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]:[0-5][0-9]$/;

function normalType() {
    searchType = "normal";
    $("#filterInput").attr('placeholder', "FileName.xml");
}

function rexType() {
    searchType = "rex";
    $("#filterInput").attr('placeholder', "*.xml");
}

function timeType() {
    searchType = "time";
    $("#filterInput").attr('placeholder', ">2017-12-01 00:00:00");
}


// 根据搜索种类搜索ZTree
function filterFiles() {
    $('#filterInput').css('color', '#DCD7D7');
    var zTree = $.fn.zTree.getZTreeObj("fileTree");
    if (zTree == null) {
        return;
    }

    //显示隐藏的节点
    nodes = zTree.getNodesByParam("isHidden", true);
    zTree.showNodes(nodes);
    var root = zTree.getNodeByParam("level", "0");
    var hiddenNodes = new Array();


    //筛选出要隐藏的节点
    var inputStr = $('#filterInput').val();

    if (searchType == "time") {
        if ((!validDate.test(inputStr)) && (!validTime.test(inputStr))) {
            return; // 如果搜索方式为时间，不符合输入要求直接跳过
        } else {
            $('#filterInput').css('color', 'green');
        }
    }

    filterNodes(root, inputStr, hiddenNodes);
    zTree.hideNodes(hiddenNodes);
}

function filterNodes(node, inputStr, filterResult) {
    if (node != null) {
        //自身是否符合搜索条件
        var selfMatch;
        if (searchType == "normal") {
            selfMatch = node.name.indexOf(inputStr) > -1;
        } else if (searchType == "time") {
            if (node.isParent == true) {
                selfMatch = false;
            } else {
                var lastModTime = node.lastModTime;
                if (inputStr.length == 11) {
                    lastModTime = lastModTime.slice(0, 10); // ex. 2017-12-01
                }
                selfMatch = filterNodesByTime(lastModTime, inputStr);
            }
        }

        //var selfMatch = node.name.indexOf(inputStr) > -1;
        //子节点是否有满足的条件的节点
        var childMatch = false;

        var children = node.children;
        if (children != undefined) {
            for (index in children) {
                childMatch = filterNodes(children[index], inputStr, filterResult) || childMatch;
            }
        }

        //自身不满足搜索条件 且其子节点不包含有满足条件的节点
        if (!selfMatch && !childMatch) {
            filterResult.push(node);
        }

        return selfMatch || childMatch;
    } else {
        return true;
    }
}

function filterNodesByTime(lastModTime, givenTime) {
    var contrast = givenTime.slice(0, 1); // > < =
    var inputTime = givenTime.slice(1, givenTime.length);

    if (contrast == ">") {
        if (lastModTime > inputTime) {
            return true;
        }
    } else if (contrast == "<") {
        if (lastModTime < inputTime) {
            return true;
        }
    } else { // "="
        if (lastModTime == inputTime) {
            return true;
        }
    }
    return false;
}


// zTree setting
var zNodes;
var setting = {
    view: {
        selectedMulti: false
    },
    check: {
        enable: true
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    callback: {
        onClick: onClicks
    }
};

// generate the file tree

function createTree() {
    $.fn.zTree.init($("#fileTree"), setting, zNodes);
    clearFlag = $("#last").attr("checked");
}

function generateFileTree(curWorkPath) {
    var rpc = b.invoker();
    rpc.module = 'handler';
    rpc.getFileList(curWorkPath).then(res => {
        zNodes = res;
        createTree();
    });
}

function listFileTree() {
    generateFileTree(curWorkPath);
    $("#init").bind("change", createTree);
    $("#last").bind("change", createTree);
}

// get checked nodes
function getSelectedNodes() {
    var selectedFiles = new Array();
    var zTree = $.fn.zTree.getZTreeObj("fileTree");
    if (zTree == null) {
        return null;
    }
    var selectedNodes = zTree.getCheckedNodes();
    var len = selectedNodes.length;
    for (var i = 0; i < len; i++) {
        if (!selectedNodes[i].isParent) {
            selectedFiles.push(selectedNodes[i].filePath);
        }
    }
    return selectedFiles;
}

// ================================================================================
// set server path

var curWorkPath;

function btnSetWorkPath(btnId) {
    var newPath = $("#" + btnId).text();
    if (newPath == "") {
        return;
    }
    var inputFrame = $('#serverInput');
    inputFrame.val(newPath);
    curWorkPath = newPath;
    inputFrame.css('color', matchColor);
    listFileTree();
}

function loadDir(){
	var inputFrame = $('#serverInput');
	var inputVal = inputFrame.val();
	var rpc = b.invoker();
    rpc.module = 'handler';
    rpc.validWorkPath(inputVal).then(res => {
        if (res) {
            if (!inStorage(inputVal)) {
                addToStorage(inputVal);
                refreshBtnText();
            }
            curWorkPath = inputVal;
            inputFrame.css('color', matchColor);
            listFileTree(); // generate file tree
        } else {
            alert("Sorry, input path is invalid on server.");
        }
    });
}
$(document).ready(function () {
    var inputFrame = $('#serverInput');
    loadDir();
    
    inputFrame.keyup(function () { 
        if (event.keyCode == 13) { 
        	loadDir();
        } else if (event.keyCode == 38) {
            if (curWorkPath == null) {
                alert("No work path has been set yet.");
            } else {
                inputFrame.val(curWorkPath);
            }
        }
        if (inputFrame.val() == curWorkPath) {
            inputFrame.css('color', matchColor);
        } else {
            inputFrame.css('color', inputColor);
        }
    });
});

// serverSetUp-localStorage: lswp1, lswp2, lswp3

function clearStorage() {
    localStorage.clear();
    refreshBtnText();
}

function addToStorage(input) {
    var lswp1 = localStorage.getItem("lswp1");
    var lswp2 = localStorage.getItem("lswp2");
    var lswp3 = localStorage.getItem("lswp3");
    localStorage.setItem("lswp3", lswp2);
    localStorage.setItem("lswp2", lswp1);
    localStorage.setItem("lswp1", input);
}

function inStorage(input) {
    var wp1 = $("#WP1").text();
    var wp2 = $("#WP2").text();
    var wp3 = $("#WP3").text();
    if ((input == wp1) || (input == wp2) || (input == wp3)) {
        return true;
    }
    return false;
}

function refreshBtnText() {
    var lswp1 = localStorage.getItem("lswp1");
    var lswp2 = localStorage.getItem("lswp2");
    var lswp3 = localStorage.getItem("lswp3");
    if (lswp1 == "null") {
        lswp1 = "";
    }
    if (lswp2 == "null") {
        lswp2 = "";
    }
    if (lswp3 == "null") {
        lswp3 = "";
    }
    $("#WP1").text(lswp1);
    $("#WP2").text(lswp2);
    $("#WP3").text(lswp3);
}

$(document).ready(function () {
    var lswp1 = localStorage.getItem("lswp1");
    var lswp2 = localStorage.getItem("lswp2");
    var lswp3 = localStorage.getItem("lswp3");
    refreshBtnText();
});

// ================================================================================
// set xPath

var curXPath;

function btnSetXPath(btnId) {
    var newPath = $("#" + btnId).text();
    var inputFrame = $('#xpInput');
    inputFrame.val(newPath);
    curXPath = newPath;
    inputFrame.css('color', matchColor);
}

$(document).ready(function () {
    var inputFrame = $('#xpInput');
    inputFrame.keyup(function () {
        if (event.keyCode == 13) {
            if (inputFrame.val() == "") {
                alert("Cannnot set empty XPath.");
            } else {
                var inputVal = inputFrame.val();
                curXPath = inputVal;
                if (!inXpStorage(inputVal)) {
                    addToXpStorage(inputVal);
                    refreshXpBtnText();
                }
            }
        } else if (event.keyCode == 38) {
            if (curXPath == null) {
                alert("No XPath has been set yet.");
            } else {
                inputFrame.val(curXPath);
            }
        }
        if ($('#xpInput').val() == curXPath) {
            inputFrame.css('color', matchColor);
        } else {
            inputFrame.css('color', inputColor);
        }
    });
});

// check is missing !

// XPathSetUp-SessionStorage: ssxp1, ssxp2, ssxp3, ssxp4, ssxp5

function addToXpStorage(input) {
    var ssxp1 = sessionStorage.getItem("ssxp1");
    var ssxp2 = sessionStorage.getItem("ssxp2");
    var ssxp3 = sessionStorage.getItem("ssxp3");
    var ssxp4 = sessionStorage.getItem("ssxp4");
    var ssxp5 = sessionStorage.getItem("ssxp5");
    sessionStorage.setItem("ssxp5", ssxp4);
    sessionStorage.setItem("ssxp4", ssxp3);
    sessionStorage.setItem("ssxp3", ssxp2);
    sessionStorage.setItem("ssxp2", ssxp1);
    sessionStorage.setItem("ssxp1", input);
}

function inXpStorage(input) {
    var xp1 = $("#XP1").text();
    var xp2 = $("#XP2").text();
    var xp3 = $("#XP3").text();
    var xp4 = $("#XP4").text();
    var xp5 = $("#XP5").text();
    if ((input == xp1) || (input == xp2) || (input == xp3) || (input == xp4) || (input == xp5)) {
        return true;
    }
    return false;
}

function refreshXpBtnText() {
    var ssxp5 = sessionStorage.getItem("ssxp5");
    var ssxp4 = sessionStorage.getItem("ssxp4");
    var ssxp3 = sessionStorage.getItem("ssxp3");
    var ssxp2 = sessionStorage.getItem("ssxp2");
    var ssxp1 = sessionStorage.getItem("ssxp1");
    if (ssxp1 == "null") {
        ssxp1 = "";
    }
    if (ssxp2 == "null") {
        ssxp2 = "";
    }
    if (ssxp3 == "null") {
        ssxp3 = "";
    }
    if (ssxp4 == "null") {
        ssxp4 = "";
    }
    if (ssxp5 == "null") {
        ssxp5 = "";
    }
    $("#XP1").text(ssxp1);
    $("#XP2").text(ssxp2);
    $("#XP3").text(ssxp3);
    $("#XP4").text(ssxp4);
    $("#XP5").text(ssxp5);
}

$(document).ready(function () {
    sessionStorage.clear();
});

// ================================================================================
// switch operation frame

function switchOperFnDiv(operFn) {
    $('.operFnDiv').css('display', 'none');
    $('#' + operFn).css('display', 'block');
}

// upload

$(document).ready(function () {

    $("#myfiles").change(function (e) {
        $("#selectedFiles").html("");
        var files = e.target.files;
        if (!files) return;


        for (var i = 0; i < files.length; i++) {
            var f = files[i];
            var text = $("#selectedFiles").html();
            $("#selectedFiles").html(text + f.name + "<br/>");
        }
    });


    $("#uploadForm").submit(function (evt) {
        evt.preventDefault();
        var formData = new FormData($(this)[0]);

        $.ajax({
            url: '/handler/upload',
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            enctype: 'multipart/form-data',
            processData: false,
            success: function (response) {
                alert("Upload Successfully");
            }
        });

        // change to the tempWorkingSpace & set zTree
        curWorkPath = "tempWorkingSpace";
        $('#serverInput').val("tempWorkingSpace");
        $('#serverInput').css('color', matchColor);
        listFileTree();

        return false;
    });
});
