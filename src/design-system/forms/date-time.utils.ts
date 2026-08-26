export const formatDateForInput = (
  value: Date,
): string => {
  const year =
    value.getFullYear();
  const month = String(
    value.getMonth() + 1,
  ).padStart(2, '0');
  const day = String(
    value.getDate(),
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const parseDateInput = (
  value: string,
): Date | null => {
  const match =
    /^(\d{4})-(\d{2})-(\d{2})$/.exec(
      value.trim(),
    );

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month =
    Number(match[2]) - 1;
  const day = Number(match[3]);

  const date = new Date(
    year,
    month,
    day,
  );

  if (
    date.getFullYear() !==
      year ||
    date.getMonth() !==
      month ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
};

export const formatTimeForInput = (
  value: Date,
): string => {
  const hour = String(
    value.getHours(),
  ).padStart(2, '0');
  const minute = String(
    value.getMinutes(),
  ).padStart(2, '0');

  return `${hour}:${minute}`;
};

export const parseTimeInput = (
  value: string,
  base: Date,
): Date | null => {
  const match =
    /^(\d{2}):(\d{2})$/.exec(
      value.trim(),
    );

  if (!match) {
    return null;
  }

  const hour = Number(match[1]);
  const minute =
    Number(match[2]);

  if (
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  const next = new Date(base);
  next.setHours(
    hour,
    minute,
    0,
    0,
  );

  return next;
};
