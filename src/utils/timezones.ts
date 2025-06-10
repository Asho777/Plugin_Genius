// List of all IANA timezones with user-friendly labels
export const timezones = [
  { value: 'Pacific/Midway', label: '(GMT-11:00) Midway Island, Samoa' },
  { value: 'Pacific/Honolulu', label: '(GMT-10:00) Hawaii' },
  { value: 'America/Anchorage', label: '(GMT-09:00) Alaska' },
  { value: 'America/Los_Angeles', label: '(GMT-08:00) Pacific Time (US & Canada)' },
  { value: 'America/Phoenix', label: '(GMT-07:00) Arizona' },
  { value: 'America/Denver', label: '(GMT-07:00) Mountain Time (US & Canada)' },
  { value: 'America/Chicago', label: '(GMT-06:00) Central Time (US & Canada)' },
  { value: 'America/New_York', label: '(GMT-05:00) Eastern Time (US & Canada)' },
  { value: 'America/Caracas', label: '(GMT-04:30) Venezuela' },
  { value: 'America/Halifax', label: '(GMT-04:00) Atlantic Time (Canada)' },
  { value: 'America/Argentina/Buenos_Aires', label: '(GMT-03:00) Buenos Aires, Georgetown' },
  { value: 'America/Sao_Paulo', label: '(GMT-03:00) Brasilia' },
  { value: 'Atlantic/South_Georgia', label: '(GMT-02:00) Mid-Atlantic' },
  { value: 'Atlantic/Azores', label: '(GMT-01:00) Azores' },
  { value: 'Europe/London', label: '(GMT+00:00) London, Edinburgh, Dublin, Lisbon' },
  { value: 'Europe/Paris', label: '(GMT+01:00) Paris, Amsterdam, Berlin, Rome, Vienna' },
  { value: 'Africa/Cairo', label: '(GMT+02:00) Cairo, Athens, Istanbul' },
  { value: 'Europe/Moscow', label: '(GMT+03:00) Moscow, St. Petersburg' },
  { value: 'Asia/Dubai', label: '(GMT+04:00) Dubai, Abu Dhabi' },
  { value: 'Asia/Karachi', label: '(GMT+05:00) Karachi, Islamabad' },
  { value: 'Asia/Dhaka', label: '(GMT+06:00) Dhaka, Astana' },
  { value: 'Asia/Bangkok', label: '(GMT+07:00) Bangkok, Jakarta' },
  { value: 'Asia/Hong_Kong', label: '(GMT+08:00) Hong Kong, Beijing, Singapore' },
  { value: 'Asia/Tokyo', label: '(GMT+09:00) Tokyo, Seoul' },
  { value: 'Australia/Sydney', label: '(GMT+10:00) Sydney, Melbourne' },
  { value: 'Pacific/Noumea', label: '(GMT+11:00) Noumea, Solomon Islands' },
  { value: 'Pacific/Auckland', label: '(GMT+12:00) Auckland, Wellington' },
  { value: 'Pacific/Fiji', label: '(GMT+12:00) Fiji' },
  { value: 'Pacific/Tongatapu', label: '(GMT+13:00) Nuku\'alofa' },
  { value: 'Pacific/Kiritimati', label: '(GMT+14:00) Kiritimati' },
  
  // Additional major timezones
  { value: 'America/Montevideo', label: '(GMT-03:00) Montevideo' },
  { value: 'America/Santiago', label: '(GMT-04:00) Santiago' },
  { value: 'America/Bogota', label: '(GMT-05:00) Bogota, Lima, Quito' },
  { value: 'America/Mexico_City', label: '(GMT-06:00) Mexico City' },
  { value: 'Europe/Amsterdam', label: '(GMT+01:00) Amsterdam' },
  { value: 'Europe/Athens', label: '(GMT+02:00) Athens' },
  { value: 'Europe/Istanbul', label: '(GMT+03:00) Istanbul' },
  { value: 'Asia/Jerusalem', label: '(GMT+02:00) Jerusalem' },
  { value: 'Asia/Riyadh', label: '(GMT+03:00) Riyadh, Kuwait' },
  { value: 'Asia/Tehran', label: '(GMT+03:30) Tehran' },
  { value: 'Asia/Kabul', label: '(GMT+04:30) Kabul' },
  { value: 'Asia/Kolkata', label: '(GMT+05:30) Kolkata, Mumbai, New Delhi' },
  { value: 'Asia/Kathmandu', label: '(GMT+05:45) Kathmandu' },
  { value: 'Asia/Yangon', label: '(GMT+06:30) Yangon (Rangoon)' },
  { value: 'Asia/Kuala_Lumpur', label: '(GMT+08:00) Kuala Lumpur' },
  { value: 'Australia/Perth', label: '(GMT+08:00) Perth' },
  { value: 'Australia/Darwin', label: '(GMT+09:30) Darwin' },
  { value: 'Australia/Adelaide', label: '(GMT+09:30) Adelaide' },
  { value: 'Australia/Brisbane', label: '(GMT+10:00) Brisbane' },
  { value: 'Australia/Hobart', label: '(GMT+10:00) Hobart' },
  
  // UTC option
  { value: 'UTC', label: '(GMT+00:00) UTC' }
];

// Helper function to get timezone label from value
export const getTimezoneLabel = (value: string): string => {
  const timezone = timezones.find(tz => tz.value === value);
  return timezone ? timezone.label : 'UTC';
};

// Helper function to get user's local timezone
export const getUserTimezone = (): string => {
  try {
    // Try to get the IANA timezone name
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Check if this timezone exists in our list
    const exists = timezones.some(tz => tz.value === timezone);
    
    // Return the timezone if it exists, otherwise return UTC
    return exists ? timezone : 'UTC';
  } catch (error) {
    // Fallback to UTC if there's an error
    return 'UTC';
  }
};
