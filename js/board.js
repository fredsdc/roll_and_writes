$(document).ready(function() {
  var scale = 1,
    htmlCanvas = document.getElementById('mainCanvas'),
    context = htmlCanvas.getContext('2d'),
    imgArray = new Array();
  let currentLoadedImages = 0;
  let totalImages = Object.keys(json["images"]).length;
  for (key in json["images"]) {
    imgArray[key] = new Image();
    imgArray[key].src = json["images"][key];
    imgArray[key].onload = function(e) {
      currentLoadedImages++;
      if (currentLoadedImages == totalImages) {
        // Start listening to resize events and draw canvas.
        initialize();
      }
    }
  }

  // Create status
  json["status"] = {};
  for (key in json["triggers"]) {
    json["status"][key] = 0;
  }

  function initialize() {
    // Register an event listener to call the resizeCanvas() function
    // each time the window is resized.
    window.addEventListener('resize', resizeCanvas, false);

    // Draw canvas border for the first time.
    resizeCanvas();

    htmlCanvas.addEventListener('mousedown', function(e) {
      let delta;
      if (event.button == 0) {
        delta = 1;
      } else if (event.button == 2) {
        delta = -1;
      } else {
        delta = 0
      }

      changeStatus(htmlCanvas, e, delta);
    });

    // Add wheel event
    htmlCanvas.addEventListener("onwheel" in document ? "wheel" : "mousewheel", function(e) {
      // deltaY for wheel event
      // wheelData for mousewheel event
      let delta = e.deltaY ? -e.deltaY : e.wheelDelta;
      if (delta > 0) {
        delta = 1;
      } else if (delta < 0) {
        delta = -1;
      }

      changeStatus(htmlCanvas, e, delta);
    });

    htmlCanvas.oncontextmenu = function(e) {
      e.preventDefault();
    };
  }

  // get cursor position
  function changeStatus(canvas, event, delta) {
    const rect = canvas.getBoundingClientRect(),
      x = (event.clientX - rect.left) / scale,
      y = (event.clientY - rect.top) / scale;
    for (key in json["triggers"]) {
      let i = json["triggers"][key][2][json["status"][key]]
      if (x >= json["triggers"][key][0] &&
        y >= json["triggers"][key][1] &&
        x <= json["triggers"][key][0] + imgArray[i].width &&
        y <= json["triggers"][key][1] + imgArray[i].height) {
        json["status"][key] += delta;
        if (json["status"][key] == json["triggers"][key][2].length) {
          json["status"][key] = 0;
        };
        if (json["status"][key] == -1) {
          json["status"][key] += json["triggers"][key][2].length;
        }
        redraw();
      }
    }
  }

  // Display custom canvas. In this case it's a blue, 5 pixel
  // border that resizes along with the browser window.
  function redraw() {
    context.drawImage(imgArray[0], 0, 0, imgArray[0].width * scale, imgArray[0].height * scale);
    for (key in json["triggers"]) {
      let x = json["triggers"][key][0],
        y = json["triggers"][key][1],
        i = json["triggers"][key][2][json["status"][key]];
      context.drawImage(imgArray[i], x * scale, y * scale, imgArray[i].width * scale, imgArray[i].height * scale)
    }
  }

  // Runs each time the DOM window resize event fires.
  // Resets the canvas dimensions to match window,
  // then draws the new borders accordingly.
  function resizeCanvas() {
    $('.old-dice').height(window.innerHeight - $('.dice').height() - 20);
    htmlCanvas.width = window.innerWidth - $('.dice').width() - 20;
    htmlCanvas.height = window.innerHeight - 20;
    scale = Math.min((htmlCanvas.width) / imgArray[0].width, htmlCanvas.height / imgArray[0].height);
    redraw();
  }
})
