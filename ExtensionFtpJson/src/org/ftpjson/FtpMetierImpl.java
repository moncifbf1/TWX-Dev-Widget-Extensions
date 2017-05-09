package org.ftpjson;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ConnectException;
import java.net.SocketException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.Date;

import org.apache.commons.net.PrintCommandListener;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;
import org.apache.commons.net.ftp.FTPReply;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

public class FtpMetierImpl {

	private String password;
	private String serverftp;
	private int portftp;
	private String username;// "prox";

	private FTPClient ftpClient = new FTPClient();
	FTPFile[] files = null;
	JSONArray jsonList = new JSONArray();

	public FtpMetierImpl(String password, String serverftp, int portftp, String username) {
		super();
		this.password = password;
		this.serverftp = serverftp;
		this.portftp = portftp;
		this.username = username;
	}

	// setters and getters
	public String getServerftp() {
		return serverftp;
	}

	public void setServerftp(String serverftp) {
		this.serverftp = serverftp;
	}

	public int getPortftp() {
		return portftp;
	}

	public void setPortftp(int portftp) {
		this.portftp = portftp;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public boolean authenticate() {
		boolean state = false;
		try {
			ftpClient.connect(serverftp, portftp);
			ftpClient.addProtocolCommandListener(new PrintCommandListener(new PrintWriter(System.out)));
			int replyCode = ftpClient.getReplyCode();
			if (!FTPReply.isPositiveCompletion(replyCode)) {
				state = false;
			} else {
				state = ftpClient.login(username, password);
				ftpClient.setControlKeepAliveTimeout(60);
			}
		} catch (IOException e) {
			e.printStackTrace();
			disconnect();
		}
		return state;
	}

	public void disconnect() {
		try {
			if (ftpClient.isConnected()) {
				ftpClient.logout();
				ftpClient.disconnect();
			}
		} catch (IOException ex) {
			ex.printStackTrace();
		}
	}

	//retrieve files ulterior to the specified date
	public void getFiles(String dateString) {
		FilterByDate filter = new FilterByDate(dateString);
		try {
			files = ftpClient.listFiles("/", filter);

		} catch (Exception e) {
			disconnect();
			e.printStackTrace();
		}
	}

	
	//converts Files to a single Json Array
	public void ftpRetrieve() {
		String rslt;
		boolean success;
		JSONObject fileAsJson = new JSONObject();
		JSONParser parser = new JSONParser();
		InputStream is;
		int count = 0;
		int howMany = 15;
		
		System.out.println("*********************************number of files :"+files.length+"***************************");

		for (int i = 0; i < files.length; i++) {

			count = 0;
			howMany = 20;

			ftpClient.setBufferSize(1024 * 1024);

			while (true) {
				try {
					
					ftpClient.enterLocalPassiveMode();
					is = ftpClient.retrieveFileStream(files[i].getName());
					if (!FTPReply.isPositiveCompletion(ftpClient.getReplyCode())) {
						String replyS = ftpClient.getReplyString();  // to view reply string in case of error
					}
					rslt = getStringFromInputStream(is);
					success = ftpClient.completePendingCommand();

					if (success) {
						fileAsJson = (JSONObject) parser.parse(rslt);
						jsonList.add(fileAsJson);
						System.out.println("*********************************file number :"+i+"***************************");
						break;
					}

					is.close();

				} catch (Exception e) {

					//repeat howmany times if one of these exceptions is caught
					if (e instanceof ConnectException | e instanceof NullPointerException |e instanceof SocketException) {
						count++;
						if (count > howMany) {
							break;
						}
					} else if (e instanceof ParseException) {
						break;
					} else {
						//any IOException other than the above prompts to disconnect
						System.out.println(e.getMessage());
						disconnect();
						e.printStackTrace();
						return;
					}

				}
			}

		}
	}

	private static String getStringFromInputStream(InputStream is) {

		BufferedReader br = null;
		StringBuilder sb = new StringBuilder();

		String line;
		try {

			br = new BufferedReader(new InputStreamReader(is));
			while ((line = br.readLine()) != null) {
				sb.append(line);
			}

		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (br != null) {
				try {
					br.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}

		return sb.toString();

	}
	
	public static void saveFile(String data, String RootPath){
		PrintWriter out;
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH-mm-ss'Z'");
		Date date = new Date();
		
		try {
			
			File rootDir = new File(RootPath+"/MarlinkJsonFiles");
		    if (!rootDir.exists()) {
		      rootDir.mkdirs();
		    }
			
			out = new PrintWriter(rootDir.getAbsolutePath()+"/"+dateFormat.format(date));
			out.print(data);
			out.close();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}

	public static void main(String... a) {

		FtpMetierImpl ftp = new FtpMetierImpl("Fgrt4pk*+", "portal.iritrack.com", 21, "prox");
		ftp.authenticate();
		ftp.getFiles("2017-04-10T13:00:31.0Z");
		ftp.ftpRetrieve();
		String rslt = ftp.jsonList.toJSONString();
		FtpMetierImpl.saveFile(rslt, "C:\\");
		

		ftp.disconnect();

	}
}
