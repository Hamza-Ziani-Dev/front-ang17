import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-speech-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './speech-button.component.html',
  styleUrl: './speech-button.component.scss'
})
export class SpeechButtonComponent {
    @Output() toggel = new EventEmitter();
    @Input() isLisetning : boolean ;
    @Input() onListentext = '';
    @Input() onNotListentext = '';
    constructor() { }

    ngOnInit(): void {
      this.isLisetning ?? false;
    }

    clicked()
    { const isListen = (this.isLisetning =! this.isLisetning)
      this.toggel.emit(isListen);
    }
}
