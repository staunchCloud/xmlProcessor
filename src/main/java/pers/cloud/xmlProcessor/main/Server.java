package pers.cloud.xmlProcessor.main;

import java.io.File;

import io.zbus.kit.ConfigKit;
import io.zbus.kit.FileKit;
import io.zbus.rpc.bootstrap.http.ServiceBootstrap;

public class Server {

	@SuppressWarnings("resource")
	public static void main(String[] args) throws Exception {
		FileKit.setCache(false); //disable cache
		
		String configFile = ConfigKit.option(args, "-conf", "config.xml"); 
		Config config = new Config(configFile); 
		
		String staticDir = new File(config.getStaticDir()).getAbsolutePath();  
		String workDir = new File(config.getWorkDir()).getAbsolutePath();  
		
		XmlHandler xmlHandler = new XmlHandler();
		xmlHandler.setWorkPath(workDir);
		
		ServiceBootstrap b = new ServiceBootstrap();
		b.addModule("index", new Index());
		b.addModule("static", new StaticResource(staticDir)); 
		b.addModule("handler", xmlHandler);
		
		b.port(config.getPort())           
		 .start();
	}  
}
