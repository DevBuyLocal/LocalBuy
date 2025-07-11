import { type FC, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { useLoader } from '@/lib/hooks/general/use-loader';

import { Pressable, Text } from '../ui';

interface CountdownProps {
  countFrom: number;
  onCountdownComplete: () => void;
  resend: () => void;
  text1?: string;
  text2?: string;
  disabled?: boolean;
  invalidMsg?: string;
  autoStart?: boolean; // New prop to control auto-start behavior
}

const CountdownTimer: FC<CountdownProps> = ({
  countFrom,
  onCountdownComplete,
  resend,
  text1,
  text2,
  disabled,
  invalidMsg,
  autoStart = false, // Default to false to prevent auto-start
}) => {
  const { setError } = useLoader({ showLoadingPage: false });
  const [countdown, setCountdown] = useState(countFrom);
  const [isActive, setIsActive] = useState(autoStart); // Use autoStart prop
  const [hasStarted, setHasStarted] = useState(autoStart); // Track if countdown has ever started

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
  }, [countdown, disabled, isActive, onCountdownComplete]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleResetClick = () => {
    if (disabled) {
      setError(invalidMsg || 'Please wait for the timer to finish');
      return;
    }

    // If countdown is active, do nothing (user must wait)
    if (countdown > 0 && isActive) return;

    // Start/restart the countdown and send the code
    setCountdown(countFrom);
    setIsActive(true);
    setHasStarted(true);
    resend();
  };

  return (
    <Pressable onPress={handleResetClick} className="flex-row items-center">
      <Text className="text-[14px] font-medium opacity-70">
        {text1 || 'Not getting code?'}{' '}
      </Text>
      {countdown > 0 && isActive ? (
        <Text className={twMerge('text-[14px] font-medium color-primaryText')}>
          {formatTime(countdown)}
        </Text>
      ) : (
        <Text className="text-[14px] font-medium color-primaryText">
          {hasStarted ? text2 || 'Resend' : text2 || 'Send'}
        </Text>
      )}
    </Pressable>
  );
};

export default CountdownTimer;
