import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

export const parseCSV = async (filename: string) => {
  const csvFilePath = path.resolve(__dirname, '..', '..', 'tmp', filename);

  const readCSVStream = fs.createReadStream(csvFilePath);

  const parseStream = csvParse({
    from_line: 2,
    ltrim: true,
    rtrim: true,
  });

  const parseCSV = readCSVStream.pipe(parseStream);

  const lines: any[] = [];

  parseCSV.on('data', line => {
    lines.push(line);
  });

  await new Promise(resolve => {
    parseCSV.on('end', resolve);
  });
  return lines;
};
