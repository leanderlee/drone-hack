
var Vision = {};
Vision.init = function () {
  Vision.backCanvas = document.createElement('canvas');
  Vision.rect_wnd = [];
  Vision.res_wnd = [];
  Vision.start()
};
Vision.start = function () {
  Vision.scale = Math.min(256/640, 256/360);
  Vision.w = (640*Vision.scale)|0;
  Vision.h = (360*Vision.scale)|0;
  Vision.backCanvas.width = Vision.w;
  Vision.backCanvas.height = Vision.h;
  setInterval(function(){Vision.draw()}, 50);
};
Vision.detectFeature = function (classifier_name, classifier) {
  var rects = jsfeat.haar.detect_multi_scale(
    Vision.sum_img, Vision.sqsum_img, Vision.tilted, null,
    Vision.w, Vision.h, classifier, 1.15, 2);
  var confident_rects = [];
  if (classifier_name == 'box') {
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
  }
  var sc = 640/Vision.w;
  jsfeat.math.qsort(rects, 0, rects.length-1, function(a,b){return (b.confidence<a.confidence);});
  if (rects.length > 0) {
    var ret = rects[0];
    ret.x *= sc;
    ret.y *= sc;
    ret.width *= sc;
    ret.height *= sc;
    ret.classifier = classifier_name;
    if (classifier_name == 'box') {
      ret.marker = CvUtil.mode(Vision.res_wnd);
    }
    return ret;
  }
};
Vision.draw = function () {
  //window.canv.readPixels(pxs.data);
  //var cans = document.querySelector("#some");
  //cans.getContext("2d").putImageData(window.canv, 0, 0);
  var hiddenC = document.getElementById('some'),
  hiddenX = hiddenC.getContext('2d');
  hiddenX.drawImage(window.canv.canvas,0,0);
  var pxs = hiddenX.getImageData(0,0,Vision.w,Vision.h);
  

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
  var r1 = Vision.detectFeature('box', jsfeat.haar.box);
  if (r1) console.log(r1);
  var r2 = Vision.detectFeature('face', jsfeat.haar.frontalface);
  if (r2) console.log(r2);
};
Vision.init();

