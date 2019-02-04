<%@ page import ="java.sql.*" %>
<%@ page import ="org.apache.log4j.Logger"%>
<%@ page import = "com.FYW.dbhandle.DBConnectionHandler;"%>

<%!
	static final Logger SeatCoordinatesSaveLogger = Logger.getLogger("SeatCoordinatesSaveLogger");
%>

<%
	Connection con = null;
	PreparedStatement preparedstmt = null;
	PreparedStatement preparedstmt1 = null;
	ResultSet resultSet = null;
	String seatNo = null;
	String coordinates = null;
	int rows=0;
	try{
		String seatCoordinatesMapping = request.getParameter("seatCoordinatesMapping");
		SeatCoordinatesSaveLogger.info("Input parameter to the JSP:seatCoordinatesMapping->" +seatCoordinatesMapping);
		
		String mapDesc = request.getParameter("imageDesc");
		SeatCoordinatesSaveLogger.info("Input parameter to the JSP:imageDesc->" +mapDesc);
		
		con = DBConnectionHandler.getConnection();
		
		if(seatCoordinatesMapping==null || seatCoordinatesMapping.length()==0){
			/*No input Parameter, no processing */
			response.sendRedirect("ErrorPage.jsp?ErrorMessage=Input parameters to the previous page were blank. Could not have proceeded further. Hence Here!");
		}
		else if(seatCoordinatesMapping.contains("Delete")){
			/*Extract Coordinates to be deleted */
			String deletedcord =  seatCoordinatesMapping.split("-")[1];
			out.println("deletedcord" + deletedcord);
			SeatCoordinatesSaveLogger.info("Coordinates to be deleted::" + deletedcord);
			String query = "DELETE FROM FYW_SEAT_MASTER WHERE SEAT_COORDINATES = ? AND MAP_ID = ?";
			SeatCoordinatesSaveLogger.info("query::" +query);
			preparedstmt1 = con.prepareStatement(query);
			String[] deleteArray = deletedcord.split("~");
			for(String coord: deleteArray){
				preparedstmt1.setString(1, coord);	
				preparedstmt1.setString(2, mapDesc);	
				rows = preparedstmt1.executeUpdate();
				SeatCoordinatesSaveLogger.info("Rows updated::" +rows);
			}		
		}else{
		
			/*Get the seat number and coordinates array*/
			String[] mappings = seatCoordinatesMapping.split("~");
			SeatCoordinatesSaveLogger.info("mappings length" +mappings.length);
			
			/*Initialize the DB operations related variables and classes*/
			
			/*Insert the Matrix in DataBase */
			SeatCoordinatesSaveLogger.info("seatCoordinatesMapping:" +seatCoordinatesMapping);		
			//String query="Insert into FYW_SEAT_MASTER(SEAT_NO, SEAT_COORDINATES, MAP_ID) VALUES(?,?)";
			String query = "MERGE INTO FYW_SEAT_MASTER a" +
							" USING (SELECT ? SEAT_NO,? SEAT_COORDINATES, ? MAP_ID FROM dual) incoming"+ 
							" ON (a.SEAT_COORDINATES = incoming.SEAT_COORDINATES and a.MAP_ID = incoming.MAP_ID)" +  
							" WHEN MATCHED THEN" + 
							" UPDATE SET SEAT_NO = incoming.SEAT_NO" +
							" WHEN NOT MATCHED THEN" + 
							" INSERT (SEAT_NO, SEAT_COORDINATES, MAP_ID)" + 
							" VALUES (incoming.SEAT_NO, incoming.SEAT_COORDINATES, incoming.MAP_ID)";
			SeatCoordinatesSaveLogger.info("Query::" +query);
			preparedstmt = con.prepareStatement(query);	
			
			for(String mapping: mappings){
				
				seatNo = mapping.split("-")[0];
				SeatCoordinatesSaveLogger.info("seatNo::" +seatNo);
				coordinates = mapping.split("-")[1];
				SeatCoordinatesSaveLogger.info("coordinates::" +coordinates);
				preparedstmt.setString(1, seatNo);
				preparedstmt.setString(2, coordinates);
				preparedstmt.setString(3, mapDesc);
				preparedstmt.executeUpdate();
			}
			
			
		}
	}catch(Exception ex){
		SeatCoordinatesSaveLogger.info("Exception occured::" +ex.getMessage());
	
	}finally{
		/*Freeing Resources */
		con = null;
		preparedstmt = null;
		preparedstmt1 = null;
		resultSet = null;
	}
	
%>