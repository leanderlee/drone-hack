
var Vision = {};
Vision.init = function () {
  Vision.backCanvas = document.createElement('canvas');
  Vision.rect_wnd = [];
  Vision.res_wnd = [];
  Vision.start()
};
Vision.start = function () {
  Vision.scale = Math.min(128/640, 128/360);
  Vision.w = (640*Vision.scale)|0;
  Vision.h = (360*Vision.scale)|0;
  Vision.classifier = jsfeat.haar.box;
  Vision.backCanvas.width = Vision.w;
  Vision.backCanvas.height = Vision.h;
  setInterval(function(){Vision.draw()}, 50);
};
Vision.draw = function () {
  var pxs = new jsfeat.matrix_t(640, 360, jsfeat.U8_t | jsfeat.C4_t);
  window.canv.readPixels(pxs.data);
  //Vision.backCtx.drawImage(img, 0, 0, Vision.backCanvas.width, Vision.backCanvas.height);
  //var pxs = Vision.backCtx.getImageData(0, 0, Vision.backCanvas.width, Vision.backCanvas.height);

  if (Vision.gray_img === undefined) {
    Vision.gray_img = new jsfeat.matrix_t(Vision.w, Vision.h, jsfeat.U8_t | jsfeat.C1_t);
    Vision.sum_img = new Int32Array((Vision.h+1)*(Vision.w+1));
    Vision.sqsum_img = new Int32Array((Vision.h+1)*(Vision.w+1));
    Vision.tilted = new Int32Array((Vision.h+1)*(Vision.w+1));
  }

  //Vision.backCtx.drawImage(Vision.video, 0, 0, Vision.backCanvas.width, Vision.backCanvas.height);
  //var px_mat = new jsfeat.matrix_t(pxs.height, pxs.width, jsfeat.U8_t | jsfeat.C3_t, pxs.data);
  jsfeat.imgproc.grayscale(pxs.data, Vision.gray_img.data);
  jsfeat.imgproc.equalize_histogram(Vision.gray_img, Vision.gray_img);
  jsfeat.imgproc.compute_integral_image(
    Vision.gray_img, Vision.sum_img, Vision.sqsum_img, null);
  jsfeat.haar.edges_density = 0.13;
  var rects = jsfeat.haar.detect_multi_scale(
    Vision.sum_img, Vision.sqsum_img, Vision.tilted, null,
    Vision.w, Vision.h, Vision.classifier, 1.15, 2);
  console.log(rects.length);
  var confident_rects = [];
  for (var i=0, n=rects.length; i < n; i++) {
    if (rects[i].confidence < 0.5) continue;
    confident_rects.push(rects[i]);
  }
  rects = confident_rects;
  rects = jsfeat.haar.group_rectangles(rects, 1);
  if (Vision.rect_wnd.length == 60) {
    Vision.rect_wnd.shift();
    Vision.res_wnd.shift();
  }
  Vision.rect_wnd.push(rects);
  rects = [].concat.apply(rects, Vision.rect_wnd);
  Vision.res_wnd.push(CvUtil.matchMarker(rects));
  //console.log(CvUtil.matchMarker(rects));
  console.log(CvUtil.mode(Vision.res_wnd));
};
Vision.init();

