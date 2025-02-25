const getFormattedDate = (date: Date, index: number) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };
  const formattedDate = date.toLocaleDateString('en-US', options);

  if (index === 0) return `Today ${formattedDate}`;
  if (index === 1) return `Tomorrow ${formattedDate}`;
  return formattedDate;
};

const NextFiveDays = Array.from({ length: 6 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + i);

  return {
    formatted: getFormattedDate(date, i),
    isoString: date.toISOString(),
  };
});

export default NextFiveDays;
