var PointCalibrate = 0;
var CalibrationPoints={};
var imgUrl = "https://raw.githubusercontent.com/namwkim/bubbleview/master/img/sample3.jpg";

/**
 * Clear the canvas and the calibration button.
 */
function ClearCanvas(){
  $("#Pt5").hide();
  var canvas = document.getElementById("plotting_canvas");
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Show the instruction of using calibration at the start up screen.
 */
function PopUpInstruction(){
  ClearCanvas();
  swal({
    title:"Calibration",
    text: "Please click on the screen. You must click on all corner points and middle. This will calibrate your eye movements.",
    buttons:{
      cancel: false,
      confirm: true
    }
  }).then(isConfirm => {
    ShowCalibrationPicture();
  });

}
/**
  * Show the help instructions right at the start.
  */
function helpModalShow() {
    $('#helpModal').modal('show');
}

/**
 * Load this function when the index page starts.
* This function listens for clicks on the html page
* checks that all buttons have been clicked 5 times each, and then goes on to measuring the precision
*/
$(document).ready(function(){
  ClearCanvas();
  helpModalShow();
  
     $("#plotting_canvas").mousemove(function(){ // click event on the calibration buttons
     
      var canvas = document.getElementById("plotting_canvas");
      // var canvas1 = document.getElementById("plotting_canvas");
      var ctx = canvas.getContext("2d");
      
      ctx.save();
      var rect = canvas.getBoundingClientRect();
      ctx.filter="blur(0px)";
      var img = new Image();
      img.src = 'https://raw.githubusercontent.com/namwkim/bubbleview/master/img/sample3.jpg';

      event.preventDefault();
      var x = event.clientX - rect.left;
      var y = event.clientY - rect.top;
      //draw the circle
      
      ctx.beginPath();
      
      // ctx.lineWidth = 10;
      // ctx.strokeStyle = '#ff0000';
      // ctx.srokestyle = "rgba(255, 0, 0, 0)";
      ctx.arc(x, y, 70, 0, 6.28, false);
      // ctx.stroke();
      ctx.clip();
      
      ctx.drawImage(img,0,0, canvas.width, canvas.height);
      
      ctx.arc(x, y, 70, 0, 2 * Math.PI, false);
      
      ctx.strokeStyle = '#ff0000';
      // ctx.stroke();
      ctx.closePath();
      // ctx.restore();

      ctx.restore();
      ShowCalibrationPicture();
      
      PointCalibrate++;

      if (PointCalibrate == 200){ // last point is calibrated
           $("#plotting_canvas").unbind( "mousemove" );
           
            // clears the canvas
            var canvas = document.getElementById("plotting_canvas");
            context = canvas.getContext('2d');
            
            context.clearRect(0, 0, canvas.width, canvas.height);
            $("#Pt5").show();
            // notification for the measurement process
            swal({
              title: "Calculating measurement",
              text: "Please stare at the middle dot for the next 5 seconds. This will allow us to calculate the accuracy of our predictions.",
              closeOnEsc: false,
              allowOutsideClick: false,
              closeModal: true
            }).then( isConfirm => {

                // makes the variables true for 5 seconds & plots the points
                $(document).ready(function(){
                 
                  store_points_variable(); // start storing the prediction points

                  sleep(5000).then(() => {
                      
                      stop_storing_points_variable(); // stop storing the prediction points
                      var past50 = get_points(); // retrieve the stored points
                      var precision_measurement = calculatePrecision(past50);
                      var accuracyLabel = "<a>Accuracy | "+precision_measurement+"%</a>";
                      document.getElementById("Accuracy").innerHTML = accuracyLabel; // Show the accuracy in the nav bar.
                      swal({
                        title: "Your accuracy measure is " + precision_measurement + "%",
                        allowOutsideClick: false,
                        buttons: {
                          cancel: "Recalibrate",
                          confirm: true,
                        }
                      }).then(isConfirm => {
                          if (isConfirm){
                            //clear the calibration & hide the last middle button
                            enableMove = false;
                            ClearCanvas();
                            
                          } else {
                            //use restart function to restart the calibration
                            ClearCalibration();
                            ClearCanvas();
                            ShowCalibrationPicture();
                          }
                      });
                  });
                });
            });
          }
    });
});

/**
 * Show the Calibration Points
 */


function ShowCalibrationPicture() {
  
  var canvas = document.getElementById("plotting_canvas");
  var ctx = canvas.getContext("2d");
  
  ctx.filter = "blur(10px)";
  var img = new Image();
  img.onload = function(){
    ctx.drawImage(img,0,0, canvas.width, canvas.height);
  };
  img.src = 'https://raw.githubusercontent.com/namwkim/bubbleview/master/img/sample3.jpg';
 
}

/**
* This function clears the calibration buttons memory
*/
function ClearCalibration(){
  
  window.localStorage.clear();
  CalibrationPoints = {};
  PointCalibrate = 0;
}

// sleep function because java doesn't have one, sourced from http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
