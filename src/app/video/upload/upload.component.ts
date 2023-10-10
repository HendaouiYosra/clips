import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
import { v4 as uuid } from 'uuid';
import { last, switchMap } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy {
  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipsService: ClipService,
    private router: Router
  ) {
    auth.user.subscribe(user => this.user = user);
  }

  percentage: number = 0;
  showAlert: boolean = false;
  alertColor: string = 'blue';
  alertText: string = 'Please wait, your clip is being uploaded';
  inSubmission: boolean = false;
  showPercentage: boolean = false;
  user: firebase.User | null = null;
  isDragover: boolean = false;
  file: File | null = null;
  nextStep: boolean = false; // Used to show the form after putting the file
  task?: AngularFireUploadTask;

  title = new FormControl('', [Validators.required, Validators.minLength(3)]);
  uploadForm = new FormGroup({
    title: this.title
  });

  ngOnDestroy(): void {
    this.task?.cancel(); // Cancel the request in case the user navigates to another page
  }

  storeFile($event: Event) {
    this.isDragover = false;
    this.file = ($event as DragEvent).dataTransfer
      ? ($event as DragEvent).dataTransfer?.files.item(0) ?? null
      : ($event.target as HTMLInputElement).files?.item(0) ?? null;
    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }

    this.nextStep = true;
    this.title.setValue(
      this.file.name.replace(/\.[^/.]+$/, '') // The title input will have the name of the file as an initial value
    );
  }

  uploadFile() {
    this.uploadForm.disable(); // Disable the form to prevent changes while the file is being uploaded
    this.showPercentage = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertText = 'Please wait! Your clip is being uploaded';
    this.inSubmission = true;
    const clipFileName = uuid(); // Generate a unique name for the file
    const clipPath = `clips/${clipFileName}.mp4`;
    this.task = this.storage.upload(clipPath, this.file); // Returns an observable containing the upload details
    const clipRef = this.storage.ref(clipPath); // Create a reference to the file

    this.task.percentageChanges().subscribe(progress => (this.percentage = progress as number)); // Subscribe to the observable

    this.task.snapshotChanges().pipe(
      last(), // Subscribe to the last observable
      switchMap(() => clipRef.getDownloadURL()) // Get the download URL and switch to another observable
    ).subscribe({
      next: async (url) => {
        const clip = {
          uid: this.user?.uid as string, // ID of the user who uploaded the video
          displayName: this.user?.displayName as string,
          title: this.title.value as string,
          fileName: `${clipFileName}.mp4`,
          url // Used as a reference to the file to access it when played
        };

        // Call your service to create the clip (you need to implement this)
        const clipDocRef = await this.clipsService.createClip(clip);
        console.log(clip);

        this.alertColor = 'green';
        this.alertText = 'Success! Your clip is ready to share with the world';
        this.showPercentage = false;

        // Use router to navigate to the ClipComponent with the clipDocRef.id as a parameter
        setTimeout(() => {
          this.router.navigate(['clip', clipDocRef.id]);
        }, 1000);
      },
      error: (error) => {
        this.uploadForm.enable(); // Allow the user to make changes before trying again
        this.alertColor = 'red';
        this.alertText = 'Upload failed, please try again';
        this.showPercentage = false;
        this.inSubmission = false;
        console.error(error);
      }
    });
  }
}
