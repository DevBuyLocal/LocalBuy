const getFormattedHour = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  return date.toLocaleTimeString('en-US', options);
};

const GetHourlyTimes = () => {
  const now = new Date();
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0
  );

  const times = [];
  for (let hour = startOfDay.getHours(); hour <= 18; hour++) {
    const currentHour = new Date(startOfDay);
    currentHour.setHours(hour);

    times.push({
      formatted: getFormattedHour(currentHour),
      isoString: currentHour.toISOString(),
    });
  }
  return times;
};

export default GetHourlyTimes;
