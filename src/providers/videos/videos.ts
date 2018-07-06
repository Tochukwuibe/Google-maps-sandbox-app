import { Subject } from 'rxjs/Subject';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class VideosProvider {

  public startPlaying = new Subject<string>();
  public endedPlaying = new Subject<number>()

  constructor() {
    console.log('Hello VideosProvider Provider');
  }

}
