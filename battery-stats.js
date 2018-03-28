'use strict';

// https://w3c.github.io/battery/#the-navigator-interface
// We get the initial value when the promise resolves ...
//
// result:
//
// BatteryManagery {
// 	charging: false,
// 	chargingTime: Infinity,
// 	dischargingTime: 8940,
// 	level: 0.59,
// 	onchargingchange: null,
// 	onchargingtimechange: null,
// 	ondischargingtimechange: null,
// 	onlevelchange: null
// }

function convertToHHMM(number) {
  var hrs = parseInt(Number(number));
  var min = Math.round((Number(number)-hrs) * 60);
  return [hrs,min];
}
        
        
// Check support for the Battery API
if(navigator.getBattery){
  // Battery API available.
  // Call Battery API and return a Promise
  navigator.getBattery().then(function(battery) {
    console.log(battery);
    
    var charging        = battery.charging;
    var chargingTime    = battery.chargingTime;
    var dischargingTime = battery.dischargingTime;
    var level           = Math.floor(battery.level * 100);
    var levelIndicator  = document.getElementById('levelIndicator');
    var levelPercentage = document.getElementById('levelPercentage');
    var dischardText    = document.getElementById('dischargeText');
    var dischargeHours  = document.getElementById('dischargeHours');
    var dischargeMins   = document.getElementById('dischargeMins');
    
    // Get remaining time in decimal format
    var dischargeDecimal = (dischargingTime / 3600);
    var hrs = convertToHHMM(dischargeDecimal)[0];
    var min = convertToHHMM(dischargeDecimal)[1];
    
    // Check if device is charging
    if(!charging){
      // Device is not charging.
      // Check if device has more than 1hr remaining
      if(dischargeDecimal > 1) {
        dischargeHours.textContent = hrs;
        dischargeMins.textContent = min;
      } else {
        dischargeHours.textContent = hrs;
        dischargeMins.textContent = min;
      }
    // Check if device is charging and fully charged
    } else if(charging && chargingTime === 0){
      // Device is charging and fully charged.
      
      // Output to HTML elements...
      dischargeText.textContent   = 'Fully Charged';
      document.getElementById('tester').style.display = 'none';
    } else {
      // Device is charging.
      
      // Output to HTML elements...
      dischargeText.textContent   = 'Charging...';
      document.getElementById('tester').style.display = 'none';
    }
    
    
    
    // Output to HTML elements...
    levelPercentage.textContent = level;
    levelIndicator.style.width = ((level * 76) / 100 )+'px';
    
    
    
    // ... and any subsequent updates.
    battery.onlevelchange = function() {
      levelIndicator.style.width = ((Math.floor(this.level * 100) * 76) / 100 )+'px';
      levelPercentage.textContent = Math.floor(this.level * 100);
      
      if(battery.level<0.3 && !battery.charging) {
        powerSavingMode = true;
      }
    };
    
    // BatteryManager.onchargingchange
    // BatteryManager.onchargingtimechange
    
    // BatteryManager.ondischargingtimechange
    battery.ondischargingtimechange = function () {
        
      console.log('BATTERY LEVEL CHANGE...');
      
      var dischargeDecimal = (this.dischargingTime / 3600);
      var hrs = convertToHHMM(dischargeDecimal)[0];
      var min = convertToHHMM(dischargeDecimal)[1];
    
      dischargeHours.textContent = hrs;
      dischargeMins.textContent = min;
    };
  }).catch(function(e){
    console.error(e);
  });
  
  
  function updateBatteryStatus(battery) {
    // document.querySelector('#charging').textContent = battery.charging ? 'charging' : 'not charging';
    // document.querySelector('#level').textContent = battery.level;
    // document.querySelector('#dischargingTime').textContent = battery.dischargingTime / 60;
    
    // navigator.getBattery().then(function(battery) {
    // // Update the battery status initially when the promise resolves ...
    //   updateBatteryStatus(battery);
  
    //   // .. and for any subsequent updates.
    //   battery.onchargingchange = function () {
    //     updateBatteryStatus(battery);
    //   };
  
    //   battery.onlevelchange = function () {
    //     updateBatteryStatus(battery);
    //   };
  
    //   battery.ondischargingtimechange = function () {
    //     updateBatteryStatus(battery);
    //   };
    // });
  }
  
  console.log(navigator);
}
else {
    // No battery API support.
    // Handle error accordingly.
}
