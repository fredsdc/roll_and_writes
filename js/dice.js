$(document).ready(function() {
  var o = [],
    e = $(".dice__cube"),
    i = 1e3 * e.css("transition-duration").split(",")[0].replace(/[^-\d\.]/g, ""),
    turn = 0;

  function n(a, i) {
    var t = e.eq(i).attr("class").split(" ")[0],
      s = "show-" + a;
    e.eq(i).removeClass(), t == s ? (e.eq(i).addClass(s + " show-same"), setTimeout(function() {
      e.eq(i).removeClass("show-same")
    }, i)) : e.eq(i).addClass(s), o.push(a)
  }
  $("#dice__btn").on("click ", function() {
    keep();
    for (i = 0; i < e.length; i++) {
      var a, t, s, o = (a = 1, t = 6, Math.floor(Math.random() * t + a));
      1 == o ? n("front", i) : 2 == o ? n("back", i) : 3 == o ? n("right", i) : 4 == o ? n("left", i) : 5 == o ? n("top", i) : 6 == o && n("bottom", i), (s = $("#dice__audio")[0]).pause(), s.currentTime = 0, s.play()
    }
  })

  function keep() {
    if (turn > 0) {
      var t, c, e = $(".dice__scene #dice__cube"),
        htmlCanvas = document.getElementById('mainCanvas'),
        context = htmlCanvas.getContext('2d'),
        img = new Image();
      for (i = 0; i < e.length; i++) {
        t = e.eq(i).attr("class").split("-")[1];
        c = t == "front" ? 0 : t == "back" ? 1 : t == "right" ? 2 : t == "left" ? 3 : t == "top" ? 4 : 5;
        img.src = e.eq(i).children().eq(c).css('background-image').replace(/^url\((['"]?)(.*?)\1\).*$/i, "$2");
        context.fillText(turn, htmlCanvas.width - $('#dice').width() + 15, 85 + 30 * turn);
        context.drawImage(img, htmlCanvas.width - $('#dice').width() + 30 + i * 30, 70 + 30 * turn, 28, 28);
      }
    }
    turn += 1
  }
});
