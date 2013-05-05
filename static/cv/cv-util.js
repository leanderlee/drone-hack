var CvUtil = {
	match: function (center, rects, sigma) {
		function sqr(n) { return n*n; }
		var unpruned = [];
		var pruned = 0;
		do {
			for (var i=0, n=rects.length; i < n; i++) {
				if (sqr(rects[i].y-center.y) + sqr(rects[i].x-center.x) >= sqr(sigma)) {
					unpruned.push(rects[i]);
				} else {
					++pruned;
				}
			}
		} while (unpruned.length > 0 && pruned < 15);
		return unpruned;
	},
	matchMarker: function (rects) {
		function sqr(n) { return n*n; }
		var sigma = 20;
		var pruned = [];
		var avgx = 0;
		var avgy = 0;
		for (var i=0, n=rects.length; i < n; i++) {
			avgx += rects[i].x;
			avgy += rects[i].y;
		}
		avgx /= rects.length;
		avgy /= rects.length;
		for (var i=0, n=rects.length; i < n; i++) {
			if (sqr(rects[i].y-avgy) + sqr(rects[i].x-avgx) < sqr(sigma)) {
				pruned.push(rects[i]);
			}
		}
		var iters = 0;
		while (pruned.length > 0) {
			pruned = CvUtil.match(pruned[0], pruned, 6);
			++iters;
		}
		return iters;
	},
	mode: function (xs) {
		var ret = 0;
		var count = 0;
		for (var i=0, n=xs.length; i < n; i++) {
			if (xs[i] == ret) ++count;
			else if (count == 0) {
				ret = xs[i];
				count = 1;
			} else --count;
		}
		return ret;
	}
};