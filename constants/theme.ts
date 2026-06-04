export const colors = {
  navy: '#022B4E',
  navyDeep: '#011E38',
  blue: '#0077B6',
  blueLight: '#0096C7',
  aqua: '#00B4D8',
  aquaLight: '#48CAE4',
  aquaPale: '#90E0EF',
  ice: '#CAF0F8',
  white: '#FFFFFF',
  bg: '#F2F8FC',
  card: '#FFFFFF',
  text: '#0A2540',
  textMuted: '#5C7589',
  border: '#E2ECF3',
  green: '#16A34A',
  greenBg: '#DCFCE7',
  blueBadge: '#2563EB',
  blueBadgeBg: '#DBEAFE',
  orange: '#EA580C',
  orangeBg: '#FFEDD5',
  red: '#DC2626',
  redBg: '#FEE2E2',
  shadow: '#0A2540',
};

export const statusStyle = (status: string) => {
  switch (status) {
    case 'In Rental':
      return { color: colors.blueBadge, bg: colors.blueBadgeBg };
    case 'Available':
    case 'Online':
    case 'Completed':
      return { color: colors.green, bg: colors.greenBg };
    case 'Warning':
    case 'Maintenance':
      return { color: colors.orange, bg: colors.orangeBg };
    case 'Offline':
    case 'Alert':
      return { color: colors.red, bg: colors.redBg };
    default:
      return { color: colors.textMuted, bg: colors.border };
  }
};

export const severityStyle = (sev: string) => {
  switch (sev) {
    case 'High':
      return { color: colors.red, bg: colors.redBg };
    case 'Medium':
      return { color: colors.orange, bg: colors.orangeBg };
    default:
      return { color: colors.blueBadge, bg: colors.blueBadgeBg };
  }
};

export const shadow = {
  shadowColor: colors.shadow,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 3,
};
