// Click-to-play YouTube slots. Markup: <section class="video-slot" data-video-id="" hidden>.
// A slot stays hidden until data-video-id holds an 11-character YouTube ID, so pages
// can ship before a video exists. Nothing loads from YouTube until a visitor presses play.
(function () {
  var slots = document.querySelectorAll('.video-slot[data-video-id]');
  Array.prototype.forEach.call(slots, function (slot) {
    var id = (slot.getAttribute('data-video-id') || '').trim();
    var button = slot.querySelector('.video-play');
    if (!/^[A-Za-z0-9_-]{11}$/.test(id) || !button) return;
    var title = slot.getAttribute('data-video-title') || 'Video';
    button.style.backgroundImage = 'url("https://i.ytimg.com/vi/' + id + '/hqdefault.jpg")';
    slot.hidden = false;
    button.addEventListener('click', function () {
      var frame = document.createElement('iframe');
      frame.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1';
      frame.title = title;
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.allowFullscreen = true;
      button.replaceWith(frame);
      frame.focus();
    });
  });
})();
