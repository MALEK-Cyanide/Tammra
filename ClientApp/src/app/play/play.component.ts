import { Component, OnInit } from '@angular/core';
import { PlayService } from './play.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './play.component.html',
  styleUrl: './play.component.css'
})
export class PlayComponent implements OnInit{
  message: string | undefined;
  constructor(private playService : PlayService){}

  ngOnInit(): void {
    this.playService.getPlayers().subscribe({
      next: (res : any) => this.message = res.value.message,
      error:error => console.log(error)
    })
  }

}
