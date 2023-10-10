import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { switchMap } from 'rxjs/operators'; // Import switchMap
import IClip from '../models/clip.model';
import videojs from 'video.js';

import 'video.js/dist/video-js.css';


@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css']
})
export class ClipComponent implements OnInit {
  clipId: string = '';
  clip: IClip | null = null;
  videoSrc: string = '';

  constructor(
    private route: ActivatedRoute,
    private storage: AngularFireStorage,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {  this.initVideoPlayer();
    this.route.params.pipe(
      switchMap(params => {
        this.clipId = params['id'];
        return this.firestore.doc<IClip>(`clips/${this.clipId}`).valueChanges();
      })
    ).subscribe(clip => {
      if (clip) {
        this.clip = clip;
        const clipPath = `clips/${clip.fileName}`;

        // Get the download URL of the clip from Firebase Storage
        this.storage.ref(clipPath).getDownloadURL().subscribe(url => {
          this.videoSrc = url;
          console.log(url)
        });
      } else {
        // Handle the case when the clip is not found
        console.error('Clip not found.');
      }
    });
  }
  handleVideoError(){console.log('perrrorrrr')}
  initVideoPlayer() {
    // Initialize the video player with options
    const player = videojs('clip', {
      controls: true, // Show video controls
      fluid: true, // Make the video player responsive
      sources: [
        {
          src: this.videoSrc,
          type: 'video/mp4', // Adjust this based on your video format
        },
      ],
    });
}}
