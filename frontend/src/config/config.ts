declare global {
    interface Window {
        config: {
            backendUrl: string;
            isLandingPageMode: boolean;
        };
    }
}