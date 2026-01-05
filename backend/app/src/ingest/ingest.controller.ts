import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IngestService } from './ingest.service';

@UseGuards(JwtAuthGuard)
@Controller('ingest')
export class IngestController {
  constructor(private readonly ingestService: IngestService) {}

  @Post('pdf')
  @UseInterceptors(FileInterceptor('file'))
  ingestPdf(@UploadedFile() file?: any) {
    // Nota: si no llega archivo, el servicio hará fallback al PDF local (según implementación).
    if (file && !file.buffer) {
      throw new BadRequestException('Archivo recibido, pero sin buffer. Revise configuración de multer.');
    }
    return this.ingestService.ingestPdf(file?.buffer);
  }
}
