import { Collapse } from "antd";
import "styles/Main.css";
import "./style.scss";
import { Box, CircularProgress } from "@mui/material";
import { Switch } from "antd";
import ClockIcon from "images/ClockBlank.svg";
import CalendarIcon from "images/CalendarBlank.svg"
import CaretDownIcon from "images/caret-down.svg";
import CaretDownCollapseIcon from "images/caret-down-collapse.svg";
import MicrosoftCalendarIcon from "images/microsoft-calendar.svg";
import MicrosoftClockIcon from "images/microsoft-clock.svg";
import { useEffect, useState } from "react";
import { CalendarService } from "service/calendarService";

interface PanelHeaderProps {
  event: any;
  isMobile: boolean;
  isGoogle: boolean;
}

interface TeamsEvent {
  eventId?: string;  // Optional for grouped events
  seriesId?: string;
  seriesMasterId?: string | null;
  onlineMeetingUrl?: string | null;
  subject?: string;
  startDateTime?: string;
  endDateTime?: string;
  isSubscribed?: boolean;
  originalStartTimeZone?: string;
  originalEndTimeZone?: string;
  earliestDate?: string;  // Only present in grouped series
  children?: { startDate: string; endDate: string }[];
}

interface GroupedByDate {
  date: string;
  events: TeamsEvent[];
}

const getDateString = (dateTime: string): string => {
  if(dateTime !== ''){
    return new Date(dateTime).toISOString().split('T')[0];
  }

  return '';
};

const formatTime = (date: Date | null): string => {
  return date
      ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
      : '';
};

const groupEvents = (events: TeamsEvent[]): (TeamsEvent)[] => {
  const seriesGroups: { [key: string]: TeamsEvent[] } = {};
  const result: (TeamsEvent)[] = [];

  events.forEach((event) => {
      const groupId = event.seriesMasterId;

      if (groupId) {
          if (!seriesGroups[groupId]) {
              seriesGroups[groupId] = [];
          }
          seriesGroups[groupId].push(event);
      } else {
          result.push(event);
      }
  });

  Object.entries(seriesGroups).forEach(([seriesId, groupEvents]) => {
      groupEvents.sort(
          (a, b) => new Date(a.startDateTime ? a.startDateTime : '').getTime() - new Date(b.startDateTime ? b.startDateTime : '').getTime()
      );
      const earliestDate = getDateString(groupEvents[0].startDateTime ? groupEvents[0].startDateTime : '');
      const children = groupEvents.map((event) => ({
          startDate: event.startDateTime ? event.startDateTime : '',
          endDate: event.endDateTime ? event.endDateTime : '',
      }));

      result.push({
          seriesId,
          subject: groupEvents[0].subject ? groupEvents[0].subject : '',
          earliestDate,
          children,
      });
  });

  return result.sort((a, b) => {
      const dateA = 'earliestDate' in a ? new Date(a.earliestDate ? a.earliestDate : '').getTime() : new Date(a.startDateTime ? a.startDateTime : '').getTime();
      const dateB = 'earliestDate' in b ? new Date(b.earliestDate ? b.earliestDate : '').getTime() : new Date(b.startDateTime ? b.startDateTime : '').getTime();
      return dateA - dateB;
  });
};

const groupByDate = (events: TeamsEvent[]): GroupedByDate[] => {
  const groups: { [key: string]: TeamsEvent[] } = {};

  events.forEach((event) => {
      const date = getDateString(event.startDateTime ? event.startDateTime : event.earliestDate ? event.earliestDate : '');

      if (!groups[date]) {
          groups[date] = [];
      }
      groups[date].push(event);
  });

  return Object.entries(groups).map(([date, events]) => ({
      date,
      events,
  }));
};

const PanelHeader: React.FC<PanelHeaderProps> = ({
  event,
  isMobile,
  isGoogle
}) => {

  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>(''); 

  useEffect(() => {

    const extractEventTimes = (event: TeamsEvent) => {
        if(event.startDateTime && event.endDateTime) {
          const startDate = new Date(event.startDateTime ? event.startDateTime : '');
          const endDate = new Date(event.endDateTime ? event.endDateTime : '');
  
          const date = startDate ? startDate.toISOString().split('T')[0] : '';
          const startTime = formatTime(startDate);
          const endTime = formatTime(endDate);
  
          setDate(date);
          setTime(startTime + ' - ' + endTime);
        } else{
          if(event.earliestDate && event.children) {
            const child = event.children[0];
            const child1 = event.children[1];
            const startDate = new Date(child.startDate ? child.startDate : '');
            const endDate = new Date(child.endDate ? child.endDate : '');
            const startDate1 = new Date(child1.startDate ? child1.startDate : '');
            const startTime = formatTime(startDate);
            const endTime = formatTime(endDate);

            const diffInMs = Math.abs(startDate1.getTime() - startDate.getTime());
            const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

            if (diffInDays === 7) {
              const dayOfWeek = startDate1.toLocaleDateString('en-US', { weekday: 'long' });
              setDate(`Every ${dayOfWeek}`);
            } else {
              setDate(event.earliestDate);
            }
            setTime(startTime + ' - ' + endTime);
          }
        }
    }
    extractEventTimes(event);
  }, [event]);

  return (
    <Box
      display="flex"
      flexDirection={isMobile ? "column" : "row"}
      alignItems={isMobile ? "left" : "center"}
      alignSelf={'stretch'}
      mr={0}
      gap={0.5}
    >
      { !isMobile && (
        <div className="flex items-center justify-between self-stretch gap-2 w-full">
          <div className="flex items-center gap-4">
            <p className="text-[16px] font-medium text-[#3B4163]">
              {event?.subject}
            </p>
            <div className="flex gap-4">
              <div className={`px-3.5 py-1.5 flex justify-center items-center gap-2 bg-[#CEEED6] ${isGoogle ? 'rounded' : 'rounded-lg border border-[#188137]'}`}>
                <img src={isGoogle ? CalendarIcon : MicrosoftCalendarIcon} className="w-4 h-4" alt="" />
                <p className="text-[#188137] text-center text-[14px] font-medium">{date}</p>
              </div>
              <div className={`px-3.5 py-1.5 rounded flex justify-center items-center gap-2 bg-[#E4EEFC] ${isGoogle ? 'rounded' : 'rounded-lg border border-[#1C73E8]'}`}>
                <img src={isGoogle ? ClockIcon : MicrosoftClockIcon} className="w-4 h-4" alt="" />
                <p className="text-[#1C73E8] text-center text-[14px] font-medium">{time}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center gap-4">
            <p className={`text-14 font-medium text-center text-[#636363] text-[14px]`}>All meetings</p>
            <Switch
              checked={event.isSubscribed}
              disabled
            />
          </div>
        </div>
      )}

      { isMobile && (
        <div className="flex flex-col items-center justify-between self-stretch gap-2 w-full">
          <div className="flex items-center gap-2 justify-between w-full">
            <p className="text-[12px] font-medium text-[#3B4163]">
              {event.subject}
            </p>
            <div className="flex justify-end items-center gap-4">
              <p className={`font-medium text-center text-[#636363] text-[9px]`}>All meetings</p>
              <Switch
                checked={event.isSubscribed}
                disabled
                size='small'
              />
            </div>
          </div>
          <div className="flex justify-start items-center gap-2 w-full">
            <div className="flex gap-4">
              <div className={`px-3.5 py-1.5 flex justify-center items-center gap-2 bg-[#CEEED6] ${isGoogle ? 'rounded' : 'rounded-lg border border-[#188137]'}`}>
                <img src={isGoogle ? CalendarIcon : MicrosoftCalendarIcon} className="w-4 h-4" alt="" />
                <p className="text-[#188137] text-center text-[9px] font-medium">{event.day}</p>
              </div>
              <div className={`px-3.5 py-1.5 rounded flex justify-center items-center gap-2 bg-[#E4EEFC] ${isGoogle ? 'rounded' : 'rounded-lg border border-[#1C73E8]'}`}>
                <img src={isGoogle ? ClockIcon : MicrosoftClockIcon} className="w-4 h-4" alt="" />
                <p className="text-[#1C73E8] text-center text-[9px] font-medium">{event.time}</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </Box>
  );
};

type CalendarScreenProps = {
  isMobile: boolean;
};

const CallScreen: React.FC<CalendarScreenProps> = ({
  isMobile,
}) => {

  const [tabIndex, setTabIndex] = useState<string>('microsoft');
  const [calendarService, setCalendarService] = useState<CalendarService | null>(null);
  const [schedules, setSchedules] = useState<GroupedByDate[]>([]);
  const [isLoaded , setIsLoaded] = useState<boolean>(false);

  const connect = async () => {
    try{
      setIsLoaded(false);
      calendarService?.connectCalendar();
      const response = await calendarService?.getCalendarEvents('2024-10-1', '2024-11-30');
      if(response) {
        setSchedules(groupByDate(groupEvents(response)));
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Error initializing CalendarService:', error);
    }
  }

  useEffect(() => {
      const initCalendarService = async () => {
          try {
              const service = await CalendarService.createInstance();
              setCalendarService(service);
              const response = await service.getCalendarEvents('2024-10-1', '2024-11-30');
              if(response) {
                setSchedules(groupByDate(groupEvents(response)));
                setIsLoaded(true);
              }
          } catch (error) {
              console.error('Error initializing CalendarService:', error);
          }
      };

      initCalendarService();
  }, []);

  return (
    <Box mt={6.875}>
      <div className="flex items-center justify-between">
        <h2 className="integration-header font-bold-h2">Calendar</h2>
        <div className={`integration-header rounded-md border border-[#CECEEA] bg-[#fff] shadow-sm flex ${isMobile ? 'p-1' : 'p-1.5'}`}>
          <button className={`${tabIndex === 'google' ? 'tabActive' : ''} ${isMobile ? 'px-2 py-1 text-[9px]' : 'px-4 py-2 text-[16px]'} font-medium`} onClick={() => setTabIndex('google')} disabled>Google Calendar</button>
          <button className={`${tabIndex === 'microsoft' ? 'tabActive' : ''}  ${isMobile ? 'px-2 py-1 text-[9px]' : 'px-4 py-2 text-[16px]'} font-medium`} onClick={() => setTabIndex('microsoft')}>Microsoft Calendar</button>
        </div>
      </div>
      {isLoaded && (
        <Box
          sx={{
            mt: 3.125,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
          style={{ paddingBottom: "1vh" }}
        >            
            {schedules
              .map((schedule) => (
                <div className="flex flex-col items-start gap-2.5 self-stretch">
                  {schedule.date && <p className={`${isMobile ? 'text-[12px]' : 'text-[14px]'} font-medium text-[#636363]`}>{schedule.date.toString().split('T')[0]}</p> }
                  {schedule.events
                    .map((event) => { 
                      return (<Collapse
                        expandIconPosition={"start"}
                        expandIcon={({ isActive }) => (
                          <div
                            style={{
                              width: 20,
                              height: 20,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <img
                              src={isActive ? CaretDownIcon : CaretDownCollapseIcon}
                              style={{ width: "calc(16 / 16 * 1rem)" }}
                              alt="caret icon"
                            ></img>
                          </div>
                        )}
                        style={{
                          width: "100%",
                          border: "none",
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        {event.children ?
                          <Collapse.Panel
                            style={{
                              boxShadow: "0px 4px 24px 0px #9A9A9A14",
                              borderRadius: "calc(12 / 16 * 1em)",
                              padding: "calc(16 / 16 * 1em)",
                              border: "1px solid var(--neutral-stroke-color)",
                            }}
                            key={"" + (schedule as any).id}
                            header={
                              <PanelHeader
                                event={event}
                                isMobile={isMobile}
                                isGoogle={tabIndex === 'google'}
                              />
                            }
                          >
                            <Box className='flex flex-col gap-5'>
                              {event.children
                                .map((child: any) => (
                                  <div className="flex justify-between items-center self-stretch">
                                    <div className={`flex px-3.5 py-2 bg-[#CEEED6] rounded items-center justify-center ${tabIndex === 'google' ? 'rounded' : 'rounded-lg border border-[#188137]'}`}>
                                      <img src={tabIndex === 'google' ? CalendarIcon : MicrosoftCalendarIcon} className="w-4 h-4" alt="" />
                                      <p className={`text-[#188137] text-center font-medium ${isMobile ? 'text-[9px]' : 'text-[14px]'} `}>{getDateString(child.startDate)}</p>
                                    </div>
                                    <div className="flex justify-end items-center gap-4">
                                      <p className={`text-14 font-medium text-center text-[#636363] ${isMobile ? 'text-[9px]' : 'text-[14px]'}`}>Only this meeting</p>
                                      <Switch
                                        checked={true}
                                        disabled
                                        size={isMobile ? 'small' : 'default'}
                                      />
                                    </div>
                                  </div>
                                )
                              )}
                            </Box>
                          </Collapse.Panel>
                          :
                          <div className="flex p-5 flex-col items-start self-stretch rounded-xl border border-[#E6E6E6] bg-[#fff]">
                            <PanelHeader
                              event={event}
                              isMobile={isMobile}
                              isGoogle={tabIndex === 'google'}
                            />
                          </div>
                        }</Collapse>)})
                  }
                </div>
          ))}
        </Box>
      )}
      {
        isLoaded && schedules.length === 0 && (
          <div className={`flex w-full flex-col items-center gap-8 ${isMobile? 'mt-28' : 'mt-40'}`}>
            <div className="flex flex-col items-start gap-3 self-stretch">
              <p className="self-stretch text-[#0D0D0D] text-center text-[32px] font-bold">Connect your Calendar</p>
              <p className="self-stretch text-16 text-center text-[#636363] font-normal">Please provide access to the calendar to display the upcoming calls.</p>
            </div>
            <button className={`text-16 font-semibold flex px-6 py-2 justify-center items-center gap-2.5 rounded border border-[#CECEEA] text-[#8280FF] ${isMobile ? 'self-stretch' : 'w-[408px]'}`}
              onClick={connect}>
            Connect</button>
          </div>
        )
      }
      {!isLoaded && (
        <Box className={"flex-column-container"}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default CallScreen;
