<%@ page import ="java.sql.*" %>
<%@ page import ="org.apache.log4j.Logger"%>
<%@ page import = "com.FYW.dbhandle.DBConnectionHandler;"%>

<%!
	static final Logger getSeatCoordinatesLogger = Logger.getLogger("getSeatCoordinatesLogger");
%>

<%
	Connection con = null;
	PreparedStatement preparedstmt = null;
	ResultSet resultSet = null;
	try{
		String sourceSeat = request.getParameter("sourceSeat");
		getSeatCoordinatesLogger.info("source seat:" +sourceSeat);
		String destinationSeat = request.getParameter("destinationSeat");
		getSeatCoordinatesLogger.info("destination seat:" +destinationSeat);
		String mapDesc = request.getParameter("imageDesc");
		getSeatCoordinatesLogger.info("mapDesc:" +mapDesc);
		String operation = request.getParameter("operation");
		getSeatCoordinatesLogger.info("operation:" +operation);
		if(sourceSeat==null || sourceSeat.length()==0 || destinationSeat==null || destinationSeat.length()==0){
			/*No input Parameter, no processing */
			response.sendRedirect("ErrorPage.jsp?ErrorMessage=Input parameters to the previous page were blank. Could not have proceeded further. Hence Here!");
		}
		else if(operation!= null && operation.equalsIgnoreCase("FindMap")){
			con = DBConnectionHandler.getConnection();
			//String query = "Select map_name from fyw_map_master2 where map_id in (?)";
			String query = "SELECT MM.MAP_NAME FROM FYW_MAP_MASTER2 MM WHERE MM.MAP_ID IN (SELECT DISTINCT SM.MAP_ID FROM FYW_SEAT_MASTER SM WHERE SM.SEAT_NO IN (?,?))";
			getSeatCoordinatesLogger.info("Query::" +query);
			preparedstmt = con.prepareStatement(query);	
			preparedstmt.setString(1, sourceSeat);
			preparedstmt.setString(2, destinationSeat);
			resultSet = preparedstmt.executeQuery();
			int rowcount = 0;
			String mapString = null;
			String finalString = null;
			while(resultSet.next()){
				if(mapString == null){
					mapString = resultSet.getString("MAP_NAME");
				}else{
					mapString = mapString + "~" + resultSet.getString("MAP_NAME");
				}
				rowcount++;
			}
			finalString = String.valueOf(rowcount) + "-" + mapString;
			out.println(finalString);
		}
		else{
			/*Initialize the DB operations related variables and classes*/
			con = DBConnectionHandler.getConnection();
			
			/* Fetch the Saved Matrix from the DataBase */
			String query="Select SEAT_NO, SEAT_COORDINATES from FYW_SEAT_MASTER WHERE SEAT_NO IN ('" +sourceSeat+ "', '" + destinationSeat + "')";
			//String query="Select SEAT_NO, SEAT_COORDINATES from FYW_SEAT_MASTER WHERE SEAT_NO IN (?, ?) AND MAP_ID = ?";
			getSeatCoordinatesLogger.info("Query::" +query);
			preparedstmt = con.prepareStatement(query);	
			//preparedstmt.setString(1, sourceSeat);
			//preparedstmt.setString(2, destinationSeat);
			//preparedstmt.setString(3, mapDesc);
			resultSet = preparedstmt.executeQuery();
			StringBuilder outputStringBuilder = new StringBuilder();
			String seatNo;
			String seatCoordinates;
			while(resultSet.next()){
				seatNo = resultSet.getString("SEAT_NO");
				outputStringBuilder.append(seatNo+"=");
				seatCoordinates = resultSet.getString("SEAT_COORDINATES");
				outputStringBuilder.append(seatCoordinates+"~");
				
			}
			getSeatCoordinatesLogger.info("Final output String ::" +outputStringBuilder.toString());
			out.println(outputStringBuilder.toString());
			
		}
	}catch(Exception ex){
		getSeatCoordinatesLogger.info("Exception occured: " +ex.getMessage());
		ex.printStackTrace();
	}finally{
		/*Freeing Resources */
		con = null;
		preparedstmt = null;
		resultSet = null;
	}
	
%>