export class Helper {
    static generateRandomEmail(): string {
      return `user_${Date.now()}@example.com`;
    }
  }