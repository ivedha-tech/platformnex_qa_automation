import * as fs from 'fs';
import * as yaml from 'js-yaml';

export interface TestData {
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
    }
    error: {
      expectedErrorMessageWrongMail: string;
      expectedErrorMessageWrongPassword: string;
      expectedErrorMessageEmpty: string;

    }
  };
  finops: {
    "gcp-projectid": string;
    "gcp-dataset-id": string;
    "gcp-table-id": string;
  };
}

export const loadYamlData = (filePath: string): TestData => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return yaml.load(fileContent) as TestData;
};