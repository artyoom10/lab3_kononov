import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoading: boolean = true;

  ngOnInit() {
      setTimeout(() => {
          this.isLoading = false;
      }, 3500);
  }
}

