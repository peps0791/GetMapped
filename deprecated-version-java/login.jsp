<%@ page import ="java.sql.*" %>
<%@ page import ="org.apache.log4j.Logger"%>
<%@ page import = "com.FYW.dbhandle.DBConnectionHandler;"%>

<%!
	static final Logger loginLogger = Logger.getLogger("loginLogger");
%>

<%
	Connection con=null;
	Statement st = null;
	ResultSet rs = null;
	try{
		String userid = request.getParameter("usr"); 
		loginLogger.info("User ID::" +userid);	
		String pwd = request.getParameter("pwd");
		loginLogger.info("Password::" +pwd);
		if(userid!=null && userid.length()>0 && pwd!=null && pwd.length()>0){
			con = DBConnectionHandler.getConnection();
			st = con.createStatement();
			String query="select * from FYW_USER_MASTER where USERNAME='" + userid + "' and PASSWD='" + pwd + "'";
			loginLogger.info("Query::" +query);
			rs = st.executeQuery(query);
			if (rs.next()) {
				session.setAttribute("userid", userid);
				response.sendRedirect("Screen2.jsp");
			} else {
				out.println("Invalid Password Try Again!");
			}
		}else{
			loginLogger.info("Redirecting to Error page.");
			response.sendRedirect("ErrorPage.jsp?ErrorMessage= Username or password is null." );
		}
	}catch(Exception ex){
		loginLogger.info("********Exception********");
		loginLogger.info(ex.getMessage());
	}finally{
		con = null;
		st = null;
		rs = null;
	}
%>