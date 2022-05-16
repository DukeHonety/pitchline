let data = [];
const smallCircle = 1;
const bigCircle = 330;
const oneFeet = 3.28084;
$(document).ready(function(){
  $(".inputs").hide();
  $("#showLine").click(function(){
      const inputDiv = $(this).parent();
      const height = parseFloat(inputDiv.find("#height").val());
      const Vx = inputDiv.find("#vx").val();
      const Vy = inputDiv.find("#vy").val();
      const Vz = inputDiv.find("#vz").val();
      const VBalance = inputDiv.find("#balance").val();

      const Ratio = VBalance / Math.sqrt(Math.pow(Vx,2) + Math.pow(Vy,2) + Math.pow(Vz,2));
      // console.log(Ratio);
      // Drawline(height, Vx, Vy, Vz, Ratio);
      Drawlines();
  });
  Drawlines();
});
function Drawline(height, Vx, Vy, Vz, Ratio){
  
  // function unpack(rows, key) {
  //   return rows.map(function(row)
  //   { return row[key]; });
  // }
  const G = 32.1522;
  var x = [0];
  var y = [0];
  var z = [height];
  var c = [0];
  for (let i = 0; i < 6000; i++){
    const T = i / 100;
    let posx = Vx * T * Ratio;
    let posy = Vy * T * Ratio;
    let posz = height + Vz*Ratio*T - G*T*T/2;
    if (posz < 0)
      break;
    console.log(posz);
    x.push(posx);
    y.push(posy);
    z.push(posz);
    c.push(0);
  }
  Plotly.newPlot('myDiv', [{
    type: 'scatter3d',
    mode: 'lines',
    x: x,
    y: y,
    z: z,
    opacity: 1,
    line: {
      width: 6,
      color: c,
      reversescale: false
    }
  }], {
    height: 840,
    width: 840
  });
};

function Drawlines(){
  data = [];
  d3.csv('import.csv', function(rows){
  // let rows = [ { balance: "17.69", color: "#ff0000", height: "1.91", horizontal: "-3.29", player: "player1", side: "3.55", vertical: "2.19"},
  //     { balance: "18.48", color: "#00ff00", height: "1.71", horizontal: "-2.29", player: "player2", side: "3.55", vertical: "3.19"},
  //     { balance: "17.2", color: "#0022ff", height: "1.82", horizontal: "-2.79", player: "player3", side: "3.55", vertical: "1.19"} ];
    // function unpack(rows, key) {
    //   return rows.map(function(row)
    //   { return row[key]; }); 
    // }
    console.log(rows);
    for(let i = 0; i < rows.length; i++){// balance,vertical,horizontal,side,height
      const height = parseFloat(rows[i].height);
      const Vx = parseFloat(rows[i].vertical);
      const Vy = parseFloat(rows[i].horizontal);
      const Vz = parseFloat(rows[i].side);
      const VBalance = parseFloat(rows[i].balance);
      const Ratio = VBalance / Math.sqrt(Math.pow(Vx,2) + Math.pow(Vy,2) + Math.pow(Vz,2));

      const G = 32.1522; // 9.8m
      var x = [0];
      var y = [0];
      var z = [0];
      for (let i = 0; i < 6000; i++){
        const T = i / 100;
        let posx = Vx * T * Ratio;
        let posy = Vy * T * Ratio;
        let posz = height + Vz*Ratio*T - G*T*T/2;
        x.push(posx);
        y.push(posy);
        z.push(posz);
        if (posz < 0)
          break;
      }

      var trace = {
        x: x,
        y: y,
        z: z,
        mode: 'lines',
        name: rows[i].player,
        marker: {
          color: '#1f77b4',
          size: 12,
          symbol: 'circle',
          line: {
            color: 'rgb(0,0,0)',
            width: 0
          }},
        line: {
          color: rows[i].color,
          width: 3
        },
        type: 'scatter3d'
      };
      data.push(trace);
    }
    AddBackground();
    // var data = [trace1, trace2, trace3];
    var layout = {
      title: 'Pitch lines',
      autosize: false,
      width: 800,
      height: 500,
      margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 50
      },
      scene:{
        aspectmode: "manual",
        aspectratio: {
          x: 1, y: 1, z:0.3
        },
        xaxis: {
          visible: false,
          ticks: 'outside',
          tick0: 0,
          tickwidth: 4,
          tickfont:
          {
            color:'#fff',
            family:'Old Standard TT, serif',
            size: 10
          },
          ticksuffix:'feet',
          backgroundcolor: "rgb(255, 255, 255)",
          gridcolor: "rgb(255, 255, 255)",
          showbackground: false,
          zerolinecolor: "rgb(255, 255, 255)",
          range: [-3, 400],
        },
        yaxis: {
          visible: false,
          ticks: 'outside',
          tick0: 0,
          tickwidth: 4,
          tickfont:
          {
            color:'dimgrey',
            family:'Old Standard TT, serif',
            size: 10
          },
          ticksuffix:'feet',
          backgroundcolor: "rgb(255, 255, 255)",
          gridcolor: "rgb(255, 255, 255)",
          showbackground: true,
          zerolinecolor: "rgb(255, 255, 255)",
          range: [-400, 3],
        },
        zaxis: {
          ticks: 'outside',
          tick0: 0,
          tickwidth: 2,
          tickcolor: '#000',
          tickfont:
            {
            color:'dimgrey',
            family:'Old Standard TT, serif',
            size: 10
            },
          ticksuffix:'feet',
          backgroundcolor: "rgb(43, 52, 71)",
          gridcolor: "rgb(255,255,255)",
          showbackground: true,
          zerolinecolor: "rgb(255, 255, 255)",
          range: [0, 120],
        }
      },
    };
    Plotly.newPlot('myDiv', data, layout);
  });
}

function AddBackground(){
    // Add new circles
    let diameter = smallCircle;
    // const G = 9.8;
    var x = [];
    var y = [];
    var z = [];
    for (let i = -diameter; i < 0; i+= 0.02){
      let posy = i;
      let posx = Math.sqrt(diameter*diameter - i*i);
      let posz = 0;
      x.push(posx);
      y.push(posy);
      z.push(posz);
      if (posz < 0)
        break;
    }
    x.push(0);
    y.push(0);
    z.push(0);
    
    diameter = bigCircle;
    for (let i = -diameter; i < 0; i+= 0.02){
      let posy = i;
      let posx = Math.sqrt(diameter*diameter - i*i);
      let posz = 0;
      x.push(posx);
      y.push(posy);
      z.push(posz);
      if (posz < 0)
        break;
    }
    x.push(0);
    y.push(0);
    z.push(0);
    var trace = {
      x: x,
      y: y,
      z: z,
      mode: 'lines',
      name: 'background',
      marker: {
        color: '#FFFFFF',
        size: 12,
        symbol: 'circle',
        line: {
          color: 'rgb(0,0,0)',
          width: 0
        }},
      line: {
        color: '#FFFFFF',
        width: 5
      },
      type: 'scatter3d'
    };
    data.push(trace);
}