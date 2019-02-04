<%@ page import ="java.sql.*" %>
<%@ page import ="org.apache.log4j.Logger"%>
<%@ page import = "com.FYW.dbhandle.DBConnectionHandler;"%>

<%!
	static final Logger searchResultsLogger = Logger.getLogger("searchResultsLogger");
%>

<%
	Connection con = null;
	PreparedStatement preparedstmt = null;
	ResultSet resultSet = null;
	try{
		String name = request.getParameter("name");
		searchResultsLogger.info("name:" +name);
		String team = request.getParameter("team");
		searchResultsLogger.info("team:" +team);
		String extension = request.getParameter("extension");
		searchResultsLogger.info("extension:" +extension);
		if((name==null || name.length()==0) && (team==null || team.length()==0) && ((extension==null || extension.length()==0))){
			/*No input Parameter, no processing */
			response.sendRedirect("ErrorPage.jsp?ErrorMessage=All the Input parameters to the previous page were blank. Could not have proceeded further. Hence Here!");
		}
		else{
			/*Initialize the DB operations related variables and classes*/
			con = DBConnectionHandler.getConnection();
			
			/* Fetch the Search Results on the basis of input parameters, from the DataBase */
			String query="SELECT EMPLOYEE_NAME, EMPLOYEE_TEAM, EMPLOYEE_EXT_NUMBER, EMPLOYEE_SEAT_NUMBER FROM FYW_EMPLOYEE_MASTER WHERE EMPLOYEE_NAME LIKE '%" +name.toUpperCase() +"%' AND EMPLOYEE_TEAM LIKE '%" + team.toUpperCase() +"%' AND EMPLOYEE_EXT_NUMBER LIKE '%" + extension +"%'";
			searchResultsLogger.info("Query::" +query);
			preparedstmt = con.prepareStatement(query);	
			resultSet = preparedstmt.executeQuery();
			StringBuilder outputStringBuilder = new StringBuilder();
			String resultEmployeeName;
			String resultEmployeeTeam;
			String resultEmployeeExtension;
			String resultEmployeeSeat;
			while(resultSet.next()){
				resultEmployeeName = resultSet.getString("EMPLOYEE_NAME");
				outputStringBuilder.append(resultEmployeeName + "^");
				resultEmployeeTeam = resultSet.getString("EMPLOYEE_TEAM");
				outputStringBuilder.append(resultEmployeeTeam + "^");
				resultEmployeeExtension = resultSet.getString("EMPLOYEE_EXT_NUMBER");
				outputStringBuilder.append(resultEmployeeExtension + "^");
				resultEmployeeSeat = resultSet.getString("EMPLOYEE_SEAT_NUMBER");
				outputStringBuilder.append(resultEmployeeSeat + "~");				
			}
			searchResultsLogger.info("Final output String ::" +outputStringBuilder.toString());
			out.println(outputStringBuilder.toString());
			
		}
	}catch(Exception ex){
	
	}finally{
		/*Freeing Resources */
		con = null;
		preparedstmt = null;
		resultSet = null;
	}
	
%>