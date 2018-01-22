package pers.cloud.xmlProcessor.methods;

import java.util.List;
import java.util.Map;

import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.dom4j.Node;

public class CreateMethods {

	public static void addElement(List<Node> eles, Map<String, String> argMap) {
		String newName = argMap.get("name");
		String newValue = argMap.get("value");
		for (Node node : eles) {
			Element ele = (Element) node;
			Element newEle = DocumentHelper.createElement(newName);
			newEle.setText(newValue);
			ele.add(newEle);
		}
	}

	public static void addAttribute(List<Node> eles, Map<String, String> argMap) {
		String newName = argMap.get("name");
		String newValue = argMap.get("value");
		for (Node node : eles) {
			Element ele = (Element) node;
			ele.addAttribute(newName, newValue);
		}
	}

	public static void addComment(List<Node> eles, Map<String, String> argMap) {
		String newCommentValue = argMap.get("value");
		for (Node node : eles) {
			Element ele = (Element) node;
			ele.addComment(newCommentValue);
		}
	}

}
