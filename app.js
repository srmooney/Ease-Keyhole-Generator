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
    var volume = template();
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
        volume.shape.center.y = (x==0) ? (centerY - middle): (centerY + middle);
      }
      else {
        volume.shape.center.y = centerY;
      }
    }

    volume.shape.height = height;
    volume.shape.points[0][1].y = height;
    volume.shape.points[0][2].y = height;

    volumes.push(volume);
  }

  success(volumes);
};


var template = function() {
  return {
    shape: {
      type: "path",
      center: {
        x: 0,
        y: 0
      },
      width: 0.0001,
      height: 1,
      rotation: 0,
      points: [
        [{
          x: 0,
          y: 0
        }, {
          x: 0,
          y: 1
        }, {
          x: 0.0001,
          y: 1
        }, {
          x: 0.0001,
          y: 0
        }]
      ],
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
