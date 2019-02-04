<%@ page import="java.io.*,java.util.*, javax.servlet.*" %>
<%@ page import="javax.servlet.http.*" %>
<%@ page import="org.apache.commons.fileupload.*" %>
<%@ page import="org.apache.commons.fileupload.disk.*" %>
<%@ page import="org.apache.commons.fileupload.servlet.*" %>
<%@ page import="org.apache.commons.io.output.*" %>
<%@ page import ="org.apache.log4j.Logger;"%>

<%!
	static final Logger fileUploadLogger = Logger.getLogger("fileUploadLogger");
%>

<%
   File file ;
   int maxFileSize = 5000 * 1024;
   int maxMemSize = 5000 * 1024;
   ServletContext context = pageContext.getServletContext();
   String filePath = context.getInitParameter("file-upload");
	fileUploadLogger.info("file Path::" +filePath);
   // Verify the content type
   String contentType = request.getContentType();
   fileUploadLogger.info("contentType::" +contentType);
   if(contentType!=null){
		if ((contentType.indexOf("multipart/form-data") >= 0)) {

		  DiskFileItemFactory factory = new DiskFileItemFactory();
		  // maximum size that will be stored in memory
		  factory.setSizeThreshold(maxMemSize);
		  // Location to save data that is larger than maxMemSize.
		  factory.setRepository(new File("c:\\temp"));

		  // Create a new file upload handler
		  ServletFileUpload upload = new ServletFileUpload(factory);
		  // maximum file size to be uploaded.
		  upload.setSizeMax( maxFileSize );
		  try{
			 // Parse the request to get file items.
			 List fileItems = upload.parseRequest(request);

			 // Process the uploaded file items
			 Iterator i = fileItems.iterator();

			 while ( i.hasNext () )
			 {
				FileItem fi = (FileItem)i.next();
				if ( !fi.isFormField () )
				{
					// Get the uploaded file parameters
					String fieldName = fi.getFieldName();
					fileUploadLogger.info("fieldName::" +fieldName);
					String fileName = fi.getName();
					fileUploadLogger.info("fileName::" +fileName);
					boolean isInMemory = fi.isInMemory();
					fileUploadLogger.info("isInMemory::" +isInMemory);
					long sizeInBytes = fi.getSize();
					fileUploadLogger.info("sizeInBytes::" +sizeInBytes);
					// Write the file
					if( fileName.lastIndexOf("\\") >= 0 ){
						file = new File( filePath +
						fileName.substring( fileName.lastIndexOf("\\"))) ;
					}else{
						file = new File( filePath +
						fileName.substring(fileName.lastIndexOf("\\")+1)) ;
					}
					fi.write( file ) ;
				   fileUploadLogger.info("fileName::" +fileName);
					out.println(fileName);

				}
			 }
			
		  }catch(Exception ex) {
			fileUploadLogger.info("*****************Exception*****************");
			fileUploadLogger.info(ex.getMessage());
			response.sendRedirect("ErrorPage.jsp?ErrorMessage= Some error occured during file upload. Who the hell made this app!! Go Find him!" );
		  }
		}else{
		  fileUploadLogger.info("No file Uploaded!");
		  out.println("No file uploaded.");

	   }
   
   }
   else{
		fileUploadLogger.info("content type is null! No File Uploaded");
		response.sendRedirect("ErrorPage.jsp?ErrorMessage= Some error occured during file upload." );
		 out.println("No file uploaded.");
   }

%>
