package pers.cloud.xmlProcessor.actions;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.List;
import java.util.Map;

import org.dom4j.Document;
import org.dom4j.Node;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.XMLWriter;

import pers.cloud.xmlProcessor.methods.CreateMethods;
import pers.cloud.xmlProcessor.methods.DeleteMethods;
import pers.cloud.xmlProcessor.methods.OtherMethods;
import pers.cloud.xmlProcessor.methods.RetrieveMethods;
import pers.cloud.xmlProcessor.methods.UpdateMethods;

public class OperateFileAction {

	// operate single file
	public static String runMethod(Document doc, String mod, Map<String, String> args, String xPath, String filePath) {
		List<Node> nodes = doc.selectNodes(xPath);
		if (nodes.size() < 1) {
			return filePath + ": Cannot find any operation node for given xPath\n.";
		}

		String res = filePath + ": " + mod + " operation completed.\n";

		// Add
		if (mod.equals("addElement")) {
			CreateMethods.addElement(nodes, args);
		} else if (mod.equals("addAttribute")) {
			CreateMethods.addAttribute(nodes, args);
		} else if (mod.equals("addComment")) {
			CreateMethods.addComment(nodes, args);
		}
		// Delete
		else if (mod.equals("deleteElement")) {
			DeleteMethods.deleteElement(nodes);
		} else if (mod.equals("deleteAttribute")) {
			DeleteMethods.deleteAttribute(nodes);
		} else if (mod.equals("deleteComment")) {
			DeleteMethods.deleteComment(nodes);
		}
		// Retrieve
		else if (mod.equals("retrieveElementNumber")) {
			res = filePath + ": " + RetrieveMethods.retrieveElementNum(nodes, args);
			return res;
		} else if (mod.equals("retrieveAttributeNumber")) {
			res = filePath + ": " + RetrieveMethods.retrieveAttributeNum(nodes, args);
			return res;
		}
		// Update
		else if (mod.equals("updateElementValue")) {
			UpdateMethods.updateElementValue(nodes, args);
		} else if (mod.equals("updateAttributeValue")) {
			UpdateMethods.updateAttributeValue(nodes, args);
		}
		// Other
		else if (mod.equals("addIDs")) {
			OtherMethods.addIDs(nodes, args);
		}

		saveSingleFile(filePath, doc);
		return res;
	}

	// save file once the operation is finished
	public static String saveSingleFile(String filePath, Document doc) {
		String res = filePath + " save completed.";

		try {
			OutputFormat format = OutputFormat.createPrettyPrint();
			format.setEncoding("UTF-8");
			XMLWriter writer = new XMLWriter(new OutputStreamWriter(new FileOutputStream(new File(filePath)), "UTF-8"),
					format);
			writer.write(doc);
			writer.flush();
			writer.close();
		} catch (FileNotFoundException e) {
			res = filePath + " save failed.";
			res = res + "\n" + e.getMessage();
		} catch (IOException e) {
			res = filePath + " save failed.";
			res = res + "\n" + e.getMessage();
		}
		return res;
	}

	// return the content of a file for displaying
	public static String printSingleFile(String filePath) throws Exception {
		FileReader fr = new FileReader(filePath);
		BufferedReader br = new BufferedReader(fr);
		StringBuffer sb = new StringBuffer();
		String str = null;
		while ((str = br.readLine()) != null) {
			sb.append(str + "\n");
		}
		br.close();
		return sb.toString();
	}

	
}
