import path from "path";

export default class PackageInfo {
  packageName: string;

  constructor(packageName: string) {
    this.packageName = packageName;
  }

  get realpathToJsonFile() {
    return require.resolve(this.packageName + '/package.json', {paths: [process.cwd()]});
  }

  get realpathToPackage() {
    return path.dirname(this.realpathToJsonFile);
  }

  get packageJson() {
    return require(this.realpathToJsonFile)
  }
}
