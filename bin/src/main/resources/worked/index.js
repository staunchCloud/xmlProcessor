function listFiles(files){
	for(var i in files){
		var file = files[i];
		$("#fileList").append("<a id=\'"+ i +"' onclick=\"selectFile('" + i + "')\">"+file+"</a>");
	} 
}

$(document).ready(function(){
	$.get("/handler/listFiles", function(res){
		var files = JSON.parse(res);
		listFiles(files); 
	});  
	
});

/*
$(document).ready(function(){ 
	var b = new ClientBootstrap();  
	b.serviceAddress("localhost:80"); 
	var rpc = b.invoker();
	rpc.module = 'handler';

	rpc.listFiles().then(res=>{
	     listFiles(res);
	});   
});
*/
