// ********************************************************
// Imports
// ********************************************************

import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

// local imports
import { SceneComponent } from './scene/scene.component';
import { DatabaseComponent } from './database/database.component';

// ********************************************************
// Const
// ********************************************************

const CAM_ZOOM_STEP = 0.4;
const CAM_PAN_STEP = 0.1;

// ********************************************************
// Class
// ********************************************************


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit {
  // *****************************
  // Data
  // *****************************
  m_title: string;

  @ViewChild(SceneComponent)
  m_scene: SceneComponent;

  @ViewChild(DatabaseComponent)
  m_database: DatabaseComponent;

  // m_database: DatabaseComponent;

  // *****************************
  // Methods
  // *****************************

  constructor() {
    this.m_title = 'Россия. Санкт-Петербург. Предсказание цены недвижимости';
    this.m_scene = null;
    this.m_database = null;
  }


  ngAfterViewInit() {
    // here we have acess to this.m_scene
    // and this.m_database
  }
  ngOnInit() {
    // this.m_scene.createMeshFromDatabase(this.m_database);
  }

  //  buttons handlers
  onClickLoadMap() {
    this.m_scene.createMeshFromDatabase(this.m_database);
  }
  onClickPlus() {
    // console.log('onClickPlus');
    this.m_scene.onClickPlus();
  }
  onClickMinus() {
    // console.log('onClickMinus');
    this.m_scene.onClickMinus();
  }
  onClickUp() {
    // console.log('onClickUp');
    this.m_scene.onClickUp();
  }
  onClickDown() {
    // console.log('onClickDown');
    this.m_scene.onClickDown();
  }
  onClickLeft() {
    // console.log('onClickLeft');
    this.m_scene.onClickLeft();
  }
  onClickRight() {
    // console.log('onClickRight');
    this.m_scene.onClickRight();
  }

}
