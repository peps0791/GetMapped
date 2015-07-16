<%@ page import ="java.sql.*" %>
<%@ page import ="java.io.*" %>
<%@ page import ="org.apache.log4j.Logger"%>
<%@ page import = "com.FYW.dbhandle.DBConnectionHandler;"%>

<%!
	static final Logger MaptoDBOperationsLogger = Logger.getLogger("MaptoDBOperationsLogger");
%>

<%
	Connection con = null;
	PreparedStatement preparedstmt = null;
	ResultSet resultSet = null;
	try{
		String twoDArray = request.getParameter("arrayString");
		MaptoDBOperationsLogger.info("Input parameter arrayString to the JSP:" +twoDArray);
		
		String mapName = request.getParameter("imageName");
		MaptoDBOperationsLogger.info("Input parameter imageName to the JSP:" +mapName);
		
		//mapName = "IMG_2109.JPG";
		MaptoDBOperationsLogger.info("Input parameter imageName to the JSP:" +mapName);
		
		String mapDesc = request.getParameter("imageDesc");
		MaptoDBOperationsLogger.info("Input parameter imageDesc to the JSP:" +mapDesc);
		
		//mapName = "newgen_third_floor";
		MaptoDBOperationsLogger.info("Input parameter imageName to the JSP:" +mapDesc);
		
		if((twoDArray==null || twoDArray.length()==0) && (mapName==null || mapName.length()==0) && (mapDesc==null || mapDesc.length()==0)){
			/*No input Parameter, no processing */
			response.sendRedirect("ErrorPage.jsp?ErrorMessage=Input parameters to the previous page were blank. Could not have proceeded further. Hence Here!");
		}
		else{
			con = DBConnectionHandler.getConnection();
			MaptoDBOperationsLogger.info("connection object initialized");
			
			if(twoDArray.equalsIgnoreCase("FetchFiles")){
				String query = "Select distinct MAP_ID, MAP_NAME from FYW_MAP_MASTER2";
				MaptoDBOperationsLogger.info("Query::" +query);
				preparedstmt = con.prepareStatement(query);
				MaptoDBOperationsLogger.info("Statement prepared...");
				resultSet = preparedstmt.executeQuery();
				String mapIdNameString = null;
				String fileName = null;
				String fileId = null;
				while(resultSet.next()){
					fileId = resultSet.getString("MAP_ID");
					MaptoDBOperationsLogger.info("Map Id::" +fileId);
					fileName = resultSet.getString("MAP_NAME");
					MaptoDBOperationsLogger.info("Map Name ::" +fileName);
					if(mapIdNameString==null || mapIdNameString.length() == 0){	
						mapIdNameString = fileId + "-" + fileName;
					}else{
						mapIdNameString = mapIdNameString + "~" + fileId + "-" +fileName;
					}
				}
				MaptoDBOperationsLogger.info("mapIdNameString:" +mapIdNameString);
				out.println(mapIdNameString);
			}else if(twoDArray.equalsIgnoreCase("Fetch")){
			
				/* Fetch the Saved Matrix from the DataBase */
				String query="Select MAP_MATRIX from FYW_MAP_MASTER2 where MAP_NAME=?";
				MaptoDBOperationsLogger.info("Query::" +query);
				preparedstmt = con.prepareStatement(query);
				preparedstmt.setString(1, mapName);
				resultSet = preparedstmt.executeQuery();
				Clob clob= null;
				while(resultSet.next()){
					clob = resultSet.getClob("MAP_MATRIX");	
				}
				String coordinatesStr = clob.getSubString(1, (int) clob.length());
				MaptoDBOperationsLogger.info("coordinates string:" +coordinatesStr);
				out.println(coordinatesStr);
			}
			else{
				Clob myClob = con.createClob();
				MaptoDBOperationsLogger.info("clob created..");
				Writer clobWriter = myClob.setCharacterStream(1);
				MaptoDBOperationsLogger.info("clob writer character stream set...");
				myClob.setString(1, twoDArray);
				MaptoDBOperationsLogger.info("clob string set...");
				
				
				/*Insert/Update the Map Matrix on the basis of whether the map name is present or not*/
				String query = "MERGE INTO FYW_MAP_MASTER2 a" +
							" USING (SELECT ? MAP_MATRIX, ? MAP_NAME, ? MAP_ID FROM dual) incoming"+ 
							" ON (a.MAP_ID = incoming.MAP_ID)" +  
							" WHEN MATCHED THEN" + 
							" UPDATE SET MAP_MATRIX = incoming.MAP_MATRIX" +
							" WHEN NOT MATCHED THEN" + 
							" INSERT (MAP_MATRIX, MAP_NAME, MAP_ID)" + 
							" VALUES (incoming.MAP_MATRIX, incoming.MAP_NAME, incoming.MAP_ID)";
				MaptoDBOperationsLogger.info("Query::" +query);
				preparedstmt = con.prepareStatement(query);
				preparedstmt.setClob(1, myClob);
				MaptoDBOperationsLogger.info("Query Locator for clob set...");
				preparedstmt.setString(2, mapName);
				preparedstmt.setString(3, mapDesc);
				int rowsUpdated = preparedstmt.executeUpdate();				
				MaptoDBOperationsLogger.info("Rows updated::" + rowsUpdated);
				
			}
			
		}
	}catch(Exception ex){
		MaptoDBOperationsLogger.info("Exception::" +ex.getMessage());
	}finally{
		/*Freeing Resources */
		con = null;
		preparedstmt = null;
		resultSet = null;
	}
	
%>