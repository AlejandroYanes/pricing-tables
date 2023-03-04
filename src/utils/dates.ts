export function formatDate(date: Date | string, locale = 'default'): string {
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  return date ? dateFormatter.format(new Date(date)) : '';
}

export function formatTime(date: Date | string, locale = 'default'): string {
  const timeFormatter = new Intl.DateTimeFormat(locale, {
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
  });
  return date ? timeFormatter.format(new Date(date)) : '';
}

export function formatDateTime(date: Date | string, locale = 'default'): string {
  const dateTimeFormatter = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  return date ? dateTimeFormatter.format(new Date(date)) : '';
}

export function formatShortDate(date: Date | string, locale = 'default'): string {
  if (date) {
    const shorterDateFormatter = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
    });
    const shortDateFormatter = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: '2-digit',
    });
    const isForThisYear = new Date(date).getFullYear() === new Date().getFullYear();
    return isForThisYear
      ? shorterDateFormatter.format(new Date(date))
      : shortDateFormatter.format(new Date(date));
  }
  return '';
}

export function getMonthName(date: Date, locale = 'default'): string {
  const monthFormatter = new Intl.DateTimeFormat(locale, {
    month: 'long',
  });
  return date ? monthFormatter.format(date) : '';
}

export function getMonthLabel(date: Date, locale = 'default') {
  const today = new Date();

  if (date.getFullYear() === today.getFullYear()) {
    return getMonthName(date, locale).slice(0, 3);
  }

  const year = date.getFullYear().toString(10).slice(-2);
  return `${getMonthName(date, locale).slice(0, 3)}/${year}`;
}
