export interface IElectronAPI {
  createUser: (name: string, email: string) => Promise<{
    success: boolean;
    user?: any;
    error?: string;
  }>;
  getUsers: () => Promise<{
    success: boolean;
    users?: any[];
    error?: string;
  }>;
  getUserById: (id: string) => Promise<{
    success: boolean;
    user?: any;
    error?: string;
  }>;
  openWindow: (windowName: string) => void;
  closeWindow: () => void;
  onUserCreated: (callback: (user: any) => void) => void;
  removeUserCreatedListener: () => void;
}

declare global {
  interface Window {
    api: IElectronAPI;
  }
}
