window.onload = function() {
  // Yay for lazy coding and globals! >.<
  var img = document.createElement('img');

  loader.addEventListener('change', function(e) {
    var reader = new FileReader();
    reader.onload = function(event){
      img.src = event.target.result;
      document.getElementById('filename').innerHTML = e.target.files[0].name;
    }
    reader.readAsDataURL(e.target.files[0]);
  }, false);

  minus.addEventListener('click', function() {
    var value = parseInt(resolution.value);
    resolution.value = value > 10 ? value - 10 : 0;
  });

  plus.addEventListener('click', function() {
    var value = parseInt(resolution.value);
    resolution.value = value < 300 ? value + 10 : 300;
  });
};
