package pers.cloud.xmlProcessor.main;

import static io.zbus.kit.ConfigKit.valueOf;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.Document;

import io.zbus.kit.ConfigKit.XmlConfig;

public class Config extends XmlConfig{ 
	public String staticDir;
	public String workDir;
	public Integer port = 80; 
	public Config(String configXmlFile) {
		loadFromXml(configXmlFile);
	}
	
	public void loadFromXml(Document doc) throws Exception{
		XPath xpath = XPathFactory.newInstance().newXPath();    
		this.staticDir = valueOf(xpath.evaluate("/xp/staticDir", doc), "static");  
		this.workDir = valueOf(xpath.evaluate("/xp/workDir", doc), "0.0.0.0"); 
		this.port = valueOf(xpath.evaluate("/xp/port", doc), 80); 
	}

	public String getStaticDir() {
		return staticDir;
	}

	public void setStaticDir(String staticDir) {
		this.staticDir = staticDir;
	}

	public String getWorkDir() {
		return workDir;
	}

	public void setWorkDir(String workDir) {
		this.workDir = workDir;
	}

	public Integer getPort() {
		return port;
	}

	public void setPort(Integer port) {
		this.port = port;
	}   
	
}