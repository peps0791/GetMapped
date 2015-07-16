<%@ page import ="java.sql.*" %>
<%@ page import ="org.apache.log4j.Logger"%>
<%@ page import = "com.FYW.dbhandle.DBConnectionHandler;"%>

<%!
	static final Logger getSeatInfoLogger = Logger.getLogger("getSeatInfoLogger");
%>

<%
	Connection con = null;
	PreparedStatement preparedstmt = null;
	ResultSet resultSet = null;
	try{
		String coordinates = request.getParameter("coordinates");
		getSeatInfoLogger.info("coordinates:" +coordinates);
		
		String mapDesc = request.getParameter("imageDesc");
		getSeatInfoLogger.info("mapDesc:" +mapDesc);
		if(coordinates==null || coordinates.length()==0){
			/*No input Parameter, no processing */
			response.sendRedirect("ErrorPage.jsp?ErrorMessage=Input parameters to the previous page were blank. Could not have proceeded further. Hence Here!");
		}
		else{
			/*Initialize the DB operations related variables and classes*/
			con = DBConnectionHandler.getConnection();	
			
			/* Fetch the Saved Matrix from the DataBase */
			//String query="Select SEAT_NO, SEAT_COORDINATES from FYW_SEAT_MASTER WHERE SEAT_COORDINATES IN ('" +coordinates+ "') AND //MAP_ID = ?" ;
			String query="Select SEAT_NO, SEAT_COORDINATES from FYW_SEAT_MASTER WHERE SEAT_COORDINATES IN (?) AND MAP_ID = ?" ;
			getSeatInfoLogger.info("Query::" +query);
			preparedstmt = con.prepareStatement(query);	
			preparedstmt.setString(1, coordinates);
			preparedstmt.setString(2, mapDesc);
			resultSet = preparedstmt.executeQuery();
			String seatNo = null;
			String seatCoordinates = null;
			StringBuilder finalMapping = new StringBuilder();
			while(resultSet.next()){
				seatNo = resultSet.getString("SEAT_NO");
				seatCoordinates = resultSet.getString("SEAT_COORDINATES");
				if(finalMapping.length()==0){
					finalMapping.append(seatNo + "-" + seatCoordinates);
				}else{
					finalMapping.append("~" + seatNo + "-" + seatCoordinates);
				}
			}
			getSeatInfoLogger.info("Seat Number ::" +seatNo);
			out.println(seatNo);
			
		}
	}catch(Exception ex){
		getSeatInfoLogger.info("Exception::" +ex.getMessage());
	}finally{
		/*Freeing Resources */
		con = null;
		preparedstmt = null;
		resultSet = null;
	}
	
%>