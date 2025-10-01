import * as fs from "fs";
import * as yaml from "js-yaml";

export interface TestData {
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

  application: {
    valid: {
      appName: string;
      description: string;
      owner: string;
    };
    edit: {
      updatedAppName: string;
      updatedDescription: string;
      updatedOwner: string;
    };
    successMessage: {
      expectedMessageOnboarded: string;
      expectedMessageUpdated: string;
    };
    MyApp: {
      name: string;
      description: string;
      tags: string[];
      owner: string;
    };
  };

  component: {
    compData: {
      valid: {
        kind: string;
        compName: string;
        description: string;
        owner: string;
        type: string;
        environment: string;
        scOption: string;
        repoLink: string;
        gcpProjectID: string;
      };
      edit: {
        updatedDescription: string;
        updatedType: string;
        updatedEnvironment: string; // Fixed: added 'd' to match your usage
      };
      successMessage: {
        expectedMessageOnboarded: string;
        expectedMessageUpdated: string;
      };
    };
    MyComponent: {
      name: string;
      description: string;
      tags: string[];
      owner: string;
    };
  };

  api: {
    apiData: {
      valid: {
        kind: string;
        apiName: string;
        description: string;
        owner: string;
        type: string;
        environment: string;
        scOption: string;
        repoLink: string;
        apiDefinition: string;
        gcpProjectID: string;
      };
      edit: {
        updatedDescription: string;
        updatedType: string;
        updatedApiDefinition: string;
      };
      successMessage: {
        expectedMessageOnboarded: string;
        expectedMessageUpdated: string;
      };
    };
    MyAPI: {
      name: string;
      description: string;
      annotations: string[];
      owner: string;
    };
  };

  resource: {
    resData: {
      valid: {
        kind: string;
        resourceName: string;
        description: string;
        owner: string;
        type: string;
        environment: string;
        gcpProjectID: string;
      };
      edit: {
        updatedResourceName: string;
        updatedDescription: string;
        updatedOwner: string;
        updatedType: string;
        updatedTags: string;
      };
      successMessage: {
        expectedMessageOnboarded: string;
        expectedMessageUpdated: string;
      };
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
      type: string;
    };
    database: {
      instanceName: string;
      version: string;
      dbName: string;
      username: string;
      password: string;
    };
  };

  finops: {
    gcpprojectid: string;
    gcpdatasetid: string;
    gcptableid: string;
  };

  devops: {
    compKind: string;
    componentName: string;
    description: string;
    owner: string;
    type: string;
    environment: string;
    providerOption: string;
    repoUrl: string;
    gcpProjectID: string;
    expected: {
      sonarMissingHeading: string;
      sonarSetupInProgressHeading: string;
      prTitlePrefix: string;
      codeQualityCards: string[];
    };
  };
}

// Function to load YAML data from a file
export default function loadYamlData(filePath: string): TestData {
  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const parsed = yaml.load(fileContents) as unknown;
    return parsed as TestData;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // Provide a concise, actionable hint for duplicate-key errors
    if (/duplicated mapping key/i.test(message)) {
      throw new Error(
        `YAML error: duplicated mapping key. Ensure each key is unique at its indentation level in ${filePath}.`
      );
    }
    throw error;
  }
};