var PointCalibrate = 0;
var CalibrationPoints={};
var imgUrl = "website.jpg"
/**
 * Clear the canvas and the calibration button.
 */
function ClearCanvas(){
  //$(".Calibration").hide();
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
     $(".Calibration").click(function(event){ // click event on the calibration buttons

      var canvas = document.getElementById("plotting_canvas");
      //var id = $(this).attr('id');
      var img = document.getElementById("pic");
      var rect = canvas.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      var ctx = document.getElementById("plotting_canvas").getContext("2d");
      ctx.strokeStyle = "#ff2626"; // <-- set fill color
      //ctx.filter = 'blur(0px)';
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, 2*Math.PI,true);
      
      ctx.stroke();

      //if (!CalibrationPoints[id]){ // initialises if not done
        //CalibrationPoints[id]=0;
      //}
      //CalibrationPoints[id]++; // increments values

     // if (CalibrationPoints[id]==1){ //only turn to yellow after 5 clicks
        //$(this).css('filter','0px');
        $(this).prop('disabled', true); //disables the button
        PointCalibrate++;
      //}else if (CalibrationPoints[id]<5){
        //Gradually increase the opacity of calibration points when click to give some indication to user.
       // var opacity = 0.2*CalibrationPoints[id]+0.2;
       // $(this).css('opacity',opacity);
     // }

      //Show the middle calibration point after all other points have been clicked.
      //if (PointCalibrate == 8){
        //$("#Pt5").show();
      //}

      if (PointCalibrate >= 9){ // last point is calibrated
            //using jquery to grab every element in Calibration class and hide them except the middle point.
            //$(".Calibration").hide();
            //$("#Pt5").show();

            // clears the canvas
            var canvas = document.getElementById("plotting_canvas");
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

            // notification for the measurement process
            swal({
              title: "Calculating measurement",
              //text: "Please don't move your mouse & stare at the middle dot for the next 5 seconds. This will allow us to calculate the accuracy of our predictions.",
              closeOnEsc: false,
              allowOutsideClick: false,
              closeModal: true
            }).then( isConfirm => {

                // makes the variables true for 5 seconds & plots the points
                $(document).ready(function(){

                  store_points_variable(); // start storing the prediction points

                  sleep(5000).then(() => {
                      stop_storing_points_variable(); // stop storing the prediction points
                      var past50 = get_points() // retrieve the stored points
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
  $(".Calibration").show();
  
  //$("#Pt5").hide(); // initially hides the middle button
}

/**
* This function clears the calibration buttons memory
*/
function ClearCalibration(){
  window.localStorage.clear();
  $(".Calibration").css('filter','10px');
  //$(".Calibration").css('opacity',0.2);
  $(".Calibration").prop('disabled',false);

  CalibrationPoints = {};
  PointCalibrate = 0;
}

// sleep function because java doesn't have one, sourced from http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
