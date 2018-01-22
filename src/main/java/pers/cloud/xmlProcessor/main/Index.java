package pers.cloud.xmlProcessor.main;

import io.zbus.transport.http.Message;

public class Index {  
	
	public Message index(){ 
		Message res = new Message();
		res.setHeader("location", "/static/file/OperationPage.html");
		res.setStatus(302);
		return res;
	} 
}
