package org.ftpjson;

import com.thingworx.entities.utils.EntityUtilities;
import com.thingworx.logging.LogUtilities;
import com.thingworx.metadata.annotations.ThingworxPropertyDefinition;
import com.thingworx.metadata.annotations.ThingworxPropertyDefinitions;
import com.thingworx.metadata.annotations.ThingworxServiceDefinition;
import com.thingworx.metadata.annotations.ThingworxServiceParameter;
import com.thingworx.metadata.annotations.ThingworxServiceResult;
import com.thingworx.relationships.RelationshipTypes.ThingworxRelationshipTypes;
import com.thingworx.things.Thing;
import com.thingworx.things.repository.FileRepositoryThing;

import org.slf4j.Logger;


@ThingworxPropertyDefinitions(properties = {
		@ThingworxPropertyDefinition(name = "serverUrl", description = "Ftp server url", category = "", baseType = "STRING", isLocalOnly = false, aspects = {
				"isPersistent:true", "isLogged:true", "dataChangeType:Always" }), 
		@ThingworxPropertyDefinition(name = "portFtp", description = "FTP server port", category = "", baseType = "INTEGER", isLocalOnly = false, aspects = {
				"isPersistent:true", "isLogged:true", "dataChangeType:Always" }),
		@ThingworxPropertyDefinition(name = "username", description = "Ftp server username", category = "", baseType = "STRING", isLocalOnly = false, aspects = {
				"isPersistent:true", "isLogged:true", "dataChangeType:Always" }), 
		@ThingworxPropertyDefinition(name = "password", description = "Ftp server password", category = "", baseType = "STRING", isLocalOnly = false, aspects = {
				"isPersistent:true", "isLogged:true", "dataChangeType:Always" }) 
})
public class FtpThing extends Thing{

	private static Logger _logger = LogUtilities.getInstance().getApplicationLogger(FtpThing.class);
	private static final long serialVersionUID = 1L;

	@ThingworxServiceDefinition(name = "getJsonArray", description = "return array of data as Json", isAllowOverride = false, aspects = {"isAsync:false" })
	@ThingworxServiceResult(name = "Result", baseType = "STRING")
	public String getJsonArray(
			@ThingworxServiceParameter(name = "server", baseType = "STRING", aspects = {"isRequired:true" }) String server,
			@ThingworxServiceParameter(name = "port", baseType = "INTEGER", aspects = {"isRequired:true" }) Integer port,
			@ThingworxServiceParameter(name = "user", baseType = "STRING", aspects = {"isRequired:true" }) String user,
			@ThingworxServiceParameter(name = "pass", baseType = "STRING", aspects = {"isRequired:true" }) String pass,
			@ThingworxServiceParameter(name = "date", baseType = "STRING", aspects = {"isRequired:true" }) String date,
			@ThingworxServiceParameter(name = "repository", baseType = "THINGNAME", aspects = {"isRequired:false","thingTemplate:FileRepository"}) String repository) 
	{
		_logger.debug("Entering Service: getJsonArray");
		
		Thing repositoryThing = (Thing)EntityUtilities.findEntity(repository, ThingworxRelationshipTypes.Thing);
	    String ROOT_PATH = ((FileRepositoryThing) repositoryThing).getRootPath();
		
		
		FtpMetierImpl ftp = new FtpMetierImpl(pass, server, port, user);
		ftp.authenticate();
		ftp.getFiles(date);
		ftp.ftpRetrieve();
		String rslt = ftp.jsonList.toJSONString();
		FtpMetierImpl.saveFile(rslt, ROOT_PATH);
		ftp.disconnect();
		_logger.debug("Exiting Service: getJsonArray");
		return rslt;
	}

	
	
	
}
