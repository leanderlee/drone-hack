/**
 * this cascade is derived from https://github.com/mtschirs/js-objectdetect implementation
 * @author Martin Tschirsich / http://www.tu-darmstadt.de/~m_t
 */
(function(global) {
	global.box = {complexClassifiers:[{simpleClassifiers:
		[{
			features:[
				[0,1,1,1,1],[1,1,1,1,-2],[2,1,1,1,1],
				[1,0,1,1,1],[1,1,1,1,-2],[1,2,1,1,1]],
				//[0,0,1,2,-2],[1,1,1,1,1],[2,1,2,1,-1],[4,1,1,1,1],[5,1,1,1,-1],[6,1,1,1,1],[7,1,2,1,-1],[9,1,1,1,1],[10,0,1,2,-2]],
				//[0,0,1,2,-2],[1,1,1,1,1],[2,1,1,1,-1],[3,1,2,1,1],[5,1,1,1,-1],[6,1,1,1,1],[7,1,1,1,-1],[8,1,1,1,1],[9,0,1,2,-2]],
			threshold:0.80, left_val:0, right_val:0.5
		}]
	}], size:/*[11,2]*/[3,3], tilted:false, threshold:0
	}
})(jsfeat.haar);