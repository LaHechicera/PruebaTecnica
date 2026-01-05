import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as fs from 'fs';
import * as path from 'path';

import { Record } from '../records/record.entity';
import { NormalizedRecord } from './pdf.types';

@Injectable()
export class IngestService {
  private readonly logger = new Logger(IngestService.name);

  constructor(
    @InjectRepository(Record)
    private readonly recordsRepo: Repository<Record>,
  ) {}

  async ingestPdf(fileBuffer?: Buffer): Promise<{ inserted: number; updated: number; total: number }> {
    // 1) Ruta del PDF: Asegúrate de que apunta a /data/data.pdf fuera de /backend/app
    const pdfPath = path.resolve(process.cwd(), '..', '..', 'data', 'data.pdf');

    try {
      if (!fileBuffer) {
        if (!fs.existsSync(pdfPath)) {
          this.logger.error(`Archivo no encontrado en la ruta calculada: ${pdfPath}`);
          throw new Error(`No se encontró el archivo PDF en: ${pdfPath}`);
        }
        fileBuffer = fs.readFileSync(pdfPath);
      }

      // 2) PDF-PARSE v2/v3: se usa la clase PDFParse (no una función)
      // Nota: Eliminé la función loadPdfParseFn() porque estaba orientada a "pdf-parse función" (v1)
      // y en su proyecto realmente se está usando PDFParse (clase).
      const { PDFParse } = require('pdf-parse');

      // 3) Parseamos el PDF desde el Buffer
      const parser = new PDFParse({ data: fileBuffer });
      const result = await parser.getText();
      await parser.destroy();

      const data = { text: result.text };

      // 4) Convertimos el texto del PDF a registros normalizados
      const normalized = this.parsePdfText(data.text);

      let inserted = 0;
      let updated = 0;

      // 5) Guardado en Laragon (MySQL)
      for (const item of normalized) {
        const existing = await this.recordsRepo.findOne({
          where: { sourceId: item.sourceId },
        });

        if (!existing) {
          const entity = this.recordsRepo.create(item);
          await this.recordsRepo.save(entity);
          inserted++;
        } else {
          // Actualización si ya existe (Idempotencia)
          existing.date = item.date;
          existing.category = item.category;
          existing.amount = item.amount;
          existing.status = item.status;
          existing.description = item.description ?? null;
          await this.recordsRepo.save(existing);
          updated++;
        }
      }

      return { inserted, updated, total: normalized.length };
    } catch (error: any) {
      this.logger.error(`Error durante la ingesta: ${error?.message}`);
      // Mejora: si hay stack, lo dejamos en logs para depurar el 500 real
      if (error?.stack) this.logger.error(error.stack);
      throw error;
    }
  }

  // --- Funciones de Normalización ---

  private parsePdfText(text: string): NormalizedRecord[] {
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    // Debug temporal (puede quitarlo cuando ya esté estable)
    this.logger.log(`Líneas detectadas: ${lines.length}`);
    this.logger.log(`Primeras 40 líneas:\n${lines.slice(0, 40).join('\n')}`);

    const records: NormalizedRecord[] = [];

    // En este PDF, cada registro viene en UNA sola línea:
    // INV-2025-001 11-10-2025 Servicios $1.666 cancelado Prestación de servicio
    const rowRegex =
      /^(INV-\d{4}-\d{3,})\s+(\d{2}-\d{2}-\d{4})\s+([A-Za-zÁÉÍÓÚáéíóúÑñ]+)\s+(\$?[\d.]+(?:,\d+)?)\s+([a-zA-ZÁÉÍÓÚáéíóúÑñ]+)\s*(.*)$/;

    for (const line of lines) {
      // Saltar encabezados y separadores típicos
      if (
        line.toLowerCase().startsWith('reporte de transacciones') ||
        line.toLowerCase().startsWith('source id') ||
        line.startsWith('--') // ej: -- 1 of 7 --
      ) {
        continue;
      }

      const match = line.match(rowRegex);
      if (!match) {
        // Si desea depurar líneas que no calzan, descomente:
        // this.logger.debug(`Línea ignorada (no calza): ${line}`);
        continue;
      }

      const sourceId = match[1];
      const dateRaw = match[2];
      const categoryRaw = match[3];
      const amountRaw = match[4];
      const statusRaw = match[5];
      const descriptionRaw = (match[6] ?? '').trim();

      records.push({
        sourceId,
        date: this.normalizeDate(dateRaw),
        category: this.normalizeCategory(categoryRaw),
        amount: this.normalizeAmount(amountRaw),
        status: this.normalizeStatus(statusRaw),
        description: descriptionRaw.length > 0 ? descriptionRaw : undefined,
      });
    }

    if (records.length === 0) {
      this.logger.warn('No se pudieron parsear registros desde el texto del PDF. Revise el patrón de filas.');
    }

    return records;
  }

  private normalizeDate(value: string): string {
    const v = value.replace(/\//g, '-');
    const parts = v.split('-');
    if (parts.length === 3) {
      // Entrada DD-MM-YYYY -> Salida YYYY-MM-DD
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return new Date().toISOString().split('T')[0];
  }

  private normalizeAmount(value: string): number {
    // Elimina todo lo que no sea número, punto, coma o signo negativo
    let v = value.replace(/[^\d,.\-]/g, '');
    // Si hay puntos de miles, los eliminamos
    v = v.replace(/\./g, '');
    // Cambiamos coma decimal por punto
    v = v.replace(/,/g, '.');
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  private normalizeStatus(value: string): string {
    return value.trim().toLowerCase();
  }

  private normalizeCategory(value: string): string {
    const v = value.trim();
    return v.length > 0 ? v[0].toUpperCase() + v.slice(1).toLowerCase() : v;
  }
}
