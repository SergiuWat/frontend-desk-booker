import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  constructor(private http: HttpClient) { }

  uploadImage(filePath: string) {
    return this.readFileContent(filePath).then(fileContent => {
      const formData = new FormData();
      formData.append('image', fileContent);

      return this.http.post<any>('YOUR_API_ENDPOINT', formData);
    });
  }
  
  readFileContent(filePath: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        resolve(new Blob([fileReader.result as ArrayBuffer]));
      };
      fileReader.onerror = error => {
        reject(error);
      };
      fileReader.readAsArrayBuffer(new File([filePath], 'image'));
    });
  }
}
