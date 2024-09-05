import * as fs from 'fs/promises';
import * as path from 'path';

async function updateIndexFile(folderPath: string): Promise<void> {
  try {
    const files: string[] = await fs.readdir(folderPath);

    const contents = {
      executor: '',
      html: '',
      css: '',
      js: '',
    };

    for (const file of files) {
      const filePath: string = path.join(folderPath, file);

      if (file.endsWith('.executor.js')) {
        const fileContent: string = await fs.readFile(filePath, 'utf8');
        contents.executor = fileContent.replaceAll('`', '\\`');
      } else if (file.endsWith('.node.html')) {
        const fileContent: string = await fs.readFile(filePath, 'utf8');
        contents.html = fileContent.replaceAll('`', '\\`');
      } else if (file.endsWith('.node.css')) {
        const fileContent: string = await fs.readFile(filePath, 'utf8');
        contents.css = fileContent.replaceAll('`', '\\`');
      } else if (file.endsWith('.node.js')) {
        const fileContent: string = await fs.readFile(filePath, 'utf8');
        contents.js = fileContent.replaceAll('`', '\`');
      }
    }

    const indexPath: string = path.join(folderPath, 'index.ts');
    const indexContent: string = `export default {
  executor: \`${contents.executor.replace(/`/g, '\\`')}\`,
  html: \`${contents.html.replace(/`/g, '\\`')}\`,
  css: \`${contents.css.replace(/`/g, '\\`')}\`,
  js: \`${contents.js.replace(/`/g, '\\`')}\`,
};
`;

    await fs.writeFile(indexPath, indexContent);
    console.log('index.ts has been updated successfully.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

const foldersPath = ['./src/server/plugins/comparison'];

foldersPath.forEach((folder) => {
  updateIndexFile(folder);
});
