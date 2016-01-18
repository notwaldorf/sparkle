window.onload = function() {
  // Yay for lazy coding and globals! >.<
  var img = document.createElement('img');
  var ctx = canvas.getContext('2d');
  var pixelsPerWidth = resolution.value;
  var pixelsPerHeight = resolution.value;
  var pixels = [];
  var isAnimating = false;
  var animationTimeout, animationFrame;

  setupCanvasSmoothing();

  img.addEventListener('load', function(e) {
    var ratio = img.height / img.width;
    pixelsPerHeight = Math.floor(pixelsPerWidth * ratio);
    canvas.width = 400;
    canvas.height = 400 * ratio;

    container.style.width = canvas.width +'px';
    container.style.height = canvas.height +'px';
    displayPixelatedImage();
  });

  // Start off with a default image.
  img.crossOrigin = '';
  resetState();

  function displayPixelatedImage() {
    pixelateCanvasImage();

    var pixelColors = getPixelColors();

    // Remove the previous render and redisplay the new image.
    container.innerHTML = '';
    for (var i = 0; i < pixelColors.length; i++) {
      pixels.push(drawPixel(pixelColors[i], canvas.width / pixelsPerWidth, canvas.height / pixelsPerHeight));
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
    // Draw the image super tiny and then scale it from the tiny size
    // to the actual canvas size, which pixellates it.
    ctx.drawImage(img, 0, 0, pixelsPerWidth, pixelsPerHeight);
    ctx.drawImage(canvas,
                 0, 0, pixelsPerWidth, pixelsPerHeight, /* source */
                 0, 0, canvas.width, canvas.height /* dest */);
  }

  function getPixelColors() {
    function getRGBA(data) {
      return 'rgba(' + data[0] + ',' + data[1] +
              ',' + data[2] + ',' + data[3] + ')';
    }

    var colors = []

    // How many original pixels we have in a "drawn" final pixel.
    for (var i = 0; i < pixelsPerWidth; i++) {
      for (var j = 0; j < pixelsPerHeight; j++) {
        var x = canvas.width / pixelsPerWidth * i + 1;
        var y = canvas.height / pixelsPerHeight * j + 1;

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

  reset.addEventListener('click', resetState);

  sparkle.addEventListener('click', function() {
    isAnimating = !isAnimating;
    if (isAnimating) {
      animate();
    } else {
      cancelAnimate();
    }
  });

  function resetState() {
    updateResolution(30);
    img.src = 'http://i.imgur.com/n95hZmA.jpg';
    filename.innerHTML = '[using the default]';
    cancelAnimate();
  };

  function updateResolution(value) {
    resolution.value = pixelsPerWidth = value;
    var ratio = img.height / img.width;
    pixelsPerHeight = Math.ceil(pixelsPerWidth * ratio);
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

      // zoom them in a bit too!
      if (pixels[which].style.transform === '') {
        pixels[which].style.transform = 'scale(1.1, 1.1)';
      } else {
        pixels[which].style.transform = '';
      }
    }
  }

  function cancelAnimate() {
    if (!animationTimeout || !animationFrame)
      return;
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
  }
};
