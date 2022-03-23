const locale = require("locale");


var font = "Vector";
var xyCenter = g.getWidth() / 2;


var initMinuteFontSize = 25;
var initHourFontSize = 40;

var dateFontSize = 13;
var digClockFontSize = 20;

var yposTime = 40;
/*
var yposDate = 95;
var yposYear = 128;
var yposGMT = 161;

*/

var bottomPadding = 16;

// Check settings for what type our clock should be

// timeout used to update every minute
var drawTimeout;

/*
let COLORS = {
  'white':    g.theme.dark ? "#000" : "#fff",
  'black':    g.theme.dark ? "#fff" : "#000",
  'charging': "#ffff00",
  'high':     g.theme.dark ? "#fff" : "#000",
  'low':      "#f00",
};

const levelColor = (l) => {
  if (Bangle.isCharging()) return COLORS.charging;
  if (l >= 30) return COLORS.high;
  return COLORS.low;
};

*/

// schedule a draw for the next minute
function queueDraw() {
  if (drawTimeout) clearTimeout(drawTimeout);
  drawTimeout = setTimeout(function() {
    drawTimeout = undefined;
    draw();
  }, 60000 - (Date.now() % 60000));
}

// Calculate calendar week (https://stackoverflow.com/a/6117889)
function getCW(date){
  var d=new Date(date.getFullYear(), date.getMonth(), date.getDate());
  var dayNum = d.getDay() || 7;
  d.setDate(d.getDate() + 4 - dayNum);
  var yearStart = new Date(d.getFullYear(),0,1);
  return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
}


function draw() {
  g.clear();
  //Bangle.drawWidgets();

  // get date
  var d = new Date();

  g.reset(); // default draw styles
  // drawSting centered
  g.setFontAlign(0, 0);

  // drawTime
  var hour = d.getHours();
  //var minutes = ("0" + d.getMinutes()).slice(-2);
  var minute = d.getMinutes();

  //hour = 23;
  //minute = 58;
  
  var strDig = (hour < 10 ? "0" + hour : hour) + ":" + (minute < 10 ? "0" + minute : minute) + " Uhr";
  
  var strMin = "minute";
  var strHour = "stunde";
  


  if(minute == 0)
    strMin = "";
  else if(minute > 0 && minute < 3)
    strMin = "kurz nach";
  else if(minute >= 3 && minute < 7)
    strMin = "fünf nach";
  else if(minute >= 7 && minute < 13)
    strMin = "zehn nach";
  else if(minute >= 13 && minute < 17)
    strMin = "viertel nach";
  else if(minute >= 17 && minute < 23)
    strMin = "zehn vor halb";
  else if(minute >= 23 && minute < 27)
    strMin = "fünf vor halb";
  else if(minute >= 27 && minute < 33)
    strMin = "halb";
  else if(minute >= 33 && minute < 37)
    strMin = "fünf nach halb";
  else if(minute >= 37 && minute < 43)
    strMin = "zehn nach halb";
  else if(minute >= 43 && minute < 47)
    strMin = "viertel vor";
  else if(minute >= 47 && minute < 53)
    strMin = "zehn vor";
  else if(minute >= 53 && minute < 57)
    strMin = "fünf vor";
  else if(minute >= 57 && minute <= 59)
    strMin = "kurz vor";
  else
    strMin = "wat?";
  
  
  if(minute > 30)
    hour += 1;
  if(hour == 24)
    hour = 0;
  
  if(hour == 0)
    strHour = "mitternacht";
  else if(hour == 1 || hour == 13)
    strHour = "eins";
  else if(hour == 2 || hour == 14)
    strHour = "zwei";
  else if(hour == 3 || hour == 15)
    strHour = "drei";
  else if(hour == 4 || hour == 16)
    strHour = "vier";
  else if(hour == 5 || hour == 17)
    strHour = "fünf";
  else if(hour == 6 || hour == 18)
    strHour = "sechs";
  else if(hour == 7 || hour == 19)
    strHour = "sieben";
  else if(hour == 8 || hour == 20)
    strHour = "acht";
  else if(hour == 9 || hour == 21)
    strHour = "neun";
  else if(hour == 10 || hour == 22)
    strHour = "zehn";
  else if(hour == 11 || hour == 23)
    strHour = "elf";
  else if(hour == 12)
    strHour = "zwölf";
  
  
  let monthStrArr = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  
  
  

  let width = g.getWidth() - 8; // vier pixel frei an jeder seite.

  g.setFont(font, initMinuteFontSize);
  let dynMinuteFontSize = width / (g.stringWidth(strMin) / initMinuteFontSize);
  let minuteHeight = g.setFont(font, (dynMinuteFontSize > initMinuteFontSize ? initMinuteFontSize : dynMinuteFontSize)).getFontHeight();
  
  
  g.setColor(g.theme.fg2);
  g.drawString(strMin, xyCenter, yposTime, true);
  
  
  g.setFont(font, initHourFontSize);
  let dynHourFontSize = width / (g.stringWidth(strHour) / initHourFontSize);
  let hourHeight = g.setFont(font, (dynHourFontSize > initHourFontSize ? initHourFontSize : dynHourFontSize)).getFontHeight();
  let hourYPos = yposTime + (minute == 0 ? 16 : minuteHeight + 8);
  
  //Terminal.println("strWidth: " + (g.stringWidth(strHour) / hourFontSize * strHour.Length()));
  
  g.setColor(g.theme.fg);
  
  
  
  g.drawString(strHour, xyCenter, hourYPos, true);
  
  



  // draw Day, name of month, Date
  
  let dateHeight = g.setFont(font, dateFontSize).getFontHeight();
  let dateY = g.getHeight() - (dateHeight / 2) - bottomPadding - 8;
  
  let day = d.getDay();
  let month = d.getMonth();
  let year = d.getFullYear();
  
  day = 31;
  month = 8;
  
  
  g.drawString([day + ". " + monthStrArr[month]] + ", KW " + getCW(d), xyCenter, dateY, true);

  // digital clock
  
  let digiHeight = g.setFont(font, digClockFontSize).getFontHeight();
  g.drawString(strDig, xyCenter, dateY - digiHeight, true);
  
  
  
  // Battery Status

  let bat = E.getBattery();

  //bat = 50;
  /*
  var s = 24; // size
  var t = 12; // thickness
  var x = 2, y = 2;
  
  g.reset();
  
  g.setColor(g.theme.fg);
  g.fillRect(x,y+2,x+s-4,y+2+t); // outer
  g.fillRect(x+s-3,y+2+(((t - 1)/2)-1),x+s-2,y+2+(((t - 1)/2)-1)+4); // contact
  
  g.clearRect(x+1,y+2+1,x+s-4-1,y+2+t-1); // centre
  g.setColor(Bangle.isCharging() ? "#ffff00" : g.theme.fg2);
  
  g.fillRect(x+3, y+5, x +5 + bat*(s-12)/100, y+t-1); // the level
  */
  
  g.setColor(Bangle.isCharging() ? "#ffff00" : g.theme.fg2);
  g.fillRect(0, g.getHeight()-1, bat*(g.getWidth())/100, g.getHeight());
  
  var imgCharge = {
    width : 8, height : 8, bpp : 1,
    transparent : 0,
    buffer : new Uint8Array([
    0b00000010,
    0b00000100,
    0b00001000,
    0b00011110,
    0b00000100,
    0b00001000,
    0b00010000,
    0b00000000
    ]).buffer
  };
  

  let batStr = bat + "%";
  let batStrWidth = batStr.length * 3; // wat?
  
  if(Bangle.isCharging()){
    g.setColor("#ffff00");
    //g.drawImage(imgCharge,x + (s), y + (t / 2));
    g.drawImage(imgCharge,1, g.getHeight()-12);
    g.setFont('6x8');
    g.drawString(batStr, g.getWidth() - batStrWidth, g.getHeight()-6, true);
  }
  

  
  // Bluetooth status
 if (!NRF.getSecurityStatus().connected){
     g.reset();
     //   g.setColor((g.getBPP()>8) ? "#07f" : (g.theme.dark ? "#0ff" : "#00f"));
    g.setColor(g.theme.fg2);
    var imgBT = {
      width : 8, height : 16, bpp : 1,
      transparent : 0,
      buffer : new Uint8Array([
      0b00010000,
      0b00011000,
      0b00010100,
      0b00010010,
      0b10010001,
      0b01010010,
      0b00110100,
      0b00011000,
      0b00110100,
      0b01010010,
      0b10010001,
      0b00010010,
      0b00010100,
      0b00011000,
      0b00010000,
      0b00000000
      ]).buffer
    };

    //var imgBT_large = atob("CxQBBgDgFgJgR4jZMawfAcA4D4NYybEYIwTAsBwDAA==");

     let btX = g.getWidth() - 2 - 8;
     let btX2 = btX + 8;
     let btY =  2; // g.getHeight()-20;
     let btY2 = btY + 16;
     g.drawImage(imgBT,btX,btY);
   
     g.setColor("#ff6060");
     g.drawLineAA(btX2, btY, btX, btY2);
  }
  
    /*
    if (Bangle.getHealthStatus) {
      g.reset();
      g.setFont('6x8');
      let strSteps = Bangle.getHealthStatus("day").steps;
      let stepsWidth = g.stringWidth(strSteps);
      
      g.drawString(strSteps, g.getWidth() - stepsWidth - 2, g.getHeight()-8, true);
      //Terminal.println(Bangle.getHealthStatus("day").steps);
    }
    */
  
  
  queueDraw();
}

//Bangle.loadWidgets();

// Stop updates when LCD is off, restart when on
Bangle.on('lcdPower',on=>{
  if (on) {
    draw(); // draw immediately, queue redraw
  } else { // stop draw timer
    if (drawTimeout) clearTimeout(drawTimeout);
    drawTimeout = undefined;
  }
});

Bangle.on('charging',function(charging) { draw(); }); // update on charge change (var charging = true/false)

NRF.on('connect',function() { draw(); });
NRF.on('disconnect',function() { draw(); });

// Show launcher when button pressed
Bangle.setUI("clock");
// clean app screen
g.clear();


//Bangle.drawWidgets();

// draw now
draw();
