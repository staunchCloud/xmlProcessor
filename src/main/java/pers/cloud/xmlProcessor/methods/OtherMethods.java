package pers.cloud.xmlProcessor.methods;

import java.util.List;
import java.util.Map;

import org.dom4j.Element;
import org.dom4j.Node;

public class OtherMethods {

	public static void addIDs(List<Node> eles, Map<String, String> argMap) {
		String pointedID = argMap.get("ID");
		for (Node node : eles) {
			Element ele = (Element) node;
			ele.addAttribute("ID", pointedID);
		}
	}

}
