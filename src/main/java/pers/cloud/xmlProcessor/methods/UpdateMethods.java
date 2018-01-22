package pers.cloud.xmlProcessor.methods;

import java.util.List;
import java.util.Map;

import org.dom4j.Attribute;
import org.dom4j.Element;
import org.dom4j.Node;

public class UpdateMethods {

	public static void updateElementValue(List<Node> eles, Map<String, String> argMap) {
		for (Node node : eles) {
			Element ele = (Element) node;
			String newValue = argMap.get("value");
			ele.setText(newValue);
		}
	}

	public static void updateAttributeValue(List<Node> attrs, Map<String, String> argMap) {
		for (Node node : attrs) {
			Attribute attr = (Attribute) node;
			String newValue = argMap.get("value");
			attr.setText(newValue);
		}
	}

}
