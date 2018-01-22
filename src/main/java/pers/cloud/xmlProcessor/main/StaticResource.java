package pers.cloud.xmlProcessor.main;

import java.io.IOException;

import io.zbus.kit.FileKit;
import io.zbus.transport.http.Message;

public class StaticResource {

	private String basePath = "";

	public StaticResource(String basePath) {
		this.basePath = basePath;
	}

	public Message file(Message request) {
		String url = request.getUrl(); // /static/file/xxx/
		String[] bb = url.split("[/]");
		String resource = "";
		int count = 0;
		for (int i = 0; i < bb.length; i++) {
			if (bb[i].equals(""))
				continue;
			count++;
			if (count < 3)
				continue;
			resource += bb[i];
			if (i < bb.length - 1)
				resource += "/";
		}

		Message res = new Message();
		res.setStatus(200);
		try {
			byte[] data = FileKit.loadFileBytes(basePath + "/" + resource);
			if (data == null) {
				res.setBody("404: " + resource + " Not Found");
				res.setStatus(404);
			} else {
				res.setBody(data);
			}

			String contentType = "text/plain";
			if (resource.endsWith(".js")) {
				contentType = "application/javascript";
			} else if (resource.endsWith(".css")) {
				contentType = "text/css";
			} else if (resource.endsWith(".htm") || resource.endsWith(".html")) {
				contentType = "text/html";
			} else if (resource.endsWith(".svg")) {
				contentType = "image/svg+xml";
			} else if (resource.endsWith(".gif")) {
				contentType = "image/gif";
			} else if (resource.endsWith(".jpeg")) {
				contentType = "image/jpeg";
			} else if (resource.endsWith(".png")) {
				contentType = "image/png";
			} else if (resource.endsWith(".woff")) {
				contentType = "font/woff";
			} else if (resource.endsWith(".woff2")) {
				contentType = "font/woff2";
			} else if (resource.endsWith(".eot")) {
				contentType = "application/vnd.ms-fontobject";
			} else if (resource.endsWith(".ttf")) {
				contentType = "font/ttf";
			}

			res.setHeader("content-type", contentType + " ; charset=utf-8");
		} catch (IOException e) {
			res.setStatus(404);
			res.setBody(e.getMessage());
		}
		return res;
	}

	public Message showUpload() {
		Message res = new Message();
		res.setStatus(200);
		try {
			byte[] data = FileKit.loadFileBytes(basePath + "/upload.htm");
			res.setBody(data);
			res.setHeader("content-type", "text/html");
		} catch (IOException e) {
			res.setStatus(404);
			res.setBody(e.getMessage());
		}
		return res;
	}

}
