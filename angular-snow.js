/**
 * Created by felix on 01.12.15.
 */
'use strict';
angular.module('angular-snow', []).directive('ngSnow', function() {

  var renderer, scene, camera, cameraRadius = 50.0, cameraTarget, cameraX = 0, cameraY = 0, cameraZ = cameraRadius, particleSystem, particleSystemHeight = 100.0, clock, controls, parameters, onParametersUpdate, texture;

  function init(el, flake, flakeCount, bgColor, mouseControls, scale) {

    renderer = new THREE.WebGLRenderer({alpha: true});

    renderer.setSize(window.innerWidth, window.innerHeight);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    cameraTarget = new THREE.Vector3(0, 0, 0);

    texture = THREE.ImageUtils.loadTexture(flake);

    var numParticles  = flakeCount, width = 100, height = particleSystemHeight, depth = 100, parameters = {
      color:   0xFFFFFF,
      height:  particleSystemHeight,
      radiusX: 2.5,
      radiusZ: 2.5,
      size:    100,
      scale:   scale,
      opacity: 1,
      speedH:  0.2,
      speedV:  0.2
    }, systemGeometry = new THREE.Geometry(), systemMaterial = new THREE.ShaderMaterial({
      uniforms:       {
        color:       {
          type:  'c',
          value: new THREE.Color(parameters.color)
        },
        height:      {
          type:  'f',
          value: parameters.height
        },
        elapsedTime: {
          type:  'f',
          value: 0
        },
        radiusX:     {
          type:  'f',
          value: parameters.radiusX
        },
        radiusZ:     {
          type:  'f',
          value: parameters.radiusZ
        },
        size:        {
          type:  'f',
          value: parameters.size
        },
        scale:       {
          type:  'f',
          value: parameters.scale
        },
        opacity:     {
          type:  'f',
          value: parameters.opacity
        },
        texture:     {
          type:  't',
          value: texture
        },
        speedH:      {
          type:  'f',
          value: parameters.speedH
        },
        speedV:      {
          type:  'f',
          value: parameters.speedV
        }
      },
      vertexShader:   'uniform float radiusX;' + 'uniform float radiusZ;' + 'uniform float size;' +
                      'uniform float scale;' + 'uniform float height;' + 'uniform float elapsedTime;' +
                      'uniform float speedH;' + 'uniform float speedV;' + 'void main() {' + '  vec3 pos = position;' +
                      '  pos.x += cos((elapsedTime + position.z) * 0.25 * speedH) * radiusX;' +
                      '  pos.y = mod(pos.y - elapsedTime * speedV, height);' +
                      '  pos.z += sin((elapsedTime + position.x) * 0.25 * speedH) * radiusZ;' +
                      '  vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );' +
                      '  gl_PointSize = size * ( scale / length( mvPosition.xyz ) );' +
                      '  gl_Position = projectionMatrix * mvPosition;' + '}',
      fragmentShader: '  uniform vec3 color;' + 'uniform float opacity;' + 'uniform sampler2D texture;' +
                      'void main() {' + '  vec4 texColor = texture2D( texture, gl_PointCoord );' +
                      '  gl_FragColor = texColor * vec4( color, opacity );' + '}',
      blending:       THREE.AdditiveBlending,
      transparent:    true,
      depthTest:      false
    });

    for (var i = 0; i < numParticles; i++) {
      var vertex = new THREE.Vector3(rand(width), Math.random() * height, rand(depth));

      systemGeometry.vertices.push(vertex);
    }

    particleSystem = new THREE.ParticleSystem(systemGeometry, systemMaterial);
    particleSystem.position.y = -height / 2;

    scene.add(particleSystem);

    clock = new THREE.Clock();
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.background = bgColor || '#000';
    renderer.domElement.style.zIndex = '-1';
    //el.append(renderer.domElement);
    document.body.appendChild(renderer.domElement);

    onParametersUpdate = function(v) {
      systemMaterial.uniforms.color.value.set(parameters.color);
      systemMaterial.uniforms.height.value = parameters.height;
      systemMaterial.uniforms.radiusX.value = parameters.radiusX;
      systemMaterial.uniforms.radiusZ.value = parameters.radiusZ;
      systemMaterial.uniforms.size.value = parameters.size;
      systemMaterial.uniforms.scale.value = parameters.scale;
      systemMaterial.uniforms.opacity.value = parameters.opacity;
      systemMaterial.uniforms.speedH.value = parameters.speedH;
      systemMaterial.uniforms.speedV.value = parameters.speedV;
    };
    controls = new dat.GUI();
    controls.close();

    controls.addColor(parameters, 'color').onChange(onParametersUpdate);
    controls.add(parameters, 'height', 0, particleSystemHeight * 2.0).onChange(onParametersUpdate);
    controls.add(parameters, 'radiusX', 0, 10).onChange(onParametersUpdate);
    controls.add(parameters, 'radiusZ', 0, 10).onChange(onParametersUpdate);
    controls.add(parameters, 'size', 1, 400).onChange(onParametersUpdate);
    controls.add(parameters, 'scale', 1, 30).onChange(onParametersUpdate);
    controls.add(parameters, 'opacity', 0, 1).onChange(onParametersUpdate);
    controls.add(parameters, 'speedH', 0.1, 3).onChange(onParametersUpdate);
    controls.add(parameters, 'speedV', 0.1, 3).onChange(onParametersUpdate);

    function onMouseWheel(e) {
      e.preventDefault();

      if (e.wheelDelta) {
        cameraZ += e.wheelDelta * 0.05;
      } else if (e.detail) {
        cameraZ += e.detail * 0.5;
      }
    }

    if (mouseControls) {

      document.addEventListener('mousemove', function(e) {
        var mouseX  = e.clientX, mouseY = e.clientY, width = window.innerWidth, halfWidth = width >>
          1, height = window.innerHeight, halfHeight = height >> 1;

        cameraX = cameraRadius * ( mouseX - halfWidth ) / halfWidth;
        cameraY = cameraRadius * ( mouseY - halfHeight ) / halfHeight;
      }, false);

      document.addEventListener('mousewheel', onMouseWheel, false);
      document.addEventListener('DOMMouseScroll', onMouseWheel, false);

    }
  }

  function animate() {

    requestAnimationFrame(animate);

    var delta = clock.getDelta(), elapsedTime = clock.getElapsedTime();

    particleSystem.material.uniforms.elapsedTime.value = elapsedTime * 10;

    camera.position.set(cameraX, cameraY, cameraZ);
    camera.lookAt(cameraTarget);

    renderer.clear();
    renderer.render(scene, camera);

  }

  function rand(v) {
    return (v * (Math.random() - 0.5));
  }

  return {
    scope:      {
      ngSnow:        '=',
      flake:         '@',
      bgColor:       '@',
      mouseControls: '=',
      flakeCount:    '=',
      scale:         '@'
    },
    restrict:   'A',
    replace:    true,
    transclude: true,
    template:   '<div  class="angular-snow" ng-show="ngSnow"><ng-transclude></ng-transclude></div>',
    link:       function(scope, el, attrs) {

      var defaultFlake = "flake.png";
      scope.flake = scope.flake || defaultFlake;
      scope.mouseControls = scope.mouseControls || false;
      scope.flakeCount = scope.flakeCount || 5000;
      scope.scale = scope.scale || 4.0;

      window.onload = function() {
        init(el, scope.flake, scope.flakeCount, scope.bgColor, scope.mouseControls, scope.scale);
        animate();
      };

      scope.$watchGroup(['flake', 'bgColor', 'mouseControls', 'flakeCount', 'scale'], function(params) {
        console.debug(params);
      });
    }
  };
});