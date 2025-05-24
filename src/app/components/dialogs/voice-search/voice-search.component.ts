import { AfterViewInit, Component, EventEmitter, OnDestroy,OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { SpeechRecognitionLang, SpeechRecognitionMaxAlternatives, SpeechRecognitionService, SpeechRecognitionGrammars, SpeechRecognitionContinuous } from '@kamiazya/ngx-speech-recognition';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-voice-search',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,FormsModule],
  templateUrl: './voice-search.component.html',
  styleUrl: './voice-search.component.scss',
//   providers: [
//     SpeechRecognitionService,
//     {
//       provide: SpeechRecognitionLang,
//       useValue: 'fr-FR',  // Set language to French
//     },
//     {
//       provide: SpeechRecognitionMaxAlternatives,
//       useValue: 1,  // Set maximum alternatives to 1
//     },
//     {
//       provide: SpeechRecognitionContinuous,
//       useValue: false,  // Set continuous flag to false
//     },
//     {
//       provide: SpeechRecognitionGrammars,
//       useValue: [],  // Provide grammars (can be an empty array or actual grammars)
//     },
//     // Do not provide ApplicationRef here, as Angular will automatically inject it
//     {
//       provide: 'audiostartHandler',
//       useValue: (ev: Event) => console.log('Audio start:', ev)
//     },
//     {
//       provide: 'soundstartHandler',
//       useValue: (ev: Event) => console.log('Sound start:', ev)
//     },
//     {
//       provide: 'speechstartHandler',
//       useValue: (ev: Event) => console.log('Speech start:', ev)
//     },
//     {
//       provide: 'speechendHandler',
//       useValue: (ev: Event) => console.log('Speech end:', ev)
//     },
//     {
//       provide: 'soundendHandler',
//       useValue: (ev: Event) => console.log('Sound end:', ev)
//     },
//     {
//       provide: 'audioendHandler',
//       useValue: (ev: Event) => console.log('Audio end:', ev)
//     },
    
//     {
//       provide: 'errorHandler',
//       useValue: (ev: any) => console.error('Error:', ev)
//     },
//     {
//       provide: 'startHandler',
//       useValue: (ev: Event) => console.log('Start:', ev)
//     },
//     {
//       provide: 'endHandler',
//       useValue: (ev: Event) => console.log('End:', ev)
//     },
//   ]

})
export class VoiceSearchComponent implements OnInit,AfterViewInit,OnDestroy {
  
    @Output() onStateChange  = new EventEmitter<"start"|"end"|"sStart"|"sEnd">();
    @Output() onResult  = new EventEmitter<string>();
    text=""
    
    constructor(
        // public speechReco : SpeechRecognitionService
    ) { }
    ngOnDestroy(): void {
      // this.speechReco.stop();
  
    }
    ngAfterViewInit(): void {
  
      // this.speechReco.start();
      this.text="Parlez maintenant..."
    }
  
    ngOnInit(): void {
      this.text="Parlez maintenant..."
  
    //   this.speechReco.onstart = (e) => {
    //     this.onStateChange.emit("start")
    //   };
     
    //   this.speechReco.onend = (e) => {
    //     this.onStateChange.emit("end")
        
    //   };
      
    //   this.speechReco.onresult = (e) => {
  
    //     let res = e.results[0].item(0).transcript
    //     this.text=res;
    //     this.onResult.emit(res)
    //   };
    //   this.speechReco.onspeechstart = (e)=> {
    //     this.onStateChange.emit("sStart")
    //     const val = "Documania vous écoute...";
    //     this.text=val;
    //   }
      
    //   this.speechReco.onspeechend = (e)=> {
    //     this.onStateChange.emit("sEnd")
    //   }
    }
    
  }
