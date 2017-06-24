document.getElementById("learnMoreButton").onclick = function(){
  el = document.getElementById("infographic");
  if (el.classList.contains('hidden')){
    el.classList.remove('hidden');
    d3.selectAll(".panel").transition().duration(750).style("height","320px").style("opacity","1");
    d3.selectAll(".closeInfographicButton").transition().duration(750).style("height","16px").style("opacity","1");
    d3.selectAll(".learnMoreContainer").transition().duration(750).style("opacity","0");
  }else{
    el.classList.add('hidden');
    d3.selectAll(".panel").transition().duration(750).style("height","0px").style("opacity","0");
    d3.selectAll(".closeInfographicButton").transition().duration(750).style("height","0px").style("opacity","0");
    d3.selectAll(".learnMoreContainer").transition().duration(750).style("opacity","1");
  }
}

document.getElementById("closeInfographicAction").onclick = function(){
  el = document.getElementById("infographic");
  if (el.classList.contains('hidden')){
    el.classList.remove('hidden');
    d3.selectAll(".panel").transition().duration(750).style("height","320px").style("opacity","1");
    d3.selectAll(".closeInfographicButton").transition().duration(750).style("height","16px").style("opacity","1");
    d3.selectAll(".learnMoreContainer").transition().duration(750).style("opacity","0");
  }else{
    el.classList.add('hidden');
    d3.selectAll(".panel").transition().duration(750).style("height","0px").style("opacity","0");
    d3.selectAll(".closeInfographicButton").transition().duration(750).style("height","0px").style("opacity","0");
    d3.selectAll(".learnMoreContainer").transition().duration(750).style("opacity","1");
  }
}
