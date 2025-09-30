import * as fs from "fs";
import * as yaml from "js-yaml";

export interface TestData {
  devops: {
    codeQualityCards: any;
    componentName: any;
    description: any;
    owner: any;
    type: any;
    environment: any;
    providerOption: any;
    repoUrl: any;
    gcpProjectID: any;
    expected: {
      sonarMissingHeading: any;
      sonarSetupInProgressHeading: any;
      prTitlePrefix: any;
      codeQualityCards: any;
    };
  };
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

  jira: {
    search: {
      byId: string;
      bySummary: string;
    };
    filters: {
      project: string;
      epic: string;
      sprint: string;
      status: string;
    };
  };
  cloudops: {
    resource: {
      name: string;
    };
    database?: {
      instanceName: string;
      version: string;
      dbName: string;
      username: string;
      password: string;
    };
    gcp?: {
      projectId: string;
    };
    finops: {
      gcpprojectid: string;
      gcpdatasetid: string;
      gcptableid: string;
  };
};

// Function to load YAML data from a file
export default function loadYamlData(filePath: string): TestData {
  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const parsed = yaml.load(fileContents) as unknown;
    return parsed as TestData;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw error;
  };
};
