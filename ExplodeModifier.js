/**
 * Make all faces use unique vertices
 * so that each face can be separated from others
 *
 * @author alteredq / http://alteredqualia.com/
 */

THREE.ExplodeModifier = function () {

};

THREE.ExplodeModifier.prototype.modify = function ( geometry ) {

	var vertices = [];

	for ( var i = 0, il = geometry.faces.length; i < il; i ++ ) {

		var n = vertices.length;

		var face = geometry.faces[ i ];

		var a = face.a;
		var b = face.b;
		var c = face.c;

		var va = geometry.vertices[ a ];
		var vb = geometry.vertices[ b ];
		var vc = geometry.vertices[ c ];

		vertices.push( va.clone() );
		vertices.push( vb.clone() );
		vertices.push( vc.clone() );

		face.a = n;
		face.b = n + 1;
		face.c = n + 2;

	}

	geometry.vertices = vertices;

};

/*
     FILE ARCHIVED ON 14:24:27 Mar 13, 2018 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 02:51:12 May 29, 2019.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  LoadShardBlock: 333.375 (3)
  esindex: 0.015
  captures_list: 361.894
  CDXLines.iter: 15.883 (3)
  PetaboxLoader3.datanode: 335.174 (4)
  exclusion.robots: 0.349
  exclusion.robots.policy: 0.29
  RedisCDXSource: 5.565
  PetaboxLoader3.resolve: 163.276 (2)
  load_resource: 203.918
*/