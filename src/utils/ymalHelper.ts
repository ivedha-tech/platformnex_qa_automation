import * as fs from 'fs';
import * as yaml from 'js-yaml';

export interface TestData {
  resource: any;
  api: any;
  application: any;
  component: any;

  login: {
    valid: {
      email: string;
      password: string;
    };
    invalid: {
      invalidusername: string;
      invalidpassword: string;
    };
    empty: {
      emptyusername: string;
      emptypassword: string;
    };
    error: {
      expectedErrorMessageWrongMail: string;
      expectedErrorMessageWrongPassword: string;
      expectedErrorMessageEmpty: string;
    };
  };

  quickstart: {
    basicinfo: {
      name: string;
      description: string;
      owner: string;
      system: string;
    };
    frontend: {
      repoOwner: string;
      repoName: string;
      serviceName: string;
      serviceDescription: string;
    };
    backend: {
      repoOwner: string;
      repoName: string;
      serviceName: string;
      serviceDescription: string;
      dependOnService: string;
      dbServiceName: string;
      dbName: string;
      dbPassword: string;
    };
  
    infrastructure: {
      project: string;
    };
  };
} // ✅ Close the interface here

// Function to load YAML data from a file
export function loadYamlData(filePath: string): TestData {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(fileContents) as TestData;
    return data;
  } catch (e) {
    console.error(`Error loading YAML file: ${e}`);
    throw e;
  }
}
