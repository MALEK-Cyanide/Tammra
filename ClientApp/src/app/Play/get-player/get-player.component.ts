import { Component, OnInit } from '@angular/core';
import { PlayService } from '../play.service';

@Component({
  selector: 'app-get-player',
  standalone: true,
  imports: [],
  templateUrl: './get-player.component.html',
  styleUrl: './get-player.component.css'
})
export class GetPlayerComponent implements OnInit{
  constructor(public playService : PlayService){}

  ngOnInit(): void {
  }

}
