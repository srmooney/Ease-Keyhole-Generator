var properties = function (projectSettings) {
  var properties = [
    {type: 'range', id: 'Number', value: 1, min: 1, max: 2, step: 1},
    {type: 'list', id: 'Orientation', options: ['Horizontal', 'Vertical'], value: 'Horizontal'}
  ];


  if (projectSettings.preferredUnit == 'mm') {
    properties = properties.concat([
      {type: 'text', id: 'Depth', value: 12 },
      {type: 'text', id: 'Length of Cut', value: 20 },
      {type: 'text', id: 'Spacing', value: 50 }

    ]);
  }
  else {
    properties = properties.concat([
      {type: 'text', id: 'Depth', value: 0.1875 },
      {type: 'text', id: 'Length of Cut', value: 1 },
      {type: 'text', id: 'Spacing', value: 2 }
    ]);
  }

  return properties;
}

var executor = function(args, success, failure) {

  var height = parseFloat(args.params['Length of Cut']);
  var distance = parseFloat(args.params['Spacing']);
  var orientation = args.params['Orientation'];
  var depth = parseFloat(args.params['Depth']);

  if (args.preferredUnit == 'mm') {
    distance /= 25.4;
    height /= 25.4;
    depth /= 25.4;
  }

  var materialWidth = args.material.dimensions.x;
  var materialHeight = args.material.dimensions.y;
  var centerX = args.material.dimensions.x/2;
  var centerY = args.material.dimensions.y/2;
  var middle = (distance/2);

  var selectedVolume = args.volumes.filter(function(volume){
    return args.selectedVolumeIds.indexOf(volume.id) >= 0;
  })[0];

  if (selectedVolume){
    centerX = selectedVolume.shape.center.x;
    centerY = selectedVolume.shape.center.y;
    materialWidth = selectedVolume.shape.width;
    materialHeight = selectedVolume.shape.height;
  }

  //check if spacing fits on material
  var distanceTest = (orientation === 'Horizontal') ? materialWidth : materialHeight;

  if (args.params.Number > 1 && distance > distanceTest){
    failure('Spacing is too big, won\'t fit on material');
    return;
  }

  //check if height fits on material
  if ((orientation === 'Horizontal') && height + (height/2) > materialHeight){
    failure('Length of Cut is too big, won\'t fit on material');
    return;
  }

  //check if depth will fit on material
  if (depth > args.material.dimensions.z){
    failure('Depth is too deep for the material thickness');
    return;
  }

  var volumes = []

  for(var x=0; x< args.params.Number; x++){
    //var volume = template();
    var volume = template2();
    volume.cut.depth = depth;
    if (orientation == 'Horizontal'){
      if (args.params.Number>1){
        volume.shape.center.x = (x===0) ? (centerX - middle): (centerX + middle);
      }
      else {
        volume.shape.center.x = centerX;
      }
      volume.shape.center.y = centerY;
    }
    else
    {
      volume.shape.center.x = centerX;
      if (args.params.Number>1){
        volume.shape.center.y = (x===0) ? (centerY - middle): (centerY + middle);
      }
      else {
        volume.shape.center.y = centerY;
      }
    }

    volume.shape.height = height;
    volume.shape.width = 0.0001;
    //volume.shape.points[0][1].y = height;
    //volume.shape.points[0][2].y = height;

    volumes.push(volume);
  }

  success(volumes);
};

var points1 = [
  [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0.0001, y: 1 },
    { x: 0.0001, y: 0 }
  ]
];

var template = function() {
  return {
    shape: {
      type: "path",
      center: {
        x: 0,
        y: 0
      },
      width: 2.0000,
      height: 8.0000,
      rotation: 0,
      points: points2,
      flipping: {
        horizontal: false,
        vertical: false
      }
    },
    cut: {
      type: "outline",
      depth: 0.1875,
      outlineStyle: "on-path",
      tabPreference: false,
      useProfile: false
    },
    id: null
  }
}

var template2 = function(){
  return {
  	"shape": {
  		"type": "path",
  		"center": {
  			"x": 0.0007030729166666674,
  			"y": 0.2500000000000054
  		},
  		"width": 0.0014061458333333332,
  		"height": 0.49999999999999994,
  		"rotation": 0,
  		"points": [
  			[{
  				"x": 0.045897,
  				"y": 1052.4,
  				"rh": {
  					"x": 0,
  					"y": 0
  				}
  			}, {
  				"x": 0.045897,
  				"y": 1043.2382,
  				"lh": {
  					"x": 0,
  					"y": 0
  				},
  				"rh": {
  					"x": 6.938893903907228e-18,
  					"y": -0.034641016151454096
  				}
  			}, {
  				"x": 0.11339699999999998,
  				"y": 1043.1992288568297,
  				"lh": {
  					"x": -0.03,
  					"y": -0.017320508075727048
  				},
  				"rh": {
  					"x": 0.013923048454132655,
  					"y": 0.00803847577299166
  				}
  			}, {
  				"x": 0.135897,
  				"y": 1043.2382,
  				"lh": {
  					"x": 0,
  					"y": -0.016076951545755946
  				},
  				"rh": {
  					"x": 0,
  					"y": 0
  				}
  			}, {
  				"x": 0.135897,
  				"y": 1051.95,
  				"lh": {
  					"x": 0,
  					"y": 0
  				},
  				"rh": {
  					"x": -0.0005656728314965276,
  					"y": 0.05195767522559436
  				}
  			}, {
  				"x": 0.034018118064407125,
  				"y": 1052.0073501387542,
  				"lh": {
  					"x": 0.0447138302511308,
  					"y": 0.02646872465516026
  				},
  				"rh": {
  					"x": -0.020300575783360385,
  					"y": -0.012017095107466957
  				}
  			}, {
  				"x": 0.0009069999999999911,
  				"y": 1051.95,
  				"lh": {
  					"x": 0.0002568217511201222,
  					"y": 0.023589361893527894
  				},
  				"rh": {
  					"x": 0,
  					"y": 0
  				}
  			}, {
  				"x": 0.0009069999999999911,
  				"y": 1034.31,
  				"lh": {
  					"x": 0,
  					"y": 0
  				},
  				"rh": {
  					"x": 0.000565672831496515,
  					"y": -0.05195767522559436
  				}
  			}, {
  				"x": 0.10278588193559288,
  				"y": 1034.2526498612458,
  				"lh": {
  					"x": -0.0447138302511308,
  					"y": -0.02646872465516026
  				},
  				"rh": {
  					"x": 0.020300575783360364,
  					"y": 0.012017095107466957
  				}
  			}, {
  				"x": 0.135897,
  				"y": 1034.31,
  				"lh": {
  					"x": -0.00025682175112012873,
  					"y": -0.023589361893527894
  				},
  				"rh": {
  					"x": 0,
  					"y": 0
  				}
  			}, {
  				"x": 0.135897,
  				"y": 1043.1298,
  				"lh": {
  					"x": 0,
  					"y": 0
  				},
  				"rh": {
  					"x": 0,
  					"y": 0.034641016151454096
  				}
  			}, {
  				"x": 0.068397,
  				"y": 1043.1687711431703,
  				"lh": {
  					"x": 0.03,
  					"y": 0.017320508075727048
  				},
  				"rh": {
  					"x": -0.013923048454132642,
  					"y": -0.00803847577299166
  				}
  			}, {
  				"x": 0.04589699999999999,
  				"y": 1043.1298,
  				"lh": {
  					"x": 0,
  					"y": 0.016076951545755946
  				},
  				"rh": {
  					"x": 0,
  					"y": 0
  				}
  			}, {
  				"x": 0.04589699999999999,
  				"y": 1025.2377999999999,
  				"lh": {
  					"x": 0,
  					"y": 0
  				},
  				"rh": {
  					"x": 6.938893903907228e-18,
  					"y": -0.034641016151454096
  				}
  			}, {
  				"x": 0.11339699999999998,
  				"y": 1025.1988288568296,
  				"lh": {
  					"x": -0.03,
  					"y": -0.017320508075727048
  				},
  				"rh": {
  					"x": 0.013923048454132655,
  					"y": 0.00803847577299166
  				}
  			}, {
  				"x": 0.135897,
  				"y": 1025.2377999999999,
  				"lh": {
  					"x": 0,
  					"y": -0.016076951545755946
  				},
  				"rh": {
  					"x": 0,
  					"y": 0
  				}
  			}, {
  				"x": 0.135897,
  				"y": 1034.1296,
  				"lh": {
  					"x": 0,
  					"y": 0
  				},
  				"rh": {
  					"x": -0.0005656728314965276,
  					"y": 0.05195767522559436
  				}
  			}, {
  				"x": 0.034018118064407125,
  				"y": 1034.1869501387541,
  				"lh": {
  					"x": 0.0447138302511308,
  					"y": 0.02646872465516026
  				},
  				"rh": {
  					"x": -0.020300575783360385,
  					"y": -0.012017095107466957
  				}
  			}, {
  				"x": 0.0009069999999999911,
  				"y": 1034.1296,
  				"lh": {
  					"x": 0.0002568217511201222,
  					"y": 0.023589361893527894
  				},
  				"rh": {
  					"x": 0,
  					"y": 0
  				}
  			}, {
  				"x": 0.0009069999999999911,
  				"y": 1016.3996,
  				"lh": {
  					"x": 0,
  					"y": 0
  				},
  				"rh": {
  					"x": 0.000565672831496515,
  					"y": -0.05195767522548067
  				}
  			}, {
  				"x": 0.10278588193559288,
  				"y": 1016.3422498612457,
  				"lh": {
  					"x": -0.0447138302511308,
  					"y": -0.02646872465504657
  				},
  				"rh": {
  					"x": 0.020300575783360364,
  					"y": 0.012017095107466957
  				}
  			}, {
  				"x": 0.135897,
  				"y": 1016.3996,
  				"lh": {
  					"x": -0.00025682175112012873,
  					"y": -0.02358936189364158
  				},
  				"rh": {
  					"x": 0,
  					"y": 0
  				}
  			}, {
  				"x": 0.135897,
  				"y": 1025.1295,
  				"lh": {
  					"x": 0,
  					"y": 0
  				},
  				"rh": {
  					"x": 0,
  					"y": 0.034641016151454096
  				}
  			}, {
  				"x": 0.068397,
  				"y": 1025.1684711431703,
  				"lh": {
  					"x": 0.03,
  					"y": 0.017320508075727048
  				},
  				"rh": {
  					"x": -0.013923048454132642,
  					"y": -0.00803847577299166
  				}
  			}, {
  				"x": 0.04589699999999999,
  				"y": 1025.1295,
  				"lh": {
  					"x": 0,
  					"y": 0.016076951545755946
  				},
  				"rh": {
  					"x": 0,
  					"y": 0
  				}
  			}, {
  				"x": 0.04589699999999999,
  				"y": 1007.4225,
  				"lh": {
  					"x": 0,
  					"y": 0
  				},
  				"rh": {
  					"x": 0,
  					"y": -0.017320508075727048
  				}
  			}, {
  				"x": 0.07964699999999998,
  				"y": 1007.4030144284148,
  				"lh": {
  					"x": -0.015,
  					"y": -0.008660254037863524
  				},
  				"rh": {
  					"x": 0.006961524227066321,
  					"y": 0.00401923788649583
  				}
  			}, {
  				"x": 0.09089699999999999,
  				"y": 1007.4225,
  				"lh": {
  					"x": 0,
  					"y": -0.008038475772877973
  				},
  				"rh": {
  					"x": 0,
  					"y": 0
  				}
  			}, {
  				"x": 0.09089699999999999,
  				"y": 1052.3995,
  				"lh": {
  					"x": 0,
  					"y": 0
  				}
  			}]
  		],
  		"flipping": {
  			"horizontal": false,
  			"vertical": true
  		},
  		"isProportionLocked": false,
  		"anchored": false
  	},
  	"cut": {
  		"type": "outline",
  		"depth": 0.375,
  		"tabPreference": true,
  		"outlineStyle": "on-path",
  		"useProfile": false,
  		"profileSettings": {
  			"width": 0.2,
  			"path": [{
  				"x": 0,
  				"y": 1,
  				"rh": {
  					"x": 0.25,
  					"y": -0.25
  				}
  			}, {
  				"x": 1,
  				"y": 0,
  				"lh": {
  					"x": -0.25,
  					"y": 0.25
  				}
  			}],
  			"startDepth": 0,
  			"endDepth": 1,
  			"upsideDown": false,
  			"pathProcessed": [],
  			"pathToolOffset": []
  		},
  		"tabHeight": 0.08,
  		"tabLength": 0.25,
  		"tabCount": 4,
  		"tabs": [{
  			"center": {
  				"x": 0.00046864583333333415,
  				"y": 5.325369818954187e-15
  			}
  		}, {
  			"center": {
  				"x": 0.001406145833333334,
  				"y": 0.15227415160479202
  			}
  		}, {
  			"center": {
  				"x": 7.216720710606639e-19,
  				"y": 0.3001244862616354
  			}
  		}, {
  			"center": {
  				"x": 0.000937395833333334,
  				"y": 0.4486996337892432
  			}
  		}]
  	},
  	"id": null
  };
};

