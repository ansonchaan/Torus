/**
 * Break faces with edges longer than maxEdgeLength
 * - not recursive
 *
 * @author alteredq / http://alteredqualia.com/
 */

THREE.TessellateModifier = function ( maxEdgeLength ) {

	this.maxEdgeLength = maxEdgeLength;

};

THREE.TessellateModifier.prototype.modify = function ( geometry ) {

	var edge;

	var faces = [];
	var faceVertexUvs = [];
	var maxEdgeLengthSquared = this.maxEdgeLength * this.maxEdgeLength;

	for ( var i = 0, il = geometry.faceVertexUvs.length; i < il; i ++ ) {

		faceVertexUvs[ i ] = [];

	}

	for ( var i = 0, il = geometry.faces.length; i < il; i ++ ) {

		var face = geometry.faces[ i ];

		if ( face instanceof THREE.Face3 ) {

			var a = face.a;
			var b = face.b;
			var c = face.c;

			var va = geometry.vertices[ a ];
			var vb = geometry.vertices[ b ];
			var vc = geometry.vertices[ c ];

			var dab = va.distanceToSquared( vb );
			var dbc = vb.distanceToSquared( vc );
			var dac = va.distanceToSquared( vc );

			if ( dab > maxEdgeLengthSquared || dbc > maxEdgeLengthSquared || dac > maxEdgeLengthSquared ) {

				var m = geometry.vertices.length;

				var triA = face.clone();
				var triB = face.clone();

				if ( dab >= dbc && dab >= dac ) {

					var vm = va.clone();
					vm.lerp( vb, 0.5 );

					triA.a = a;
					triA.b = m;
					triA.c = c;

					triB.a = m;
					triB.b = b;
					triB.c = c;

					if ( face.vertexNormals.length === 3 ) {

						var vnm = face.vertexNormals[ 0 ].clone();
						vnm.lerp( face.vertexNormals[ 1 ], 0.5 );

						triA.vertexNormals[ 1 ].copy( vnm );
						triB.vertexNormals[ 0 ].copy( vnm );

					}

					if ( face.vertexColors.length === 3 ) {

						var vcm = face.vertexColors[ 0 ].clone();
						vcm.lerp( face.vertexColors[ 1 ], 0.5 );

						triA.vertexColors[ 1 ].copy( vcm );
						triB.vertexColors[ 0 ].copy( vcm );

					}

					edge = 0;

				} else if ( dbc >= dab && dbc >= dac ) {

					var vm = vb.clone();
					vm.lerp( vc, 0.5 );

					triA.a = a;
					triA.b = b;
					triA.c = m;

					triB.a = m;
					triB.b = c;
					triB.c = a;

					if ( face.vertexNormals.length === 3 ) {

						var vnm = face.vertexNormals[ 1 ].clone();
						vnm.lerp( face.vertexNormals[ 2 ], 0.5 );

						triA.vertexNormals[ 2 ].copy( vnm );

						triB.vertexNormals[ 0 ].copy( vnm );
						triB.vertexNormals[ 1 ].copy( face.vertexNormals[ 2 ] );
						triB.vertexNormals[ 2 ].copy( face.vertexNormals[ 0 ] );

					}

					if ( face.vertexColors.length === 3 ) {

						var vcm = face.vertexColors[ 1 ].clone();
						vcm.lerp( face.vertexColors[ 2 ], 0.5 );

						triA.vertexColors[ 2 ].copy( vcm );

						triB.vertexColors[ 0 ].copy( vcm );
						triB.vertexColors[ 1 ].copy( face.vertexColors[ 2 ] );
						triB.vertexColors[ 2 ].copy( face.vertexColors[ 0 ] );

					}

					edge = 1;

				} else {

					var vm = va.clone();
					vm.lerp( vc, 0.5 );

					triA.a = a;
					triA.b = b;
					triA.c = m;

					triB.a = m;
					triB.b = b;
					triB.c = c;

					if ( face.vertexNormals.length === 3 ) {

						var vnm = face.vertexNormals[ 0 ].clone();
						vnm.lerp( face.vertexNormals[ 2 ], 0.5 );

						triA.vertexNormals[ 2 ].copy( vnm );
						triB.vertexNormals[ 0 ].copy( vnm );

					}

					if ( face.vertexColors.length === 3 ) {

						var vcm = face.vertexColors[ 0 ].clone();
						vcm.lerp( face.vertexColors[ 2 ], 0.5 );

						triA.vertexColors[ 2 ].copy( vcm );
						triB.vertexColors[ 0 ].copy( vcm );

					}

					edge = 2;

				}

				faces.push( triA, triB );
				geometry.vertices.push( vm );

				for ( var j = 0, jl = geometry.faceVertexUvs.length; j < jl; j ++ ) {

					if ( geometry.faceVertexUvs[ j ].length ) {

						var uvs = geometry.faceVertexUvs[ j ][ i ];

						var uvA = uvs[ 0 ];
						var uvB = uvs[ 1 ];
						var uvC = uvs[ 2 ];

						// AB

						if ( edge === 0 ) {

							var uvM = uvA.clone();
							uvM.lerp( uvB, 0.5 );

							var uvsTriA = [ uvA.clone(), uvM.clone(), uvC.clone() ];
							var uvsTriB = [ uvM.clone(), uvB.clone(), uvC.clone() ];

						// BC

						} else if ( edge === 1 ) {

							var uvM = uvB.clone();
							uvM.lerp( uvC, 0.5 );

							var uvsTriA = [ uvA.clone(), uvB.clone(), uvM.clone() ];
							var uvsTriB = [ uvM.clone(), uvC.clone(), uvA.clone() ];

						// AC

						} else {

							var uvM = uvA.clone();
							uvM.lerp( uvC, 0.5 );

							var uvsTriA = [ uvA.clone(), uvB.clone(), uvM.clone() ];
							var uvsTriB = [ uvM.clone(), uvB.clone(), uvC.clone() ];

						}

						faceVertexUvs[ j ].push( uvsTriA, uvsTriB );

					}

				}

			} else {

				faces.push( face );

				for ( var j = 0, jl = geometry.faceVertexUvs.length; j < jl; j ++ ) {

					faceVertexUvs[ j ].push( geometry.faceVertexUvs[ j ][ i ] );

				}

			}

		}

	}

	geometry.faces = faces;
	geometry.faceVertexUvs = faceVertexUvs;

};

/*
     FILE ARCHIVED ON 13:56:15 Mar 13, 2018 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 02:51:14 May 29, 2019.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  LoadShardBlock: 45.696 (3)
  esindex: 0.009
  captures_list: 65.247
  CDXLines.iter: 13.241 (3)
  PetaboxLoader3.datanode: 59.479 (5)
  exclusion.robots: 0.189
  exclusion.robots.policy: 0.175
  RedisCDXSource: 2.712
  PetaboxLoader3.resolve: 1255.911 (2)
  load_resource: 1330.995
*/