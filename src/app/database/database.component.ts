// ********************************************************
// Imports
// ********************************************************

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Vec2 } from '../core/vec2';
import { DatabaseDescr } from '../core/db';

// import { BoundsComponent } from '../bounds/bounds.component';
// import { MapWayComponent } from '../mapway/mapway.component';

import { DatabaseService } from './database.service';

// ********************************************************
// Const
// ********************************************************



// ********************************************************
// Methods
// ********************************************************

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  providers: [ DatabaseService ],
  styleUrls: ['./database.component.css']
})


export class DatabaseComponent implements OnInit {

  // ********************************************************
  // Const
  // ********************************************************

  static readonly MAX_EMULATOR_DATA_SIZE = 353;

  // ********************************************************
  // Data
  // ********************************************************

  public m_database: DatabaseDescr;

  public m_numNodes: number;
  public m_nodes: Vec2[];

  // ********************************************************
  // Methods
  // ********************************************************

  constructor(private databaseService: DatabaseService) {
    this.m_database = null;
    this.m_numNodes = 0;
    this.m_nodes = [];
    const BAD_VALUE = 555;
    const node = new Vec2(BAD_VALUE, BAD_VALUE);
    this.m_nodes.push(node);
  }

  ngOnInit() {
    this.databaseService.getConfig().subscribe(data => {
      // console.log('DB. osm josn data received...');
      this.m_database = data;
      // console.log(`DB. ngOnInit. Read json. Bounds = ${this.m_database.bounds.xMin},${this.m_database.bounds.yMin}`);

      this.m_numNodes = Math.floor(this.m_database.nodes.length / 2);
      // console.log(`DB. ngOnInit. Read json. numNodes = ${this.m_numNodes}`);
      this.m_nodes = [];
      const NUM_COORDS = 2;
      let i;
      let j = 0;
      for (i = 0; i < this.m_numNodes; i++, j += NUM_COORDS) {
        const x = this.m_database.nodes[j + 0];
        const y = this.m_database.nodes[j + 1];
        const node = new Vec2();
        node.x = x; node.y = y;
        this.m_nodes.push(node);
      }
      // log first streets
      const strStreet = this.m_database.streets[0];
      console.log(`DB. Read json completed. street[0] = ${strStreet}`);
    }, err => {
      console.log(`DB. ngOnInit. Read Json error = ${err}`);
    });

  }

}

