import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';

// Function to replace string in file
function replaceStringInFile(
  filePath: string,
  items: Array<{ searchString: string; replaceString: string }>,
) {
  try {
    // Read the file contents
    let fileContent = readFileSync(filePath, 'utf-8');

    items.forEach((item) => {
      fileContent = fileContent.replaceAll(item.searchString, item.replaceString);
    });

    // Write the updated content back to the file
    writeFileSync(filePath, fileContent, 'utf-8');

    console.log('String replacement completed successfully.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Example usage
const filePath = 'dist/_worker.js';

replaceStringInFile(filePath, [
  { searchString: 'process.env.ENV', replaceString: `"${process.env.ENV}"` },
  { searchString: 'process.env.DB_URL', replaceString: `"${process.env.DB_URL}"` },
]);

const foldersPath = ['./src/server/plugins/comparison'];

foldersPath.forEach(async (folder) => {
  writeFileSync(
    path.join(folder, 'index.ts'),
    `export default {
  executor: '',
  html: '',
  css: '',
  js: '',
};`,
  );
});
