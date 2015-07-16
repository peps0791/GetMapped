<%
	out.println("This is the Error Page!! Can you believe it? Huh!");
	out.println("And you know what do they say?");
	String errorMsg = request.getParameter("ErrorMessage");
	out.println(errorMsg);
%>