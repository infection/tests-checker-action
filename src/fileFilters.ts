import {minimatch} from 'minimatch';

export type File = {
  filename: string;
};

export function getTouchedSourceFilesRequireTests(files: File[], fileExtensions: string[]): File[] {
  return files.filter(file => {
    return fileExtensions.find((fileExtension: string) => {
      return file.filename.endsWith(fileExtension);
    });
  });
}

export function getTouchedTestFiles(files: File[], testDir: string, testPattern: string): File[] {
  let filtered: File[] = [];

  if (testDir) {
    filtered = files.filter(file => {
      return file.filename.startsWith(`${testDir}/`);
    });
  }
  if (testPattern) {
    filtered = filtered.concat(
      files.filter(file => {
        return minimatch(file.filename, testPattern);
      })
    );
  }
  return filtered;
}
