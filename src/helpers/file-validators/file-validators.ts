import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { loadEsm } from 'load-esm';
import { fileTypeError } from '../../common/constants/error-constants';

export function FileTypeMagicNumberValidator(): PipeTransform {
  return new FileTypeMagicNumberValidatorPipe();
}

@Injectable()
export class FileTypeMagicNumberValidatorPipe implements PipeTransform {
  private readonly allowedFileTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
  ];
  fileTypeFunction;

  // This dynamic import has to be done because it is a pure ESM module, and we're using commonJS
  async loadFileTypeModule() {
    if (this.fileTypeFunction === undefined) {
      const { fileTypeFromBuffer } =
        await loadEsm<typeof import('file-type')>('file-type');
      this.fileTypeFunction = fileTypeFromBuffer;
    }
  }

  /**
   * Indicates if this file should be considered valid.
   * @param file the file from the request object
   */
  async transform(file: Express.Multer.File): Promise<Express.Multer.File> {
    await this.loadFileTypeModule();
    const fileType = await this.fileTypeFunction(file.buffer);
    if (
      fileType === undefined ||
      !this.allowedFileTypes.includes(fileType.mime)
    ) {
      throw new BadRequestException([fileTypeError]);
    }
    return file;
  }
}
