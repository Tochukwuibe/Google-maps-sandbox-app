import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { VideosProvider } from '../../providers/videos/videos';


@Component({
  selector: 'app-video',
  templateUrl: 'app-video.html'
})
export class AppVideoComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() videoDoc: any;

  @ViewChild('video') videoELe: ElementRef;

  private video: HTMLVideoElement;
  private sub: Subscription;

  constructor(
    private videos: VideosProvider
  ) {
    console.log('Hello AppVideoComponent Component'); 
  }

  ngOnInit() {
    this.video = this.videoELe.nativeElement;
    this.video.load();
  }



  ngAfterViewInit() {
    this.sub = this.videos.startPlaying
    .subscribe(id => {
      if(id === this.videoDoc.id) {
        this.video.play();
      } else {
        this.video.pause();
      }
    })
  }




  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
