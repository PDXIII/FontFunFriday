/*
	extended javascript for 
	Adobe Indesign 5.5
	by
	PDXIII
	http://about.me/PDXIII
*/

// get the location of the scriptfile
var script_file = File($.fileName);
// get the path
var script_file_path = script_file.path;

// this serves as a kind of headline and will be displayed on top of the page with the name of the font
var funSentence ='Font Fun Friday: '
var displayUnicodeNumber = true;

// tile grid preferences
var tileColumns = 6;
var tileRows = 8;
var tileWidth = 18;
var tileHeight = 23;
var baseLineOffset = 13;
var scribbleHeight = 10;

// documentPreferences
var pageWidth = 142;
var pageHeight = 205;
var topMargin = 13;
var bottomMargin = 8;
var leftMargin = 11;
var rightMargin = 11;
var facingPages = true;
var startPageNumber = 1;
var gutter = (pageWidth - (tileWidth * tileColumns) - leftMargin -rightMargin) / (tileColumns-1);

var doc = app.documents.add({
  documentPreferences:{
    pageWidth:pageWidth,
    pageHeight:pageHeight,
    facingPages: facingPages,
    startPageNumber: startPageNumber
  },
  gridPreferences:{
      baselineDivision: tileHeight,
      baselineStart: topMargin,
      baselineGridShown : true
    }
});

//masterspread (Master-A) just the margins
doc.masterSpreads.item(0).pages.item(0).marginPreferences.properties = {
  top : topMargin,
  bottom : bottomMargin,
  left : leftMargin,
  right : rightMargin,
  columnCount : tileColumns,
  columnGutter : gutter
};

doc.masterSpreads.item(0).pages.item(1).marginPreferences.properties = {
  top : topMargin,
  bottom : bottomMargin,
  left : leftMargin,
  right : rightMargin,
  columnCount : tileColumns,
  columnGutter : gutter
};


// text styles
var paraStyleBasicFontStyle = doc.paragraphStyles.add({
  name: "BasicFontStyle",
  pointSize: 6,
  fillColor: "Black",
});
var paraStyleFontName = doc.paragraphStyles.add({
  name: "FontName",
  basedOn: paraStyleBasicFontStyle,
  pointSize: 18,
  justification: Justification.LEFT_ALIGN
});
var paraStyleFontMetrics = doc.paragraphStyles.add({
  name: "FontMetrics",
  basedOn: paraStyleBasicFontStyle,
  pointSize: 6,
  justification: Justification.CENTER_JUSTIFIED
});
var paraStyleGlyph = doc.paragraphStyles.add({
  name: "Glyph",
  basedOn: paraStyleBasicFontStyle,
  pointSize: 6,
  justification: Justification.CENTER_ALIGN
});
var paraStyleNumber = doc.paragraphStyles.add({
  name: "GlyphNumber",
  basedOn: paraStyleBasicFontStyle,
  pointSize: 6,
  justification: Justification.CENTER_ALIGN
});
var paraStyleName = doc.paragraphStyles.add({
  name: "GlyphName",
  basedOn: paraStyleBasicFontStyle,
  pointSize: 6,
  fillColor: "Black",
  justification: Justification.CENTER_ALIGN
});


// object styles
var objStyleScribbleField = doc.objectStyles.add({
  name: "ScribbleField",
  topLeftCornerOption: CornerOptions.ROUNDED_CORNER,
  topRightCornerOption: CornerOptions.ROUNDED_CORNER,
  bottomLeftCornerOption: CornerOptions.ROUNDED_CORNER,
  bottomRightCornerOption: CornerOptions.ROUNDED_CORNER,
  topLeftCornerRadius: 3,
  topRightCornerRadius: 3,
  bottomLeftCornerRadius: 3,
  bottomRightCornerRadius: 3,
  strokeWeight:0.25,
  strokeColor: "Black",
  fillColor: "Paper"
});

var objStyleBaseline = doc.objectStyles.add({
  name: "baseline",
  strokeWeight:0.25,
  strokeColor: "Black"
});
var objStyleHLine = doc.objectStyles.add({
  name: "H height (capitals)",
  strokeWeight:0.25,
  strokeColor: "Black"
});
var objStyleKLine = doc.objectStyles.add({
  name: "k height (ascenders)",
  strokeWeight:0.25,
  strokeColor: "Black"
});
var objStyleXLine = doc.objectStyles.add({
  name: "x height",
  strokeWeight:0.25,
  strokeColor: "Black"
});
var objStylePLine = doc.objectStyles.add({
  name: "p height (descenders)",
  strokeWeight:0.25,
  strokeColor: "Black"
});

var masterPageIndex = 0;

var currentPage = doc.pages.item(0);

main();

function main(){
  //for the cover
  var firstPage = doc.pages.item(0);
  firstPage.appliedMaster = doc.masterSpreads.item(0);
  // dialog for unicode information display
  displayUnicodeNumber = unicodeInfo();

  makeMasters();
  makeGuideLines();

  //for the back
  var lastPage = doc.pages.add();
  lastPage.appliedMaster = doc.masterSpreads.item(0);
};

/**
 * [this function ask you how you want the unicode information to be displayed]
 * @return {[boolean]} [returns true or false to displayUnicodeNumber]
 */
function unicodeInfo(){
  var w = new Window ("dialog","Unicode Info");
  w.orientation = "column";
  var message = w.add ("statictext");
  message.text = "How do you want the unicode information to be displayed ?";
  var inputGroup = w.add("Group");
  inputGroup.orientation = "row";
  inputGroup.alignChildren = "right";
  var printNumber = inputGroup.add ("radiobutton", undefined, "a u+0061");
  var printName = inputGroup.add ("radiobutton", undefined, "latin small letter a");
  var ok = w.add("button", undefined, "OK");
  ok.alignment = "right";
  printNumber.value = true;
  w.show ();
  return printNumber.value;
}

/**
 * [makeMasters this function builds the masterpages and calls the function for the scribble tiles for each glyph]
 */
function makeMasters(){
  // move the ruler to top left corner of the page for better handling
  doc.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;
  // set path to JSON file
  var filepath = script_file_path + "/GlyphsList-UniCode.json";
  var glyphList = loadJSONObject(filepath);
  // this calculates the least amount of pages for the glyphs
  var maxMasterPages = Math.ceil(glyphList.length/(tileRows*tileColumns));
  doc.masterSpreads.add();
  var glyphIndex = 0;

  for(var j = 0; j < maxMasterPages; j++){
    var currentMasterPage = doc.masterSpreads.item(1).pages.item(masterPageIndex);
    currentMasterPage.marginPreferences.properties = {
      top : topMargin,
      bottom : bottomMargin,
      left : leftMargin,
      right : rightMargin,
      columnCount : tileColumns,
      columnGutter : gutter
    };
    for(var currentRow = 0; currentRow < tileRows; currentRow++){
      for(var currentColumn = 0; currentColumn < tileColumns; currentColumn++){
        try{
          var current_Glyph = glyphList[glyphIndex];
        }
        catch(err){
          alert("End of File!");
        }
        // make theTileGroup
        if(!displayUnicodeNumber){
          var tileGroupArray = makeTileGroupArrayWithName(current_Glyph,currentMasterPage)
        }
        else{
          var tileGroupArray = makeTileGroupArrayWithNumber(current_Glyph,currentMasterPage)
        }
        var theTileGroup = currentMasterPage.groups.add(tileGroupArray);
        // move theTileGroup to its position
        theTileGroup.move(undefined, [leftMargin + currentMasterPage.marginPreferences.columnsPositions[currentColumn * 2], currentRow * tileHeight + topMargin]);

        glyphIndex++;
      }
    }
    masterPageIndex++;
  }
}

/**
 * [makeTileGroupArray this function makes the scribble tile for the given glyph and adds it to the given page]
 * @param  {[JSONObject]} cGlyph [a glyph ]
 * @param  {[Page]} cPage  [a page]
 * @return {[Array]} [an array of an rectangle and two textframes]
 */
function makeTileGroupArrayWithNumber(cGlyph, cPage){
  var cGroup = new Array();
  // make rectangle for the ScribbleField
  var myRect = cPage.rectangles.add({
    geometricBounds:[0,0,19,tileWidth],
  });
  myRect.appliedObjectStyle = objStyleScribbleField;
  cGroup.push(myRect);
  // make textFrame for the glyph/character
  var glyph_textFrame = cPage.textFrames.add({
    geometricBounds: [20,0,tileHeight,9],
    contents: cGlyph.glyph
  });
  glyph_textFrame.paragraphs.everyItem().appliedParagraphStyle = paraStyleGlyph;
  cGroup.push(glyph_textFrame);
  // make textFrame for the unicode number
  var number_textFrame = cPage.textFrames.add({
    geometricBounds: [20, 9, tileHeight, 18],
    contents: "u+" + cGlyph.number
  });
  number_textFrame.paragraphs.everyItem().appliedParagraphStyle = paraStyleNumber;
  cGroup.push(number_textFrame);
  // return the array
  return cGroup;
}

function makeTileGroupArrayWithName(cGlyph, cPage){
  var cGroup = new Array();
  // make rectangle for the ScribbleField
  var myRect = cPage.rectangles.add({
    geometricBounds:[0,0,19,tileWidth],
  });
  myRect.appliedObjectStyle = objStyleScribbleField;
  cGroup.push(myRect);
  // make textFrame for the glyph name
  var glyph_textFrame = cPage.textFrames.add({
    geometricBounds: [14,0,19,18],
    contents: cGlyph.name.toLowerCase()
  });
  glyph_textFrame.paragraphs.everyItem().appliedParagraphStyle = paraStyleName;
  cGroup.push(glyph_textFrame);
  // return the array
  return cGroup;
}

function makeGuideLines(){
  // set path to JSON file
  var filepath = script_file_path + "/FontList.json";
  var fontList = loadJSONObject(filepath);

  for(var fontIndex = 0; fontIndex < fontList.length; fontIndex++){
    // get the font you want the metrics from
    var currentFont = fontList[fontIndex];
    for(var i = 0; i < 2; i++){

      currentPage = doc.pages.add();
      // apply the master for the left page
      currentPage.appliedMaster = doc.masterSpreads.item(1);
       // get the name of the current font 
       // 
      var fontName = currentFont.FontName.toString();
      // and put it in a textframe on top of the page
      if(i == 0){
        var fontNameFrame = currentPage.textFrames.add({
          geometricBounds: [gutter*2, leftMargin, topMargin - gutter, pageWidth-rightMargin],
          contents: funSentence + fontName
        });
      fontNameFrame.paragraphs.everyItem().appliedParagraphStyle = doc.paragraphStyles.itemByName("FontName");
      }
      // or a metrics info textframe at the bottom
      else{
        var fontMetrics = '\tH: '+currentFont.HkxpArray[0].toFixed(3)
          + '\tk: '+currentFont.HkxpArray[1].toFixed(3)
          + '\tx: '+currentFont.HkxpArray[2].toFixed(3)
          + '\tp: '+currentFont.HkxpArray[3].toFixed(3);
        var fontMetricsFrame = currentPage.textFrames.add({
          geometricBounds: [pageHeight-bottomMargin+(gutter/2), pageWidth/2, pageHeight - gutter, pageWidth-rightMargin],
          contents: fontMetrics
        });
        fontMetricsFrame.paragraphs.everyItem().appliedParagraphStyle = doc.paragraphStyles.itemByName("FontMetrics");
      }
      for(var currentRow = 0; currentRow < tileRows; currentRow++){
        for(var currentColumn = 0; currentColumn < tileColumns; currentColumn++){
          // make theLineGroup
            var lineGroupArray = makeALineGroupArray(currentFont.HkxpArray)
          var theLineGroup = currentPage.groups.add(lineGroupArray);
          // move theLineGroup to its position
          theLineGroup.move(undefined, [leftMargin + currentPage.marginPreferences.columnsPositions[currentColumn * 2], currentRow * tileHeight + topMargin]);
        }
      }
    }
  }
}


function makeALineGroupArray(HkxpArray){
  var lineArray = new Array();
    // make the baseline
    lineArray.push(makeALine(0));
    // make the other metric lines with the makeALine function
    for(k in HkxpArray){
      lineArray.push(makeALine(HkxpArray[k]));
    }
    // apply the right objectstyles to the lines. this is not elegant but it serves the purpose
    lineArray[0].appliedObjectStyle = doc.objectStyles.itemByName("baseline");
    lineArray[1].appliedObjectStyle = doc.objectStyles.itemByName("H height (capitals)");
    lineArray[2].appliedObjectStyle = doc.objectStyles.itemByName("k height (ascenders)");
    lineArray[3].appliedObjectStyle = doc.objectStyles.itemByName("x height");
    lineArray[4].appliedObjectStyle = doc.objectStyles.itemByName("p height (descenders)");
    return lineArray;
}

/**
 * [makeALine this function make a horizontal line at a given y position]
 * @param  {[float]} metricsValue [this serves as y position]
 * @return {[GraphicLine]}
 */
function makeALine(metricsValue){
  var lineYpos = (metricsValue.toFixed(2) * (-scribbleHeight)) + baseLineOffset;
  var currentLine = currentPage.graphicLines.add();
  var currentPath = currentLine.paths[0];
  var point01 = currentPath.pathPoints[0];
  var point02 = currentPath.pathPoints[1];
  point01.anchor = [0,lineYpos];
  point02.anchor = [tileWidth ,lineYpos];
  return currentLine;
}

/**
 * [loadJSONObject is a function to load a JSONfile and return a JSONObject]
 * @param  {[String]} filepath [the path to a file with the name of the file]
 * @return {[JSONObject]}
 */
function loadJSONObject(filepath){
  var myJSONfile = File(filepath);
  if(myJSONfile != false){
    myJSONfile.open('r');
    myJSONObject = eval("{" + myJSONfile.read() + "}");
    myJSONfile.close(); // always close files after reading
    return myJSONObject;
  }
  else{
    alert("Bah!");
  }
}