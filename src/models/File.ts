export interface UploadedFileResponse {
    data_type: string;
    extension: string;
    file: string;
    type: string;
    meta: {
      original_name: string;
      size: number;
      mime_type: string;
    };
}
export interface FileUploadEvent {
    files: FileToUpload[];
}

export interface FileToUpload {
    file: File;
    index: number;
}