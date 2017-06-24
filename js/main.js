 Globals =   {  "speedFactor": -0.10,
                "GearSlowdown": 0.25,
                "tooth2toothDist": 50,
                "toothSize": 14};  //speedfactor: 15

d3.json("data/resonances.json", function(error, resonances) {

  /******************/
  /* error handling */
  /******************/
  if (error) throw error;
  //console.log(resonances);


  /***********************************************/
  /* do some preprocessing on the data structure */
  /***********************************************/
  for (var LL=0; LL<resonances.length; LL++){
    //apply main color to all orbiting bodies
    var thisMainColor = resonances[LL].MainColor;
    for (var LLL=0; LLL<resonances[LL].bodies.length; LLL++){
      resonances[LL].bodies[LLL].Color = thisMainColor;
    }
    //let each orbing body know how many are in the System
    var thisSystemSize = resonances[LL].bodies.length;
    for (var LLL=0; LLL<resonances[LL].bodies.length; LLL++){
      resonances[LL].bodies[LLL].systemSize = thisSystemSize;
      resonances[LL].bodies[LLL].bodyNum = LLL;
    }
    //for each body know which system they're in
    var thisIndex = resonances[LL].index;
    for (var LLL=0; LLL<resonances[LL].bodies.length; LLL++){
      resonances[LL].bodies[LLL].parentIndex = thisIndex;
    }


    //assign the default UI configuration
    resonances[LL].UI = { "settingsOpen":false,
                          "lines":true,
                          "spirograph":false,
                          "primary":true,
                          "labels":false,
                          "center":0,
                          "cog":1};
  }

  Globals.resonances = resonances;
  console.log(resonances);


  /***********************************************************/
  /* build the overall div to contain each resonance example */
  /***********************************************************/
  var myResonanceContainer = d3.select("#contentContainer")
    .selectAll(".resonaceInstance")
    .data(resonances)
    .enter()
    .append("div")
      .attr("class","row resonanceContainer narrative")
      .attr("id",function(d,i){return ("resonance"+i+"Container");});


  /****************************************************/
  /* build the bootstrap columns to organize the page */
  /****************************************************/
  var mySmallTilesCol = myResonanceContainer.append("div")
    .attr("class",function(d,i){
      if((i%2)==1){
        return "class","col-xs-4 push-xs-8 macroHalfDiv";
      }else{
        return "class","col-xs-4 macroHalfDiv";
      }
    }
  );
  var myLargeTileCol = myResonanceContainer.append("div")
    .attr("class",function(d,i){
      if((i%2)==1){
        return "class","col-xs-8 pull-xs-4 macroHalfDiv";
      }else{
        return "class","col-xs-8 macroHalfDiv";
      }
    }
  );


  /*****************************************************/
  /* build the individual tiles to contain the content */
  /*****************************************************/
  var myTitleTile = mySmallTilesCol.append("div")
    //.attr("style",function(d,i){return "background-color:"+d.MainColor+"";})
    .attr("class","titleTile");
  var myOrbitTile = mySmallTilesCol.append("div")
    //.attr("style",function(d,i){return "background-color:"+d.MainColor+"";})
    .attr("class","orbitTile");
  var mySpiroTile = myLargeTileCol.append("div")
    .attr("class","spiroTile");


  /*******************************/
  /* grab some global size stats */
  /*******************************/
  Globals.TileWidth = Number(d3.select("#resonance0Container .titleTile").style("width").split("px")[0]);
  Globals.TileHeight = Number(d3.select("#resonance0Container .titleTile").style("height").split("px")[0]);
  Globals.SprioWidth = Number(d3.select("#resonance0Container .spiroTile").style("width").split("px")[0]);
  Globals.SpiroHeight = Number(d3.select("#resonance0Container .spiroTile").style("height").split("px")[0]);
  Globals.T0 = Date.now();


  /***************************************/
  /* populate content for the title card */
  /***************************************/
  var myTitleTileFlippingCard = myTitleTile.append("div").attr("class","flippingCard");
  var myTitleTileFront = myTitleTileFlippingCard.append("div").attr("class","face front");
  var myTitleTileBack = myTitleTileFlippingCard.append("div").attr("class","face back");
  var myTitleTileFrontContainer = myTitleTileFront.append("div").attr("class","titleTile_Container container");
  var myTitleTileBackContainer  =  myTitleTileBack.append("div").attr("class","titleTile_Container container");
  // populate the front of the card
  myTitleTileFrontContainer.append("h3")
    .attr("class","titleTile_Title")
    .html(function(d,i){return d.Title;});
  myTitleTileFrontContainer.append("i")
    .attr("class","fa fa-info-circle titleInfoButton")
    .style("color",function(d,i){return d.MainColor;});
  // populate the back of the card
  myTitleTileBackContainer.append("p")
    .attr("class","titleTile_Subtitle")
    .html(function(d,i){return ("read more about <a href='" +d.Link+ "' style='color:" +d.MainColor+ "' target='_blank'>this orbital resonance</a>");});
  var myTable = myTitleTileBackContainer
    .append("div")
    .attr("class","table-responsive")
    .append("table")
    .attr("class","titleTile_Table table table-sm table-bordered");
  var myTableHeader = myTable.append("thead").append("tr");
  myTableHeader.append("th").html("Body");
  myTableHeader.append("th").html(function(d,i) {return ("Period of orbit around " +d.Primary);});
  myTableHeader.append("th").html(function(d,i) {return ("Semimajor axis of orbit around " +d.Primary);});
  var myTableBody = myTable.append("tbody");
  var myTableMeat = myTableBody.selectAll(".orbitingBodyRow")
    .data(function(d,i){return d.bodies;})
    .enter()
    .append("tr");
  myTableMeat.append("td").html(function(d,i){return (d.Name);});
  var myFormat = d3.format(",.4r");
  myTableMeat.append("td").html(function(d,i){return (""+ myFormat(d.PeriodDays)  + " earth days");});
  myTableMeat.append("td").html(function(d,i){return (""+ myFormat(d.SMA_km)  + " km");});
  myTitleTileBackContainer.append("i")
    .attr("class","fa fa-chevron-circle-left titleCloseButton")
    .style("color",function(d,i){return d.MainColor;});
  // create the colored buttons to flip the card
  d3.selectAll('.titleInfoButton').on("click",function(){
    d3.select(this.parentNode.parentNode.parentNode).classed("flipped",true);
  });
  d3.selectAll('.titleCloseButton').on("click",function(){
    d3.select(this.parentNode.parentNode.parentNode).classed("flipped",false);
  });


  /***************************************/
  /* populate content for the orbit card */
  /***************************************/
  var myOrbitTileContainer = myOrbitTile.append("div").attr("class","orbitTile_Container container");
  var myOrbitSVG = myOrbitTileContainer.append("svg")
    .attr("class","orbitTile_svg")
    .attr("width", Globals.TileWidth-0)
    .attr("height", Globals.TileHeight);
  myOrbitSVG.append("circle")
    .attr("class","OrbitCentralBody")
    .attr("cx",Globals.TileWidth/2.0)
    .attr("cy",Globals.TileHeight/2.0)
    .attr("r", 8);
    myOrbitSVG.append("text")
      .attr("class","OrbitCentralBodyLabel")
      .attr("x",(Globals.TileWidth/2.0)+6+3)
      .attr("y",Globals.TileHeight/2.0+6)
      .text(function(d,i){ return ("-"+d.Primary);});
  Globals.maxOrbitRadius = 0.6*Math.min(Globals.TileWidth,Globals.TileHeight)/2.0;
  //
  myOrbitSVG.selectAll(".OrbitOrbitalArc")
    .data(function(d,i){
                        var smaMax=Math.max(...d.bodies.map(function(d){return d.SMA_km;}));
                        d.bodies.forEach(function(d){d.SMA_km_Max = smaMax;});
                        return d.bodies;
                        })
    .enter()
    .append("circle")
    .attr("class","OrbitOrbitalArc")
    .attr("cx",Globals.TileWidth/2.0)
    .attr("cy",Globals.TileHeight/2.0)
    .attr("r", function(d,i){return ((d.SMA_km/d.SMA_km_Max)*Globals.maxOrbitRadius);} );
  //
  var myOrbitBodyG = myOrbitSVG.selectAll(".OrbitBodyG")
    .data(function(d,i){
                        var periodMin=Math.min(...d.bodies.map(function(d){return d.PeriodInt;}));
                        d.bodies.forEach(function(d){d.PeriodInt_Min = periodMin;});
                        return d.bodies;
                        })
    .enter()
    .append("g")
    .attr("class","OrbitBodyG")
    .attr("transform", "translate(" + Globals.TileWidth/2.0 + "," + Globals.TileHeight/2.0 + ")")
    .attr("width", Globals.maxOrbitRadius*2+20)
    .attr("height", Globals.maxOrbitRadius*2+20);
  //
  /*
  var myGradientDef = myOrbitBodyG.append("defs");
  var myGradient = myGradientDef.append("linearGradient")
    .attr("id",function(d,i){return ("Gradient-"+d.Name);})
    .attr("x1","0")
    .attr("x2","25%")
    .attr("y1","0")
    .attr("y2","25%")
    .attr("spreadMethod","repeat");
  myGradient.append("stop")
    .attr("offset","0%")
    .attr("stop-color",function(d,i){return tinycolor(d.Color).darken(15).desaturate(50).toString();});
  myGradient.append("stop")
    .attr("offset",function(d,i){return ((100*(i+1)/(d.systemSize+1))+"%");})
    .attr("stop-color",function(d,i){return tinycolor(d.Color).darken(15).desaturate(50).toString();});
  myGradient.append("stop")
    .attr("offset",function(d,i){return ((1+100*(i+1)/(d.systemSize+1))+"%");})
    .attr("stop-color",function(d,i){return d.Color;});
  myGradient.append("stop")
    .attr("offset","100%")
    .attr("stop-color",function(d,i){return d.Color;});
  */
  //



  /*  THIS WAS THE RAW CIRCLE.... but now i do GROUP(Circle,Text)
  myOrbitBodyG.append("circle")
    //.attr("class","OrbitOuterBody noOrbitOuterBodyFill")
    .attr("class",function(d,i){
      if (i==0){
        return "OrbitOuterBody";
      }else{
        return "OrbitOuterBody noOrbitOuterBodyFill";
      }
    })
    .style("fill",function(d,i){return d.Color;})
    //.style("fill",function(d,i){return ("url(#Gradient-"+d.Name+")");})
    .style("stroke",function(d,i){return d.Color;})
    .attr("cx",function(d,i){
                              var myRad = ((d.SMA_km/d.SMA_km_Max)*Globals.maxOrbitRadius);
                              var myAngle = ((d.initialAngle)*(Math.PI/180.0));
                              return (myRad*Math.cos(myAngle));
                            })
    .attr("cy",function(d,i){
                              var myRad = ((d.SMA_km/d.SMA_km_Max)*Globals.maxOrbitRadius);
                              var myAngle = ((d.initialAngle)*(Math.PI/180.0));
                              return (myRad*Math.sin(myAngle));
                            })
    .attr("r", 6);
    */

    var myOrbitBodyGG = myOrbitBodyG.append("g")
      .attr("class","OrbitBodyGG")
      .attr("transform", function(d,i){
                                var myRad = ((d.SMA_km/d.SMA_km_Max)*Globals.maxOrbitRadius);
                                var myAngle = ((d.initialAngle)*(Math.PI/180.0));
                                return ("translate(" + myRad*Math.cos(myAngle) + "," + myRad*Math.sin(myAngle) + ")"); })
      .attr("width", Globals.maxOrbitRadius*2+20)
      .attr("height", Globals.maxOrbitRadius*2+20);

    myOrbitBodyGG.append("circle")
      .attr("class",function(d,i){
        if (i==0){
          return "OrbitOuterBody";
        }else{
          return "OrbitOuterBody noOrbitOuterBodyFill";
        }
      })
      .style("fill",function(d,i){return d.Color;})
      .style("stroke",function(d,i){return d.Color;})
      .attr("cx",0)
      .attr("cy",0)
      .attr("r", 6);

    myOrbitBodyGG.append("text")
      .attr("class",function(d,i){
        if (i==0){
          return "OrbitOuterBodyLabel";
        }else{
          return "OrbitOuterBodyLabel noOrbitOuterBodyLabelFill";
        }
      })
      .text(function(d,i){ return ("-"+d.Name);})
      .attr("x",6+3)
      .attr("y",6);


    /***************************************/
    /* populate content for the spiro card */
    /***************************************/
    // create the proper left/right alignment
    var mySpiroTileContainer = mySpiroTile.append("div").attr("class","spiroTile_Container container");
    // create the Menu div for each of the interactives
    var myMenuDiv = mySpiroTileContainer.append("div").attr("class","menuDiv").attr("id",function(d,i){return ("menuDiv"+i);});
    myMenuDiv.append("a").attr("class","closebtn").html("&times;").on("click",function(d,i){
      closeNav(i);
    });
    var myMenuContainer = myMenuDiv.append("div").attr("class","container-fluid");
    // Add the menu title
    var myMenuRow = myMenuContainer.append("div").attr("class","row titleRow");
    myMenuRow.append("div").attr("class","menuCol col-xs-12").append("p").html("Visualization Settings");
    // Add the first menu item, camera position
    var myMenuRow = myMenuContainer.append("div").attr("class","row menuItemRow");
    myMenuRow.append("div").attr("class","menuCol col-xs-6").append("p").attr("class","menuItemTitle").html("Perspective Centerpoint");
    var myButtonDiv = myMenuRow.append("div").attr("class","menuCol col-xs-6 primarySwitch");
    var myOption = myButtonDiv.selectAll(".radioInput")
      .data(function(d,i){
                         d.bodies.forEach(function(d){d.resonanceID = i;});
                         return d.bodies;
                         })
      .enter().append("div");
    myOption.append("input").attr("class","radioInput")
      .attr("type","radio")
      .attr("name",function(d,i){return ("resonance_"+d.resonanceID);})
      .attr("id",function(d,i){
        return "Option_"+d.Name
      })
      .attr("id",function(d,i){
        if(i==0){
          document.getElementById("Option_"+d.Name).checked = true;
        }
        return "Option_"+d.Name
      });
    myOption.append("label").attr("class","radioLabel").attr("for",function(d,i){return "Option_"+d.Name}).html(function(d,i){return d.Name;}).on("click",function(d,i){
      switchCameraCenter(d.resonanceID,i);
    });
    //Add the menu item to toggle lines
    var myMenuRow = myMenuContainer.append("div").attr("class","row menuItemRow");
    myMenuRow.append("div").attr("class","menuCol col-xs-6").append("p").attr("class","menuItemTitle").html("Show Orbital Trace Lines");
    var myToggleDiv = myMenuRow.append("div").attr("class","col-xs-6");
    myToggleDiv.append("input").attr("id", function(d,i){return ("toggle_"+i+"_lines");}).attr("type","checkbox").attr("hidden","hidden").attr("checked","checked");
    myToggleDiv.append("label").attr("for",function(d,i){return ("toggle_"+i+"_lines");}).attr("class","switch").on("click",function(d,i){
      toggleSwitch(i,"lines",true);
    });
    //Add the menu item to toggle cogs
    var myMenuRow = myMenuContainer.append("div").attr("class","row menuItemRow");
    myMenuRow.append("div").attr("class","menuCol col-xs-6").append("p").attr("class","menuItemTitle").html("Show Spirograph Cogs");
    var myToggleDiv = myMenuRow.append("div").attr("class","col-xs-6");
    myToggleDiv.append("input").attr("id", function(d,i){return ("toggle_"+i+"_spirograph");}).attr("type","checkbox").attr("hidden","hidden");
    myToggleDiv.append("label").attr("for",function(d,i){return ("toggle_"+i+"_spirograph");}).attr("class","switch").on("click",function(d,i){
      toggleSwitch(i,"spirograph",true);
    });
    //Add the menu item to toggle primary body
    var myMenuRow = myMenuContainer.append("div").attr("class","row menuItemRow");
    myMenuRow.append("div").attr("class","menuCol col-xs-6").append("p").attr("class","menuItemTitle").html("Show Primary Body");
    var myToggleDiv = myMenuRow.append("div").attr("class","col-xs-6");
    myToggleDiv.append("input").attr("id", function(d,i){return ("toggle_"+i+"_primary");}).attr("type","checkbox").attr("hidden","hidden").attr("checked","checked");
    myToggleDiv.append("label").attr("for",function(d,i){return ("toggle_"+i+"_primary");}).attr("class","switch").on("click",function(d,i){
      toggleSwitch(i,"primary",true);
    });
    //Add the menu item to toggle labels
    var myMenuRow = myMenuContainer.append("div").attr("class","row menuItemRow");
    myMenuRow.append("div").attr("class","menuCol col-xs-6").append("p").attr("class","menuItemTitle").html("Show Labels");
    var myToggleDiv = myMenuRow.append("div").attr("class","col-xs-6");
    myToggleDiv.append("input").attr("id", function(d,i){return ("toggle_"+i+"_labels");}).attr("type","checkbox").attr("hidden","hidden");
    myToggleDiv.append("label").attr("for",function(d,i){return ("toggle_"+i+"_labels");}).attr("class","switch").on("click",function(d,i){
      toggleSwitch(i,"labels",true);
    });

    // create the large main graphic div
    var myGrpahicDiv = mySpiroTileContainer.append("div").attr("class","spiroGraphicDiv").attr("id",function(d,i){return ("spiroGraphicDiv"+i);});
    myGrpahicDiv.append("span").append("a").attr("class","spiroTile_settings fa fa-lg fa-gear").on("click",function(d,i){
      toggleNav(i);
    });
    // create the main graphic SVG
    Globals.maxSpiroOrbitRadius = 0.6*Math.min(Globals.SprioWidth,Globals.SpiroHeight);
    var mySpiroSVG = myGrpahicDiv.append("svg")
      .attr("class","spiroTile_svg")
      .attr("width", Globals.SprioWidth-0)
      .attr("height", Globals.SpiroHeight);
    var mySpiroPrimaryG = mySpiroSVG.append("g")
      .attr("class","spiroPrimaryBodyG")
      .attr("transform", "translate(" + Globals.SprioWidth/2.0 + "," + Globals.SpiroHeight/2.0 + ")")
      .attr("width", Globals.maxOrbitRadius*2+20)
      .attr("height", Globals.maxOrbitRadius*2+20);
    // let the userFeedbackEvent Happen
    mySpiroPrimaryG
      .append("circle")
      .attr("class","spiroUserFeedback")
      .attr("cx",0).attr("cy",0).attr("r",0);
    // create the lines
    mySpiroPrimaryG.selectAll(".SpiroBodyTraces")
      .data(function(d,i){
                          return d.bodies;
                          })
      .enter()
      .append("path")
      //.attr("class","SpiroBodyTraces")
      .attr("class",function(d,i){return ("SpiroBodyTraces toggleItems_"+(d.parentIndex-1)+"_lines");})
      .attr("d",function(d,i){return lineGenerator(dataGenerator(d.parentIndex-1,i));});
    // create the Outer Gears
    var spiroOuterCog = mySpiroPrimaryG.append("path")
      //.attr("class","spiroCog spiroOuterCog")
      .attr("class",function(d,i){return ("spiroCog spiroOuterCog toggleItems_"+(i)+"_spirograph");})
      .attr("d",function(d,i){return cogGenerator(outerCogDataGenerator(i));});
    // create the Inner Gears
    var spiroInnerCogG = mySpiroPrimaryG.append("g")
      .attr("class","spiroInnerCogG");
    var spiroInnerCog = spiroInnerCogG.append("path")
      //.attr("class","spiroCog spiroInnerCog")
      .attr("class",function(d,i){return ("spiroCog spiroInnerCog toggleItems_"+(i)+"_spirograph");})
      .on("click",function(d,i){
        switchCog(i);
      })
      .attr("d",function(d,i){return cogGenerator(innerCogDataGenerator(i));});
    var spiroInnerCogLine = spiroInnerCogG.append("line")
      //.attr("class","sprioCogLine")
      .attr("class",function(d,i){return ("sprioCogLine toggleItems_"+(i)+"_spirograph");})
      .attr("x1",0)
      .attr("y1",function(d,i){return (Globals.resonances[i].myO-0.5*Globals.resonances[i].myT-2);})
      .attr("x2",0)
      .attr("y2",function(d,i){return -(Globals.resonances[i].myO-0.5*Globals.resonances[i].myT-2);});
      var spiroInnerCogColoredLine = spiroInnerCogG.append("line")
        //.attr("class","sprioCogLine")
        .attr("class",function(d,i){return ("sprioColoredCogLine toggleItems_"+(i)+"_spirograph");})
        .attr("stroke",function(d,i){return (d.MainColor);})
        .attr("x1",0)
        .attr("y1",0)
        .attr("x2",0)
        .attr("y2",function(d,i){
          var dd = Globals.resonances[i];
          var ee = dd.bodies[dd.UI.cog];
          return (-((ee.SMA_km/ee.SMA_km_Max)*Globals.maxOrbitRadius));
        });
    var spiroInnerCogLabel = spiroInnerCogG.append("text")
      //.attr("class","sprioCogText")
      .attr("class",function(d,i){return ("sprioCogText toggleItems_"+(i)+"_spirograph");})
      .attr("x",0)
      .attr("y",-15)
      .attr("text-anchor","middle")
      .text(function(d,i){
        if (resonances[i].bodies.length>2){
          return ("click to swap cog-body");
        }else{
          return ("");
        }
      });

    // create the primary Body
    var mySpiroPrimaryGG = mySpiroPrimaryG.append("g")
      .attr("class","spiroPrimaryBodyGG")
      .attr("transform", "translate(" + Globals.SprioWidth/2.0 + "," + Globals.SpiroHeight/2.0 + ")")
      .attr("width", Globals.maxOrbitRadius*2+20)
      .attr("height", Globals.maxOrbitRadius*2+20);
    var mySpiroPrimary = mySpiroPrimaryG.append("circle")
      //.attr("class","spiroPrimaryBody")
      .attr("class",function(d,i){return ("spiroPrimaryBody toggleItems_"+(i)+"_primary");})
      .attr("id",function(d,i){ return ("spiroPrimaryBody_"+i);})
      .attr("cx",Globals.SprioWidth/2.0)
      .attr("cy",Globals.SpiroHeight/2.0)
      .attr("r", 8);
    // create primary body's label
    /*
    mySpiroPrimaryGG.append("text")
      //.attr("class","spiroPrimaryBodyLabel")
      .attr("class",function(d,i){return ("spiroPrimaryBodyLabel toggleItems_"+(i)+"_primary");})
      .text(function(d,i){ return ("-"+d.Primary);})
      .attr("x",8+3)
      .attr("y",6);
    */
    // create each orbiting body
    var mySpiroBodyG = mySpiroSVG.selectAll(".SpiroBodyG")
      .data(function(d,i){
                          return d.bodies;
                          })
      .enter()
      .append("g")
      .attr("class","SpiroBodyG")
      .attr("transform", "translate(" + Globals.SprioWidth/2.0 + "," + Globals.SpiroHeight/2.0 + ")")
      .attr("width", Globals.maxOrbitRadius*2+20)
      .attr("height", Globals.maxOrbitRadius*2+20);

    /*
    var mySpiroBodyGG = mySpiroBodyG.append("g")
      .attr("class","SpiroBodyGG")
      .attr("transform", function(d,i){
                                var myRad = ((d.SMA_km/d.SMA_km_Max)*Globals.maxOrbitRadius);
                                var myAngle = ((d.initialAngle)*(Math.PI/180.0));
                                return ("translate(" + myRad*Math.cos(myAngle) + "," + myRad*Math.sin(myAngle) + ")"); })
      .attr("width", Globals.maxOrbitRadius*2+20)
      .attr("height", Globals.maxOrbitRadius*2+20);
    */





    /* just deleted
    var mySpiroBody = mySpiroBodyG.append("circle")
      .attr("class",function(d,i){
        if (i==0){
          return "SpiroOuterBody";
        }else{
          return "SpiroOuterBody noSpiroOuterBodyFill";
        }
      })
      .style("fill",function(d,i){return d.Color;})
      .style("stroke",function(d,i){return d.Color;})
      .attr("cx",function(d,i){
                                var myRad = ((d.SMA_km/d.SMA_km_Max)*Globals.maxOrbitRadius);
                                var myAngle = ((d.initialAngle)*(Math.PI/180.0));
                                return (myRad*Math.cos(myAngle));
                              })
      .attr("cy",function(d,i){
                                var myRad = ((d.SMA_km/d.SMA_km_Max)*Globals.maxOrbitRadius);
                                var myAngle = ((d.initialAngle)*(Math.PI/180.0));
                                return (myRad*Math.sin(myAngle));
                              })
      .attr("r", 6);
    */
    var mySpiroBodyGG = mySpiroBodyG.append("g")
      .attr("class","SpiroBodyGG")
      .attr("transform", function(d,i){
        var myRad = ((d.SMA_km/d.SMA_km_Max)*Globals.maxOrbitRadius);
        var myAngle = ((d.initialAngle)*(Math.PI/180.0));
        return ("translate(" + (myRad*Math.cos(myAngle)) + "," + (myRad*Math.sin(myAngle)) + ")");
      })
      .attr("width", Globals.maxOrbitRadius*2+20)
      .attr("height", Globals.maxOrbitRadius*2+20);
    var mySpiroBody = mySpiroBodyGG.append("circle")
      .attr("class",function(d,i){
        if (i==0){
          return "SpiroOuterBody";
        }else{
          return "SpiroOuterBody noSpiroOuterBodyFill";
        }
      })
      .style("fill",function(d,i){return d.Color;})
      .style("stroke",function(d,i){return d.Color;})
      .attr("cx",0)
      .attr("cy",0)
      .attr("r", 6);
    // create the labels
    mySpiroBodyGG.append("text")
      .attr("class",function(d,i){
        if (i==0){
          return "spiroOuterBodyLabel toggleItems_"+(d.parentIndex-1)+"_labels";
        }else{
          return "spiroOuterBodyLabel noSpiroOuterBodyLabelFill toggleItems_"+(d.parentIndex-1)+"_labels";
        }
      })
      .text(function(d,i){ return ("-"+d.Name);})
      .attr("x",6+3)
      .attr("y",6);


    // add the appropriate descriptor text
    var descriptorText = myGrpahicDiv.append("p")
      .attr("class","descriptorText")
      .attr("id",function(d,i){return ("descriptorText_"+i);})
      .text(function(d,i){
        return ("viewing " +
                resonances[i].Title.toLowerCase() +
                " relative to " +
                resonances[i].bodies[0].Name.toLowerCase() +
                "");
      });



      // everything has been created
      for (var LL=0; LL<resonances.length; LL++){
        d3.selectAll(".toggleItems_"+LL+"_spirograph").style("visibility","hidden");
        d3.selectAll(".toggleItems_"+LL+"_labels").style("visibility","hidden");
      }
      // do some one-off manouvers to do better story telling
      // 0 - labels on
      toggleSwitch(0,"labels",false);
      d3.selectAll("#toggle_0_labels").attr("checked","checked");
      // 1 - primary off
      toggleSwitch(1,"primary",false);
      d3.selectAll("#toggle_1_primary").attr("checked",null);
      // 2 - spiro on, primary off
      toggleSwitch(2,"spirograph",false);
      d3.selectAll("#toggle_2_spirograph").attr("checked","checked");
      toggleSwitch(2,"primary",false);
      d3.selectAll("#toggle_2_primary").attr("checked",null);


      d3.select("#contentContainer").append("div")
        .attr("class", "narrative")
        .attr("id","narr1.5")
        .append("p")
          .attr("class","narrativeText")
          .html("Neptune and Pluto are in 3:2 Resonance.  Every 3 times Neptune orbits the Sun, Pluto does exactly twice. <br>Notice the difference in the patterns made by Neptune+Pluto's 3:2 Resonance & Titan+Hyperion's 4:3 Resonance.");
      d3.select("#contentContainer").append("div")
        .attr("class", "narrative")
        .attr("id","narr2.5")
        .append("p")
          .attr("class","narrativeText")
          .html("Turns out your favorite childhood toy can create these beautiful resonance patterns.<br>I guess we shouldn't be <a target='_blank' href='http://i.imgur.com/kBAIkO6.gifv'>surprised</a>...");
      d3.select("#contentContainer").append("div")
        .attr("class", "narrative")
        .attr("id","narr4.5")
        .append("p")
          .attr("class","narrativeText")
          .html("Is that a flower?");

      d3.selectAll(".narrative").data([1,2,3,4,5,1.5,2.5,4.5]).sort();






});




function switchCameraCenter(ii,jj) {
  Globals.resonances[ii].UI.center = jj;

  d3.select("#descriptorText_"+ii)
    .text(  "viewing " +
            Globals.resonances[ii].Title.toLowerCase() +
            " relative to " +
            Globals.resonances[ii].bodies[jj].Name.toLowerCase() +
            ""
    );
  // if the center takes the place of the cog, switch the cog
  Globals.resonances[ii].UI.cog = incrementCogNumber( Globals.resonances[ii].bodies.length,
                                                      jj,
                                                      Globals.resonances[ii].UI.cog);

  d3.select("#resonance"+ii+"Container")
    .select(".orbitTile")
    .selectAll(".OrbitOuterBody")
    .classed("noOrbitOuterBodyFill",function(d,i){
      return i!=jj;
    });
    d3.select("#resonance"+ii+"Container")
      .select(".orbitTile")
      .selectAll(".OrbitOuterBodyLabel")
      .classed("noOrbitOuterBodyLabelFill",function(d,i){
        return i!=jj;
      });
  d3.select("#resonance"+ii+"Container")
    .select(".spiroTile")
    .selectAll(".SpiroOuterBody")
    .classed("noSpiroOuterBodyFill",function(d,i){
      return i!=jj;
    });
    d3.select("#resonance"+ii+"Container")
      .select(".spiroTile")
      .selectAll(".spiroOuterBodyLabel")
      .classed("noSpiroOuterBodyLabelFill",function(d,i){
        return i!=jj;
      });
  d3.select("#resonance"+ii+"Container")
    .select(".spiroTile")
    .selectAll(".SpiroBodyTraces")
    .attr("d",function(d,i){return lineGenerator(dataGenerator(d.parentIndex-1,i));});

  //update cogs
  //*
  d3.selectAll(".spiroOuterCog")
    .attr("d",function(d,i){return cogGenerator(outerCogDataGenerator(i));});
  d3.selectAll(".spiroInnerCog")
    .attr("d",function(d,i){return cogGenerator(innerCogDataGenerator(i));});
  d3.selectAll(".sprioCogLine")
    .attr("y1",function(d,i){return (Globals.resonances[i].myO-0.5*Globals.resonances[i].myT-2);})
    .attr("y2",function(d,i){return -(Globals.resonances[i].myO-0.5*Globals.resonances[i].myT-2);});
  d3.selectAll(".sprioColoredCogLine")
    .attr("y2",function(d,i){
      var dd = Globals.resonances[i];
      var ee = dd.bodies[dd.UI.cog];
      return (-((ee.SMA_km/ee.SMA_km_Max)*Globals.maxOrbitRadius));
    });
  //  */

  // give user some feedback
  d3.select("#resonance"+ii+"Container")
    .select(".orbitTile")
    .selectAll(".OrbitOuterBody")
    .attr("r",50)
    .transition()
      .duration(500)
      .attr("r",6);
  d3.select("#resonance"+(ii)+"Container")
    .select(".spiroUserFeedback")
    .attr("r",Globals.maxOrbitRadius*2.5)
    .attr("fill",Globals.resonances[ii].MainColor)
    .transition()
      .duration(500)
      .attr("r",Globals.maxOrbitRadius*3.5)
      .attr("fill","rgba(0, 0, 0, 0.0)");
}
function switchCog(ii){
  Globals.resonances[ii].UI.cog = incrementCogNumber( Globals.resonances[ii].bodies.length,
                                                      Globals.resonances[ii].UI.center,
                                                      Globals.resonances[ii].UI.cog);
  d3.selectAll(".sprioColoredCogLine")
    .attr("y2",function(d,i){
      var dd = Globals.resonances[i];
      var ee = dd.bodies[dd.UI.cog];
      return (-((ee.SMA_km/ee.SMA_km_Max)*Globals.maxOrbitRadius));
    });
}

function toggleSwitch(ii,setting,feedback) {
  //note by the time we get here, the DOM hasn't updated - so i need to go off the OLD value
  if(document.getElementById("toggle_"+ii+"_"+setting).checked){
    //It's checked and here we are un-checking it
    Globals.resonances[ii].UI[setting] = false;
    d3.selectAll(".toggleItems_"+ii+"_"+setting).style("visibility","hidden")
    //alert("i am unchecking that for you");
  }else{
    //It's not checked and here we are checking it
    Globals.resonances[ii].UI[setting] = true;
    d3.selectAll(".toggleItems_"+ii+"_"+setting).style("visibility","visible");
    //alert("i am checking that for you");
  }
  // give the user some feedback that something happened
  if (feedback){
    d3.select("#resonance"+(ii)+"Container")
      .select(".spiroUserFeedback")
      .attr("r",Globals.maxOrbitRadius*2.5)
      .attr("fill","rgba(201, 214, 222, 0.5)")
      .transition()
        .duration(500)
        .attr("r",Globals.maxOrbitRadius*3.5)
        .attr("fill","rgba(201, 214, 222, 0.0)");
  }



}

function toggleNav(ii) {
  if(Globals.resonances[ii].UI.settingsOpen){
    closeNav(ii);
  }else{
    openNav(ii);
  }
}
/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav(ii) {
    document.getElementById("menuDiv"+ii).style.width = "85%";
    document.getElementById("spiroGraphicDiv"+ii).style.marginLeft = "85%";
    Globals.resonances[ii].UI.settingsOpen = true;
}
/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav(ii) {
    document.getElementById("menuDiv"+ii).style.width = "0";
    document.getElementById("spiroGraphicDiv"+ii).style.marginLeft = "0";
    Globals.resonances[ii].UI.settingsOpen = false;
}

function dataGenerator(resonanceIndex,bodyIndex){
  var indx = Globals.resonances[resonanceIndex].UI.center;
  if (indx==bodyIndex){
    //you're asking me to draw the line for the one under the camera. EASY!
    data = [  [0, 0],
              [0, 0]];
  }else{
    var data = [];
    var dd = Globals.resonances[resonanceIndex];
    var numRevs = LCM([dd.bodies[bodyIndex].PeriodInt,
                      dd.bodies[indx].PeriodInt]);
    for (var angle = 0; angle<=(numRevs*360); angle=angle+5){
      var newAngle = dd.bodies[indx].initialAngle + angle/dd.bodies[indx].PeriodInt;
      var myRad    = ((dd.bodies[indx].SMA_km/dd.bodies[indx].SMA_km_Max)*Globals.maxOrbitRadius);
      var myAngle = ((newAngle)*(Math.PI/180.0));
      var centerX = myRad*Math.cos(myAngle);
      var centerY = myRad*Math.sin(myAngle);
      var newAngle = dd.bodies[bodyIndex].initialAngle + angle/dd.bodies[bodyIndex].PeriodInt;
      var myRad    = ((dd.bodies[bodyIndex].SMA_km/dd.bodies[bodyIndex].SMA_km_Max)*Globals.maxOrbitRadius);
      var myAngle = ((newAngle)*(Math.PI/180.0));
      var bodyX = myRad*Math.cos(myAngle);
      var bodyY = myRad*Math.sin(myAngle);
      var newPoint = [bodyX-centerX,bodyY-centerY];
      data.push(newPoint);
    }
  }
  return data;
};

function outerCogDataGenerator(resonanceIndex){
  var dd = Globals.resonances[resonanceIndex];
  var centerIndx = dd.UI.center;
  var cogIndx = dd.UI.cog;

  var myLCMVec = (dd.bodies.map(function(d){return d.PeriodInt;}));
  var myLCM = LCM(myLCMVec);
  var k=1;
  while (myLCM*k<50){
    k = k+1;
  }
  //var numTeeth = myLCM*k;
  //Globals.resonances[resonanceIndex].outerNumTeeth = numTeeth;
  var mydata = [];

  // some quick inner cog calcs
  var outerO = Globals.maxOrbitRadius*2.5; //keep it less than 3.333
  var primaryRad = ((dd.bodies[centerIndx].SMA_km/dd.bodies[centerIndx].SMA_km_Max)*Globals.maxOrbitRadius);
  var myO = (outerO - primaryRad);//*0.3; //keep it less than 3.333
  var myCirc = myO*2*Math.PI;
  var numTeeth = Math.round(myCirc/Globals.tooth2toothDist);
  var innerCogTeethSpacing = myCirc/numTeeth

  var myO = Globals.maxOrbitRadius*2.5; //keep it less than 3.333
  var myCirc = myO*2*Math.PI;
  var numTeeth = Math.round(myCirc/Globals.tooth2toothDist);

  var Z = solveNumTeeth(primaryRad);
  numTeeth = Math.round(Z.outerNumTeeth);
  myO = Z.outerRadius;

  var myT = Globals.toothSize;
  for (var angle = 0; angle<(359.0); angle=angle+360.0/numTeeth){
    var myangle = angle+Globals.resonances[resonanceIndex].bodies[centerIndx].initialAngle;
    var a1 = myangle*Math.PI/180.0;
    var a2 = (myangle+360.0/numTeeth*0.35)*Math.PI/180.0;
    var a3 = (myangle+360.0/numTeeth*0.5)*Math.PI/180.0;
    var a4 = (myangle+360.0/numTeeth*0.85)*Math.PI/180.0;
    mydata.push({"a":a1,  "i":myO+0.5*myT, "o": myO+2*myT});
    mydata.push({"a":a2,  "i":myO+0.5*myT, "o": myO+2*myT});
    mydata.push({"a":a3,  "i":myO-0.5*myT, "o": myO+2*myT});
    mydata.push({"a":a4,  "i":myO-0.5*myT, "o": myO+2*myT});
  }
  return mydata;
}
function innerCogDataGenerator(resonanceIndex){
  var dd = Globals.resonances[resonanceIndex];
  var centerIndx = dd.UI.center;
  var cogIndx = dd.UI.cog;

  var outerO = Globals.maxOrbitRadius*2.5; //keep it less than 3.333
  var primaryRad = ((dd.bodies[centerIndx].SMA_km/dd.bodies[centerIndx].SMA_km_Max)*Globals.maxOrbitRadius);
  var myO = (outerO - primaryRad);//*0.3; //keep it less than 3.333
  var myCirc = myO*2*Math.PI;
  var numTeeth = Math.round(myCirc/Globals.tooth2toothDist);
  var myT = Globals.toothSize;

  var Z = solveNumTeeth(primaryRad);
  numTeeth = Math.round(Z.innerNumTeeth);
  myO = Z.innerRadius;

  Globals.resonances[resonanceIndex].myO = myO;
  Globals.resonances[resonanceIndex].myT = myT;

  var mydata = [];
  for (var angle = 0; angle<(359.0); angle=angle+360.0/numTeeth){
    var myangle = angle+Globals.resonances[resonanceIndex].bodies[centerIndx].initialAngle;
    var a1 = myangle*Math.PI/180.0;
    var a2 = (myangle+360.0/numTeeth*0.35)*Math.PI/180.0;
    var a3 = (myangle+360.0/numTeeth*0.5)*Math.PI/180.0;
    var a4 = (myangle+360.0/numTeeth*0.85)*Math.PI/180.0;
    mydata.push({"a":a1,  "i":0, "o": myO+0.5*myT});
    mydata.push({"a":a2,  "i":0, "o": myO+0.5*myT});
    mydata.push({"a":a3,  "i":0, "o": myO-0.5*myT});
    mydata.push({"a":a4,  "i":0, "o": myO-0.5*myT});
  }
  return mydata;
}

var lineGenerator = d3.line();
var cogGenerator = d3.radialArea()
  .curve(d3.curveCardinalClosed)
  .angle(function(d) { return d.a; })
  .innerRadius(function(d) { return d.i; })
  .outerRadius(function(d) { return d.o; });


// some useful math
function GCF(a,b){
  if (b==0){
    return a;
  }else{
    return (GCF(b,a%b));
  }
}
function LCM(myV){
  if(myV.length>2){
    var a = myV.pop();
    var b = LCM(myV);
  }else{
    var a = myV[0];
    var b = myV[1];
  }
  return ((a*b)/GCF(a,b));
}
function solveNumTeeth(R0){
  var scoreList = [];
  var XList = [];
  var NList = [];
  for (var X=5.0; X<50.0; X=X+1.0){
    for (var N=(X+1.0); N<((X+1.0)*5.0); N=N+1.0){
      var A = (N/X*R0)/((N/X)-1.0);
      var ToothDist = (Math.PI*2*(A-R0))/X;
      var score = Math.abs(A-Globals.maxOrbitRadius*2.5)+Math.abs(ToothDist-Globals.tooth2toothDist);
      if (isNaN(score)){
        //console.log(X+","+N);
      }
      scoreList.push(score);
      XList.push(X);
      NList.push(N);
      //console.log("A is: "+Math.round(A)+"    and ToothSize is: "+Math.round(ToothDist*10)/10);
    }
  }
  var minScore = Math.min(...scoreList);
  var goodIndex = scoreList.indexOf(minScore);
  var goodX = XList[goodIndex];
  var goodN = NList[goodIndex];
  var goodA = (goodN/goodX*R0)/((goodN/goodX)-1.0);
  var goodToothDist = (Math.PI*2*(goodA-R0))/goodX;
  var output = {"innerNumTeeth":goodX,
                "outerNumTeeth":goodN,
                "innerRadius":(goodA-R0),
                "outerRadius":(goodA)};
  //console.log(" ")
  //console.log("Min Score is "+minScore+" at index "+goodIndex+" where X="+XList[goodIndex]+" and N="+NList[goodIndex]);
  //console.log("inner num teeth = "+goodX+" and inner ToothDist= "+goodToothDist);
  //console.log("outer num teeth = "+goodN+" and outer ToothDist= "+(goodA)*Math.PI*2/goodN);
  return output;
}


function incrementCogNumber(NumBodies,CenterNumber,CurrentCogNumber) {
  var nextCogNumber = ((1+CurrentCogNumber)%NumBodies);
  while (nextCogNumber == CenterNumber){
    nextCogNumber = ((1+nextCogNumber)%NumBodies);
  }
  return nextCogNumber;
}

function whichResonancesAreInView(){
  var resonanceVisibility = new Array(Globals.resonances.length);
  for (var ii=0; ii<resonanceVisibility.length; ii++){
    var divTop = document.getElementById("resonance"+ii+"Container").getBoundingClientRect().top;
    var divBot = document.getElementById("resonance"+ii+"Container").getBoundingClientRect().bottom;
    resonanceVisibility[ii] = (divTop<window.innerHeight) && (divBot>0);
  }
  return resonanceVisibility;
}


d3.timer(function() {
  var delta = (Date.now() - Globals.T0);
  var resViz = whichResonancesAreInView();
  //for the orbit tile
  /*
  d3.selectAll(".OrbitOuterBody")
    .attr("cx",function(d,i){
      var newAngle = d.initialAngle + delta * Globals.speedFactor/(d.PeriodInt/d.PeriodInt_Min);
      var myRad = ((d.SMA_km/d.SMA_km_Max)*Globals.maxOrbitRadius);
      var myAngle = ((newAngle)*(Math.PI/180.0));
      return (myRad*Math.cos(myAngle));
    })
    .attr("cy",function(d,i){
      var newAngle = d.initialAngle + delta * Globals.speedFactor/(d.PeriodInt/d.PeriodInt_Min);
      var myRad = ((d.SMA_km/d.SMA_km_Max)*Globals.maxOrbitRadius);
      var myAngle = ((newAngle)*(Math.PI/180.0));
      return (myRad*Math.sin(myAngle));
    });
    */


    d3.selectAll(".OrbitBodyGG")
      .each(function(dd,ii){
        if (resViz[dd.parentIndex-1]){
          d3.select(this)
            .attr("transform", function(d,i){
                                  var newAngle = d.initialAngle + delta * Globals.speedFactor/(d.PeriodInt/d.PeriodInt_Min);
                                  var myRad = ((d.SMA_km/d.SMA_km_Max)*Globals.maxOrbitRadius);
                                  var myAngle = ((newAngle)*(Math.PI/180.0));
                                  return ("translate(" + myRad*Math.cos(myAngle) + "," + myRad*Math.sin(myAngle) + ")"); });
        }
      });


    //for the main spiro tile
    d3.selectAll(".spiroPrimaryBody")
      .each(function(dd,iii){
        if (resViz[iii]){
          d3.select(this)
            .attr("cx",function(d,ii){
              var indx = Globals.resonances[iii].UI.center;
              //repeat above code, but return a negative
              var newAngle = d.bodies[indx].initialAngle + delta * Globals.speedFactor/(d.bodies[indx].PeriodInt/d.bodies[indx].PeriodInt_Min);
              var myRad = ((d.bodies[indx].SMA_km/d.bodies[indx].SMA_km_Max)*Globals.maxOrbitRadius);
              var myAngle = ((newAngle)*(Math.PI/180.0));
              return (-myRad*Math.cos(myAngle));
            })
            .attr("cy",function(d,ii){
              var indx = Globals.resonances[iii].UI.center;
              //repeat above code, but return a negative
              var newAngle = d.bodies[indx].initialAngle + delta * Globals.speedFactor/(d.bodies[indx].PeriodInt/d.bodies[indx].PeriodInt_Min);
              var myRad = ((d.bodies[indx].SMA_km/d.bodies[indx].SMA_km_Max)*Globals.maxOrbitRadius);
              var myAngle = ((newAngle)*(Math.PI/180.0));
              return (-myRad*Math.sin(myAngle));
            });
          }
        });
    d3.selectAll(".spiroPrimaryBodyGG")
      .each(function(dd,iii){
        if (resViz[iii]){
          d3.select(this)
            .attr("transform", function(d,i){
                                var indx = Globals.resonances[iii].UI.center;
                                var newAngle = d.bodies[indx].initialAngle + delta * Globals.speedFactor/(d.bodies[indx].PeriodInt/d.bodies[indx].PeriodInt_Min);
                                var myRad = ((d.bodies[indx].SMA_km/d.bodies[indx].SMA_km_Max)*Globals.maxOrbitRadius);
                                var myAngle = ((newAngle)*(Math.PI/180.0));
                                return ("translate(" + (-myRad*Math.cos(myAngle)) + "," + (-myRad*Math.sin(myAngle)) + ")"); });
        }
      });
    /*
    d3.selectAll(".SpiroOuterBody")
      .attr("cx",function(d,ii){
        parentX = Number(d3.selectAll("#spiroPrimaryBody_"+(d.parentIndex-1)).attr("cx"));
        var newAngle = d.initialAngle + delta * Globals.speedFactor/(d.PeriodInt/d.PeriodInt_Min);
        var myRad = ((d.SMA_km/d.SMA_km_Max)*Globals.maxOrbitRadius);
        var myAngle = ((newAngle)*(Math.PI/180.0));
        //return (parentX+myRad*Math.cos(myAngle));
        return (0);
      }).attr("cy",function(d,ii){
        parentY = Number(d3.selectAll("#spiroPrimaryBody_"+(d.parentIndex-1)).attr("cy"));
        var newAngle = d.initialAngle + delta * Globals.speedFactor/(d.PeriodInt/d.PeriodInt_Min);
        var myRad = ((d.SMA_km/d.SMA_km_Max)*Globals.maxOrbitRadius);
        var myAngle = ((newAngle)*(Math.PI/180.0));
        //return (parentY+myRad*Math.sin(myAngle));
        return (0);
      });
      */
      d3.selectAll(".SpiroBodyGG")
        .each(function(dd,ii){
          if (resViz[dd.parentIndex-1]){
            d3.select(this)
              .attr("transform", function(d,i){
                            parentX = Number(d3.selectAll("#spiroPrimaryBody_"+(d.parentIndex-1)).attr("cx"));
                            parentY = Number(d3.selectAll("#spiroPrimaryBody_"+(d.parentIndex-1)).attr("cy"));
                            var newAngle = d.initialAngle + delta * Globals.speedFactor/(d.PeriodInt/d.PeriodInt_Min);
                            var myRad = ((d.SMA_km/d.SMA_km_Max)*Globals.maxOrbitRadius);
                            var myAngle = ((newAngle)*(Math.PI/180.0));
                            return ("translate(" + (parentX+myRad*Math.cos(myAngle)) + "," + (parentY+myRad*Math.sin(myAngle)) + ")"); });
          }
        });

    d3.selectAll(".spiroInnerCogG")
      .each(function(dd,iii){
        if (resViz[iii] && Globals.resonances[iii].UI.spirograph){
          d3.select(this)
            .attr("transform",function(d,i){
              var myPrimary = d3.selectAll("#spiroPrimaryBody_"+(iii));
              var dd = Globals.resonances[iii];
              var centerIndx = dd.UI.center;
              var cogIndx = dd.UI.cog;
              //var dd1 = Globals.resonances[i].bodies[0];
              //var newAngle1 = dd1.initialAngles + delta * Globals.speedFactor/(dd1.PeriodInt/dd1.PeriodInt_Min);
              //var newAngle1 = delta * Globals.speedFactor/(dd1.PeriodInt/dd1.PeriodInt_Min);
              //var myGearRatio = dd.bodies[0].PeriodInt/(dd.bodies[1].PeriodInt);
              //var myRotAngle = dd.bodies[0].PeriodInt/(dd.bodies[1].PeriodInt)*delta*Globals.speedFactor/(dd.bodies[0].PeriodInt/dd.bodies[0].PeriodInt_Min);

              var myRotAngle = (dd.bodies[centerIndx].PeriodInt_Min)/(dd.bodies[cogIndx].PeriodInt)*delta*Globals.speedFactor;

              return (
              "translate("+
              (myPrimary.attr("cx"))
              +","+
              (myPrimary.attr("cy"))
              +")"+"rotate("+(90+dd.bodies[cogIndx].initialAngle+(myRotAngle))+")");});
            }
          });
    d3.selectAll(".spiroOuterCog")
      .each(function(dd,iii){
        if (resViz[iii] && Globals.resonances[iii].UI.spirograph){
          d3.select(this)
            .attr("transform",function(d,i){
              var dd = Globals.resonances[iii];
              var centerIndx = dd.UI.center;
              var cogIndx = dd.UI.cog;

              // solve for the correct speed
              var primaryRad = ((dd.bodies[centerIndx].SMA_km/dd.bodies[centerIndx].SMA_km_Max)*Globals.maxOrbitRadius);
              var Z = solveNumTeeth(primaryRad);
              var Mult = (Z.outerRadius)/Globals.maxOrbitRadius;
              var MacroSpeedRot = (dd.bodies[centerIndx].PeriodInt_Min/dd.bodies[centerIndx].PeriodInt);
              var MacroSpeedLin = ((dd.bodies[centerIndx].SMA_km/dd.bodies[centerIndx].SMA_km_Max)*Globals.maxOrbitRadius)*MacroSpeedRot;
              var MicroSpeedRot = ((dd.bodies[centerIndx].PeriodInt_Min)/(dd.bodies[cogIndx].PeriodInt));
              var MicroSpeedLin = ((Mult-(dd.bodies[centerIndx].SMA_km/dd.bodies[centerIndx].SMA_km_Max))*Globals.maxOrbitRadius)*MicroSpeedRot;
              var totalSpeedLin = 1.0*MacroSpeedLin+1.0*MicroSpeedLin;
              //var MicroSpeedLin = ((2.5-(dd.bodies[0].SMA_km/dd.bodies[0].SMA_km_Max))*Globals.maxOrbitRadius)*MicroSpeedRot;
              //totalSpeedLin *= (2.5/(2.5-(dd.bodies[0].SMA_km/dd.bodies[0].SMA_km_Max)));
              //var totalSpeedAng = totalSpeedLin / ((Globals.maxOrbitRadius*2.5));
              //totalSpeedAng *= (dd.outerTeethSpacing / dd.innerTeethSpacing)
              var totalSpeedAng = totalSpeedLin / ((Z.outerRadius));
              var myRotAngle = totalSpeedAng*delta*Globals.speedFactor;

              // solve for the correct offset
              var theta0 = dd.bodies[0].initialAngle;
              var theta1 = dd.bodies[cogIndx].initialAngle;
              var contactDegreesBehindLeader = (720+90+theta1+(90-theta0))%360.0;
              var contactPortionBehindLeader = contactDegreesBehindLeader/360.0;
              var numOfToothSetsBehindLeader = Z.innerNumTeeth*contactPortionBehindLeader;
              var fractionOfToothSetBehind = numOfToothSetsBehindLeader-Math.floor(numOfToothSetsBehindLeader);

              var outerDegreesPerToothSet = 360.0/(Z.outerNumTeeth);
              var outerOffsetAngle = 0-90+theta0+fractionOfToothSetBehind*(outerDegreesPerToothSet);


              return (
              "rotate("+(0+outerOffsetAngle+myRotAngle)+")");});
            }
          });

});


















// Page Resize Stuff
window.onresize = function(event) {
  Globals.TileWidth = Number(d3.select("#resonance0Container .titleTile").style("width").split("px")[0]);
  Globals.TileHeight = Number(d3.select("#resonance0Container .titleTile").style("height").split("px")[0]);
  Globals.SprioWidth = Number(d3.select("#resonance0Container .spiroTile").style("width").split("px")[0]);
  Globals.SpiroHeight = Number(d3.select("#resonance0Container .spiroTile").style("height").split("px")[0]);
  Globals.maxOrbitRadius = 0.6*Math.min(Globals.TileWidth,Globals.TileHeight)/2.0;
  Globals.maxSpiroOrbitRadius = 0.6*Math.min(Globals.SprioWidth,Globals.SpiroHeight);

  d3.selectAll(".orbitTile_svg")
    .attr("width", Globals.TileWidth-0)
    .attr("height", Globals.TileHeight);
  d3.selectAll(".OrbitBodyGG")
    .attr("width", Globals.maxOrbitRadius*2+20)
    .attr("height", Globals.maxOrbitRadius*2+20);
  d3.selectAll(".OrbitBodyG")
    .attr("transform", "translate(" + Globals.TileWidth/2.0 + "," + Globals.TileHeight/2.0 + ")")
    .attr("width", Globals.maxOrbitRadius*2+20)
    .attr("height", Globals.maxOrbitRadius*2+20);
  d3.selectAll(".OrbitCentralBody")
    .attr("cx",Globals.TileWidth/2.0)
    .attr("cy",Globals.TileHeight/2.0);
  d3.selectAll(".OrbitCentralBodyLabel")
    .attr("x",(Globals.TileWidth/2.0)+6+3)
    .attr("y",Globals.TileHeight/2.0+6);
  d3.selectAll(".OrbitOrbitalArc")
    .attr("class","OrbitOrbitalArc")
    .attr("cx",Globals.TileWidth/2.0)
    .attr("cy",Globals.TileHeight/2.0)
    .attr("r", function(d,i){return ((d.SMA_km/d.SMA_km_Max)*Globals.maxOrbitRadius);} );



  d3.selectAll(".spiroTile_svg")
    .attr("width", Globals.SprioWidth-0)
    .attr("height", Globals.SpiroHeight);
  d3.selectAll(".spiroPrimaryBodyG")
    .attr("transform", "translate(" + Globals.SprioWidth/2.0 + "," + Globals.SpiroHeight/2.0 + ")")
    .attr("width", Globals.maxOrbitRadius*2+20)
    .attr("height", Globals.maxOrbitRadius*2+20);
  /*
  d3.selectAll(".SpiroBodyTraces")
    .attr("d",function(d,i){console.log(i); return lineGenerator(dataGenerator(d.parentIndex-1,i));});
  */
  d3.selectAll(".SpiroBodyTraces")
    .each(function(dd,ii){
      d3.select(this)
        .attr("d",function(d,i){console.log(d); return lineGenerator(dataGenerator(d.parentIndex-1,d.bodyNum));});
    });




  d3.selectAll(".spiroOuterCog")
    .attr("d",function(d,i){return cogGenerator(outerCogDataGenerator(i));});
  d3.selectAll(".spiroInnerCog")
    .attr("d",function(d,i){return cogGenerator(innerCogDataGenerator(i));});
  d3.selectAll(".sprioCogLine")
    .attr("y1",function(d,i){return (Globals.resonances[i].myO-0.5*Globals.resonances[i].myT-2);})
    .attr("y2",function(d,i){return -(Globals.resonances[i].myO-0.5*Globals.resonances[i].myT-2);})
  d3.selectAll(".sprioColoredCogLine")
    .attr("y2",function(d,i){
      var dd = Globals.resonances[i];
      var ee = dd.bodies[dd.UI.cog];
      return (-((ee.SMA_km/ee.SMA_km_Max)*Globals.maxOrbitRadius));
    });

  d3.selectAll(".spiroPrimaryBodyGG")
    .attr("transform", "translate(" + Globals.SprioWidth/2.0 + "," + Globals.SpiroHeight/2.0 + ")")
    .attr("width", Globals.maxOrbitRadius*2+20)
    .attr("height", Globals.maxOrbitRadius*2+20);
  d3.selectAll(".spiroPrimaryBody")
    .attr("cx",Globals.SprioWidth/2.0)
    .attr("cy",Globals.SpiroHeight/2.0);
  d3.selectAll(".SpiroBodyG")
    .attr("transform", "translate(" + Globals.SprioWidth/2.0 + "," + Globals.SpiroHeight/2.0 + ")")
    .attr("width", Globals.maxOrbitRadius*2+20)
    .attr("height", Globals.maxOrbitRadius*2+20);
  d3.selectAll(".SpiroBodyGG")
    .attr("width", Globals.maxOrbitRadius*2+20)
    .attr("height", Globals.maxOrbitRadius*2+20);






};
