package org.ftpjson;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import org.apache.commons.net.ftp.FTPFile;
import org.apache.commons.net.ftp.FTPFileFilter;

public class FilterByDate implements FTPFileFilter{

	Calendar date = Calendar.getInstance(); 

	public FilterByDate(String stringDate){
		
		try {
			String pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
			Date date = new SimpleDateFormat(pattern).parse(stringDate);
			
			this.date.setTime(date);
			
		} catch (ParseException e) {
			e.printStackTrace();
		}
		
	}
	
	
	public boolean accept(FTPFile file) {
	
		return (file.getTimestamp().compareTo(this.date)>=0);
	}

}
