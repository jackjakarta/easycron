type TimeOfDay = 'morning' | 'noon' | 'afternoon' | 'evening' | 'night' | 'anytime';

type Greeting = {
  text: string;
  period: TimeOfDay;
};

const greetings: Record<TimeOfDay, string[]> = {
  anytime: ['Welcome back', 'Nice to see you'],
  morning: ['Good morning', 'A brand new day'],
  noon: ['Enjoy your lunch'],
  afternoon: ['Good afternoon', 'Hope your day is going well'],
  evening: ['Good evening', 'How was your day'],
  night: ['Good night', 'Late night thoughts'],
};

function getCurrentTimeOfDay(): TimeOfDay {
  const now = new Date();
  const germanTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Berlin' }));
  const hour = germanTime.getHours();

  if (hour >= 5 && hour < 11.5) {
    return 'morning';
  } else if (hour >= 11.5 && hour < 13.5) {
    return 'noon';
  } else if (hour >= 13.5 && hour < 17) {
    return 'afternoon';
  } else if (hour >= 17 && hour < 22) {
    return 'evening';
  } else {
    return 'night';
  }
}

function seededRandom(max: number, seed: number): number {
  const x = Math.sin(seed) * 10000;
  const randomValue = x - Math.floor(x);
  return Math.floor(randomValue * max);
}

function getTodaySeed(): number {
  const now = new Date();

  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

export function getTimeBasedGreeting(maybeFirstName?: string): string {
  const currentPeriod = getCurrentTimeOfDay();
  const todaySeed = getTodaySeed();

  const combinedGreetings: Greeting[] = [
    ...greetings[currentPeriod].map((text) => ({ text, period: currentPeriod })),
    ...(currentPeriod !== 'noon'
      ? greetings.anytime.map((text) => ({ text, period: 'anytime' as const }))
      : []),
  ];

  const randomIndex = seededRandom(combinedGreetings.length, todaySeed + currentPeriod.length);
  const selectedGreeting = combinedGreetings[randomIndex];

  if (selectedGreeting === undefined) {
    return 'Nice to see you';
  }

  const nameAddition = maybeFirstName ? `, ${maybeFirstName}` : '';

  const needsExclamation = [
    'Welcome back',
    'Nice to see you',
    'Good morning',
    'A brand new day',
    'Enjoy your lunch',
    'Good evening',
  ].includes(selectedGreeting.text);

  const isQuestion = ['How was your day'].includes(selectedGreeting.text);

  const punctuation = isQuestion ? '?' : needsExclamation ? '!' : '.';

  return `${selectedGreeting.text}${nameAddition}${punctuation}`;
}
