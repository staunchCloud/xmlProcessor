package pers.cloud.xmlProcessor.main;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Calendar;

public class ZNode {
	public int id;
	public int pId;
	public String name;
	public String filePath;
	public boolean isParent;

	public String lastModTime;

	ZNode(int id, int pId, String name, String filePath, boolean isParent) {
		this.id = id;
		this.pId = pId;
		this.name = name;
		this.isParent = isParent;
		this.filePath = filePath;
	}

	// folders should not have lastModifiy time, their "isParent" are true.
	public void setTime(File f) {
		Calendar cal = Calendar.getInstance();
		long time = f.lastModified();

		SimpleDateFormat timeFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		cal.setTimeInMillis(time);
		this.lastModTime = timeFormat.format(cal.getTime());
	}

}
