<%@ page import="aStar.AreaMap"%>
<%@ page import="aStar.heuristics.AStarHeuristic" %>
<%@ page import="aStar.heuristics.ClosestHeuristic"%>
<%@ page import="aStar.AStar"%>
<%@ page import="java.util.*"%>
<%@ page import ="org.apache.log4j.Logger;"%>

<%!
	static final Logger PathFinderLogger = Logger.getLogger("PathFinderLogger");
%>

<%

	PathFinderLogger.info("Inside PathFinder.jsp");
	String twoDArray = request.getParameter("arrayString");
	PathFinderLogger.info("twoDArray:" +twoDArray);
	String sourceCoordinates = request.getParameter("sourceCoordinates");
	PathFinderLogger.info("sourceCoordinates:" +sourceCoordinates);
	String destinationCoordinates = request.getParameter("destinationCoordinates");
	PathFinderLogger.info("destinationCoordinates:" +destinationCoordinates);
	String[] sourceCoordinatesArr = sourceCoordinates.split(",");
	String[] destinationCoordinatesArr = destinationCoordinates.split(",");
	int sourceX = Integer.parseInt(sourceCoordinatesArr[0]);
	PathFinderLogger.info("source X coordinate:" +sourceX);
	int sourceY = Integer.parseInt(sourceCoordinatesArr[1]);
	PathFinderLogger.info("source Y Coordinate:" +sourceY);
	int destX = Integer.parseInt(destinationCoordinatesArr[0]);
	PathFinderLogger.info("destination X Coordinate:" +destX);
	int destY = Integer.parseInt(destinationCoordinatesArr[1]);
	PathFinderLogger.info("destination Y Coordinate:" +destY);
	
	//create 2-D integer array from the above string
	String[] outerArray = twoDArray.split("~");
	int numOfRows = outerArray.length;
	PathFinderLogger.info("numOfRows:" +numOfRows);
	int numOfColumns = outerArray[0].length();
	PathFinderLogger.info("numOfColumns:" +numOfColumns);
	int[][] ourfinalArray = new int[numOfRows][numOfColumns];
	int i=0,j=0;
	for (String temp : outerArray) {
		String[] innerArray = temp.split("\\|");
		for (String innerTemp : innerArray) {
			//out.print(innerTemp + " ");
			ourfinalArray[i][j] = Integer.parseInt(innerTemp);
			j++;
		}
		//out.println();
		i++;
		j = 0;
	}
	
	for(int ii=0;ii<numOfRows;ii++){
		for(int jj=0;jj<numOfColumns;jj++){
			PathFinderLogger.info("i is:"+ii + "j is: " + jj+" and element:" +ourfinalArray[ii][jj]+" ");
		}
		PathFinderLogger.info("");
	}
	
	//Integer 2-D array created
	PathFinderLogger.info("2 D Array Created...");
	List<String> pathNodes = new ArrayList<String>();
	AreaMap map = new AreaMap(75, 101, ourfinalArray);
	AStarHeuristic heuristic = new ClosestHeuristic();
	AStar pathFinder = new AStar(map, heuristic);
	//pathFinder.calcShortestPath(16, 41, 30, 53);
	pathFinder.calcShortestPath(sourceX, sourceY, destX, destY);
	PathFinderLogger.info("Shortest Path calculated.....");
	pathFinder.printPath();
	pathNodes = pathFinder.returnPath();
	PathFinderLogger.info("return path::" +pathNodes);
	System.out.println(pathNodes);
	String nodeString = "";
	for(String node: pathNodes){
		if(nodeString.length()==0){
			nodeString = node;
		}
		nodeString = nodeString + "~" + node;
	}
	
	PathFinderLogger.info("nodeString::" +nodeString);
	//return nodeString;
	out.println(nodeString);	
    
%>