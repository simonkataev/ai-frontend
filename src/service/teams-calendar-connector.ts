import {
    PublicClientApplication,
    InteractionRequiredAuthError,
    AccountInfo,
    AuthenticationResult,
    BrowserAuthError
} from '@azure/msal-browser';

export class TeamsCalendarConnector {
    private msalInstance: PublicClientApplication;
    public account: AccountInfo | undefined = undefined;

    private msalConfig = {
        auth: {
            clientId: 'a46342ce-f973-42ec-a1eb-d42f11feb811',
            authority: 'https://login.microsoftonline.com/common',
            redirectUri: window.location.origin + '/hub/calendar',
        },
        cache: {
            cacheLocation: 'localStorage',
            storeAuthStateInCookie: true,
        }
    };

    private loginRequest = {
        scopes: ['openid', 'profile', 'user.read', 'calendars.read', 'onlineMeetings.read'],
    };

    private tokenRequest = {
        scopes: [`api://${this.msalConfig.auth.clientId}/access_as_user`],
    };

    private constructor() {
        this.msalInstance = new PublicClientApplication(this.msalConfig);
    }

    /**
     * Creates an instance of TeamsCalendarConnector and initializes MSAL.
     * @returns A promise that resolves with the instance of TeamsCalendarConnector.
     */
    public static async createInstance(): Promise<TeamsCalendarConnector> {
        const connector = new TeamsCalendarConnector();
        await connector.initializeMsal();
        return connector;
    }

    /**
     * Initializes MSAL and sets the active account if one exists.
     */
    private async initializeMsal() {
        await this.msalInstance.initialize();
        const accounts = this.msalInstance.getAllAccounts();
        if (accounts.length > 0) {
            this.account = accounts[0];
            this.msalInstance.setActiveAccount(this.account);
        }
    }

    /**
     * Triggers the sign-in process using a popup.
     */
    public async signIn() {
        try {
            const loginResponse: AuthenticationResult = await this.msalInstance.loginPopup(this.loginRequest);
            this.account = loginResponse.account;
            this.msalInstance.setActiveAccount(this.account);
        } catch (error: unknown) {
            
            if (error instanceof BrowserAuthError) {
                if (error.errorCode === 'user_cancelled') {
                    console.error('Login cancelled by the user.');
                } else {
                    console.error('Browser authentication error:', error.message);
                }
            } else {
                console.error('An unknown error occurred during login:', error);
            }
        }
    }

    /**
     * Signs out the current user.
     */
    public async signOut() {
        await this.msalInstance.logoutPopup();
        this.account = undefined;
    }

    /**
     * Acquires an access token for API authentication.
     * @returns A promise that resolves with the access token.
     */
    public async getToken(): Promise<string | undefined> {
        if (!this.account) {
            await this.signIn();
        }

        try {
            const tokenResponse: AuthenticationResult = await this.msalInstance.acquireTokenSilent({
                ...this.tokenRequest,
                account: this.account,
            });
            return tokenResponse.accessToken;
        } catch (error) {
            if (error instanceof InteractionRequiredAuthError) {
                const tokenResponse = await this.msalInstance.acquireTokenPopup(this.tokenRequest);
                return tokenResponse.accessToken;
            } else {
                console.error('Error getting token:', error);
            }
        }
    }

    /**
     * A public method to trigger the authentication flow and fetch an access token.
     * @returns A promise that resolves with the access token.
     */
    public async connectCalendar(): Promise<string | undefined> {
        if (!this.account) {
            await this.signIn();
        }

        return await this.getToken();
    }
}
