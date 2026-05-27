import type { CSSProperties } from 'react';
import { getHandAngles } from '../lib/getHandAngles';

type AnalogClockProps = {
  date: Date;
  className?: string;
};

const CENTER = 100;
const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const ARABIC_NUMERALS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

function pointOnClock(angle: number, radius: number) {
  const radians = ((angle - 90) * Math.PI) / 180;

  return {
    x: CENTER + Math.cos(radians) * radius,
    y: CENTER + Math.sin(radians) * radius,
  };
}

function handStyle(angle: number): CSSProperties {
  return {
    transform: `rotate(${angle}deg)`,
    transformBox: 'view-box',
    transformOrigin: `${CENTER}px ${CENTER}px`,
  };
}

const minuteTicks = Array.from({ length: 60 }, (_, index) => {
  const angle = index * 6;
  const isHourTick = index % 5 === 0;
  const outer = pointOnClock(angle, 94);
  const inner = pointOnClock(angle, isHourTick ? 84 : 89);

  return {
    angle,
    inner,
    isHourTick,
    outer,
  };
});

const numeralPositions = Array.from({ length: 12 }, (_, index) => {
  const hour = index + 1;
  const angle = hour * 30;

  return {
    angle,
    arabic: ARABIC_NUMERALS[index],
    inner: pointOnClock(angle, 58),
    outer: pointOnClock(angle, 75),
    roman: ROMAN_NUMERALS[index],
  };
});

export function AnalogClock({ date, className = '' }: AnalogClockProps) {
  const angles = getHandAngles(date);

  return (
    <svg
      role="img"
      aria-label="Analog clock"
      viewBox="0 0 200 200"
      className={[
        'aspect-square w-full max-w-xs overflow-visible text-slate-100 sm:max-w-sm',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <circle
        cx={CENTER}
        cy={CENTER}
        r="97"
        className="fill-slate-950 stroke-slate-700"
        strokeWidth="2"
      />
      <circle
        cx={CENTER}
        cy={CENTER}
        r="88"
        className="fill-slate-900/70 stroke-slate-800"
        strokeWidth="1"
      />

      {minuteTicks.map((tick) => (
        <line
          key={tick.angle}
          x1={tick.inner.x}
          y1={tick.inner.y}
          x2={tick.outer.x}
          y2={tick.outer.y}
          className={tick.isHourTick ? 'stroke-cyan-200' : 'stroke-slate-500'}
          strokeLinecap="round"
          strokeWidth={tick.isHourTick ? 2 : 0.75}
        />
      ))}

      {numeralPositions.map((position) => (
        <g key={position.angle} className="select-none text-center">
          <text
            x={position.outer.x}
            y={position.outer.y}
            dominantBaseline="middle"
            textAnchor="middle"
            className="fill-slate-100 font-serif text-[0.72rem] font-semibold"
          >
            {position.roman}
          </text>
          <text
            x={position.inner.x}
            y={position.inner.y}
            dominantBaseline="middle"
            textAnchor="middle"
            className="fill-slate-400 font-mono text-[0.48rem] font-semibold"
          >
            {position.arabic}
          </text>
        </g>
      ))}

      <line
        data-clock-hand="hour"
        x1={CENTER}
        y1={CENTER}
        x2={CENTER}
        y2="58"
        className="stroke-slate-100"
        strokeLinecap="round"
        strokeWidth="5"
        style={handStyle(angles.hour)}
      />
      <line
        data-clock-hand="minute"
        x1={CENTER}
        y1={CENTER}
        x2={CENTER}
        y2="38"
        className="stroke-cyan-100"
        strokeLinecap="round"
        strokeWidth="3"
        style={handStyle(angles.minute)}
      />
      <line
        data-clock-hand="second"
        x1={CENTER}
        y1="108"
        x2={CENTER}
        y2="30"
        className="stroke-rose-300"
        strokeLinecap="round"
        strokeWidth="1.5"
        style={handStyle(angles.second)}
      />
      <circle cx={CENTER} cy={CENTER} r="4" className="fill-cyan-200" />
    </svg>
  );
}
