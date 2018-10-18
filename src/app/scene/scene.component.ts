// ********************************************************
// Imports
// ********************************************************

import { AfterViewInit, Component, ElementRef, Input, ViewChild, HostListener, Inject } from '@angular/core';
import * as THREE from 'three';

import { DatabaseComponent } from '../database/database.component';

// ********************************************************
// Const
// ********************************************************

const STEP_CAMERA_ZOOM = 0.04;
const STEP_CAMERA_PAN = 0.002;

// ********************************************************
// Class SceneComponent
// ********************************************************

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})
export class SceneComponent implements AfterViewInit {
  // *****************************
  // Data
  // *****************************

  private m_renderer: THREE.WebGLRenderer;
  private m_camera: THREE.PerspectiveCamera;
  private m_cameraTarget: THREE.Vector3;
  public m_scene: THREE.Scene;

  public m_fieldOfView: number;
  public m_nearClippingPane: number;
  public m_farClippingPane: number;
  public m_xMinFrustum: number;
  public m_xMaxFrustum: number;
  public m_yTopFrustum: number;
  public m_yBotFrustum: number;

  public m_MeshBoxA: THREE.Mesh;
  public m_MeshBoxB: THREE.Mesh;
  public m_MeshBoxC: THREE.Mesh;
  public m_MeshMap: THREE.Mesh;

  // public controls: THREE.OrbitControls;
  private m_mousePressed: boolean;
  private m_xMousePrev: number;
  private m_yMousePrev: number;

  private m_canvas: HTMLCanvasElement;

  constructor() {
    this.m_renderer = null;
    this.m_camera = null;
    this.m_cameraTarget = null;
    this.m_scene = null;
    // some strange from example
    this.render = this.render.bind(this);

    this.m_fieldOfView = 90;
    this.m_nearClippingPane = 1.0;
    this.m_farClippingPane = 1000.0;
    this.m_xMinFrustum = -1.0;
    this.m_xMaxFrustum = +1.0;
    this.m_yTopFrustum = -1.0;
    this.m_yBotFrustum = -1.0;

    this.m_MeshBoxA = null;
    this.m_MeshBoxB = null;
    this.m_MeshBoxC = null;
    this.m_MeshMap = null;

    this.m_mousePressed = false;
    this.m_xMousePrev = 0;
    this.m_yMousePrev = 0;
  }

  // Invoked after Angular initialize view
  ngAfterViewInit() {
    this.createThreeJsScene();
    this.createLight();
    this.createCamera();
    this.createMesh();
    this.startRendering();
    this.addControls();
  }
  private createThreeJsScene() {
    const ID_CANVAS = 'renderCanvas';
    this.m_canvas = <HTMLCanvasElement>document.getElementById(ID_CANVAS);

    this.m_scene = new THREE.Scene();
    // this.m_scene.add(new THREE.AxisHelper(200));
    // const loader = new THREE.ColladaLoader();
    // loader.load('assets/model/multimaterial.dae', this.onModelLoadingCompleted);

    const RENDER_BACK_COLOR = 0xdddddd;
    this.m_scene.background = new THREE.Color(RENDER_BACK_COLOR);
  }
  private createLight() {
    const lightA = new THREE.PointLight(0xffffff, 1, 1000);
    lightA.position.set(0, 0, 1.0);
    this.m_scene.add(lightA);

    const lightB = new THREE.PointLight(0xffffff, 1, 1000);
    lightB.position.set(0, 0, -1.0);
    this.m_scene.add(lightB);
  }
  private createCamera() {
    const aspectRatio = this.getAspectRatio();
    /*
    this.m_camera = new THREE.PerspectiveCamera(
      this.m_fieldOfView,
      aspectRatio,
      this.m_nearClippingPane,
      this.m_farClippingPane
    );
    */
    const SCENE_RANGE = 1.3;
    this.m_xMinFrustum = -SCENE_RANGE;
    this.m_xMaxFrustum = +SCENE_RANGE;
    this.m_yTopFrustum = +SCENE_RANGE;
    this.m_yBotFrustum = -SCENE_RANGE;
    this.m_camera = new THREE.OrthographicCamera(
      this.m_xMinFrustum,
      this.m_xMaxFrustum,
      this.m_yTopFrustum,
      this.m_yBotFrustum,
      this.m_nearClippingPane,
      this.m_farClippingPane
    );

    // Set position and look at (affect on initial 3 cubes appear)
    this.m_camera.position.x = 0;
    this.m_camera.position.y = 0;
    this.m_camera.position.z = 3;
  }

  private createMesh() {
    const BOX_SIZE = 0.2;
    const geometry = new THREE.BoxBufferGeometry(BOX_SIZE, BOX_SIZE, BOX_SIZE);

    const materialA = new THREE.MeshBasicMaterial( { color: new THREE.Color(0xff7722) } );
    this.m_MeshBoxA = new THREE.Mesh(geometry, materialA);
    this.m_scene.add(this.m_MeshBoxA);

    const materialB = new THREE.MeshBasicMaterial( { color: new THREE.Color(0x00ff77) } );
    this.m_MeshBoxB = new THREE.Mesh(geometry, materialB);
    this.m_MeshBoxB.position.x += BOX_SIZE + BOX_SIZE;
    this.m_scene.add(this.m_MeshBoxB);

    const materialC = new THREE.MeshBasicMaterial( { color: new THREE.Color(0x0077ff) } );
    this.m_MeshBoxC = new THREE.Mesh(geometry, materialC);
    this.m_MeshBoxC.position.x += BOX_SIZE + BOX_SIZE + BOX_SIZE + BOX_SIZE;
    this.m_scene.add(this.m_MeshBoxC);
  }

  private getAspectRatio(): number {
    const height = this.m_canvas.clientHeight;
    if (height === 0) {
        return 0;
    }
    return this.m_canvas.clientWidth / this.m_canvas.clientHeight;
  }
  private startRendering() {
    this.m_renderer = new THREE.WebGLRenderer({
        canvas: this.m_canvas,
        antialias: true
    });
    this.m_renderer.setPixelRatio(devicePixelRatio);
    this.m_renderer.setSize(this.m_canvas.clientWidth, this.m_canvas.clientHeight);

    this.m_renderer.shadowMap.enabled = true;
    this.m_renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.m_renderer.setClearColor(0xffffff, 1);
    this.m_renderer.autoClear = true;

    const component: SceneComponent = this;

    (function render() {
        // requestAnimationFrame(render);
        component.render();
    }());
  }
  public render() {
    this.m_renderer.render(this.m_scene, this.m_camera);
  }

  public addControls() {
  }

  private findAllObjects(pred: THREE.Object3D[], parent: THREE.Object3D) {
    // NOTE: Better to keep separate array of selected objects
    if (parent.children.length > 0) {
      parent.children.forEach((i) => {
        pred.push(i);
        this.findAllObjects(pred, i);
      });
    }
  }
  public onClickPlus() {
    this.m_xMinFrustum += STEP_CAMERA_ZOOM;
    this.m_xMaxFrustum -= STEP_CAMERA_ZOOM;
    this.m_yTopFrustum -= STEP_CAMERA_ZOOM;
    this.m_yBotFrustum += STEP_CAMERA_ZOOM;

    this.m_camera.left = this.m_xMinFrustum;
    this.m_camera.right = this.m_xMaxFrustum;
    this.m_camera.top = this.m_yTopFrustum;
    this.m_camera.bottom = this.m_yBotFrustum;
    this.m_camera.updateProjectionMatrix();
    this.render();
  }
  public onClickMinus() {
    this.m_xMinFrustum -= STEP_CAMERA_ZOOM;
    this.m_xMaxFrustum += STEP_CAMERA_ZOOM;
    this.m_yTopFrustum += STEP_CAMERA_ZOOM;
    this.m_yBotFrustum -= STEP_CAMERA_ZOOM;

    this.m_camera.left = this.m_xMinFrustum;
    this.m_camera.right = this.m_xMaxFrustum;
    this.m_camera.top = this.m_yTopFrustum;
    this.m_camera.bottom = this.m_yBotFrustum;
    this.m_camera.updateProjectionMatrix();
    this.render();
  }
  public onClickLeft() {
   this.m_camera.position.x -= STEP_CAMERA_PAN;
   this.render();
  }
  public onClickRight() {
   this.m_camera.position.x += STEP_CAMERA_PAN;
   this.render();
  }
  public onClickUp() {
   this.m_camera.position.y += STEP_CAMERA_PAN;
   this.render();
  }
  public onClickDown() {
   this.m_camera.position.y -= STEP_CAMERA_PAN;
   this.render();
  }


  public onMouseDown(event: MouseEvent) {
    this.m_mousePressed = true;
    // in [-1..+1]
    this.m_xMousePrev = +(event.clientX / this.m_renderer.domElement.clientWidth) * 2 - 1;
    this.m_yMousePrev = -(event.clientY / this.m_renderer.domElement.clientHeight) * 2 + 1;
    /*
    console.log('onMouseDown');
    event.preventDefault();

    // Example of mesh selection/pick:
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / this.m_renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = - (event.clientY / this.m_renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, this.m_camera);

    const obj: THREE.Object3D[] = [];
    this.findAllObjects(obj, this.m_scene);
    const intersects = raycaster.intersectObjects(obj);
    console.log('Scene has ' + obj.length + ' objects');
    console.log(intersects.length + ' intersected objects found');
    intersects.forEach((i) => {
        console.log(i.object); // do what you want to do with object
    });
    */
  }
  public onMouseMove(event: MouseEvent) {
    // console.log('onMouseMove');
    if (this.m_mousePressed) {
      const xMouse = +(event.clientX / this.m_renderer.domElement.clientWidth) * 2 - 1;
      const yMouse = -(event.clientY / this.m_renderer.domElement.clientHeight) * 2 + 1;
      const dx = xMouse - this.m_xMousePrev;
      const dy = yMouse - this.m_yMousePrev;
      this.m_camera.position.x -= dx;
      this.m_camera.position.y -= dy;
      this.render();
      this.m_xMousePrev = xMouse;
      this.m_yMousePrev = yMouse;
    } // if mouse pressed
  }

  public onMouseUp(event: MouseEvent) {
    console.log('onMouseUp');
    this.m_mousePressed = false;
  }

  // use loaded database from json file
  public createMeshFromDatabase(database: DatabaseComponent) {
    // remove old fake boxes
    if (this.m_MeshBoxA !== null) {
      this.m_scene.remove(this.m_MeshBoxA);
      this.m_scene.remove(this.m_MeshBoxB);
      this.m_scene.remove(this.m_MeshBoxC);
    }
    const numNodes = database.m_numNodes;
    const xBoxMin = database.m_database.bounds.xMin;
    const yBoxMin = database.m_database.bounds.yMin;
    const xBoxMax = database.m_database.bounds.xMax;
    const yBoxMax = database.m_database.bounds.yMax;
    // console.log(`createMeshFromDatabase. Box = ${xBoxMin}, ${yBoxMin}, ${xBoxMax}, ${yBoxMax}`);
    const X_SCENE_MIN = -1.0;
    const X_SCENE_MAX = +1.0;
    const Y_SCENE_MIN = -1.0;
    const Y_SCENE_MAX = +1.0;

    // create plane mesh for the whole scene
    //
    //   2----3
    //   |\   |
    //   | \  |
    //   |  \ |
    //   |   \|
    //   0----1
    //
    const geometryPlane = new THREE.Geometry();
    const v0 = new THREE.Vector3(X_SCENE_MIN, Y_SCENE_MIN, 0);
    const v1 = new THREE.Vector3(X_SCENE_MAX, Y_SCENE_MIN, 0);
    const v2 = new THREE.Vector3(X_SCENE_MIN, Y_SCENE_MAX, 0);
    const v3 = new THREE.Vector3(X_SCENE_MAX, Y_SCENE_MAX, 0);
    geometryPlane.vertices.push(v0);
    geometryPlane.vertices.push(v1);
    geometryPlane.vertices.push(v2);
    geometryPlane.vertices.push(v3);
    geometryPlane.faces.push(new THREE.Face3(0, 1, 1));
    geometryPlane.faces.push(new THREE.Face3(1, 3, 3));
    geometryPlane.faces.push(new THREE.Face3(3, 2, 2));
    geometryPlane.faces.push(new THREE.Face3(2, 0, 0));

    const materialPlane = new THREE.MeshBasicMaterial( { color: new THREE.Color(0xff22aa), wireframe: true } );
    const meshPlane = new THREE.Mesh(geometryPlane, materialPlane);
    this.m_scene.add(meshPlane);

    // create geo map
    const geometryMap = new THREE.Geometry();

    // add database vertices
    const xScale = 1.0 / (xBoxMax - xBoxMin);
    const yScale = 1.0 / (yBoxMax - yBoxMin);
    let i;
    for (i = 0; i < numNodes; i++) {
      const xSrc = database.m_nodes[i].x;
      const ySrc = database.m_nodes[i].y;
      const x = X_SCENE_MIN + (X_SCENE_MAX - X_SCENE_MIN) * (xSrc - xBoxMin) * xScale;
      const y = Y_SCENE_MIN + (Y_SCENE_MAX - Y_SCENE_MIN) * (ySrc - yBoxMin) * yScale;
      const v = new THREE.Vector3(x, y, 0.0);
      geometryMap.vertices.push(v);
      // debug
      // if (i === 0) {
      //   console.log(`geometryMap. vert[0] = ${x}, {y}`);
      // }
    }
    // add ways
    const INVALID = -1;
    let numWaysShow = 0;
    let w;
    const numWaysAll = database.m_database.ways.length;
    for (w = 0; w < numWaysAll; w++) {
      const way = database.m_database.ways[w];
      if (way.s === INVALID) {
        numWaysShow++;
        const numIndices = way.n;
        for (let j = 0; j < numIndices - 1; j++) {
          const indA = way.d[j + 0];
          const indB = way.d[j + 1];
          const face = new THREE.Face3(indA, indB, indB);
          geometryMap.faces.push(face);
        } // for (j)
      } // if
    } // for

    const materialMap = new THREE.MeshBasicMaterial( { color: new THREE.Color(0x22822), wireframe: true } );
    this.m_MeshMap = new THREE.Mesh(geometryMap, materialMap);
    this.m_scene.add(this.m_MeshMap);
    console.log(`geometryMap. Map mesh added with ${numWaysShow} ways from ${numWaysAll} orig ways`);

    // redraw scene
    this.render();
  }

}
