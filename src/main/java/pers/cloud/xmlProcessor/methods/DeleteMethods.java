package pers.cloud.xmlProcessor.methods;

import java.util.List;

import org.dom4j.Attribute;
import org.dom4j.Element;
import org.dom4j.Node;

public class DeleteMethods {

	public static void deleteElement(List<Node> eles) {
		for (Node node : eles) {
			Element ele = (Element) node;
			ele.detach();
		}
	}

	public static void deleteAttribute(List<Node> attrs) {
		for (Node node : attrs) {
			Attribute attr = (Attribute) node;
			attr.detach();
		}
	}

	public static void deleteComment(List<Node> eles) {
		for (Node node : eles) {
			Element ele = (Element) node;
			List<Node> subNodes = ele.content();
			for (Node subNode : subNodes) {
				if (subNode.getNodeTypeName().equals("Comment"))
					subNode.detach();
			}
		}
	}

}
