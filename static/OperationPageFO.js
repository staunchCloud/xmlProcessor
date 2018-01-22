// This file executes different file operations

var b = new ClientBootstrap();

// ------------------------------[check & execute]------------------------------

// check if the input name or value fit XML's rule

function checkName(name) {
    var illegalChar = [' ', '`', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '+',
        '=', '[', ']', '{', '}', '\\', '|', ':', ';', '\'', '\"', ',', '.', '<', '>', '/', '?'];
    // Name cannot start with a number or a punctuation mark
    // Name cannot begin with XML (regardless of capitalization)
    // Name can not have spaces
    // cannot have . : - =
    var len = name.length;
    if (len == 0) {
        return "";
    }
    if (len >= 3) {
        if (name.charAt(0) == 'X' || name.charAt(0) == 'x') {
            if (name.charAt(1) == 'M' || name.charAt(1) == 'm') {
                if (name.charAt(2) == 'L' || name.charAt(2) == 'l') {
                    return "Name cannot start with \"XML\" (regardless of capitalization).\n";
                }
            }
        }
    }

    for (i = 0; i < len; i++) {
        if (illegalChar.indexOf(name.charAt(i)) != -1) {
            return "Name contains illegal character.\n";
        }
    }

    if (!isNaN(name.charAt(0))) {
        return "Name cannot start with a number.\n";
    }

    return "";
}


// inputMap => Collection of input
// needArr => Args need to check before operation
function checkInput(inputMap, needArr, selectedFiles) {
    var prompt = "";

    if ((selectedFiles == null) || (selectedFiles.length == 0)) {
        prompt = prompt + "Please select at least one file.\n";
    }
    if (curXPath == null) {
        prompt = prompt + "Please set an XPath.\n";
    }

    if (needArr.indexOf("name") != -1) { // need value
        if (inputMap["name"] == "") {
            prompt = prompt + "Please input a name.\n";
        } else {
            var checkRes = checkName(inputMap["name"]);
            if (checkRes != "") {
                prompt = prompt + checkRes;
            }
        }
    }

    if (needArr.indexOf("value") != -1) { // need value
        if (inputMap["value"] == "") {
            prompt = prompt + "Please input a value.\n";
        }
    }

    if(needArr.indexOf("initID") != -1){
        if(inputMap["initID"] == ""){
            prompt = prompt + "Please input the initial ID.";
        } else if( isNaN(inputMap["initID"])) {
            prompt = prompt + "The initial ID must be an integer.";
        }
    }

    return prompt;
}


// operation for XML files:
function operFile(map, selectedFiles) {
    var rpc = b.invoker();

    rpc.module = 'handler';
    rpc.handleFiles(map, selectedFiles).then(res => {
        alert(res);
        // update fileContent if it is displaying
        len = selectedFiles.length;
        for (i = 0; i < len; i++) {
            if (selectedFiles[i] == curFilePath) {
                changeFileContent(selectedFiles[i]);
            }
        }
    });
}


// ------------------------------[initiate & collect]------------------------------

// add operation

function addElement() {
    var selectedFiles = getSelectedNodes();
    var map = {
        name: $("#addEleName").val(),
        value: $("#addEleValue").val(),
        xPath: curXPath,
        mod: "addElement"
    };

    var prompt = checkInput(map, ["name", "value"], selectedFiles);
    if (prompt != "") {
        alert(prompt);
    } else {
        var rpc = b.invoker();
        rpc.module = 'handler';
        rpc.checkXPath(selectedFiles, curXPath).then(res => {
            if (res == "") {
                operFile(map, selectedFiles);
            } else {
                var doIt = confirm("XPath error: \n" + res + "\nPress OK to force operation, cancel to quit operation.");
                if (doIt) {
                    operFile(map, selectedFiles);
                }
            }
        });
    }
}


function addAttribute() {
    var selectedFiles = getSelectedNodes();
    var map = {
        name: $("#addAttrName").val(),
        value: $("#addAttrValue").val(),
        xPath: curXPath,
        mod: "addAttribute"
    };

    var prompt = checkInput(map, ["name", "value"], selectedFiles);
    if (prompt != "") {
        alert(prompt);
    } else {
        var rpc = b.invoker();
        rpc.module = 'handler';
        rpc.checkXPath(selectedFiles, curXPath).then(res => {
            if (res == "") {
                operFile(map, selectedFiles);
            } else {
                var doIt = confirm("XPath error: \n" + res + "\nPress OK to force operation, cancel to quit operation.");
                if (doIt) {
                    operFile(map, selectedFiles);
                }
            }
        });
    }
}


function addComment() {
    var selectedFiles = getSelectedNodes();
    var map = {
        value: $("#addCommValue").val(),
        xPath: curXPath,
        mod: "addComment"
    };

    var prompt = checkInput(map, ["value"], selectedFiles);
    if (prompt != "") {
        alert(prompt);
    } else {
        var rpc = b.invoker();
        rpc.module = 'handler';
        rpc.checkXPath(selectedFiles, curXPath).then(res => {
            if (res == "") {
                operFile(map, selectedFiles);
            } else {
                var doIt = confirm("XPath error: \n" + res + "\nPress OK to force operation, cancel to quit operation.");
                if (doIt) {
                    operFile(map, selectedFiles);
                }
            }
        });
    }
}


// *addIDs - special operation*
function addIDs() {
    var selectedFiles = getSelectedNodes();
    var map = {
        initID: $("#addID").val()
    };

    var prompt = checkInput(map, ["initID"], selectedFiles);
    if (prompt != "") {
        alert(prompt);
    } else {
        var rpc = b.invoker();
        rpc.module = 'handler';
        rpc.checkXPath(selectedFiles, curXPath).then(res => {
            if (res == "") {
                exeAddId(curXPath, map["initID"], selectedFiles);
            } else {
                var doIt = confirm("XPath error: \n" + res + "\nPress OK to force operation, cancel to quit operation.");
                if (doIt) {
                    exeAddId(curXPath, map["initID"], selectedFiles);
                }
            }
        });
    }
}

function exeAddId(xPath, initID, selectedFiles) {
    var rpc = b.invoker();
    rpc.module = 'handler';
    rpc.addIDs(xPath, initID, selectedFiles).then(res => {
        alert(res);
        // update fileContent if it is displaying
        len = selectedFiles.length;
        for (i = 0; i < len; i++) {
            if (selectedFiles[i] == curFilePath) {
                changeFileContent(selectedFiles[i]);
            }
        }
    });
}


// Check Operation
var schemaPath;

function endWithXSD(filePath) {
    var len = filePath.length;
    if (len < 5) {
        return false;
    }
    var suffix = filePath.substring(len - 4, len);
    if (suffix == ".xsd") {
        return true;
    }
    return false;
}


function setSchema() {
    if (endWithXSD(curFilePath)) {
        schemaPath = curFilePath;
        $("#curSchema").val(schemaPath);
        $("#curSchema").css("color", matchColor);
    } else {
        alert("Please select an XSD file as schema file.");
    }
}


function checkByXSD() {
    if (schemaPath == null) {
        alert("Please choose a schema file to validate.");
        return;
    } else {
        var selectedFiles = getSelectedNodes();
        var rpc = b.invoker();
        rpc.module = 'handler';
        rpc.checkBySchema(selectedFiles, schemaPath).then(res => {
            alert(res);
        });
    }
}


$(document).ready(function () {
    var schemaInput = $("#curSchema");
    schemaInput.keyup(function () {
        var inputVal = schemaInput.val();
        if (event.keyCode == 13) {
            if (inputVal == "") {
                alert("Cannnot set empty Schema path.");
                return;
            }
            if (!endWithXSD(inputVal)) {
                alert("The schema file has to be an XSD file.");
                return;
            }
            $.get("/handler/validWorkPath/" + inputVal, function (valid) {
                if (valid) {
                    schemaPath = inputVal;
                    schemaInput.css('color', matchColor);
                } else {
                    alert("Sorry, input path is invalid on server.");
                }
            });
        } else if (event.keyCode == 38) {
            if (schemaPath == null) {
                alert("No Schema path has been set yet.");
            } else {
                schemaInput.val(schemaPath);
            }
        }

        if (schemaInput.val() == schemaPath) {
            schemaInput.css('color', matchColor);
        } else {
            schemaInput.css('color', inputColor);
        }
    });
});


// Delete Operation

function deleteElement() {
    var selectedFiles = getSelectedNodes();
    var map = {
        xPath: curXPath,
        mod: "deleteElement"
    };

    var prompt = checkInput(map, [], selectedFiles);
    if (prompt != "") {
        alert(prompt);
    } else {
        var rpc = b.invoker();
        rpc.module = 'handler';
        rpc.checkXPath(selectedFiles, curXPath).then(res => {
            if (res == "") {
                operFile(map, selectedFiles);
            } else {
                var doIt = confirm("XPath error: \n" + res + "\nPress OK to force operation, cancel to quit operation.");
                if (doIt) {
                    operFile(map, selectedFiles);
                }
            }
        });
    }
}


function deleteAttribute() {
    var selectedFiles = getSelectedNodes();
    var map = {
        xPath: curXPath,
        mod: "deleteAttribute"
    };

    var prompt = checkInput(map, [], selectedFiles);
    if (prompt != "") {
        alert(prompt);
    } else {
        var rpc = b.invoker();
        rpc.module = 'handler';
        rpc.checkXPath(selectedFiles, curXPath).then(res => {
            if (res == "") {
                operFile(map, selectedFiles);
            } else {
                var doIt = confirm("XPath error: \n" + res + "\nPress OK to force operation, cancel to quit operation.");
                if (doIt) {
                    operFile(map, selectedFiles);
                }
            }
        });
    }
}


function deleteComment() {
    var selectedFiles = getSelectedNodes();
    var map = {
        xPath: curXPath,
        mod: "deleteComment"
    };

    var prompt = checkInput(map, [], selectedFiles);
    if (prompt != "") {
        alert(prompt);
    } else {
        var rpc = b.invoker();
        rpc.module = 'handler';
        rpc.checkXPath(selectedFiles, curXPath).then(res => {
            if (res == "") {
                operFile(map, selectedFiles);
            } else {
                var doIt = confirm("XPath error: \n" + res + "\nPress OK to force operation, cancel to quit operation.");
                if (doIt) {
                    operFile(map, selectedFiles);
                }
            }
        });
    }
}


// Retrieve Operation

function retrieveElementNum() {
    var selectedFiles = getSelectedNodes();
    var map = {
        name: $("#retrieveEleNum").val(),
        xPath: curXPath,
        mod: "retrieveElementNumber"
    };

    var prompt = checkInput(map, ["name"], selectedFiles);
    if (prompt != "") {
        alert(prompt);
    } else {
        var rpc = b.invoker();
        rpc.module = 'handler';
        rpc.checkXPath(selectedFiles, curXPath).then(res => {
            if (res == "") {
                operFile(map, selectedFiles);
            } else {
                var doIt = confirm("XPath error: \n" + res + "\nPress OK to force operation, cancel to quit operation.");
                if (doIt) {
                    operFile(map, selectedFiles);
                }
            }
        });
    }
}


function retrieveAttributeNum() {
    var selectedFiles = getSelectedNodes();
    var map = {
        name: $("#retrieveAttrNum").val(),
        xPath: curXPath,
        mod: "retrieveAttributeNumber"
    };

    var prompt = checkInput(map, ["name"], selectedFiles);
    if (prompt != "") {
        alert(prompt);
    } else {
        var rpc = b.invoker();
        rpc.module = 'handler';
        rpc.checkXPath(selectedFiles, curXPath).then(res => {
            if (res == "") {
                operFile(map, selectedFiles);
            } else {
                var doIt = confirm("XPath error: \n" + res + "\nPress OK to force operation, cancel to quit operation.");
                if (doIt) {
                    operFile(map, selectedFiles);
                }
            }
        });
    }
}


// update Operation

function updateElementValue() {
    var selectedFiles = getSelectedNodes();
    var map = {
        value: $("#updateEleValue").val(),
        xPath: curXPath,
        mod: "updateElementValue"
    };

    var prompt = checkInput(map, ["value"], selectedFiles);
    if (prompt != "") {
        alert(prompt);
    } else {
        var rpc = b.invoker();
        rpc.module = 'handler';
        rpc.checkXPath(selectedFiles, curXPath).then(res => {
            if (res == "") {
                operFile(map, selectedFiles);
            } else {
                var doIt = confirm("XPath error: \n" + res + "\nPress OK to force operation, cancel to quit operation.");
                if (doIt) {
                    operFile(map, selectedFiles);
                }
            }
        });
    }
}


function updateAttributeValue() {
    var selectedFiles = getSelectedNodes();
    var map = {
        value: $("#updateAttrValue").val(),
        xPath: curXPath,
        mod: "updateAttributeValue"
    };

    var prompt = checkInput(map, ["value"], selectedFiles);
    if (prompt != "") {
        alert(prompt);
    } else {
        var rpc = b.invoker();
        rpc.module = 'handler';
        rpc.checkXPath(selectedFiles, curXPath).then(res => {
            if (res == "") {
                operFile(map, selectedFiles);
            } else {
                var doIt = confirm("XPath error: \n" + res + "\nPress OK to force operation, cancel to quit operation.");
                if (doIt) {
                    operFile(map, selectedFiles);
                }
            }
        });
    }

}


// ------------------------------[save change in contentArea]------------------------------


function saveChange() {
    if(curFilePath == null){
        alert("No file has been select yet.");
        return;
    }
    var newContent = editor.getValue();

    var rpc = b.invoker();
    rpc.module = 'handler';
    rpc.saveChangedFile(newContent, curFilePath).then(res => {
        if (res == "") {
            alert("Save finished.");
        } else {
            alert(res);
        }
    });
}