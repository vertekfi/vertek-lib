const createCsvWriter = require('csv-writer').createObjectCsvWriter;

export interface CsvHeader {
  id: string;
  title: string;
}

class CsvService {
  constructor() {}

  async write(outputPath: string, headers: CsvHeader[], data: any[]) {
    try {
      const csvWriter = createCsvWriter({
        path: outputPath,
        header: headers,
      });
      await csvWriter.writeRecords(data);
    } catch (error) {
      throw error;
    }
  }
}

export const csvService = new CsvService();
