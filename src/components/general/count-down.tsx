import { type FC, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { Pressable, Text } from '../ui';

interface CountdownProps {
  countFrom: number;
  onCountdownComplete: () => void;
  resend: () => void;
}

const CountdownTimer: FC<CountdownProps> = ({
  countFrom,
  onCountdownComplete,
  resend,
}) => {
  const [countdown, setCountdown] = useState(countFrom);
  const [isActive, setIsActive] = useState(true); // New state for countdown activity

  useEffect(() => {
    if (isActive && countdown > 0) {
      const interval = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (countdown === 0 && isActive) {
      setIsActive(false);
      onCountdownComplete();
    }
  }, [countdown, isActive, onCountdownComplete]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleResetClick = () => {
    if (countdown > 0) return;
    setCountdown(countFrom);
    setIsActive(true);
    resend();
  };

  return (
    <Pressable onPress={handleResetClick} className="flex-row items-center">
      <Text className="text-[14px] font-medium opacity-70">
        Not getting code?{' '}
      </Text>
      {countdown > 0 ? (
        <Text
          className={twMerge(
            countdown > 0 ? 'opacity-100' : 'opacity-0',
            'text-[14px] font-medium color-primaryText'
          )}
        >
          {formatTime(countdown)}
        </Text>
      ) : (
        <Text className="text-[14px] font-medium color-primaryText">
          Resend
        </Text>
      )}
    </Pressable>
  );
};

export default CountdownTimer;
