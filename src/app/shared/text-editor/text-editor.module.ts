import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
// import { QuillModule } from 'ngx-quill';

import { EditorTextDialogComponent } from 'app/components/dialogs/editor-text-dialog/editor-text-dialog.component'; // Ensure this path is correct
import { CloseConfirmationComponent } from 'app/components/dialogs/close-confirmation/close-confirmation.component';
import { TexteditorService } from 'app/components/services/texteditor.service';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { SaveModelDialogComponent } from 'app/components/dialogs/save-model-dialog/save-model-dialog.component';
import { LoadModelDialogComponent } from 'app/components/dialogs/load-model-dialog/load-model-dialog.component';
import { TexteditorComponentComponent } from 'app/components/texteditor/texteditor-component/texteditor-component.component';
import { MyTemplatesComponent } from 'app/components/preferences/my-templates/my-templates.component';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    AngularEditorModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModuleModule,
    // QuillModule.forRoot({
    //   suppressGlobalRegisterWarning: true
    // }),
    NgxPaginationModule,
    // Import standalone components directly here
    EditorTextDialogComponent,
    TexteditorComponentComponent,
    CloseConfirmationComponent,
    SaveModelDialogComponent,
    LoadModelDialogComponent,
    MyTemplatesComponent
    // LoadModelComponent,
    // SaveModelComponent
  ],
  providers: [
    TexteditorService,
  ],
  exports: [
    CloseConfirmationComponent,
    SaveModelDialogComponent,
    LoadModelDialogComponent,
    MyTemplatesComponent,
    // SaveModelComponent,
    // LoadModelComponent,
    MaterialModuleModule,
    EditorTextDialogComponent,
    TexteditorComponentComponent
  ]
})
export class TexteditorModule { }
