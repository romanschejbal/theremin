// JAKE VERY a.k.a. jQuery
// Questions to ask:
// 1. What is this appliaction doing? ANSWER: https://giphy.com/clips/laff-tv-confused-huh-what-the-hell-A19tglYyfc7JPQYwNi
// 2. Where is the application state? ANSWER: https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWxzZ2NqcDEyaGl3NjBxcWtzbXl2OHJxbjE1cWdxMnZyOXd3NWhnaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o85xr3K9IXEWAb4Eo/giphy.gif

$(document).ready(function () {
  const $appContents = $(".app-contents");
  const $startMessage = $(".start-message");
  const $canvas = $(".canvas")[0];

  $appContents.hide();

  $(window).one("keydown click", function () {
    init();
  });

  function init() {
    $appContents.show();
    $startMessage.remove();

    const AudioContext = window.AudioContext;
    const audioCtx = new AudioContext();

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const WIDTH = $(window).width();
    const HEIGHT = $(window).height();

    const maxFreq = 6000;
    const maxVol = 0.02;
    const initialVol = 0.001;

    oscillator.detune.value = 100;
    oscillator.start(0);

    oscillator.onended = function () {
      console.log("Your tone has now stopped playing!");
    };

    gainNode.gain.value = initialVol;

    let CurX;
    let CurY;

    $(document).mousemove(function (e) {
      CurX = e.pageX;
      CurY = e.pageY;

      oscillator.frequency.value = (CurX / WIDTH) * maxFreq;
      gainNode.gain.value = (CurY / HEIGHT) * maxVol;

      canvasDraw();
    });

    $mute.click(function () {
      if ($(this).attr("data-muted") === "false") {
        gainNode.disconnect(audioCtx.destination);
        $(this).attr("data-muted", "true").text("Unmute");
      } else {
        gainNode.connect(audioCtx.destination);
        $(this).attr("data-muted", "false").text("Mute");
      }
    });

    const canvasCtx = $canvas.getContext("2d");

    $canvas.width = WIDTH;
    $canvas.height = HEIGHT;

    function canvasDraw() {
      rX = CurX;
      rY = CurY;

      rC = Math.floor((gainNode.gain.value / maxVol) * 30);

      canvasCtx.globalAlpha = 0.2;

      for (let i = 1; i <= 15; i = i + 2) {
        canvasCtx.beginPath();
        canvasCtx.fillStyle =
          "rgb(" +
          100 +
          i * 10 +
          "," +
          Math.floor((gainNode.gain.value / maxVol) * 255) +
          "," +
          Math.floor((oscillator.frequency.value / maxFreq) * 255) +
          ")";
        canvasCtx.arc(
          rX + random(0, 50),
          rY + random(0, 50),
          rC / 2 + i,
          (Math.PI / 180) * 0,
          (Math.PI / 180) * 360,
          false
        );
        canvasCtx.fill();
        canvasCtx.closePath();
      }
    }

    $clear.click(function () {
      canvasCtx.clearRect(0, 0, $canvas.width, $canvas.height);
    });
  }
});

// canvas visualization
function random(number1, number2) {
  return number1 + (Math.floor(Math.random() * (number2 - number1)) + 1);
}
