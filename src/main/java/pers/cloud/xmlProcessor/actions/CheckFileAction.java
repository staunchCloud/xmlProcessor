package pers.cloud.xmlProcessor.actions;

import java.io.File;
import java.io.IOException;

import javax.xml.XMLConstants;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;
import javax.xml.validation.Validator;

import org.xml.sax.SAXException;

import pers.cloud.xmlProcessor.main.XmlHandler;

public class CheckFileAction {

	public static String checkByXSD(String xmlPath, String xsdPath) {
		String result = "";
		try {
			SchemaFactory factory = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
			Schema schema = factory.newSchema(new File(xsdPath));
			Validator validator = schema.newValidator();
			validator.validate(new StreamSource(new File(xmlPath)));
		} catch (IOException | SAXException e) {
			result = XmlHandler.getFileName(xmlPath) + ": " + e.getMessage() + "\n";
		}
		return result;
	}

}
