package pers.cloud.xmlProcessor.methods;

import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.dom4j.Attribute;
import org.dom4j.Element;
import org.dom4j.Node;

// Support Regular Expression
public class RetrieveMethods {

	public static String retrieveElementNum(List<Node> eles, Map<String, String> argMap) {
		String name = argMap.get("name");
		Pattern namePattern = Pattern.compile(name);
		int count = 0;
		for (Node node : eles) {
			Element ele = (Element) node;
			Matcher matcher = namePattern.matcher(ele.getName());
			if (matcher.find())
				count++;
		}
		String res = "There are " + count + " \"" + name + "\" elements in selected range.\n";
		return res;
	}

	public static String retrieveAttributeNum(List<Node> eles, Map<String, String> argMap) {
		String attrName = argMap.get("name");
		Pattern attrNamePattern = Pattern.compile(attrName);
		int count = 0;
		for (Node node : eles) {
			Element ele = (Element) node;
			List<Attribute> attrs = ele.attributes();
			for (Attribute attr : attrs) {
				Matcher matcher = attrNamePattern.matcher(attr.getName());
				if (matcher.find())
					count++;
			}
		}
		String res = "There are " + count + " \"" + attrName + "\" attributes in selected range.\n";
		return res;
	}

}
