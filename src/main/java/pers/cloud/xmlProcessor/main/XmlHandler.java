package pers.cloud.xmlProcessor.main;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Node;
import org.dom4j.io.SAXReader;

import io.zbus.transport.http.Message;
import io.zbus.transport.http.Message.FileForm;
import io.zbus.transport.http.Message.FileUpload;
import pers.cloud.xmlProcessor.actions.CheckFileAction;
import pers.cloud.xmlProcessor.actions.OperateFileAction;
import pers.cloud.xmlProcessor.actions.ZipFileAction;
import pers.cloud.xmlProcessor.methods.CreateMethods;


public class XmlHandler {
	
	// setting
	String workPath; 
	ExecutorService processPool = Executors.newFixedThreadPool(8);
	
	public void setWorkPath(String workPath) {
		this.workPath = workPath;
	}
	
	
	// decode the filePath for Chinese characters
	@SuppressWarnings("static-access")
	private static String filePathDecode(String filePath) {
		URLDecoder decoder = new URLDecoder();
		try {
			return decoder.decode(filePath,"utf-8");
		} catch (UnsupportedEncodingException e) {
			return "Invalid Path Name.";
		} 
	}

	
	// ================================================================================
	// get file name from its path
	public static String getFileName(String filePath){
		int seperator = filePath.lastIndexOf('\\');
		return filePath.substring(seperator+1, filePath.length());
	}

	
	// ================================================================================
	// check if modes can be found with given xPath
	public String checkXPath(String[] selectedFiles, String xPath){
		SAXReader reader = new SAXReader();
		String res = "";
		for (String filePath : selectedFiles) {			
			try {
				Document doc = (Document) reader.read(new File(filePath));
				List<Node> nodes = doc.selectNodes(xPath);
				// XPath need correct input
				if(nodes.size() < 1){
					String curFileName = getFileName(filePath);
					res = res + curFileName +": Cannot find any operation node for given xPath.\n";
				}
			} catch (DocumentException e) {
				e.printStackTrace();
			}
		}
		return res; // check pass -> res = ""; 
	}


	// ================================================================================
	// handle single or multiple files
	public String handleFiles(final Map<String, String> args, String[] selectedFiles) { 
		final String mod = (String) args.get("mod");
		String res = mod + " operation:\n";
		final String xPath = (String) args.get("xPath");
		
		final CountDownLatch countDown = new CountDownLatch(selectedFiles.length);
		final List<String> taskRes = Collections.synchronizedList(new ArrayList<String>()); 
		
		for (final String filePath : selectedFiles) {
			processPool.submit(new Runnable() {
				@Override
				public void run() { 
					final SAXReader reader = new SAXReader();
					Document doc;
					try {
						doc = (Document) reader.read(new File(filePath));
						String result = OperateFileAction.runMethod(doc, mod, args, xPath, filePath);
						taskRes.add(result);
					} catch (DocumentException e) {
						taskRes.add("Cannot open file: " + filePath + "\n");
					}
					countDown.countDown(); 
				}
			});
			
		}
		try {
			countDown.await(10, TimeUnit.SECONDS);
		} catch (InterruptedException e) { 
			e.printStackTrace();
		}
		for(String result : taskRes){
			res += result;
		}  
		res += "End of the operation.\n";
		
		return res;
	}
	
	
	// ================================================================================
	// add id
	public String addIDs(final String xPath, int initID, String[] selectedFiles) {
		String res = "addIDs operation:\n";

		int curID = initID;

		final CountDownLatch countDown = new CountDownLatch(selectedFiles.length);
		final List<String> taskRes = Collections.synchronizedList(new ArrayList<String>());

		for (final String filePath : selectedFiles) {
			final String writeID = String.valueOf(curID++);
			processPool.submit(new Runnable() {
				@Override
				public void run() {
					final SAXReader reader = new SAXReader();
					Document doc;
					try {
						doc = (Document) reader.read(new File(filePath));
						List<Node> nodes = doc.selectNodes(xPath);
						Map<String, String> argMap = new HashMap<String, String>();
						argMap.put("name", "ID");
						argMap.put("value", writeID);
						CreateMethods.addAttribute(nodes, argMap);
						OperateFileAction.saveSingleFile(filePath, doc);
						taskRes.add(filePath + ": add ID completes.\n");
					} catch (DocumentException e) {
						taskRes.add("Cannot open file: " + filePath + "\n");
					}
					countDown.countDown();
				}
			});
		}
		try {
			countDown.await(10, TimeUnit.SECONDS);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		for (String result : taskRes) {
			res += result;
		}
		res += "End of the operation.\n";

		return res;
	}
	
	
	// ================================================================================
	// handle single or multiple files with Single Thread
	/*
	public String handleFilesST(Map<String, String> args, String[] selectedFiles) {
		SAXReader reader = new SAXReader();
		String mod = (String) args.get("mod");
		String res = mod + " operation:\n";
		String xPath = (String) args.get("xPath");
		for (String filePath : selectedFiles) {
			Document doc;
			try {
				doc = (Document) reader.read(filePath);
				res = res + SingleFileAction.runMethod(doc, mod, args, xPath, filePath);
			} catch (DocumentException e) {
				res = res + "Cannot open file: " + filePath + "\n";
			}
		}
		res = res + "End of the operation.\n";
		return res;
	}
	*/
	
	
	// ================================================================================

	// save file modified in the content frame
	public String saveChangedFile(String content, String filePath){
		String res = "";
		File file = new File(filePath);
		try {
			FileOutputStream fos = new FileOutputStream(file);
			fos.write(content.getBytes());
			fos.flush();
			fos.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			res = e.getMessage();
		}
		return res;
	}
	
	
	// ================================================================================
	// check if the input path is valid 
	public boolean validWorkPath(String path) {
		path = filePathDecode(path);
		File file = null;
		if(path.startsWith("/")){
			file = new File(path);
		} else {
			file = new File(this.workPath, path);
		}
		return file.exists();
	}

	
	// ================================================================================
	// check XML file with a pointed Schema file
	public String checkBySchema(String[] xmlPaths, String xsdPath) {
		String res = "";
		for (String filePath : xmlPaths) {
			res = res + CheckFileAction.checkByXSD(filePath, xsdPath);
		}
		if (res.equals("")) {
			res = "All selected files have passed Schema Check.";
		}
		return res;
	}

	
	// ================================================================================
	// get contents of a single XML file
	public String printFile(String filePath) {
		filePath = filePathDecode(filePath);
		String res = "";		
		try {
			res = OperateFileAction.printSingleFile(filePath);
		} catch (Exception e) {
			res = e.getMessage();
		}
		return res;
	}

	
	// ================================================================================
	// collect files' info for ZTree with simple format
	public ZNode[] getFileList(String rootPath) {
		rootPath = filePathDecode(rootPath);
		List<ZNode> fileList = new ArrayList<ZNode>();
		File file = null;
		if(rootPath.startsWith("/")){
			file = new File(rootPath);
		} else {
			file = new File(this.workPath, rootPath);
		}
		
		if (file.isDirectory()) {
			ZNode root = new ZNode(1, 0, file.getName(), file.getPath(), true);
			fileList.add(root);
			collectFileList(fileList, 1 * 10 + 1, 1, file);
		} else if (file.getName().endsWith(".xml") || file.getName().endsWith(".xsd")) {
			ZNode root = new ZNode(1, 0, file.getName(), file.getPath(), false);
			root.setTime(file);
			fileList.add(root);
		}
		// else the result is empty
		return fileList.toArray(new ZNode[0]);
	}

	private void collectFileList(List<ZNode> fileList, int id, int pId, File file) { 
		File[] files = file.listFiles();
		if(files == null) return;
		for (File f : files) {
			if (f.isDirectory()) {
				ZNode node = new ZNode(id, pId, f.getName(), f.getPath(), true);
				fileList.add(node);
				
				File subPath = new File(file, f.getName()); 
				int newId = id * 10 + 1;
				int newPId = id;
				collectFileList(fileList, newId, newPId, subPath); // recursion

				id++;
				continue;
			}

			if (!f.getName().endsWith(".xml") && !f.getName().endsWith(".xsd"))
				continue;

			ZNode node = new ZNode(id, pId, f.getName(), f.getPath(), false);
			node.setTime(f);
			fileList.add(node);
			id++;
		}
	}
	
	
	// ================================================================================
	// upload files will be saved into tempWorkingSpace
	public boolean upload(Message request) {
		FileForm fileForm = request.getFileForm();
		if (fileForm == null)
			return false;

		/*
		for (String key : fileForm.attributes.keySet()) {
			System.out.println(key + "=>" + fileForm.attributes.get(key));
		}
		System.out.println("Files: ");
		*/

		BufferedOutputStream bos = null;
		FileOutputStream fos = null;

		for (String key : fileForm.files.keySet()) {
			List<FileUpload> files = fileForm.files.get(key);
			for (FileUpload file : files) {
				try {
					File curF = new File(workPath, file.fileName);
					fos = new FileOutputStream(curF);
					bos = new BufferedOutputStream(fos);
					bos.write(file.data);
					//System.out.println("Save successfully");
					
					if(curF.getName().endsWith(".zip")){
						ZipFileAction.unzip(curF.getAbsolutePath(), workPath);
						curF.delete();
					}
					
				} catch (Exception e) {
					System.out.println(e.getMessage());
					e.printStackTrace();
				} finally {
					try {
						if (bos != null) {
							bos.close();
						}
						if (fos != null) {
							fos.close();
						}
					} catch (Exception e) {
						System.out.println(e.getMessage());
						e.printStackTrace();
					}
				}
			}
		}
		return true;
	}

	
	// ================================================================================
	// download all files in working space
	public Message download(){
		Message message = new Message();
		message.setStatus(200); 
		
		message.setBody(ZipFileAction.zip(workPath)); 
		
		message.setHeader("content-type", "application/octet-stream");
		
		message.setHeader("Content-Disposition", "attachment;filename=" + "tempfilname.zip"); 
		
		return message;
	}
	
	
	// ================================================================================
	// test results can be returned
	public String testConnection(){
		return "Connection success!";
	}
	
	
}
