import * as THREE from './resources/threejs/r115/build/three.module.js';

// Text Generation and Printing

//testing 2d poem creation

function pull() {
        
  const titles = []; //test-titles

  const lines = 
  ['Doom befalls the wicked','And I can hear your little clicks in my dream', 
  `I feel as if my soul were floating`, `In a thousand floating echoes of voices`,
  `Good men fall to the wayside`, `Like leaves that dragged to the pit`,
  `I will end you in pieces`, `My heart bleeds crimson`, `End me, oh cruel night`, `My burning desire, never quenched`,
  `Ascend o my burning heart`, `And sink, like a decayed tower`, `Leaving ashes of thy pomp and power`,
  `The darkness beckons from the light`, `Till the dirges of his hope the melancholy burden bore`, `Never sorrow could dawn upon us`,
  `For we cannot help loving the present`, `All we sought in the past, vanished sky`, `Dread, not the future`, `My soul, which is full of mysteries I cannot discover`,
  `All we see is a dream confined to the grave`, `O the wilderness of night, unto thy climes fair`, ` I am shorn of my strength`, `As I lie at full length`,
  `The fever called "living" is conquered at last `, `Pitiless pain, burned in brain, heart willows`, `Of things that flow, with a lullaby sound`, `Amid earnest woes`, `In some tumultuous place I rest`,
  `I dwelt alone in a world of moan`, `My soul a stagnant tide`,`Melancholy waters lie ahead`, `It was the dead that groaned within`]; // test-lines

  function randomNoRepeats(array) { //so no lines repeat 
    const copy = array.slice(0);
    return function() {
      if (copy.length < 1) { copy = array.slice(0); } 
      const index = Math.floor(Math.random() * copy.length);
      const item = copy[index];
      copy.splice(index, 1);
      return item;
     };
    }

    const choose = randomNoRepeats(lines);

  document.getElementById("one").innerHTML = choose();
  document.getElementById("two").innerHTML = choose();
  document.getElementById("three").innerHTML = choose();
  document.getElementById("four").innerHTML = choose();

}

// Text Animation Scene

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.autoClearColor = false;

  const camera = new THREE.OrthographicCamera(
    -1, // left
     1, // right
     1, // top
    -1, // bottom
    -1, // near,
     1, // far
  );
  const scene = new THREE.Scene();
 const plane = new THREE.PlaneBufferGeometry(2, 2);

 // Loading shader

  const fragmentShader = `
  #include <common>

  uniform vec3 iResolution;
  uniform float iTime;

  mat2 r2d(float a) {
	float c = cos(a), s = sin(a);
	return mat2(c, s, -s, c);
}

float de(vec3 p) {

	p.y += cos(iTime*2.) * .2;

	p.xy *= r2d(iTime + p.z);

	vec3 r;
	float d = 0., s = 1.;

	for (int i = 0; i < 3; i++)
		r = max(r = abs(mod(p*s + 1., 2.) - 1.), r.yzx),
		d = max(d, (.9 - min(r.x, min(r.y, r.z))) / s),
		s *= 3.;

	return d;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
	vec2 uv = fragCoord.xy / iResolution.xy - .5;
	uv.x *= iResolution.x / iResolution.y;

	vec3 ro = vec3(.1*cos(iTime), 0, -iTime), p;
	vec3 rd = normalize(vec3(uv, -1));
	p = ro;

	float it = 0.;
	for (float i=0.; i < 1.; i += .01) {
        it = i;
		float d = de(p);
		if (d < .0001) break;
		p += rd * d*.4;
	}
	it /= .4 * sqrt(abs(tan(iTime) + p.x*p.x + p.y*p.y));

	vec3 c = mix(vec3(.1, .1, .3), vec3(.7, .1, .3), it*sin(p.z));

	fragColor = vec4(c, 2.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
  }
  `;
  const uniforms = {
    iTime: { value: 0 },
    iResolution:  { value: new THREE.Vector3() },
  };
  const material = new THREE.ShaderMaterial({
    fragmentShader,
    uniforms,
  });
  scene.add(new THREE.Mesh(plane, material));

//Background Audio

const listener = new THREE.AudioListener();
camera.add(listener);

const sound = new THREE.Audio(listener);

const audioLoader = new THREE.AudioLoader();
audioLoader.load( './assets/music.mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.5 );
	sound.play();
});


//Rendering Functions

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.001;  // convert to seconds

    resizeRendererToDisplaySize(renderer);

    const canvas = renderer.domElement;
    uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
    uniforms.iTime.value = time;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
pull();