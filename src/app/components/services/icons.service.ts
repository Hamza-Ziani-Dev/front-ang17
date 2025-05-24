import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class IconsService {
  constructor() {}

  checkMimeType(doc) {
    const supportedMimes = environment.supportedMimeTypes.split(' ');
    return supportedMimes.indexOf(doc);
  }

  getFontAwesomeIconFromMIME(mimeType: string): string {
    const icon_classes: { [key: string]: string } = {
      // Media
      image: 'fa fa-file-image-o text-blue-500',
      audio: 'fa fa-file-audio-o text-purple-500',
      video: 'fa fa-file-video-o text-indigo-500',
  
      // Documents
      'application/pdf': 'fa fa-file-pdf-o text-red-600',
      'application/msword': 'fa fa-file-word-o text-blue-600',
      'application/vnd.ms-word': 'fa fa-file-word-o text-blue-600',
      'application/vnd.oasis.opendocument.text': 'fa fa-file-word-o text-blue-600',
      'application/vnd.openxmlformats-officedocument.wordprocessingml':
        'fa fa-file-word-o text-blue-600',
  
      'application/vnd.ms-excel': 'fa fa-file-excel-o text-green-600',
      'application/vnd.openxmlformats-officedocument.spreadsheetml':
        'fa fa-file-excel-o text-green-600',
      'application/vnd.oasis.opendocument.spreadsheet': 'fa fa-file-excel-o text-green-600',
  
      'application/vnd.ms-powerpoint': 'fa fa-file-powerpoint-o text-orange-500',
      'application/vnd.openxmlformats-officedocument.presentationml':
        'fa fa-file-powerpoint-o text-orange-500',
      'application/vnd.oasis.opendocument.presentation':
        'fa fa-file-powerpoint-o text-orange-500',
  
      'text/plain': 'fa fa-file-text-o text-gray-600',
      'text/html': 'fa fa-file-code-o text-teal-500',
      'application/json': 'fa fa-file-code-o text-teal-500',
  
      // Archives
      'application/gzip': 'fa fa-file-archive-o text-yellow-500',
      'application/zip': 'fa fa-file-archive-o text-yellow-500',
    };
  
    if (!mimeType || mimeType === 'null') {
      return 'fa fa-file text-gray-400';
    }
  
    for (const key in icon_classes) {
      if (icon_classes.hasOwnProperty(key) && mimeType.startsWith(key)) {
        return icon_classes[key];
      }
    }
  
    return 'fa fa-file-alt text-gray-400';
  }
  
}
