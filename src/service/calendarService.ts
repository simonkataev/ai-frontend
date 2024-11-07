import { TeamsCalendarConnector } from './teams-calendar-connector';
import EndPointProvider from "utils/EndPointProvider";
import axios, { AxiosResponse } from "axios";

interface EventSubscriptionRequestDto {
    eventId: string;
    onlineMeetingUrl: string;
    startDateTime: string;
    originalStartTimeZone?: string;
    isSubscribed?: boolean;
}

interface TeamsEvent {
    eventId: string;
    seriesMasterId?: string;
    subject?: string;
    onlineMeetingUrl: string;
    startDateTime: string;
    endDateTime: string;
    isSubscribed: boolean;
    originalStartTimeZone?: string;
    originalEndTimeZone?: string;
}

export class CalendarService {
    private connector: TeamsCalendarConnector;
    private endpoint: string;

    private constructor(connector: TeamsCalendarConnector) {
        this.connector = connector;
        this.endpoint = EndPointProvider.getCalendarEndPoint();
    }

    /**
     * Creates an instance of CalendarService with initialized authentication.
     * @returns A promise that resolves with the instance of CalendarService.
     */
    public static async createInstance(): Promise<CalendarService> {
        const connector = await TeamsCalendarConnector.createInstance();
        return new CalendarService(connector);
    }

    /**
     * Connect Calendar
     */
    public async connectCalendar(){
        this.connector.connectCalendar();
        this.getCalendarEvents('', '');
    }

    /**
     * Fetches calendar events between the specified dates.
     * @param startDate - The start date for fetching events.
     * @param endDate - The end date for fetching events.
     * @returns A promise that resolves with an array of TeamsEvent objects.
     */
    public async getCalendarEvents(startDate: string, endDate: string): Promise<TeamsEvent[] | undefined> {
        const accessToken = await this.connector.getToken();
        if (!accessToken) {
            console.error('Failed to acquire access token.');
            return;
        }

        try {
            const response: AxiosResponse<TeamsEvent[]> = await axios.get(this.endpoint + '/api/Calendar/events', {
                params: { startDate, endDate },
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                }
            });
    
            // The response data will be typed correctly as TeamsEvent[]
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                console.error(`Error ${error.response.status}: ${error.response.statusText}`);
            } else {
                console.error('Error fetching calendar events:', error);
            }
            throw error; // Optionally re-throw the error for further handling
        }
    }

    /**
     * Subscribes to a single calendar event.
     * @param subscriptionData - The data required to subscribe to an event.
     * @returns A promise that resolves when the subscription is complete.
     */
    public async subscribeToEvent(subscriptionData: EventSubscriptionRequestDto): Promise<void> {
        const accessToken = await this.connector.getToken();
        if (!accessToken) {
            console.error('Failed to acquire access token.');
            return;
        }

        try {
            const response = await fetch(`/api/Calendar/subscribe`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(subscriptionData),
            });

            if (response.ok) {
                console.log('Successfully subscribed to the event.');
            } else {
                console.error('Failed to subscribe to the event:', response.statusText);
            }
        } catch (error) {
            console.error('Error occurred while subscribing to the event:', error);
        }
    }

    /**
     * Subscribes to multiple calendar events.
     * @param subscriptionDataList - An array of event subscription data.
     * @returns A promise that resolves when all subscriptions are complete.
     */
    public async subscribeToSeries(subscriptionDataList: EventSubscriptionRequestDto[]): Promise<void> {
        const accessToken = await this.connector.getToken();
        if (!accessToken) {
            console.error('Failed to acquire access token.');
            return;
        }

        try {
            const response = await fetch(`/api/Calendar/series-subscribe`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(subscriptionDataList),
            });

            if (response.ok) {
                console.log('Successfully subscribed to the series of events.');
            } else {
                console.error('Failed to subscribe to the series of events:', response.statusText);
            }
        } catch (error) {
            console.error('Error occurred while subscribing to the series of events:', error);
        }
    }
}