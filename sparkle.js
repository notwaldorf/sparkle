window.onload = function() {
  // Yay for lazy coding and globals! >.<
  var img = document.createElement('img');
  var ctx = canvas.getContext('2d');
  var pixelsPerSide = resolution.value;
  var pixels = [];
  var isAnimating = false;

  setupCanvasSmoothing();

  img.addEventListener('load', function(e) {
    displayPixelatedImage();
  });

  // Start off with a default image.
  img.crossOrigin = '';
  img.src = 'http://i.imgur.com/RbzVCZI.png';

  function displayPixelatedImage() {
    pixelateCanvasImage();

    var pixelColors = getPixelColors();

    // Remove the previous render and redisplay the new image.
    container.innerHTML = '';

    var size = canvas.width / pixelsPerSide;
    for (var i = 0; i < pixelColors.length; i++) {
      pixels.push(drawPixel(pixelColors[i], size));
    }
  }

  function drawPixel(rgba, size) {
    var pixel = document.createElement('div');
    pixel.className = 'pixel';
    pixel.style.width = pixel.style.height = size + 'px';

    pixel.style.backgroundColor = rgba;
    container.appendChild(pixel);
    return pixel;
  }

  function pixelateCanvasImage() {
    var thumbWidth = pixelsPerSide;
    var thumbHeight = pixelsPerSide

    // Draw the image super tiny and then scale it from the tiny size
    // to the actual canvas size, which pixellates it.
    ctx.drawImage(img, 0, 0, thumbWidth, thumbHeight);
    ctx.drawImage(canvas,
                 0, 0, thumbWidth, thumbHeight, /* source */
                 0, 0, canvas.width, canvas.height /* dest */);
  }

  function getPixelColors() {
    function getRGBA(data) {
      return 'rgba(' + data[0] + ',' + data[1] +
              ',' + data[2] + ',' + data[3] + ')';
    }

    var colors = []
    var width = canvas.width;

    // How many original pixels we have in a "drawn" final pixel.
    var distancePerPixel = width / pixelsPerSide;

    for (var i = 0; i < pixelsPerSide; i++) {
      for (var j = 0; j < pixelsPerSide; j++) {
        var x = distancePerPixel * i + 1;
        var y = distancePerPixel * j + 1;

        var pixel = ctx.getImageData(x, y, 1, 1);
        var rgba = getRGBA(pixel.data);

        colors.push(rgba);
      }
    }
    return colors;
  }

  loader.addEventListener('change', function(e) {
    var reader = new FileReader();
    reader.onload = function(event){
      img.src = event.target.result;
      filename.innerHTML = e.target.files[0].name;
    }
    reader.readAsDataURL(e.target.files[0]);
  }, false);

  minus.addEventListener('click', function() {
    var value = parseInt(resolution.value);
    updateResolution(value > 10 ? value - 10 : 0);
  });

  plus.addEventListener('click', function() {
    var value = parseInt(resolution.value);
    updateResolution(value < 300 ? value + 10 : 300);
  });

  reset.addEventListener('click', function() {
    updateResolution(30);
    img.src = 'http://i.imgur.com/RbzVCZI.png';
    filename.innerHTML = '[using the default]';
    cancelAnimate();
  });

  sparkle.addEventListener('click', function() {
    isAnimating = !isAnimating;
    if (isAnimating) {
      animate();
    } else {
      cancelAnimate();
    }
  });

  function updateResolution(value) {
    resolution.value = pixelsPerSide = value;
    displayPixelatedImage();
  }

  function animate() {
    animationTimeout = setTimeout(function() {
    animationFrame = window.requestAnimationFrame(animate);
    }, 0.1);

    // Style 20% of the pixels.
    var howMany = 0.02 * pixels.length;
    for (var i = 0; i < howMany; i++) {
      var which = Math.floor(Math.random() * pixels.length);
      var opacity = (Math.floor(Math.random() * 5) + 6 ) / 10;
      pixels[which].style.opacity = opacity;
    }
  }

  function cancelAnimate() {
    clearTimeout(animationTimeout);
    window.cancelAnimationFrame(animationFrame);
    isAnimating = false;
  }

  function setupCanvasSmoothing() {
    // from https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    container.style.width = canvas.width +'px';
    container.style.height = canvas.height +'px';
  }
};
